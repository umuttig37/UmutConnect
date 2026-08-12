import { Trash2, X } from 'lucide-react'

export function DeletePostDialog({ onDelete, onClose }: { onDelete: () => void; onClose: () => void }) {
  return <div className="post-dialog-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section className="delete-post-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-post-title">
      <button className="dialog-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
      <span className="delete-icon"><Trash2 size={21} /></span>
      <h2 id="delete-post-title">Delete this post?</h2>
      <p>It will disappear from your feed and profile. There is no undo after this.</p>
      <footer><button onClick={onClose}>Keep post</button><button className="delete" onClick={onDelete}>Delete</button></footer>
    </section>
  </div>
}
