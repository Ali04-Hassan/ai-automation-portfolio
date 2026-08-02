import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SectionHeading } from '@/components/section-heading'
import { AdminActions } from '@/components/admin-actions'
import { ImageField } from '@/components/media-field'
import { ImageLightbox } from '@/components/image-lightbox'
import { usePortfolio } from '@/components/portfolio-provider'
import { useAdmin } from '@/components/admin-provider'
import { type Certification } from '@/lib/portfolio-data'

export function CertificationsSection() {
  const { isAdmin } = useAdmin()
  const { certifications, addCertification, updateCertification, removeCertification } =
    usePortfolio()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Certification | null>(null)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  const lightboxItems = certifications.map((cert) => ({
    id: cert.id,
    src: cert.image,
    alt: `${cert.title} certificate issued by ${cert.issuer}`,
    title: cert.title,
    subtitle: cert.issuer,
    caption: cert.description,
  }))

  function openAdd() {
    setEditing(null)
    setOpen(true)
  }

  function openEdit(cert: Certification) {
    setEditing(cert)
    setOpen(true)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const title = String(data.get('title') ?? '').trim()
    if (!title) return

    const payload = {
      title,
      issuer: String(data.get('issuer') ?? '').trim() || 'Self-issued',
      description: String(data.get('description') ?? '').trim(),
      image: String(data.get('image') ?? '').trim() || '/placeholder.jpg',
    }

    if (editing) {
      updateCertification(editing.id, payload)
      toast.success('Certification updated')
    } else {
      addCertification(payload)
      toast.success('Certification added')
    }
    setOpen(false)
    setEditing(null)
  }

  return (
    <section id="certifications" className="relative w-full overflow-hidden py-20 sm:py-24">
      <div className="section-glow-right pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-12">
        <SectionHeading
          eyebrow="certifications"
          title="Credentials & training"
          description="Programmes and certificates that back the engineering work."
          action={
            isAdmin ? (
              <Button
                variant="outline"
                className="glass h-9 gap-1.5 px-4 hover:text-primary"
                onClick={openAdd}
              >
                <PlusIcon data-icon="inline-start" />
                Add Certificate
              </Button>
            ) : null
          }
        />

        <ul className="mt-12 grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, i) => (
            <li key={cert.id}>
              <Card className="glass group relative flex h-full flex-col gap-0 overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
                <AdminActions
                  className="absolute right-3 top-3 z-10"
                  label={cert.title}
                  onEdit={() => openEdit(cert)}
                  onDelete={() => {
                    removeCertification(cert.id)
                    toast.success('Certification removed')
                  }}
                />
                <button
                  type="button"
                  onClick={() => setPreviewIndex(i)}
                  aria-label={`Open full-size preview of ${cert.title} certificate`}
                  aria-haspopup="dialog"
                  className="flex cursor-zoom-in flex-col text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <span className="relative block aspect-[16/10] w-full border-b border-border">
                    <img
                      src={cert.image || '/placeholder.svg'}
                      alt={`${cert.title} certificate issued by ${cert.issuer}`}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </span>
                  <CardContent className="flex flex-1 flex-col gap-2 p-5">
                    <CardTitle className="text-balance text-base leading-snug">
                      {cert.title}
                    </CardTitle>
                    <span className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
                      {cert.issuer}
                    </span>
                    <CardDescription className="leading-relaxed">{cert.description}</CardDescription>
                  </CardContent>
                </button>
              </Card>
            </li>
          ))}
        </ul>

        <ImageLightbox
          items={lightboxItems}
          index={previewIndex}
          onIndexChange={setPreviewIndex}
          onClose={() => setPreviewIndex(null)}
          label="Certificate gallery"
        />


        <Dialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next)
            if (!next) setEditing(null)
          }}
        >
          <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit Certificate' : 'Add Certificate'}</DialogTitle>
                <DialogDescription>
                  Show credentials in the certifications grid.
                </DialogDescription>
              </DialogHeader>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="cert-title">Title</FieldLabel>
                  <Input
                    id="cert-title"
                    name="title"
                    required
                    placeholder="Certification name"
                    defaultValue={editing?.title ?? ''}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="cert-issuer">Issuer</FieldLabel>
                  <Input
                    id="cert-issuer"
                    name="issuer"
                    placeholder="Google, DeepLearning.AI, UET"
                    defaultValue={editing?.issuer ?? ''}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="cert-description">Description</FieldLabel>
                  <Textarea
                    id="cert-description"
                    name="description"
                    rows={3}
                    placeholder="What the certificate covers."
                    defaultValue={editing?.description ?? ''}
                  />
                </Field>
                <ImageField
                  key={editing?.id ?? 'new'}
                  id="cert-image"
                  name="image"
                  label="Certificate Image"
                  defaultValue={editing?.image ?? ''}
                  placeholder="/certifications/my-cert.png"
                  description="Paste an image URL or upload a file — shown on the card and in the lightbox."
                />
              </FieldGroup>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">{editing ? 'Save changes' : 'Add certificate'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
