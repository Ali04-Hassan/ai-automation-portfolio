import { useRef, useState } from 'react'
import { UploadIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

/**
 * Image field with two input modes: paste a URL or upload a file
 * (read as a data URL so it persists with the local portfolio content).
 * The current value is mirrored into a hidden input named `name` so the
 * parent <form> + FormData flow keeps working.
 */
export function ImageField({
  id,
  name,
  label,
  defaultValue = '',
  description,
  placeholder = 'https://... or /images/my-file.png',
}: {
  id: string
  name: string
  label: string
  defaultValue?: string
  description?: string
  placeholder?: string
}) {
  const [value, setValue] = useState(defaultValue)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setValue(String(reader.result ?? ''))
    reader.readAsDataURL(file)
  }

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input type="hidden" name={name} value={value} />
      <div className="flex gap-2">
        <Input
          id={id}
          value={value.startsWith('data:') ? '' : value}
          placeholder={value.startsWith('data:') ? 'Uploaded file' : placeholder}
          disabled={value.startsWith('data:')}
          onChange={(event) => setValue(event.target.value)}
        />
        {value.startsWith('data:') ? (
          <Button type="button" variant="outline" onClick={() => setValue('')}>
            <XIcon data-icon="inline-start" />
            Clear
          </Button>
        ) : (
          <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
            <UploadIcon data-icon="inline-start" />
            Upload
          </Button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      {value ? (
        <img
          src={value}
          alt=""
          className="mt-2 h-28 w-full rounded-lg border border-border object-cover"
        />
      ) : null}
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </Field>
  )
}

/** Turn a YouTube / Vimeo / Loom share link into an embeddable URL. */
export function toEmbedUrl(url: string) {
  const value = url.trim()
  if (!value) return ''
  const youtube = value.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/,
  )
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`
  const vimeo = value.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  if (value.includes('loom.com/share/')) return value.replace('/share/', '/embed/').split('?')[0]
  return value
}

export function isDirectVideoFile(url: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url.trim())
}
