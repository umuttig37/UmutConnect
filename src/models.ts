export interface Post {
  id: number
  name: string
  handle: string
  time: string
  color: string
  text: string
  likes: number
  replies: number
  photo?: boolean
  image?: string
  imageAlt?: string
  liked?: boolean
  bookmarked?: boolean
}

export interface Notification {
  id: number
  person: string
  message: string
  time: string
  type: 'like' | 'follow' | 'share' | 'reply'
  read: boolean
}

export interface ChatMessage {
  id: number
  sender: 'me' | 'them'
  text: string
  sentAt: string
}

export interface Conversation {
  id: string
  name: string
  handle: string
  initials: string
  color: string
  unread: number
  messages: ChatMessage[]
}

export interface Person {
  id: string
  name: string
  handle: string
  initials: string
  color: string
  role: string
  location: string
}

export interface Topic {
  id: string
  name: string
  category: string
  posts: string
  description: string
}
