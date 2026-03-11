import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, LogOut, Settings, MoreVertical, MessageSquare, Camera, X, Check, MessageCircle, User, Bell, Shield, HelpCircle } from 'lucide-react'
import { useChat } from '../context/ChatContext'
import { useAuth } from '../context/AuthContext'
import ContactItem from './ContactItem'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function Sidebar() {
  const { contacts, activePeer } = useChat()
  const { user, logout, updateProfile } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('All Chats')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const filteredContacts = contacts.filter(c =>
    c.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const tabs = ['All Chats', 'Groups', 'Contacts']

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      await updateProfile(res.data.url)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error('Failed to upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-[380px] h-screen bg-chat-sidebar sidebar-shadow flex flex-col relative z-20"
    >
      {/* Header */}
      <div className="p-8 pb-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setIsProfileOpen(true)}>
            <div className="relative">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-chat-primary/10 group-hover:ring-chat-primary transition-all"
                alt="Me"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <p className="text-chat-textMuted text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Hello,</p>
              <h2 className="text-xl font-extrabold text-chat-text tracking-tight capitalize">{user?.username}</h2>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-chat-textMuted hover:text-chat-primary hover:bg-chat-primary/5 transition-all">
              <Search size={16} />
            </button>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-chat-textMuted hover:text-chat-primary hover:bg-chat-primary/5 transition-all"
            >
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        {/* Tabs - Smaller & Iconic */}
        <div className="flex bg-gray-50/80 p-1 rounded-full mb-6">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${activeTab === tab
                  ? 'bg-chat-primary text-white shadow-purple'
                  : 'text-chat-textMuted hover:text-chat-text'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 custom-scrollbar">
        <div className="space-y-0.5">
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
              <div className="py-20 text-center opacity-20 scale-75">
                <MessageCircle size={48} className="mx-auto mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Quiet on set</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Profile Modal - Enhanced Account details */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-chat-text/5 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] p-10 w-full max-w-sm relative shadow-2xl sidebar-shadow"
            >
              <button
                onClick={() => setIsProfileOpen(false)}
                className="absolute top-8 right-8 p-2 text-chat-textMuted hover:text-chat-text transition-all"
              >
                <X size={20} />
              </button>

              <div className="text-center">
                <div className="mb-8">
                  <h2 className="text-xl font-black text-chat-text tracking-tight">Account Detail</h2>
                  <p className="text-chat-textMuted text-[10px] font-bold uppercase tracking-widest mt-1">Configure your identity</p>
                </div>

                <div className="relative inline-block mb-8">
                  <div className="w-28 h-28 rounded-3xl bg-chat-bg ring-8 ring-chat-primary/5 overflow-hidden">
                    <img
                      src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-chat-primary text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-lg transition-transform hover:scale-110 active:scale-95"
                  >
                    <Camera size={16} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
                </div>

                <div className="space-y-2 mb-8">
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left transition-all hover:bg-gray-100">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-chat-primary shadow-sm">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="text-[9px] text-chat-textMuted font-black uppercase tracking-widest">Username</p>
                      <p className="text-chat-text font-bold text-sm tracking-tight">{user?.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl text-left transition-all hover:bg-gray-100 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-chat-textMuted shadow-sm">
                      <Bell size={14} />
                    </div>
                    <p className="text-[10px] text-chat-text font-bold uppercase tracking-widest">Notifications</p>
                  </div>

                  <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl text-left transition-all hover:bg-gray-100 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-chat-textMuted shadow-sm">
                      <Shield size={14} />
                    </div>
                    <p className="text-[10px] text-chat-text font-bold uppercase tracking-widest">Security</p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="w-full py-4 rounded-2xl bg-red-50 text-red-500 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-red-100 transition-all flex items-center justify-center gap-3 border border-red-100"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  )
}
