import React from 'react'
import { motion } from 'framer-motion'
import { useChat } from '../context/ChatContext'

export default function ContactItem({ contact, isActive }) {
  const { selectChat, onlineUsers } = useChat()
  const isOnline = onlineUsers.has(contact._id)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => selectChat(contact)}
      className={`group relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${isActive
          ? 'bg-netflix-red/10 border border-netflix-red/20 red-glow'
          : 'hover:bg-white/5 border border-transparent hover:border-white/5'
        }`}
    >
      {/* Avatar Container */}
      <div className="relative">
        <div className={`w-14 h-14 rounded-2xl overflow-hidden ring-2 transition-all duration-300 ${isActive ? 'ring-netflix-red' : 'ring-transparent'
          }`}>
          <img
            src={contact.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.username}`}
            alt={contact.username}
            className="w-full h-full object-cover"
          />
        </div>
        {isOnline && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-netflix-dark shadow-lg ring-2 ring-green-500/20" />
        )}
      </div>

      {/* Info Container */}
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-start mb-1">
          <h4 className={`font-medium text-base transition-colors duration-300 ${isActive ? 'text-white' : 'text-netflix-textMuted group-hover:text-white'
            }`}>
            {contact.username}
          </h4>
          <span className="text-[10px] text-netflix-textMuted uppercase tracking-tighter mt-1">12:45 PM</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-netflix-textMuted truncate font-light">
            {contact.lastMessage || 'Start a conversation'}
          </p>
          {/* Notification badge placeholder */}
          {Math.random() > 0.7 && !isActive && (
            <div className="min-w-[18px] h-[18px] flex items-center justify-center bg-netflix-red text-[10px] text-white font-bold rounded-full px-1 shadow-[0_0_10px_rgba(229,9,20,0.4)]">
              2
            </div>
          )}
        </div>
      </div>

      {/* Active Indicator Line */}
      {isActive && (
        <motion.div
          layoutId="activeSide"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-netflix-red rounded-r-full shadow-[2px_0_10px_rgba(229,9,20,0.6)]"
        />
      )}
    </motion.div>
  )
}

