import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Smile, Plus, Mic, Paperclip } from 'lucide-react'
import { useChat } from '../context/ChatContext'

export default function MessageInput() {
  const [text, setText] = useState('')
  const { sendMessage, sendTypingStatus } = useChat()
  const typingTimeoutRef = useRef(null)

  const handleSend = () => {
    if (!text.trim()) return
    sendMessage(text)
    setText('')
    sendTypingStatus(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e) => {
    setText(e.target.value)

    // Typing indicator logic
    sendTypingStatus(true)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(false)
    }, 2000)
  }

  return (
    <footer className="p-6 pt-2 bg-gradient-to-t from-netflix-black via-netflix-black/95 to-transparent relative z-20">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-6xl mx-auto flex items-end gap-4"
      >
        <div className="flex-1 relative group">
          <div className="absolute inset-0 bg-netflix-red/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="relative glass-morphism rounded-2xl border border-white/10 flex items-end p-2 transition-all duration-300 group-focus-within:border-netflix-red/30">
            <button className="p-3 text-netflix-textMuted hover:text-white transition-colors">
              <Smile size={22} />
            </button>
            <button className="p-3 text-netflix-textMuted hover:text-white transition-colors">
              <Paperclip size={22} />
            </button>

            <textarea
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Start typing a story..."
              rows="1"
              className="flex-1 bg-transparent border-none outline-none text-[15px] font-light py-3 px-2 text-white placeholder:text-netflix-textMuted/40 resize-none custom-scrollbar max-h-32"
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = e.target.scrollHeight + 'px'
              }}
            />

            <button className="p-3 text-netflix-textMuted hover:text-white transition-colors">
              <Plus size={22} />
            </button>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(229, 9, 20, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!text.trim()}
          className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-300 ${text.trim()
              ? 'bg-netflix-red text-white shadow-lg shadow-netflix-red/30'
              : 'bg-white/5 text-netflix-textMuted cursor-not-allowed'
            }`}
        >
          {text.trim() ? <Send size={24} className="ml-1" /> : <Mic size={24} />}
        </motion.button>
      </motion.div>
    </footer>
  )
}

