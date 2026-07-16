import { useEffect, useState } from 'react'
import { startingConversations } from '../data/conversations'
import type { Conversation } from '../models'

const storageKey = 'umutconnect-conversations'

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : startingConversations
    } catch {
      return startingConversations
    }
  })
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? '')

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(conversations))
  }, [conversations])

  const openConversation = (id: string) => {
    setActiveId(id)
    setConversations(current => current.map(item => item.id === id ? { ...item, unread: 0 } : item))
  }

  const sendMessage = (conversationId: string, text: string) => {
    const cleanText = text.trim()
    if (!cleanText) return

    setConversations(current => current.map(item => item.id === conversationId ? {
      ...item,
      messages: [...item.messages, {
        id: Date.now(),
        sender: 'me',
        text: cleanText,
        sentAt: new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()),
      }],
    } : item))
  }

  return {
    conversations,
    activeId,
    unreadCount: conversations.reduce((total, item) => total + item.unread, 0),
    openConversation,
    sendMessage,
  }
}
