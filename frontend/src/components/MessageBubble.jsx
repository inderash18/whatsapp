import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function MessageBubble({ message, isLast }) {
  const { user } = useAuth()
  const isMe = message.sender_id === user?._id

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} group mb-2`}
    >
      <div className={`relative max-w-[70%] lg:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
        <div className={`px-5 py-3.5 rounded-2xl shadow-xl transition-all duration-300 ${isMe
          ? 'bg-red-gradient text-white rounded-tr-none'
          : 'bg-netflix-received text-netflix-text rounded-tl-none border border-white/5'
          }`}>
          {message.type === 'image' ? (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={message.message}
              alt="Sent cinematic"
              className="max-w-full rounded-lg cursor-pointer hover:scale-[1.02] transition-transform"
              onClick={() => window.open(message.message, '_blank')}
            />
          ) : (
            <p className="text-[15px] leading-relaxed font-light">{message.message}</p>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className={`text-[10px] text-netflix-textMuted mt-1.5 px-1 uppercase tracking-widest font-bold ${isMe ? 'text-right' : 'text-left'
            }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </motion.div>
      </div>
    </motion.div>
  )
}

