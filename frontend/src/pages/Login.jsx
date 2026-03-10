import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { MessageSquare, ShieldCheck, Zap } from 'lucide-react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, register } = useAuth()
  const nav = useNavigate()

  const handleAuth = async (isLogin) => {
    if (!username || !password) {
      setError('Please fill in all fields')
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
    <div className="min-h-screen w-full cinematic-bg flex items-center justify-center p-6 bg-netflix-black relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-netflix-red/5 rounded-full blur-[150px] animate-pulse-slow" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[450px] relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="bg-netflix-red p-2.5 rounded-2xl shadow-[0_0_20px_rgba(229,9,20,0.5)]">
              <MessageSquare className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-black text-netflix-red tracking-tighter">CHATFLIX</h1>
          </motion.div>
          <p className="text-netflix-textMuted font-light tracking-widest uppercase text-xs">Premium Messaging Experience</p>
        </div>

        <div className="glass-morphism rounded-[32px] p-10 border-white/10 shadow-2xl relative">
          <h2 className="text-2xl font-bold text-white mb-8">Sign In</h2>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-netflix-red/10 border border-netflix-red/20 rounded-xl text-netflix-red text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5 group">
              <label className="text-[11px] font-bold text-netflix-textMuted uppercase tracking-wider ml-1 group-focus-within:text-netflix-red transition-colors">Username</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-5 py-4 rounded-2xl outline-none focus:border-netflix-red/50 focus:ring-4 focus:ring-netflix-red/10 transition-all font-light"
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-1.5 group">
              <label className="text-[11px] font-bold text-netflix-textMuted uppercase tracking-wider ml-1 group-focus-within:text-netflix-red transition-colors">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-5 py-4 rounded-2xl outline-none focus:border-netflix-red/50 focus:ring-4 focus:ring-netflix-red/10 transition-all font-light"
                placeholder="Enter your password"
              />
            </div>

            <div className="pt-4 space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAuth(true)}
                disabled={loading}
                className="w-full bg-netflix-red text-white py-4 rounded-2xl font-bold text-lg shadow-[0_4px_20px_rgba(229,9,20,0.4)] hover:shadow-[0_4px_30px_rgba(229,9,20,0.6)] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Login'}
              </motion.button>

              <button
                onClick={() => handleAuth(false)}
                className="w-full bg-white/5 text-white py-4 rounded-2xl font-medium hover:bg-white/10 transition-colors border border-white/5"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
            <div className="text-center">
              <ShieldCheck className="mx-auto text-netflix-textMuted mb-2" size={18} />
              <p className="text-[10px] text-netflix-textMuted uppercase font-bold">Secure</p>
            </div>
            <div className="text-center">
              <Zap className="mx-auto text-netflix-textMuted mb-2" size={18} />
              <p className="text-[10px] text-netflix-textMuted uppercase font-bold">Fast</p>
            </div>
            <div className="text-center">
              <MessageSquare className="mx-auto text-netflix-textMuted mb-2" size={18} />
              <p className="text-[10px] text-netflix-textMuted uppercase font-bold">Private</p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-netflix-textMuted text-xs font-light">
          This is a premium demonstration and does not use real billing.
        </p>
      </motion.div>
    </div>
  )
}

