import { useState } from 'react'
import { ArrowLeft, Bell, CheckCheck, Heart, MessageCircle, Repeat2, UserPlus, X } from 'lucide-react'
import { MessageCenter } from './MessageCenter'
import { ExplorePanel } from './ExplorePanel'
import { BookmarksPanel } from './BookmarksPanel'
import { ProfilePanel } from './ProfilePanel'
import { SettingsPanel } from './SettingsPanel'
import type { Conversation, Notification, Post, Preferences, Reply, UserProfile } from './models'

interface SocialPanelProps {
  view: string
  onClose: () => void
  notifications: Notification[]
  onRead: (id: number) => void
  onReadAll: () => void
  onDismiss: (id: number) => void
  conversations: Conversation[]
  activeConversationId: string
  onOpenConversation: (id: string) => void
  onSendMessage: (conversationId: string, text: string) => void
  posts: Post[]
  replies: Reply[]
  following: string[]
  onFollow: (handle: string) => void
  onOpenPost: (post: Post) => void
  onRemoveBookmark: (post: Post) => void
  onOpenProfile: (handle: string) => void
  profile: UserProfile
  onSaveProfile: (profile: UserProfile) => void
  preferences: Preferences
  onChangePreferences: (preferences: Preferences) => void
  onExport: () => void
  onReset: () => void
}

export function SocialPanel({ view, onClose, notifications, onRead, onReadAll, onDismiss, conversations, activeConversationId, onOpenConversation, onSendMessage, posts, replies, following, onFollow, onOpenPost, onRemoveBookmark, onOpenProfile, profile, onSaveProfile, preferences, onChangePreferences, onExport, onReset }: SocialPanelProps) {
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread'>('all')
  const shownNotifications = notificationFilter === 'unread' ? notifications.filter(item => !item.read) : notifications

  return <section className="social-panel" aria-label={view}>
    <header><button onClick={onClose} aria-label="Back to home"><ArrowLeft size={19} /></button><div><h1>{view}</h1><span>{view === 'Messages' ? 'Your conversations' : 'What’s happening around you'}</span></div></header>

    {view === 'Explore' && <ExplorePanel posts={posts} following={following} onFollow={onFollow} onOpenPost={onOpenPost} onOpenProfile={onOpenProfile} />}

    {view === 'Notifications' && <div className="notifications-view">
      <div className="notification-toolbar"><div><button className={notificationFilter === 'all' ? 'active' : ''} onClick={() => setNotificationFilter('all')}>All</button><button className={notificationFilter === 'unread' ? 'active' : ''} onClick={() => setNotificationFilter('unread')}>Unread</button></div><button onClick={onReadAll} disabled={!notifications.some(item => !item.read)}><CheckCheck size={15} /> Mark all read</button></div>
      {shownNotifications.length === 0 && <div className="notification-empty"><Bell size={25} /><strong>You are all caught up</strong><span>New activity will appear here.</span></div>}
      <div className="notification-list">{shownNotifications.map(item => <article className={item.read ? 'read' : ''} key={item.id} onClick={() => onRead(item.id)}><span className={`notification-icon ${item.type}`}>{notificationIcon(item.type)}</span><div><strong>{item.person}</strong> {item.message}<small>{item.time}</small></div>{!item.read && <i aria-label="Unread" />}<button onClick={event => { event.stopPropagation(); onDismiss(item.id) }} aria-label={`Dismiss notification from ${item.person}`}><X size={15} /></button></article>)}</div>
    </div>}

    {view === 'Messages' && <MessageCenter conversations={conversations} activeId={activeConversationId} onOpen={onOpenConversation} onSend={onSendMessage} />}

    {view === 'Bookmarks' && <BookmarksPanel posts={posts.filter(post => post.bookmarked)} onOpenPost={onOpenPost} onRemove={onRemoveBookmark} />}

    {view === 'Profile' && <ProfilePanel profile={profile} posts={posts} replies={replies} followingCount={following.length} onSave={onSaveProfile} onOpenPost={onOpenPost} />}

    {view === 'Settings' && <SettingsPanel preferences={preferences} onChange={onChangePreferences} onExport={onExport} onReset={onReset} />}

    {!['Explore', 'Notifications', 'Messages', 'Bookmarks', 'Profile', 'Settings'].includes(view) && <div className="quiet-state"><strong>{view} is ready for your account.</strong><p>This part will grow naturally as UmutConnect gets its own backend.</p></div>}
  </section>
}

function notificationIcon(type: Notification['type']) {
  if (type === 'like') return <Heart size={17} />
  if (type === 'follow') return <UserPlus size={17} />
  if (type === 'share') return <Repeat2 size={17} />
  return <MessageCircle size={17} />
}
