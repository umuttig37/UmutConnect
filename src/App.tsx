import { useEffect, useMemo, useState } from 'react'
import {
  Bell, Bookmark, Compass, Heart, Home, Mail, MessageCircle,
  MoreHorizontal, Repeat2, Search, Settings, UserRound,
} from 'lucide-react'
import { DeletePostDialog } from './DeletePostDialog'
import { EditPostDialog } from './EditPostDialog'
import { PostComposer } from './PostComposer'
import { PostMenu } from './PostMenu'
import { PostThread } from './PostThread'
import { ResetDialog } from './ResetDialog'
import { ShareDialog } from './ShareDialog'
import { SocialPanel } from './SocialPanel'
import { UserProfilePanel } from './UserProfilePanel'
import { initialReplies } from './data/replies'
import { useConversations } from './hooks/useConversations'
import { useStoredState } from './hooks/useStoredState'
import type { Notification, Post, Preferences, Reply, UserProfile } from './models'
import './App.css'
import './interactions.css'
import './accessibility.css'
import './branding.css'
import './second-push.css'
import './third-push.css'
import './fourth-push.css'
import './fifth-push.css'
import './sixth-push.css'
import './seventh-push.css'
import './eighth-push.css'
import './final-push.css'
import './final-details.css'

const seedPosts: Post[] = [
  { id: 1, name: 'Emilia Laine', handle: 'emilialaine', time: '12m', color: '#f6b65a', text: 'Finally cleaned up the onboarding flow I have been putting off all week. It is funny how removing two unnecessary steps made the whole thing feel finished.', likes: 34, replies: 7 },
  { id: 2, name: 'Oskari Niemi', handle: 'oskarin', time: '1h', color: '#89a8ff', text: 'Walk by the sea, coffee at the usual place and now a few quiet hours for my side project. Not a bad Monday.', likes: 21, replies: 4, photo: true },
  { id: 3, name: 'Sara Karjalainen', handle: 'sarak', time: '3h', color: '#e88da3', text: 'Developers: what is one tiny detail in an app that made you think “someone really cared about this”?', likes: 58, replies: 19 },
]

const navigation = [
  { label: 'Home', icon: Home },
  { label: 'Explore', icon: Compass },
  { label: 'Notifications', icon: Bell },
  { label: 'Messages', icon: Mail },
  { label: 'Bookmarks', icon: Bookmark },
  { label: 'Profile', icon: UserRound },
  { label: 'Settings', icon: Settings },
]

const initialNotifications: Notification[] = [
  { id: 1, person: 'Emilia Laine', message: 'liked your post about the UmutConnect conversation view.', time: '4m', type: 'like', read: false },
  { id: 2, person: 'Elias Lehto', message: 'started following you.', time: '1h', type: 'follow', read: false },
  { id: 3, person: 'Venla Mäki', message: 'shared your latest post.', time: '3h', type: 'share', read: false },
  { id: 4, person: 'Oskari Niemi', message: 'replied: “The profile page is looking good.”', time: 'Yesterday', type: 'reply', read: true },
]

const defaultProfile: UserProfile = {
  name: 'Umut Efe Uygur',
  handle: 'umutefe',
  bio: 'Junior software developer building practical web products and learning something new with every project.',
  location: 'Helsinki, Finland',
  color: '#b9e678',
}

const defaultPreferences: Preferences = {
  theme: 'system',
  likes: true,
  follows: true,
  replies: true,
  messages: true,
  compactFeed: false,
}

