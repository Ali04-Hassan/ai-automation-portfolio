import { useState } from 'react'
import { PlusIcon, QuoteIcon, StarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { SectionHeading } from '@/components/section-heading'
import { AdminActions } from '@/components/admin-actions'
import { usePortfolio } from '@/components/portfolio-provider'
import { useAdmin } from '@/components/admin-provider'
import { type Testimonial } from '@/lib/portfolio-data'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function TestimonialsSection() {
  const { isAdmin } = useAdmin()
  const { testimonials, addTestimonial, updateTestimonial, removeTestimonial } = usePortfolio()
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState('5')
  const [editing, setEditing] = useState<Testimonial | null>(null)

  function openAdd() {
    setEditing(null)
    setRating('5')
    setOpen(true)
  }

  function openEdit(item: Testimonial) {
    setEditing(item)
    setRating(String(item.rating))
    setOpen(true)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const quote = String(data.get('quote') ?? '').trim()
    if (!name || !quote) return

    const payload = {
      name,
      role: String(data.get('role') ?? '').trim() || 'Client',
      quote,
      rating: Number(rating),
    }

    if (editing) {
      updateTestimonial(editing.id, payload)
      toast.success('Review updated')
    } else {
      addTestimonial(payload)
      toast.success('Thanks for the review!')
    }
    setOpen(false)
    setEditing(null)
  }

  return (
    <section id="testimonials" className="relative w-full overflow-hidden py-20 sm:py-24">
      <div className="section-glow-left pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-12">
        <SectionHeading
          eyebrow="testimonials"
          title="What clients say"
          description="Feedback from founders and operators whose workflows now run themselves."
          action={
            isAdmin ? (
              <Button
                variant="outline"
                className="glass h-9 gap-1.5 px-4 hover:text-primary"
                onClick={openAdd}
              >
                <PlusIcon data-icon="inline-start" />
                Add Review
              </Button>
            ) : null
          }
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <Card
              key={item.id}
              className="glass relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
            >
              <QuoteIcon
                className="absolute right-4 top-4 size-8 text-primary/15"
                aria-hidden="true"
              />
              <AdminActions
                className="absolute right-3 top-3 z-10"
                label={`review by ${item.name}`}
                onEdit={() => openEdit(item)}
                onDelete={() => {
                  removeTestimonial(item.id)
                  toast.success('Review removed')
                }}
              />
              <CardContent className="flex h-full flex-col gap-4 pt-6">
                <div className="flex items-center gap-0.5" aria-label={`${item.rating} out of 5`}>
                  {Array.from({ length: item.rating }).map((_, index) => (
                    <StarIcon key={index} className="size-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-pretty text-sm leading-relaxed text-foreground/85">
                  &quot;{item.quote}&quot;
                </p>
                <div className="mt-auto flex items-center gap-3 border-t border-border pt-4">
                  <Avatar className="size-9 border border-primary/30">
                    <AvatarFallback className="bg-primary/10 font-mono text-xs text-primary">
                      {initials(item.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.role}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                <DialogTitle>{editing ? 'Edit review' : 'Leave a review'}</DialogTitle>
                <DialogDescription>
                  Worked with me? Share a short note about the results.
                </DialogDescription>
              </DialogHeader>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="review-name">Name</FieldLabel>
                  <Input
                    id="review-name"
                    name="name"
                    required
                    placeholder="Your name"
                    defaultValue={editing?.name ?? ''}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="review-role">Role / company</FieldLabel>
                  <Input
                    id="review-role"
                    name="role"
                    placeholder="Founder, Acme Store"
                    defaultValue={editing?.role ?? ''}
                  />
                </Field>
                <Field>
                  <FieldLabel>Rating</FieldLabel>
                  <ToggleGroup
                    type="single"
                    value={rating}
                    onValueChange={(value) => {
                      if (value) setRating(value)
                    }}
                    variant="outline"
                    size="sm"
                  >
                    {['1', '2', '3', '4', '5'].map((value) => (
                      <ToggleGroupItem key={value} value={value} aria-label={`${value} stars`}>
                        {value}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Field>
                <Field>
                  <FieldLabel htmlFor="review-quote">Review</FieldLabel>
                  <Textarea
                    id="review-quote"
                    name="quote"
                    required
                    rows={4}
                    defaultValue={editing?.quote ?? ''}
                  />
                </Field>
              </FieldGroup>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">{editing ? 'Save changes' : 'Submit review'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
