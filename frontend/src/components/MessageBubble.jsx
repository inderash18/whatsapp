import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const MessageBubble = forwardRef(({ message, isLast }, ref) => {
  const { user } = useAuth()
  const isMe = message.sender_id === user?._id

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`relative max-w-[75%] lg:max-w-[65%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
        <div className={`px-5 py-4 rounded-[28px] ${isMe
            ? 'message-bubble-sent text-white rounded-tr-none'
            : 'message-bubble-received text-chat-text rounded-tl-none'
          }`}>
          {message.type === 'image' ? (
            <img
              src={message.message}
              alt="Asset"
              className="max-w-full rounded-[20px] cursor-pointer hover:scale-[1.02] transition-transform"
              onClick={() => window.open(message.message, '_blank')}
            />
          ) : (
            <p className="text-[15px] font-medium leading-relaxed">{message.message}</p>
          )}
        </div>

        <div className={`text-[9px] font-bold uppercase tracking-widest mt-1.5 px-3 ${isMe ? 'text-white/40' : 'text-chat-text/30'
          }`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  )
})

export default MessageBubble
