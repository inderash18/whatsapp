from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
client = MongoClient(MONGO_URI)
db = client['chat_app']
users_col = db['users']
messages_col = db['messages']

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'netflix_secret_key')
socketio = SocketIO(app, cors_allowed_origins='*', async_mode='eventlet')

# Track online users: {session_id: user_id}
online_users = {}

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    if users_col.find_one({'username': data['username']}):
        return jsonify({'error': 'User already exists'}), 400
    user = {
        'username': data['username'],
        'password': generate_password_hash(data['password']),
        'avatar': data.get('avatar', ''),
        'last_seen': datetime.utcnow()
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
    users_col.update_one({'_id': ObjectId(user['_id'])}, {'$set': {'last_seen': datetime.utcnow()}})
    return jsonify(user)

@app.route('/api/users', methods=['GET'])
def get_users():
    users = []
    for u in users_col.find():
        users.append({
            '_id': str(u['_id']),
            'username': u.get('username'),
            'avatar': u.get('avatar', ''),
            'last_seen': u.get('last_seen').isoformat() if u.get('last_seen') else None
        })
    return jsonify(users)

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

