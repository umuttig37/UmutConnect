import { useState } from 'react'
import { ArrowLeft, Bell, CheckCheck, Heart, MessageCircle, Repeat2, UserPlus, X } from 'lucide-react'
import { MessageCenter } from './MessageCenter'
import { ExplorePanel } from './ExplorePanel'
import type { Conversation, Notification, Post } from './models'

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
  following: string[]
  onFollow: (handle: string) => void
  onOpenPost: (post: Post) => void
}

export function SocialPanel({ view, onClose, notifications, onRead, onReadAll, onDismiss, conversations, activeConversationId, onOpenConversation, onSendMessage, posts, following, onFollow, onOpenPost }: SocialPanelProps) {
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread'>('all')
  const shownNotifications = notificationFilter === 'unread' ? notifications.filter(item => !item.read) : notifications

  return <section className="social-panel" aria-label={view}>
    <header><button onClick={onClose} aria-label="Back to home"><ArrowLeft size={19} /></button><div><h1>{view}</h1><span>{view === 'Messages' ? 'Your conversations' : 'What’s happening around you'}</span></div></header>

    {view === 'Explore' && <ExplorePanel posts={posts} following={following} onFollow={onFollow} onOpenPost={onOpenPost} />}

    {view === 'Notifications' && <div className="notifications-view">
      <div className="notification-toolbar"><div><button className={notificationFilter === 'all' ? 'active' : ''} onClick={() => setNotificationFilter('all')}>All</button><button className={notificationFilter === 'unread' ? 'active' : ''} onClick={() => setNotificationFilter('unread')}>Unread</button></div><button onClick={onReadAll} disabled={!notifications.some(item => !item.read)}><CheckCheck size={15} /> Mark all read</button></div>
      {shownNotifications.length === 0 && <div className="notification-empty"><Bell size={25} /><strong>You are all caught up</strong><span>New activity will appear here.</span></div>}
      <div className="notification-list">{shownNotifications.map(item => <article className={item.read ? 'read' : ''} key={item.id} onClick={() => onRead(item.id)}><span className={`notification-icon ${item.type}`}>{notificationIcon(item.type)}</span><div><strong>{item.person}</strong> {item.message}<small>{item.time}</small></div>{!item.read && <i aria-label="Unread" />}<button onClick={event => { event.stopPropagation(); onDismiss(item.id) }} aria-label={`Dismiss notification from ${item.person}`}><X size={15} /></button></article>)}</div>
    </div>}

    {view === 'Messages' && <MessageCenter conversations={conversations} activeId={activeConversationId} onOpen={onOpenConversation} onSend={onSendMessage} />}

    {view === 'Profile' && <div className="profile-view"><div className="profile-cover"><span>Helsinki evenings</span></div><div className="profile-details"><span className="profile-avatar">UE</span><button>Edit profile</button><h2>Umut Efe Uygur</h2><span>@umutefe</span><p>Junior software developer building practical web products and learning something new with every project. Based in Helsinki.</p><small>Joined July 2026</small><div className="profile-stats"><span><strong>86</strong> Following</span><span><strong>214</strong> Followers</span><span><strong>19</strong> Posts</span></div></div><nav className="profile-tabs"><button className="active">Posts</button><button>Replies</button><button>Media</button></nav><article className="profile-post"><strong>Umut Efe Uygur</strong><span>@umutefe · now</span><p>Putting the next version of UmutConnect together today. Making every part feel useful, not just clickable.</p></article></div>}

    {!['Explore', 'Notifications', 'Messages', 'Profile'].includes(view) && <div className="quiet-state"><strong>{view} is ready for your account.</strong><p>This part will grow naturally as UmutConnect gets its own backend.</p></div>}
  </section>
}

function notificationIcon(type: Notification['type']) {
  if (type === 'like') return <Heart size={17} />
  if (type === 'follow') return <UserPlus size={17} />
  if (type === 'share') return <Repeat2 size={17} />
  return <MessageCircle size={17} />
}
