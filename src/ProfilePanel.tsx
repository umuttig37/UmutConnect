import { useState } from 'react'
import { CalendarDays, MapPin, X } from 'lucide-react'
import type { Post, Reply, UserProfile } from './models'

interface ProfilePanelProps {
  profile: UserProfile
  posts: Post[]
  replies: Reply[]
  followingCount: number
  onSave: (profile: UserProfile) => void
  onOpenPost: (post: Post) => void
}

export function ProfilePanel({ profile, posts, replies, followingCount, onSave, onOpenPost }: ProfilePanelProps) {
  const [editing, setEditing] = useState(false)
  const [tab, setTab] = useState<'posts' | 'replies' | 'media'>('posts')
  const [draft, setDraft] = useState(profile)
  const ownPosts = posts.filter(post => post.handle === profile.handle).sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)))
  const ownReplies = replies.filter(reply => reply.handle === profile.handle)
  const mediaPosts = ownPosts.filter(post => post.image || post.photo)

  const save = () => {
    if (!draft.name.trim() || !draft.handle.trim()) return
    onSave({ ...draft, name: draft.name.trim(), handle: draft.handle.trim().replace(/^@/, '').replace(/\s+/g, '').toLowerCase(), bio: draft.bio.trim(), location: draft.location.trim() })
    setEditing(false)
  }

  return <div className="profile-view personal-profile">
    <div className="profile-cover"><span>Helsinki evenings</span></div>
    <div className="profile-details"><span className="profile-avatar" style={{ background: profile.color }}>{initials(profile.name)}</span><button onClick={() => { setDraft(profile); setEditing(true) }}>Edit profile</button><h2>{profile.name}</h2><span>@{profile.handle}</span><p>{profile.bio}</p><div className="profile-meta"><span><MapPin size={13} /> {profile.location}</span><span><CalendarDays size={13} /> Joined July 2026</span></div><div className="profile-stats"><span><strong>{followingCount}</strong> Following</span><span><strong>214</strong> Followers</span><span><strong>{ownPosts.length}</strong> Posts</span></div></div>
    <nav className="profile-tabs"><button className={tab === 'posts' ? 'active' : ''} onClick={() => setTab('posts')}>Posts</button><button className={tab === 'replies' ? 'active' : ''} onClick={() => setTab('replies')}>Replies</button><button className={tab === 'media' ? 'active' : ''} onClick={() => setTab('media')}>Media</button></nav>
    {tab === 'posts' && <div className="profile-post-list">{ownPosts.length === 0 ? <p>You have not posted anything yet.</p> : ownPosts.map(post => <button onClick={() => onOpenPost(post)} key={post.id}>{post.pinned && <small>Pinned</small>}<strong>{profile.name}</strong><span>@{profile.handle} · {post.time}</span><p>{post.text || 'Photo post'}</p>{post.image && <img src={post.image} alt={post.imageAlt || 'Your uploaded photo'} />}</button>)}</div>}
    {tab === 'replies' && <div className="profile-post-list">{ownReplies.length === 0 ? <p>You have not replied to a post yet.</p> : ownReplies.map(reply => <article className="profile-reply" key={reply.id}><strong>Replying as @{profile.handle}</strong><span>{reply.time}</span><p>{reply.text}</p></article>)}</div>}
    {tab === 'media' && <div className="profile-media-grid">{mediaPosts.length === 0 ? <p>Your photo posts will appear here.</p> : mediaPosts.map(post => <button onClick={() => onOpenPost(post)} key={post.id}>{post.image ? <img src={post.image} alt={post.imageAlt || 'Your uploaded photo'} /> : <span>Helsinki, Finland</span>}</button>)}</div>}
    {editing && <div className="profile-edit-backdrop" onMouseDown={event => event.target === event.currentTarget && setEditing(false)}><section className="profile-edit-dialog" role="dialog" aria-modal="true" aria-labelledby="profile-edit-title"><header><h2 id="profile-edit-title">Edit profile</h2><button onClick={() => setEditing(false)} aria-label="Close"><X size={19} /></button></header><div className="profile-color-preview" style={{ background: draft.color }}>{initials(draft.name)}</div><label>Name<input value={draft.name} maxLength={50} onChange={event => setDraft({ ...draft, name: event.target.value })} /></label><label>Username<input value={draft.handle} maxLength={24} onChange={event => setDraft({ ...draft, handle: event.target.value })} /></label><label>Bio<textarea value={draft.bio} maxLength={160} rows={4} onChange={event => setDraft({ ...draft, bio: event.target.value })} /></label><label>Location<input value={draft.location} maxLength={50} onChange={event => setDraft({ ...draft, location: event.target.value })} /></label><label>Profile colour<input type="color" value={draft.color} onChange={event => setDraft({ ...draft, color: event.target.value })} /></label><footer><button onClick={() => setEditing(false)}>Cancel</button><button className="save" onClick={save} disabled={!draft.name.trim() || !draft.handle.trim()}>Save profile</button></footer></section></div>}
  </div>
}

const initials = (name: string) => name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