function App() {
  const [posts, setPosts] = useStoredState<Post[]>('umutconnect-posts', seedPosts)
  const [following, setFollowing] = useStoredState<string[]>('umutconnect-following', ['emilialaine', 'oskarin'])
  const [profile, setProfile] = useStoredState<UserProfile>('umutconnect-profile', defaultProfile)
  const [replies, setReplies] = useStoredState<Reply[]>('umutconnect-replies', initialReplies)
  const [preferences, setPreferences] = useStoredState<Preferences>('umutconnect-preferences', defaultPreferences)
  const [notifications, setNotifications] = useStoredState<Notification[]>('umutconnect-notifications', initialNotifications)
  const messages = useConversations()

  const [view, setView] = useState('Home')
  const [feedMode, setFeedMode] = useState<'all' | 'following'>('all')
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState('')
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [openPostMenu, setOpenPostMenu] = useState<number | null>(null)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [deletingPost, setDeletingPost] = useState<Post | null>(null)
  const [sharingPost, setSharingPost] = useState<Post | null>(null)
  const [showReset, setShowReset] = useState(false)

  useEffect(() => {
    const followsSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = preferences.theme === 'dark' || (preferences.theme === 'system' && followsSystemDark)
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    document.documentElement.dataset.density = preferences.compactFeed ? 'compact' : 'comfortable'
  }, [preferences])

  const visiblePosts = useMemo(() => posts
    .filter(post => {
      const matchesSearch = `${post.name} ${post.handle} ${post.text}`.toLowerCase().includes(query.toLowerCase())
      const matchesFeed = feedMode === 'all' || following.includes(post.handle)
      return matchesSearch && matchesFeed
    })
    .sort((first, second) => Number(Boolean(second.pinned)) - Number(Boolean(first.pinned))),
  [posts, query, feedMode, following])

  const enabledNotifications = notifications.filter(item => {
    if (item.type === 'like') return preferences.likes
    if (item.type === 'follow') return preferences.follows
    if (item.type === 'reply') return preferences.replies
    return true
  })
  const unreadNotifications = enabledNotifications.filter(item => !item.read).length
  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 1800)
  }
  const updatePost = (id: number, changes: Partial<Post>) => {
    setPosts(items => items.map(post => post.id === id ? { ...post, ...changes } : post))
  }
  const publish = (text: string, image?: string, imageAlt?: string) => {
    setPosts(items => [{
      id: Date.now(), name: profile.name, handle: profile.handle, time: 'now',
      color: profile.color, text, likes: 0, replies: 0, image, imageAlt,
    }, ...items])
    notify(image ? 'Your photo is now in the feed' : 'Your post is live')
  }
  const follow = (handle: string) => {
    setFollowing(items => items.includes(handle) ? items.filter(item => item !== handle) : [...items, handle])
  }
  const pinPost = (post: Post) => {
    setPosts(items => items.map(item => item.handle === profile.handle ? { ...item, pinned: item.id === post.id ? !post.pinned : false } : item))
    setOpenPostMenu(null)
    notify(post.pinned ? 'Post unpinned' : 'Post pinned to your profile')
  }
  const savePost = (changes: Partial<Post>) => {
    if (!editingPost) return
    updatePost(editingPost.id, changes)
    setEditingPost(null)
    notify('Your changes are saved')
  }
  const deletePost = () => {
    if (!deletingPost) return
    setPosts(items => items.filter(item => item.id !== deletingPost.id))
    setReplies(items => items.filter(item => item.postId !== deletingPost.id))
    setDeletingPost(null)
    notify('Post deleted')
  }
  const toggleBookmark = (post: Post) => {
    updatePost(post.id, { bookmarked: !post.bookmarked })
    notify(post.bookmarked ? 'Removed from bookmarks' : 'Saved to bookmarks')
  }
  const saveProfile = (next: UserProfile) => {
    const previousHandle = profile.handle
    setProfile(next)
    setPosts(items => items.map(item => item.handle === previousHandle ? { ...item, name: next.name, handle: next.handle, color: next.color } : item))
    setReplies(items => items.map(item => item.handle === previousHandle ? { ...item, name: next.name, handle: next.handle, color: next.color, initials: initials(next.name) } : item))
    notify('Profile updated')
  }
  const addReply = (postId: number, text: string) => {
    setReplies(items => [...items, { id: Date.now(), postId, name: profile.name, handle: profile.handle, initials: initials(profile.name), color: profile.color, text, time: 'now', liked: false, likes: 0 }])
  }
  const exportData = () => {
    const data = { exportedAt: new Date().toISOString(), profile, posts, replies, following, notifications, conversations: messages.conversations, preferences }
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'umutconnect-data.json'
    link.click()
    URL.revokeObjectURL(url)
    notify('Your data download is ready')
  }
  const resetData = () => {
    Object.keys(localStorage).filter(key => key.startsWith('umutconnect-')).forEach(key => localStorage.removeItem(key))
    window.location.reload()
  }
  const openProfile = (handle: string) => {
    if (handle === profile.handle) {
      setView('Profile')
      setSelectedPost(null)
      setSelectedProfile(null)
      return
    }
    setSelectedProfile(handle)
  }

  return <div className="app">
    <aside className="sidebar">
      <a className="logo" href="#feed"><span>UC</span><div><strong>UmutConnect</strong><small>Social Media App</small></div></a>
      <nav>{navigation.map(({ label, icon: Icon }) => <button className={view === label ? 'active' : ''} key={label} onClick={() => setView(label)}><Icon size={21} /><span>{label}</span>{label === 'Notifications' && unreadNotifications > 0 && <i>{unreadNotifications}</i>}{label === 'Messages' && preferences.messages && messages.unreadCount > 0 && <i>{messages.unreadCount}</i>}</button>)}</nav>
      <button className="invade-button" onClick={() => { setView('Home'); window.setTimeout(() => document.querySelector<HTMLTextAreaElement>('.photo-composer textarea')?.focus(), 0) }}>New post</button>
      <button className="mini-profile" onClick={() => setView('Profile')}><Avatar initials={initials(profile.name)} color={profile.color} /><div><strong>{profile.name}</strong><span>@{profile.handle}</span></div><MoreHorizontal size={18} /></button>
    </aside>

    <main id="feed">
      <header className="feed-header"><div><h1>Home</h1><span>{feedMode === 'all' ? 'For you' : 'Following'}</span></div><button onClick={() => setView('Settings')} aria-label="Open settings"><Settings size={18} /></button></header>
      <PostComposer onPublish={publish} onNotice={notify} />
      <div className="feed-tabs"><button className={feedMode === 'all' ? 'active' : ''} onClick={() => setFeedMode('all')}>For you</button><button className={feedMode === 'following' ? 'active' : ''} onClick={() => setFeedMode('following')}>Following</button></div>
      {visiblePosts.length === 0 && <div className="empty-state"><Search /><strong>No posts found</strong><span>{feedMode === 'following' ? 'Follow a few more people or switch back to For you.' : 'Try a different name or phrase.'}</span></div>}
      {visiblePosts.map(post => <PostCard key={post.id} post={post} ownHandle={profile.handle} openMenu={openPostMenu === post.id} onOpen={() => setSelectedPost(post)} onOpenProfile={() => openProfile(post.handle)} onToggleMenu={() => setOpenPostMenu(current => current === post.id ? null : post.id)} onCloseMenu={() => setOpenPostMenu(null)} onEdit={() => { setEditingPost(post); setOpenPostMenu(null) }} onPin={() => pinPost(post)} onDelete={() => { setDeletingPost(post); setOpenPostMenu(null) }} onShare={() => setSharingPost(post)} onLike={() => updatePost(post.id, { liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) })} onBookmark={() => toggleBookmark(post)} />)}
    </main>

    <aside className="rightbar">
      <label className="search"><Search size={17} /><input aria-label="Search feed" placeholder="Search the feed" value={query} onChange={event => setQuery(event.target.value)} /></label>
      <section className="panel"><h2>Topics people are talking about</h2>{['Design systems', 'Learning in public', 'Helsinki tech'].map((tag, index) => <button className="trend" onClick={() => { setView('Explore'); setQuery(tag) }} key={tag}><span>Trending · {index + 1}</span><strong>{tag}</strong><small>{12 - index * 3}.4K posts</small></button>)}</section>
      <section className="panel"><h2>People you may know</h2>{[['elias', 'EL', 'Elias Lehto', '#d8a9ef'], ['venla', 'VM', 'Venla Mäki', '#74c8bb'], ['mikko', 'MR', 'Mikko Ranta', '#f09972']].map(person => <div className="person" key={person[0]}><button className="person-link" onClick={() => openProfile(person[0])}><Avatar initials={person[1]} color={person[3]} /><span><strong>{person[2]}</strong><small>@{person[0]}</small></span></button><button className={following.includes(person[0]) ? 'following' : ''} onClick={() => follow(person[0])}>{following.includes(person[0]) ? 'Following' : 'Follow'}</button></div>)}</section>
      <p className="legal">Privacy · Terms · Accessibility · © 2026 UmutConnect</p>
    </aside>

    {view !== 'Home' && <SocialPanel view={view} onClose={() => setView('Home')} notifications={enabledNotifications} onRead={id => setNotifications(items => items.map(item => item.id === id ? { ...item, read: true } : item))} onReadAll={() => setNotifications(items => items.map(item => ({ ...item, read: true })))} onDismiss={id => setNotifications(items => items.filter(item => item.id !== id))} conversations={messages.conversations} activeConversationId={messages.activeId} onOpenConversation={messages.openConversation} onSendMessage={messages.sendMessage} posts={posts} replies={replies} following={following} onFollow={follow} onOpenPost={post => { setView('Home'); setSelectedPost(post) }} onRemoveBookmark={toggleBookmark} onOpenProfile={openProfile} profile={profile} onSaveProfile={saveProfile} preferences={preferences} onChangePreferences={setPreferences} onExport={exportData} onReset={() => setShowReset(true)} />}
    {selectedPost && <PostThread post={selectedPost} replies={replies} profile={profile} onAddReply={addReply} onLikeReply={replyId => setReplies(items => items.map(item => item.id === replyId ? { ...item, liked: !item.liked, likes: item.likes + (item.liked ? -1 : 1) } : item))} onDeleteReply={replyId => setReplies(items => items.filter(item => item.id !== replyId))} onOpenProfile={openProfile} onClose={() => setSelectedPost(null)} />}
    {selectedProfile && <UserProfilePanel handle={selectedProfile} posts={posts} replies={replies} following={following} onFollow={follow} onOpenPost={post => { setSelectedProfile(null); setSelectedPost(post) }} onClose={() => setSelectedProfile(null)} />}
    {sharingPost && <ShareDialog post={sharingPost} conversations={messages.conversations} onSend={messages.sendMessage} onNotice={notify} onClose={() => setSharingPost(null)} />}
    {editingPost && <EditPostDialog post={editingPost} onSave={savePost} onClose={() => setEditingPost(null)} />}
    {deletingPost && <DeletePostDialog onDelete={deletePost} onClose={() => setDeletingPost(null)} />}
    {showReset && <ResetDialog onConfirm={resetData} onClose={() => setShowReset(false)} />}
    {toast && <div className="toast" role="status">{toast}</div>}
  </div>
}

