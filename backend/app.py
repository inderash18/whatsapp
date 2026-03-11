from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Configuration
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
client = MongoClient(MONGO_URI)
db = client['chat_app']
users_col = db['users']
messages_col = db['messages']

app = Flask(__name__)
# Enable static file serving for uploads
CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'netflix_secret_key')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
socketio = SocketIO(app, cors_allowed_origins='*', async_mode='eventlet')

# Track online users: {session_id: user_id}
online_users = {}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(f"{datetime.now().timestamp()}_{file.filename}")
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        file_url = f"http://localhost:5000/uploads/{filename}"
        return jsonify({'url': file_url})
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    if users_col.find_one({'username': data['username']}):
        return jsonify({'error': 'User already exists'}), 400
    user = {
        'username': data['username'],
        'password': generate_password_hash(data['password']),
        'avatar': data.get('avatar', ''),
    }
    res = users_col.insert_one(user)
    user['_id'] = str(res.inserted_id)
    user.pop('password')
    return jsonify(user)

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = users_col.find_one({'username': data['username']})
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'error': 'Invalid username or password'}), 401
    user['_id'] = str(user['_id'])
    user.pop('password', None)
    return jsonify(user)

@app.route('/api/users', methods=['GET'])
def get_users():
    users = []
    for u in users_col.find():
        users.append({
            '_id': str(u['_id']),
            'username': u.get('username'),
            'avatar': u.get('avatar', '')
        })
    return jsonify(users)

# Added a temporary route to clear all data as requested
@app.route('/api/admin/clear-db', methods=['POST'])
def clear_db():
    users_col.delete_many({})
    messages_col.delete_many({})
    return jsonify({'status': 'Data cleared successfully'})

@app.route('/api/messages/<user_id>/<peer_id>', methods=['GET'])
def get_messages(user_id, peer_id):
    msgs = messages_col.find({
        '$or': [
            {'sender_id': user_id, 'receiver_id': peer_id},
            {'sender_id': peer_id, 'receiver_id': user_id}
        ]
    }).sort('timestamp', 1)
    
    output = []
    for m in msgs:
        output.append({
            '_id': str(m['_id']),
            'sender_id': m['sender_id'],
            'receiver_id': m['receiver_id'],
            'message': m['message'],
            'type': m.get('type', 'text'),
            'timestamp': m['timestamp'].isoformat()
        })
    return jsonify(output)

@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")

@socketio.on('register_user')
def handle_register(data):
    user_id = data.get('user_id')
    if user_id:
        join_room(user_id)
        online_users[request.sid] = user_id
        emit('user_online', {'user_id': user_id}, broadcast=True)
        print(f"User {user_id} registered and online")

@socketio.on('disconnect')
def handle_disconnect():
    user_id = online_users.get(request.sid)
    if user_id:
        emit('user_offline', {'user_id': user_id}, broadcast=True)
        online_users.pop(request.sid, None)
        print(f"User {user_id} disconnected")

@socketio.on('send_message')
def handle_message(data):
    now = datetime.utcnow()
    msg = {
        'sender_id': data['sender_id'],
        'receiver_id': data['receiver_id'],
        'message': data['message'],
        'type': data.get('type', 'text'),
        'timestamp': now
    }
    res = messages_col.insert_one(msg)
    msg['_id'] = str(res.inserted_id)
    msg['timestamp'] = now.isoformat()
    
    # Send to receiver's room
    emit('receive_message', msg, room=data['receiver_id'])
    # Send ack back to sender
    emit('message_sent', msg)

@socketio.on('typing')
def handle_typing(data):
    # data: {sender_id, receiver_id, typing: bool}
    emit('typing', data, room=data['receiver_id'])

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)

