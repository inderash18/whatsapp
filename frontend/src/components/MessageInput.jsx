import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Plus, Mic, Paperclip, Smile } from 'lucide-react'
import { useChat } from '../context/ChatContext'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function MessageInput() {
  const [text, setText] = useState('')
  const [uploading, setUploading] = useState(false)
  const { sendMessage, sendTypingStatus } = useChat()
  const typingTimeoutRef = useRef(null)
  const fileInputRef = useRef(null)

  const handleSend = () => {
    if (!text.trim()) return
    sendMessage(text)
    setText('')
    sendTypingStatus(false)
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      sendMessage(res.data.url, 'image')
    } catch (err) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e) => {
    setText(e.target.value)
    sendTypingStatus(true)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(false)
    }, 2000)
  }

  return (
    <footer className="p-10 pt-4 relative z-20">
      <div className="max-w-6xl mx-auto flex items-center gap-5">
        <div className="flex-1 bg-white rounded-full p-2 pl-4 flex items-center shadow-soft border border-gray-100 group transition-all duration-300 focus-within:shadow-purple focus-within:border-chat-primary/20">
          <button className="p-3 text-chat-textMuted hover:text-chat-primary transition-all">
            <Mic size={22} />
          </button>

          <input
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={uploading ? "Broadcasting asset..." : "Script your message..."}
            disabled={uploading}
            className="flex-1 bg-transparent border-none outline-none text-sm font-semibold py-3 px-4 text-chat-text placeholder:text-chat-textMuted/40"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-chat-textMuted hover:text-chat-primary transition-all"
          >
            <Paperclip size={22} />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

          <button className="p-3 text-chat-textMuted hover:text-chat-primary transition-all">
            <Smile size={22} />
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!text.trim() || uploading}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-purple ${text.trim() && !uploading
              ? 'bg-chat-primary text-white'
              : 'bg-white text-chat-textMuted'
            }`}
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-chat-primary/20 border-t-chat-primary rounded-full animate-spin" />
          ) : (
            <Send size={24} className={text.trim() ? "translate-x-0.5" : ""} />
          )}
        </motion.button>
      </div>
    </footer>
  )
}
