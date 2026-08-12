import { useState } from 'react'
import { X } from 'lucide-react'
import type { Post } from './models'

export function EditPostDialog({ post, onSave, onClose }: { post: Post; onSave: (changes: Partial<Post>) => void; onClose: () => void }) {
  const [text, setText] = useState(post.text)
  const [imageAlt, setImageAlt] = useState(post.imageAlt ?? '')

  const save = () => {
    if (!text.trim() && !post.image) return
    onSave({ text: text.trim(), imageAlt: imageAlt.trim() || undefined })
  }

  return <div className="post-dialog-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section className="edit-post-dialog" role="dialog" aria-modal="true" aria-labelledby="edit-post-title">
      <header><div><small>Your post</small><h2 id="edit-post-title">Make a quick edit</h2></div><button onClick={onClose} aria-label="Close"><X size={19} /></button></header>
      <label>Post text<textarea autoFocus value={text} onChange={event => setText(event.target.value)} maxLength={280} rows={5} /></label>
      {post.image && <><img src={post.image} alt={post.imageAlt || 'Attached post image'} /><label>Image description<input value={imageAlt} onChange={event => setImageAlt(event.target.value)} maxLength={120} /></label></>}
      <footer><span>{text.length}/280</span><button onClick={onClose}>Cancel</button><button className="save" onClick={save} disabled={!text.trim() && !post.image}>Save changes</button></footer>
    </section>
  </div>
}
