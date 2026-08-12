import { useState } from 'react'
import { Check, Copy, MessageCircle, Send, Share2, X } from 'lucide-react'
import type { Conversation, Post } from './models'

interface ShareDialogProps {
  post: Post
  conversations: Conversation[]
  onSend: (conversationId: string, text: string) => void
  onNotice: (message: string) => void
  onClose: () => void
}

export function ShareDialog({ post, conversations, onSend, onNotice, onClose }: ShareDialogProps) {
  const [sentTo, setSentTo] = useState<string[]>([])
  const postUrl = `${window.location.origin}${window.location.pathname}#post-${post.id}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl)
      onNotice('Post link copied')
    } catch {
      const input = document.createElement('textarea')
      input.value = postUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
      onNotice('Post link copied')
    }
  }

  const shareOutside = async () => {
    if (!navigator.share) {
      await copyLink()
      return
    }
    try {
      await navigator.share({ title: `${post.name} on UmutConnect`, text: post.text, url: postUrl })
    } catch (error) {
      if ((error as DOMException).name !== 'AbortError') onNotice('Sharing was not available this time')
    }
  }

  const sendToConversation = (conversationId: string) => {
    if (sentTo.includes(conversationId)) return
    const preview = post.text ? `Shared a post from @${post.handle}: “${post.text.slice(0, 90)}${post.text.length > 90 ? '…' : ''}” ${postUrl}` : `Shared a photo from @${post.handle}: ${postUrl}`
    onSend(conversationId, preview)
    setSentTo(current => [...current, conversationId])
  }

  return <div className="share-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section className="share-dialog" role="dialog" aria-modal="true" aria-labelledby="share-title">
      <header><div><small>Share post</small><h2 id="share-title">Pass it along</h2></div><button onClick={onClose} aria-label="Close"><X size={19} /></button></header>
      <div className="share-post-preview"><span className="avatar" style={{ background: post.color }}>{post.name.split(' ').map(part => part[0]).join('')}</span><div><strong>{post.name}</strong><span>@{post.handle}</span><p>{post.text || 'Shared a photo'}</p></div></div>
      <div className="share-actions"><button onClick={copyLink}><span><Copy size={18} /></span>Copy link</button><button onClick={shareOutside}><span><Share2 size={18} /></span>More options</button></div>
      <div className="share-conversations"><header><MessageCircle size={15} /><strong>Send in a message</strong></header>{conversations.map(item => <button onClick={() => sendToConversation(item.id)} key={item.id}><span className="avatar" style={{ background: item.color }}>{item.initials}</span><span><strong>{item.name}</strong><small>@{item.handle}</small></span><i>{sentTo.includes(item.id) ? <Check size={15} /> : <Send size={15} />}</i></button>)}</div>
    </section>
  </div>
}
