import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { useChat } from '../context/ChatContext'
import { Pin } from 'lucide-react'

const ContactItem = forwardRef(({ contact, isActive }, ref) => {
  const { selectChat, onlineUsers } = useChat()
  const isOnline = onlineUsers.has(contact._id)

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
      onClick={() => selectChat(contact)}
      className={`group relative flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${isActive
          ? 'bg-gray-50/80 shadow-sm'
          : 'hover:bg-gray-50/30'
        }`}
    >
      {/* Avatar - Smaller & Iconic */}
      <div className="relative">
        <div className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all duration-300 ${isActive ? 'border-chat-primary scale-105 shadow-purple' : 'border-transparent'
          }`}>
          <img
            src={contact.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.username}`}
            alt={contact.username}
            className="w-full h-full object-cover"
          />
        </div>
        {isOnline && (
          <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-[3px] border-white" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center mb-0.5">
          <h4 className="font-bold text-chat-text text-sm truncate tracking-tight">
            {contact.username}
            {Math.random() > 0.8 && <Pin size={10} className="inline ml-1.5 text-chat-primary opacity-40 rotate-45" />}
          </h4>
          <span className="text-[9px] text-chat-textMuted font-black uppercase tracking-widest opacity-60">09:38 AM</span>
        </div>
        <div className="flex justify-between items-center">
          <p className={`text-[11px] truncate tracking-tight ${isActive ? 'text-chat-text font-bold' : 'text-chat-textMuted font-medium'}`}>
            {contact.lastMessage || 'Directing a scene...'}
          </p>
          {Math.random() > 0.7 && !isActive && (
            <div className="min-w-[16px] h-[16px] flex items-center justify-center bg-chat-primary text-[9px] text-white font-black rounded-full px-1 shadow-purple">
              2
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
})

export default ContactItem
