import { useState } from 'react'
import { ArrowLeft, MapPin } from 'lucide-react'
import { people } from './data/explore'
import type { Post, Reply } from './models'

interface UserProfilePanelProps {
  handle: string
  posts: Post[]
  replies: Reply[]
  following: string[]
  onFollow: (handle: string) => void
  onOpenPost: (post: Post) => void
  onClose: () => void
}

const bios: Record<string, string> = {
  elias: 'Frontend developer who cares about fast interfaces, quiet details and code that stays understandable.',
  venla: 'Product designer working between research, interface design and the occasional ceramics class.',
  mikko: 'Building small web products from Tampere. Usually sharing the useful mistakes along the way.',
  laurah: 'UX researcher interested in how people actually use the things we build.',
  anttik: 'Software engineer, open-source contributor and year-round cyclist in Oulu.',
  emilialaine: 'Designing straightforward product experiences and writing down what I learn.',
  oskarin: 'Developer, coffee regular and collector of unfinished weekend projects.',
  sarak: 'Product-minded developer asking too many questions in the best possible way.',
}

export function UserProfilePanel({ handle, posts, replies, following, onFollow, onOpenPost, onClose }: UserProfilePanelProps) {
  const [tab, setTab] = useState<'posts' | 'replies' | 'media'>('posts')
  const knownPerson = people.find(person => person.handle === handle)
  const postAuthor = posts.find(post => post.handle === handle)
  const person = knownPerson ?? { name: postAuthor?.name ?? handle, handle, initials: postAuthor?.name.split(' ').map(part => part[0]).join('') ?? handle.slice(0, 2), color: postAuthor?.color ?? '#d8d5ce', role: 'UmutConnect member', location: 'Finland' }
  const userPosts = posts.filter(post => post.handle === handle)
  const userReplies = replies.filter(reply => reply.handle === handle)
  const mediaPosts = userPosts.filter(post => post.image || post.photo)
  const isFollowing = following.includes(handle)

  return <section className="user-profile-panel"><header><button onClick={onClose} aria-label="Back"><ArrowLeft size={19} /></button><div><h1>{person.name}</h1><span>{userPosts.length} posts</span></div></header><div className="user-cover"/><div className="user-profile-details"><span className="profile-avatar" style={{ background: person.color }}>{person.initials}</span><button className={isFollowing ? 'following' : ''} onClick={() => onFollow(handle)}>{isFollowing ? 'Following' : 'Follow'}</button><h2>{person.name}</h2><span>@{handle}</span><p>{bios[handle] ?? `${person.role} sharing work, ideas and everyday moments.`}</p><small><MapPin size={13} /> {person.location}</small><div><span><strong>{48 + handle.length}</strong> Following</span><span><strong>{120 + handle.length * 11}</strong> Followers</span></div></div><nav className="profile-tabs"><button className={tab === 'posts' ? 'active' : ''} onClick={() => setTab('posts')}>Posts</button><button className={tab === 'replies' ? 'active' : ''} onClick={() => setTab('replies')}>Replies</button><button className={tab === 'media' ? 'active' : ''} onClick={() => setTab('media')}>Media</button></nav>{tab === 'posts' && <div className="user-posts">{userPosts.length ? userPosts.map(post => <button onClick={() => onOpenPost(post)} key={post.id}><strong>{person.name}</strong><span>@{handle} · {post.time}</span><p>{post.text || 'Photo post'}</p></button>) : <p>No posts here yet.</p>}</div>}{tab === 'replies' && <div className="user-posts">{userReplies.length ? userReplies.map(reply => <article className="profile-reply" key={reply.id}><strong>@{handle} replied</strong><span>{reply.time}</span><p>{reply.text}</p></article>) : <p>No replies here yet.</p>}</div>}{tab === 'media' && <div className="profile-media-grid">{mediaPosts.length ? mediaPosts.map(post => <button onClick={() => onOpenPost(post)} key={post.id}>{post.image ? <img src={post.image} alt={post.imageAlt || `Photo shared by ${person.name}`} /> : <span>Helsinki, Finland</span>}</button>) : <p>No photo posts here yet.</p>}</div>}</section>
}
