import { useState } from 'react'
import { ArrowLeft, Heart, MessageCircle, Send, Trash2 } from 'lucide-react'
import type { Post, Reply, UserProfile } from './models'

interface PostThreadProps {
  post: Post
  replies: Reply[]
  profile: UserProfile
  onAddReply: (postId: number, text: string) => void
  onLikeReply: (replyId: number) => void
  onDeleteReply: (replyId: number) => void
  onOpenProfile: (handle: string) => void
  onClose: () => void
}

export function PostThread({ post, replies, profile, onAddReply, onLikeReply, onDeleteReply, onOpenProfile, onClose }: PostThreadProps) {
  const [reply, setReply] = useState('')
  const postReplies = replies.filter(item => item.postId === post.id)

  const submitReply = () => {
    if (!reply.trim()) return
    onAddReply(post.id, reply.trim())
    setReply('')
  }

  return <section className="thread-panel" aria-label="Post conversation">
    <header><button onClick={onClose} aria-label="Back to feed"><ArrowLeft size={19} /></button><div><h1>Conversation</h1><span>{postReplies.length} {postReplies.length === 1 ? 'reply' : 'replies'}</span></div></header>
    <article className="thread-original"><button className="thread-author" onClick={() => onOpenProfile(post.handle)}><span className="avatar" style={{ background: post.color }}>{post.name.split(' ').map(part => part[0]).join('')}</span><span><strong>{post.name}</strong><small>@{post.handle}</small></span></button>{post.text && <p>{post.text}</p>}{post.image && <img className="thread-image" src={post.image} alt={post.imageAlt || `Photo shared by ${post.name}`} />}<small>Today at {post.time === 'now' ? 'just now' : post.time} · Helsinki</small><footer><span><MessageCircle size={16} /> {post.replies + postReplies.length}</span><span><Heart size={16} /> {post.likes}</span></footer></article>
    <div className="thread-reply-box"><span className="avatar" style={{ background: profile.color }}>{initials(profile.name)}</span><label><textarea value={reply} onChange={event => setReply(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) submitReply() }} placeholder={`Reply to @${post.handle}`} maxLength={280} /><span>{reply.length}/280 · Ctrl+Enter to send</span><button onClick={submitReply} disabled={!reply.trim()}><Send size={15} /> Reply</button></label></div>
    {postReplies.length === 0 && <div className="thread-empty"><MessageCircle size={22} /><strong>Start the conversation</strong><span>Be the first person to reply.</span></div>}
    <div className="thread-replies">{postReplies.map(item => <article key={item.id}><button className="reply-avatar" onClick={() => onOpenProfile(item.handle)}><span className="avatar" style={{ background: item.color }}>{item.initials}</span></button><div><header><button onClick={() => onOpenProfile(item.handle)}><strong>{item.name}</strong><span>@{item.handle} · {item.time}</span></button>{item.handle === profile.handle && <button className="delete-reply" onClick={() => onDeleteReply(item.id)} aria-label="Delete your reply"><Trash2 size={14} /></button>}</header><p>{item.text}</p><button className={item.liked ? 'reply-liked' : ''} onClick={() => onLikeReply(item.id)}><Heart size={15} fill={item.liked ? 'currentColor' : 'none'} /> {item.likes || 'Like'}</button></div></article>)}</div>
  </section>
}

const initials = (name: string) => name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
