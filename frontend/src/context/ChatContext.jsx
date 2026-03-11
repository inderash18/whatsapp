import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import useSocket from '../hooks/useSocket'
import api from '../services/api'
import { useAuth } from './AuthContext'

const ChatContext = createContext()

export function ChatProvider({ children }) {
  const { user } = useAuth()
  const [contacts, setContacts] = useState([])
  const [activePeer, setActivePeer] = useState(null)
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const socket = useSocket()

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get('/users')
        if (user) {
          setContacts(res.data.filter(u => u._id !== user._id))
        } else {
          setContacts(res.data)
        }
      } catch (err) {
        console.error('Failed to fetch contacts', err)
      }
    }
    fetchContacts()
  }, [user])

  useEffect(() => {
    if (!socket || !user) return

    socket.emit('register_user', { user_id: user._id })

    socket.on('receive_message', (msg) => {
      if (activePeer && (msg.sender_id === activePeer._id || msg.sender_id === user._id)) {
        setMessages(prev => [...prev, msg])
      }
      // Update last message in contacts list
      setContacts(prev => prev.map(c =>
        c._id === msg.sender_id ? { ...c, lastMessage: msg.message } : c
      ))
    })

    socket.on('message_sent', (msg) => {
      setMessages(prev => [...prev, msg])
    })

    socket.on('typing', (data) => {
      if (activePeer && data.sender_id === activePeer._id) {
        setIsTyping(data.typing)
      }
    })

    socket.on('user_online', (data) => {
      setOnlineUsers(prev => new Set([...prev, data.user_id]))
    })

    socket.on('user_offline', (data) => {
      setOnlineUsers(prev => {
        const next = new Set(prev)
        next.delete(data.user_id)
        return next
      })
    })

    return () => {
      socket.off('receive_message')
      socket.off('message_sent')
      socket.off('typing')
      socket.off('user_online')
      socket.off('user_offline')
    }
  }, [socket, user, activePeer])

  const selectChat = async (peer) => {
    setActivePeer(peer)
    setIsTyping(false)
    try {
      const res = await api.get(`/messages/${user._id}/${peer._id}`)
      setMessages(res.data)
    } catch (err) {
      console.error('Failed to load messages', err)
    }
  }

  const sendMessage = (text, type = 'text') => {
    if (!socket || !activePeer || !user) return
    const msgData = {
      sender_id: user._id,
      receiver_id: activePeer._id,
      message: text,
      type: type
    }
    socket.emit('send_message', msgData)
  }

  const sendTypingStatus = (typing) => {
    if (!socket || !activePeer || !user) return
    socket.emit('typing', {
      sender_id: user._id,
      receiver_id: activePeer._id,
      typing
    })
  }

  return (
    <ChatContext.Provider value={{
      contacts,
      activePeer,
      messages,
      isTyping,
      onlineUsers,
      selectChat,
      sendMessage,
      sendTypingStatus,
      messagesEndRef
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)

