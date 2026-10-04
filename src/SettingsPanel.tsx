import { Download, Monitor, Moon, RotateCcw, Sun, Trash2 } from 'lucide-react'
import type { Preferences } from './models'

interface SettingsPanelProps {
  preferences: Preferences
  onChange: (preferences: Preferences) => void
  onExport: () => void
  onReset: () => void
}

export function SettingsPanel({ preferences, onChange, onExport, onReset }: SettingsPanelProps) {
  const update = <K extends keyof Preferences>(key: K, value: Preferences[K]) => onChange({ ...preferences, [key]: value })

  return <div className="settings-view">
    <section><header><h2>Appearance</h2><p>Choose how UmutConnect looks on this device.</p></header><div className="theme-options">{([{ id: 'light', label: 'Light', icon: Sun }, { id: 'dark', label: 'Dark', icon: Moon }, { id: 'system', label: 'System', icon: Monitor }] as const).map(({ id, label, icon: Icon }) => <button className={preferences.theme === id ? 'active' : ''} onClick={() => update('theme', id)} key={id}><Icon size={18} /><span>{label}</span></button>)}</div><SettingToggle label="Compact feed" detail="Show more posts on screen with tighter spacing." checked={preferences.compactFeed} onChange={value => update('compactFeed', value)} /></section>
    <section><header><h2>Notifications</h2><p>Decide which activity should appear in your notification feed.</p></header><SettingToggle label="Likes" detail="When someone likes your post." checked={preferences.likes} onChange={value => update('likes', value)} /><SettingToggle label="New followers" detail="When someone follows your profile." checked={preferences.follows} onChange={value => update('follows', value)} /><SettingToggle label="Replies" detail="When someone joins your conversation." checked={preferences.replies} onChange={value => update('replies', value)} /><SettingToggle label="Messages" detail="Unread badges for new messages." checked={preferences.messages} onChange={value => update('messages', value)} /></section>
    <section><header><h2>Your data</h2><p>Your demo data stays in this browser. You can download or remove it whenever you want.</p></header><div className="data-actions"><button onClick={onExport}><Download size={17} /><span><strong>Download your data</strong><small>Save posts, messages and preferences as JSON.</small></span></button><button className="reset-data" onClick={onReset}><Trash2 size={17} /><span><strong>Reset UmutConnect</strong><small>Remove local posts, messages and settings.</small></span></button></div></section>
    <footer><RotateCcw size={14} /> Changes are saved automatically on this device.</footer>
  </div>
}

function SettingToggle({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="setting-toggle"><span><strong>{label}</strong><small>{detail}</small></span><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} /><i aria-hidden="true" /></label>
}
