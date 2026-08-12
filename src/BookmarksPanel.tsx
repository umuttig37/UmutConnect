import { Bookmark, Heart, MessageCircle } from 'lucide-react'
import type { Post } from './models'

interface BookmarksPanelProps {
  posts: Post[]
  onOpenPost: (post: Post) => void
  onRemove: (post: Post) => void
}

export function BookmarksPanel({ posts, onOpenPost, onRemove }: BookmarksPanelProps) {
  if (posts.length === 0) {
    return <div className="bookmarks-empty"><span><Bookmark size={24} /></span><strong>Save something for later</strong><p>Tap the bookmark under a post and it will stay here, even after you close the page.</p></div>
  }

  return <div className="bookmarks-view">
    <div className="bookmarks-intro"><strong>Your saved posts</strong><span>{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span></div>
    {posts.map(post => <article key={post.id}>
      <span className="avatar" style={{ background: post.color }}>{post.name.split(' ').map(part => part[0]).join('')}</span>
      <div>
        <header><button onClick={() => onOpenPost(post)}><strong>{post.name}</strong><span>@{post.handle} · {post.time}</span></button><button className="remove-bookmark" onClick={() => onRemove(post)} aria-label={`Remove ${post.name}'s post from bookmarks`}><Bookmark size={17} fill="currentColor" /></button></header>
        <button className="saved-post-content" onClick={() => onOpenPost(post)}><p>{post.text || 'Photo post'}</p>{post.image && <img src={post.image} alt={post.imageAlt || `Photo shared by ${post.name}`} />}</button>
        <footer><span><MessageCircle size={14} /> {post.replies}</span><span><Heart size={14} /> {post.likes}</span></footer>
      </div>
    </article>)}
  </div>
}
