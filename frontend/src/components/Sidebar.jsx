import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, LogOut, Settings, MoreVertical, MessageSquare } from 'lucide-react'
import { useChat } from '../context/ChatContext'
import { useAuth } from '../context/AuthContext'
import ContactItem from './ContactItem'

export default function Sidebar() {
  const { contacts, activePeer } = useChat()
  const { user, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredContacts = contacts.filter(c =>
    c.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-[400px] h-screen bg-netflix-dark border-r border-white/5 flex flex-col relative z-20"
    >
      {/* Profile Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-netflix-red/20"
              alt="Profile"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-netflix-dark" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg leading-tight uppercase tracking-wider">{user?.username}</h2>
            <p className="text-netflix-textMuted text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Online
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={logout} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-netflix-textMuted hover:text-netflix-red">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-netflix-textMuted group-focus-within:text-netflix-red transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-netflix-red/50 focus:ring-4 focus:ring-netflix-red/10 transition-all font-light placeholder:text-netflix-textMuted/50"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <div className="mb-4 px-2">
          <h3 className="text-netflix-textMuted text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Direct Messages</h3>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <ContactItem
                    key={contact._id}
                    contact={contact}
                    isActive={activePeer?._id === contact._id}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center"
                >
                  <MessageSquare className="mx-auto text-white/5 mb-4" size={48} />
                  <p className="text-netflix-textMuted text-sm">No conversations found</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer Glow */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-netflix-red/5 to-transparent pointer-events-none" />
    </motion.aside>
  )
}

