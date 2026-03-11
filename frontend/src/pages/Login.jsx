import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { MessageCircle, ShieldCheck, Zap, ArrowRight, Star } from 'lucide-react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, register } = useAuth()
  const nav = useNavigate()

  const handleAuth = async (isLogin) => {
    if (!username || !password) {
      setError('Please provide your credentials')
      return
    }
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        await login(username, password)
      } else {
        await register(username, password, `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`)
      }
      nav('/chat')
    } catch (err) {
      setError(err.toString())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F8F9FE] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-chat-primary/5 rounded-full blur-[100px]" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-chat-primary/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-chat-primary rounded-[32px] flex items-center justify-center shadow-purple mx-auto mb-6"
          >
            <MessageCircle className="text-white" size={40} />
          </motion.div>
          <h1 className="text-4xl font-black text-chat-text tracking-tight mb-2">Purple Messenger</h1>
          <p className="text-chat-textMuted font-medium text-sm">Experience the modern way of connecting.</p>
        </div>

        <div className="bg-white rounded-[40px] p-12 shadow-soft border border-gray-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <Star size={24} className="text-chat-primary/10" />
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-widest text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-chat-textMuted uppercase tracking-widest ml-1">Username</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-gray-50 border border-transparent text-chat-text px-6 py-5 rounded-3xl outline-none focus:bg-white focus:border-chat-primary/30 transition-all font-semibold placeholder:text-chat-textMuted/30"
                placeholder="Enter workspace name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-chat-textMuted uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-transparent text-chat-text px-6 py-5 rounded-3xl outline-none focus:bg-white focus:border-chat-primary/30 transition-all font-semibold placeholder:text-chat-textMuted/30"
                placeholder="Secure your access"
              />
            </div>

            <div className="pt-4 grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAuth(true)}
                disabled={loading}
                className="bg-chat-primary text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-purple transition-all flex items-center justify-center gap-2"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
                {!loading && <ArrowRight size={16} />}
              </motion.button>

              <button
                onClick={() => handleAuth(false)}
                className="w-full bg-gray-50 text-chat-textMuted py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
              >
                Join Now
              </button>
            </div>
          </form>

          <footer className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-chat-primary" />
              <span className="text-[10px] font-bold text-chat-textMuted uppercase tracking-widest">End-to-End Encryption</span>
            </div>
            <p className="text-[10px] font-bold text-chat-textMuted uppercase tracking-widest">v2.4.0</p>
          </footer>
        </div>

        <p className="mt-10 text-center text-chat-textMuted font-bold text-[10px] uppercase tracking-[0.3em]">
          Inspired by Modern Larry Machigo Design
        </p>
      </motion.div>
    </div>
  )
}
