import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Video, Info, MoreVertical, MessageCircle } from 'lucide-react'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import { useChat } from '../context/ChatContext'

export default function ChatWindow() {
  const { messages, activePeer, isTyping, onlineUsers, messagesEndRef } = useChat()
  const isOnline = activePeer ? onlineUsers.has(activePeer._id) : false

  if (!activePeer) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center cinematic-bg overflow-hidden relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10"
        >
          <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto mb-8 glass-morphism border-white/10">
            <MessageCircle size={48} className="text-netflix-red animate-pulse-slow" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-[0.3em]">Select a Story</h2>
          <p className="text-netflix-textMuted font-light">Choose a contact to start messaging.</p>
        </motion.div>
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-netflix-red/10 rounded-full blur-[120px] pointer-events-none" />
      </main>
    )
  }

  return (
    <main className="flex-1 flex flex-col cinematic-bg relative overflow-hidden">
      {/* Immersive Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 flex items-center justify-between border-b border-white/5 glass-morphism z-20"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={activePeer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activePeer.username}`}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-netflix-red/20 shadow-xl"
              alt={activePeer.username}
            />
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-netflix-black" />
            )}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">{activePeer.username}</h3>
            <p className="text-netflix-textMuted text-xs flex items-center gap-1">
              {isOnline ? 'Active Now' : 'Last seen recently'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-netflix-textMuted">
          <button className="hover:text-netflix-red transition-colors"><Phone size={20} /></button>
          <button className="hover:text-netflix-red transition-colors"><Video size={20} /></button>
          <div className="w-[1px] h-6 bg-white/10 mx-2" />
          <button className="hover:text-netflix-red transition-colors"><Info size={20} /></button>
          <button className="hover:text-netflix-red transition-colors"><MoreVertical size={20} /></button>
        </div>
      </motion.header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 custom-scrollbar relative z-10">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <MessageBubble
              key={m._id || i}
              message={m}
              isLast={i === messages.length - 1}
            />
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-netflix-red text-xs font-medium bg-red-500/10 px-4 py-2 rounded-full w-fit border border-red-500/20"
          >
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
            {activePeer.username} is typing...
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Panel */}
      <MessageInput />

      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-netflix-red/5 blur-[120px] pointer-events-none -z-0" />
    </main>
  )
}

