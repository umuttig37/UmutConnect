import { useMemo, useState } from 'react'
import { MoreHorizontal, Search, Send } from 'lucide-react'
import type { Conversation } from './models'

interface MessageCenterProps {
  conversations: Conversation[]
  activeId: string
  onOpen: (id: string) => void
  onSend: (conversationId: string, text: string) => void
}

export function MessageCenter({ conversations, activeId, onOpen, onSend }: MessageCenterProps) {
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const activeConversation = conversations.find(item => item.id === activeId) ?? conversations[0]
  const shownConversations = useMemo(() => conversations.filter(item => `${item.name} ${item.handle}`.toLowerCase().includes(query.toLowerCase())), [conversations, query])

  const submitMessage = () => {
    if (!activeConversation || !draft.trim()) return
    onSend(activeConversation.id, draft)
    setDraft('')
  }

  return <div className="message-center">
    <aside className="message-sidebar">
      <label><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search conversations" /></label>
      <div>{shownConversations.map(item => {
        const lastMessage = item.messages.at(-1)
        return <button className={item.id === activeConversation?.id ? 'active' : ''} onClick={() => onOpen(item.id)} key={item.id}>
          <span className="avatar" style={{ background: item.color }}>{item.initials}</span>
          <span className="conversation-summary"><strong>{item.name}</strong><small>{lastMessage?.sender === 'me' ? 'You: ' : ''}{lastMessage?.text}</small></span>
          <span className="conversation-meta"><small>{lastMessage?.sentAt}</small>{item.unread > 0 && <i>{item.unread}</i>}</span>
        </button>
      })}</div>
      {shownConversations.length === 0 && <p className="no-conversations">No conversations match “{query}”.</p>}
    </aside>

    {activeConversation && <section className="active-chat">
      <header><span className="avatar" style={{ background: activeConversation.color }}>{activeConversation.initials}</span><div><strong>{activeConversation.name}</strong><small>@{activeConversation.handle} · Active today</small></div><button aria-label="Conversation options"><MoreHorizontal size={18} /></button></header>
      <div className="message-history" aria-live="polite">{activeConversation.messages.map((message, index) => <div className={`message-row ${message.sender}`} key={message.id}><div><p>{message.text}</p><small>{message.sentAt}{message.sender === 'me' && index === activeConversation.messages.length - 1 ? ' · Sent' : ''}</small></div></div>)}</div>
      <footer><textarea value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submitMessage() } }} placeholder={`Message ${activeConversation.name.split(' ')[0]}`} rows={1} /><button onClick={submitMessage} disabled={!draft.trim()} aria-label="Send message"><Send size={17} /></button></footer>
    </section>}
  </div>
}
