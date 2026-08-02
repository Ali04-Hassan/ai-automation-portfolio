import { useState } from 'react'
import {
  CheckIcon,
  DatabaseIcon,
  FileTextIcon,
  PhoneCallIcon,
  PlugIcon,
  PlusIcon,
  WorkflowIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SectionHeading } from '@/components/section-heading'
import { AdminActions } from '@/components/admin-actions'
import { usePortfolio } from '@/components/portfolio-provider'
import { useAdmin } from '@/components/admin-provider'
import { type Service } from '@/lib/portfolio-data'

const icons: Record<Service['icon'], typeof WorkflowIcon> = {
  workflow: WorkflowIcon,
  voice: PhoneCallIcon,
  api: PlugIcon,
  rag: DatabaseIcon,
  doc: FileTextIcon,
}

const iconKeys = Object.keys(icons) as Service['icon'][]

export function ServicesSection() {
  const { isAdmin } = useAdmin()
  const { services, addService, updateService, removeService } = usePortfolio()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)

  function openAdd() {
    setEditing(null)
    setOpen(true)
  }

  function openEdit(service: Service) {
    setEditing(service)
    setOpen(true)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const title = String(data.get('title') ?? '').trim()
    if (!title) return

    const payload = {
      title,
      description: String(data.get('description') ?? '').trim(),
      icon: (String(data.get('icon') ?? 'workflow') as Service['icon']) || 'workflow',
      points: String(data.get('points') ?? '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    }

    if (editing) {
      updateService(editing.id, payload)
      toast.success('Service updated')
    } else {
      addService(payload)
      toast.success('Service added')
    }
    setOpen(false)
    setEditing(null)
  }

  return (
    <section id="services" className="relative w-full overflow-hidden py-20 sm:py-24">
      <div className="section-glow-left pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-12">
        <SectionHeading
          eyebrow="services"
          title="What I build for clients"
          description="Every engagement ships with documentation, a Loom walkthrough, and error handling you can trust in production."
          action={
            isAdmin ? (
              <Button
                variant="outline"
                className="glass h-9 gap-1.5 px-4 hover:text-primary"
                onClick={openAdd}
              >
                <PlusIcon data-icon="inline-start" />
                Add Service
              </Button>
            ) : null
          }
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = icons[service.icon] ?? WorkflowIcon
            return (
              <Card
                key={service.id}
                className="glass card-glow group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_40px_-12px_color-mix(in_oklab,var(--primary)_50%,transparent)]"
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
                <AdminActions
                  className="absolute right-3 top-3 z-10"
                  label={service.title}
                  onEdit={() => openEdit(service)}
                  onDelete={() => {
                    removeService(service.id)
                    toast.success('Service removed')
                  }}
                />
                <CardHeader>
                  <span className="flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary transition-shadow group-hover:shadow-[0_0_20px_color-mix(in_oklab,var(--primary)_35%,transparent)]">
                    <Icon className="size-5" />
                  </span>
                  <CardTitle className="mt-3 text-base">{service.title}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col gap-2">
                    {service.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-2 text-sm text-foreground/80"
                      >
                        <CheckIcon className="size-3.5 shrink-0 text-primary" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

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
                <DialogTitle>{editing ? 'Edit service' : 'Add a service'}</DialogTitle>
                <DialogDescription>
                  Services appear in the grid immediately after saving.
                </DialogDescription>
              </DialogHeader>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="service-title">Title</FieldLabel>
                  <Input
                    id="service-title"
                    name="title"
                    required
                    defaultValue={editing?.title ?? ''}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="service-description">Description</FieldLabel>
                  <Textarea
                    id="service-description"
                    name="description"
                    rows={3}
                    defaultValue={editing?.description ?? ''}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="service-icon">Icon</FieldLabel>
                  <select
                    id="service-icon"
                    name="icon"
                    defaultValue={editing?.icon ?? 'workflow'}
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    {iconKeys.map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="service-points">Key points</FieldLabel>
                  <Textarea
                    id="service-points"
                    name="points"
                    rows={3}
                    defaultValue={editing?.points.join('\n') ?? ''}
                  />
                  <FieldDescription>One point per line.</FieldDescription>
                </Field>
              </FieldGroup>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">{editing ? 'Save changes' : 'Add service'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
