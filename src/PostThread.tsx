import { useState } from 'react'
import { ArrowLeft, Heart, MessageCircle, Send } from 'lucide-react'
import type { Post } from './models'

const startingReplies = [
  { name: 'Laura Hämäläinen', handle: 'laurah', initials: 'LH', color: '#d7b3e8', text: 'This is exactly it. The best changes often look obvious only after someone has done the hard thinking.' },
  { name: 'Antti Koski', handle: 'anttik', initials: 'AK', color: '#8fc8bd', text: 'Removing a step is much harder than adding another setting. Nice work.' },
]

export function PostThread({ post, onClose }: { post: Post; onClose: () => void }) {
  const [reply, setReply] = useState('')
  const [replies, setReplies] = useState(startingReplies)

  const submitReply = () => {
    if (!reply.trim()) return
    setReplies(current => [...current, { name: 'Umut Efe', handle: 'umutefe', initials: 'UE', color: '#b9e678', text: reply.trim() }])
    setReply('')
  }

  return <section className="thread-panel" aria-label="Post conversation">
    <header><button onClick={onClose} aria-label="Back to feed"><ArrowLeft size={19} /></button><div><h1>Conversation</h1><span>{replies.length} replies</span></div></header>
    <article className="thread-original"><div className="thread-author"><span className="avatar" style={{ background: post.color }}>{post.name.split(' ').map(part => part[0]).join('')}</span><div><strong>{post.name}</strong><span>@{post.handle}</span></div></div><p>{post.text}</p><small>Today at {post.time === 'now' ? 'just now' : post.time} · Helsinki</small><footer><span><MessageCircle size={16} /> {post.replies + replies.length}</span><span><Heart size={16} /> {post.likes}</span></footer></article>
    <div className="thread-reply-box"><span className="avatar umut-avatar">UE</span><label><textarea value={reply} onChange={event => setReply(event.target.value)} placeholder={`Reply to @${post.handle}`} maxLength={280} /><button onClick={submitReply} disabled={!reply.trim()}><Send size={15} /> Reply</button></label></div>
    <div className="thread-replies">{replies.map((item, index) => <article key={`${item.handle}-${index}`}><span className="avatar" style={{ background: item.color }}>{item.initials}</span><div><header><strong>{item.name}</strong><span>@{item.handle} · {index + 2}m</span></header><p>{item.text}</p><button><Heart size={15} /> Like</button></div></article>)}</div>
  </section>
}
