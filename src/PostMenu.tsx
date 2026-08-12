import { useEffect, useRef } from 'react'
import { Edit3, Pin, PinOff, Trash2 } from 'lucide-react'
import type { Post } from './models'

interface PostMenuProps {
  post: Post
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onPin: () => void
}

export function PostMenu({ post, onClose, onEdit, onDelete, onPin }: PostMenuProps) {
  const menu = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menu.current?.contains(event.target as Node)) onClose()
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [onClose])

  return <div className="post-menu" ref={menu} role="menu">
    <button onClick={onEdit} role="menuitem"><Edit3 size={15} /><span><strong>Edit post</strong><small>Change the text or image description</small></span></button>
    <button onClick={onPin} role="menuitem">{post.pinned ? <PinOff size={15} /> : <Pin size={15} />}<span><strong>{post.pinned ? 'Unpin from profile' : 'Pin to profile'}</strong><small>{post.pinned ? 'Return it to its usual place' : 'Keep it at the top of your posts'}</small></span></button>
    <button className="danger" onClick={onDelete} role="menuitem"><Trash2 size={15} /><span><strong>Delete post</strong><small>This cannot be undone</small></span></button>
  </div>
}
