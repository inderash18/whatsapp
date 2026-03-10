import React from 'react'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import { motion } from 'framer-motion'

export default function Chat() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen w-full flex bg-netflix-black overflow-hidden"
    >
      <Sidebar />
      <ChatWindow />
    </motion.div>
  )
}

