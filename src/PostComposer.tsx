import { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'

interface PostComposerProps {
  onPublish: (text: string, image?: string, imageAlt?: string) => void
  onNotice: (message: string) => void
}

const maximumFileSize = 8 * 1024 * 1024

export function PostComposer({ onPublish, onNotice }: PostComposerProps) {
  const [text, setText] = useState('')
  const [image, setImage] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [processingImage, setProcessingImage] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const chooseImage = async (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      onNotice('Choose an image file such as JPG, PNG or WebP.')
      return
    }
    if (file.size > maximumFileSize) {
      onNotice('That image is over 8 MB. Choose a smaller one.')
      return
    }

    setProcessingImage(true)
    try {
      setImage(await prepareImage(file))
      setImageAlt('')
    } catch {
      onNotice('The image could not be opened. Try another file.')
    } finally {
      setProcessingImage(false)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  const removeImage = () => {
    setImage('')
    setImageAlt('')
  }

  const publish = () => {
    if (!text.trim() && !image) return
    onPublish(text.trim(), image || undefined, imageAlt.trim() || undefined)
    setText('')
    removeImage()
  }

  return <section className="composer photo-composer">
    <div className="avatar umut-avatar">UE</div>
    <div>
      <textarea aria-label="Create a post" placeholder="Share something with your people…" value={text} maxLength={280} onChange={event => setText(event.target.value)} />
      {image && <div className="composer-image"><img src={image} alt={imageAlt || 'Selected upload preview'} /><button onClick={removeImage} aria-label="Remove selected image"><X size={17} /></button><label>Image description<input value={imageAlt} onChange={event => setImageAlt(event.target.value)} maxLength={120} placeholder="Describe the image for people who cannot see it" /></label></div>}
      <footer>
        <div className="composer-tools"><input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={event => chooseImage(event.target.files?.[0])} /><button onClick={() => fileInput.current?.click()} disabled={processingImage}><ImagePlus size={15} /> {processingImage ? 'Preparing…' : image ? 'Change photo' : 'Photo'}</button><button onClick={() => onNotice('Polls will arrive in a later update.')}>Poll</button></div>
        <span className="character-count">{text.length}/280</span>
        <button className="small-invade" disabled={(!text.trim() && !image) || processingImage} onClick={publish}>Post</button>
      </footer>
    </div>
  </section>
}

function prepareImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const source = new Image()
      source.onerror = reject
      source.onload = () => {
        const longestSide = Math.max(source.width, source.height)
        const scale = Math.min(1, 1400 / longestSide)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(source.width * scale)
        canvas.height = Math.round(source.height * scale)
        const context = canvas.getContext('2d')
        if (!context) return reject(new Error('Canvas is not available'))
        context.drawImage(source, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/webp', 0.82))
      }
      source.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}
