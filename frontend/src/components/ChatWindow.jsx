import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MoreVertical, Phone, Video, Search, ArrowLeft, MessageCircle, Info } from 'lucide-react'
import { useChat } from '../context/ChatContext'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'

export default function ChatWindow() {
  const { messages, activePeer, deselectChat, onlineUsers } = useChat()
  const scrollRef = useRef()

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [messages])

  if (!activePeer) {
    return (
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
        <div className="relative z-10">
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-32 h-32 bg-chat-bg rounded-[48px] flex items-center justify-center text-chat-primary mb-10 mx-auto shadow-purple border border-chat-primary/10"
          >
            <MessageCircle size={60} />
          </motion.div>
          <h2 className="text-4xl font-extrabold text-chat-text mb-4 tracking-tighter">Your Workspace</h2>
          <p className="text-chat-textMuted max-w-xs mx-auto text-sm leading-relaxed">
            Select a script from the list to start directing your story. Everything you say is private.
          </p>
        </div>

        {/* Background Decor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-chat-primary/5 rounded-full blur-[100px]" />
      </div>
    )
  }

  const isOnline = onlineUsers.has(activePeer._id)

  return (
    <div className="flex-1 bg-chat-bg h-screen flex flex-col relative">
      {/* Header Area */}
      <div className="bg-chat-purpleBg text-white header-clip p-10 pb-20 relative z-10 transition-all duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={deselectChat}
              className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all active:scale-90"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={activePeer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activePeer.username}`}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/10"
                  alt={activePeer.username}
                />
                {isOnline && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-chat-purpleBg" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">{activePeer.username}</h3>
                <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mt-1">
                  {isOnline ? 'Online Now' : 'Last seen 2h ago'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
              <Video size={20} />
            </button>
            <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
              <Phone size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="absolute inset-0 pt-32 pb-32 flex flex-col">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-10 custom-scrollbar space-y-2 pt-10"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <MessageBubble
                key={msg._id || idx}
                message={msg}
                isLast={idx === messages.length - 1}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <MessageInput />
    </div>
  )
}