interface PostCardProps {
  post: Post
  ownHandle: string
  openMenu: boolean
  onOpen: () => void
  onOpenProfile: () => void
  onToggleMenu: () => void
  onCloseMenu: () => void
  onEdit: () => void
  onPin: () => void
  onDelete: () => void
  onShare: () => void
  onLike: () => void
  onBookmark: () => void
}

function PostCard({ post, ownHandle, openMenu, onOpen, onOpenProfile, onToggleMenu, onCloseMenu, onEdit, onPin, onDelete, onShare, onLike, onBookmark }: PostCardProps) {
  return <article className={`post ${post.pinned ? 'pinned-post' : ''}`} id={`post-${post.id}`}>
    <button className="avatar-button" onClick={onOpenProfile} aria-label={`Open ${post.name}'s profile`}><Avatar initials={initials(post.name)} color={post.color} /></button>
    <div className="post-body">
      {post.pinned && <span className="pinned-label">Pinned to your profile</span>}
      <header><button className="post-author" onClick={onOpenProfile}><strong>{post.name}</strong><span>@{post.handle} · {post.time}</span></button>{post.handle === ownHandle && <button aria-label="Post options" aria-expanded={openMenu} onClick={onToggleMenu}><MoreHorizontal size={18} /></button>}{openMenu && <PostMenu post={post} onClose={onCloseMenu} onEdit={onEdit} onPin={onPin} onDelete={onDelete} />}</header>
      {post.text && <p onClick={onOpen}>{post.text}</p>}
      {post.image && <button className="uploaded-photo" onClick={onOpen}><img src={post.image} alt={post.imageAlt || `Photo shared by ${post.name}`} /></button>}
      {post.photo && <div className="post-photo" onClick={onOpen}><span>Late afternoon<br /><strong>Helsinki, Finland</strong></span></div>}
      <footer><button onClick={onOpen}><MessageCircle size={16} /><span>{post.replies}</span></button><button onClick={onShare}><Repeat2 size={17} /><span>Share</span></button><button className={post.liked ? 'liked' : ''} onClick={onLike}><Heart size={17} fill={post.liked ? 'currentColor' : 'none'} /><span>{post.likes}</span></button><button className={post.bookmarked ? 'bookmarked' : ''} onClick={onBookmark} aria-label={post.bookmarked ? 'Remove bookmark' : 'Bookmark post'}><Bookmark size={16} fill={post.bookmarked ? 'currentColor' : 'none'} /></button></footer>
    </div>
  </article>
}

function Avatar({ initials: label, color }: { initials: string; color: string }) {
  return <span className="avatar" style={{ background: color }}>{label}</span>
}

const initials = (name: string) => name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()

export default App
