import { AlertTriangle, X } from 'lucide-react'

export function ResetDialog({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  return <div className="post-dialog-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}><section className="reset-dialog" role="alertdialog" aria-modal="true" aria-labelledby="reset-title"><button onClick={onClose} aria-label="Close"><X size={18} /></button><span><AlertTriangle size={22} /></span><h2 id="reset-title">Reset everything on this device?</h2><p>Your posts, saved items, conversations, replies, profile changes and preferences will be removed. The original demo content will return.</p><footer><button onClick={onClose}>Cancel</button><button className="danger" onClick={onConfirm}>Reset everything</button></footer></section></div>
}
