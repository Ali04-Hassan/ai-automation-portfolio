import { useState } from 'react'
import { ArrowUpRightIcon, PlayIcon, PlusIcon } from 'lucide-react'
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
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SectionHeading } from '@/components/section-heading'
import { AdminActions } from '@/components/admin-actions'
import { ImageField, isDirectVideoFile, toEmbedUrl } from '@/components/media-field'
import { ImageLightbox } from '@/components/image-lightbox'
import { usePortfolio } from '@/components/portfolio-provider'
import { useAdmin } from '@/components/admin-provider'
import { type Project } from '@/lib/portfolio-data'

export function ProjectsSection() {
  const { isAdmin } = useAdmin()
  const { projects, addProject, updateProject, removeProject } = usePortfolio()
  const [active, setActive] = useState<Project | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  const lightboxItems = projects.map((project) => ({
    id: project.id,
    src: project.image,
    alt: `${project.title} project cover image`,
    title: project.title,
    subtitle: 'Project cover',
    caption: project.description,
  }))

  function openAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(project: Project) {
    setEditing(project)
    setFormOpen(true)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const title = String(data.get('title') ?? '').trim()
    const description = String(data.get('description') ?? '').trim()
    if (!title || !description) return

    const payload = {
      title,
      description,
      image: String(data.get('image') ?? '').trim() || '/placeholder.jpg',
      videoUrl: String(data.get('videoUrl') ?? '').trim(),
      externalUrl: String(data.get('externalUrl') ?? '').trim(),
    }

    if (editing) {
      updateProject(editing.id, payload)
      toast.success('Project updated')
    } else {
      addProject(payload)
      toast.success('Project added to your portfolio')
    }
    setFormOpen(false)
    setEditing(null)
  }

  return (
    <section id="projects" className="relative w-full overflow-hidden py-20 sm:py-24">
      <div className="section-glow-left pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-12">
        <SectionHeading
          eyebrow="featured projects"
          title="Interactive case studies"
          description="Real systems running in production. Open a case study for the walkthrough and live links."
          action={
            isAdmin ? (
              <Button
                variant="outline"
                className="glass h-9 gap-1.5 px-4 hover:text-primary"
                onClick={openAdd}
              >
                <PlusIcon data-icon="inline-start" />
                Add Project
              </Button>
            ) : null
          }
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <Card
              key={project.id}
              className="glass card-glow group relative flex flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_50px_-16px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
            >
              <AdminActions
                className="absolute right-3 top-3 z-10"
                label={project.title}
                onEdit={() => openEdit(project)}
                onDelete={() => {
                  removeProject(project.id)
                  toast.success('Project removed')
                }}
              />
              <button
                type="button"
                onClick={() => setPreviewIndex(i)}
                aria-label={`Open full-size preview of the ${project.title} cover image`}
                aria-haspopup="dialog"
                className="relative aspect-video w-full cursor-zoom-in overflow-hidden border-b border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <img
                  src={project.image || '/placeholder.svg'}
                  alt={`${project.title} project cover image`}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"
                  aria-hidden="true"
                />
              </button>

              <CardContent className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex flex-col gap-2">
                  <CardTitle className="text-balance text-lg leading-snug">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 leading-relaxed">
                    {project.description}
                  </CardDescription>
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                  <Button className="h-9 gap-1.5 px-4" onClick={() => setActive(project)}>
                    <PlayIcon data-icon="inline-start" />
                    View Case Study
                  </Button>
                  {project.externalUrl ? (
                    <Button
                      asChild
                      variant="ghost"
                      className="h-9 gap-1.5 px-3 text-muted-foreground hover:text-primary"
                    >
                      <a href={project.externalUrl} target="_blank" rel="noopener noreferrer">
                        Open link
                        <ArrowUpRightIcon data-icon="inline-end" />
                      </a>
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <ImageLightbox
          items={lightboxItems}
          index={previewIndex}
          onIndexChange={setPreviewIndex}
          onClose={() => setPreviewIndex(null)}
          label="Project cover gallery"
        />



        <Dialog open={active !== null} onOpenChange={(open) => !open && setActive(null)}>
          <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-3xl">
            <DialogHeader>
              <span className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
                Case study
              </span>
              <DialogTitle className="text-balance text-xl leading-snug">
                {active?.title}
              </DialogTitle>
            </DialogHeader>

            {active?.image ? (
              <img
                src={active.image}
                alt={`${active.title} cover`}
                className="w-full rounded-xl border border-border object-cover"
              />
            ) : null}

            <DialogDescription className="leading-relaxed">{active?.description}</DialogDescription>

            {active?.videoUrl ? (
              <div className="overflow-hidden rounded-xl border border-border bg-background">
                <div className="relative aspect-video w-full">
                  {isDirectVideoFile(active.videoUrl) ? (
                    <video
                      src={active.videoUrl}
                      controls
                      className="absolute inset-0 size-full"
                    />
                  ) : (
                    <iframe
                      src={toEmbedUrl(active.videoUrl)}
                      title={`${active.title} demo video`}
                      allowFullScreen
                      className="absolute inset-0 size-full"
                    />
                  )}
                </div>
              </div>
            ) : null}

            {active?.externalUrl ? (
              <div className="flex flex-wrap gap-2 pt-1">
                <Button asChild className="h-10 gap-1.5 px-4">
                  <a href={active.externalUrl} target="_blank" rel="noopener noreferrer">
                    Open project link
                    <ArrowUpRightIcon className="size-4" />
                  </a>
                </Button>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>

        <Dialog
          open={formOpen}
          onOpenChange={(next) => {
            setFormOpen(next)
            if (!next) setEditing(null)
          }}
        >
          <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit Project' : 'Add Project'}</DialogTitle>
                <DialogDescription>
                  New case studies appear at the top of the projects grid.
                </DialogDescription>
              </DialogHeader>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="project-title">Title</FieldLabel>
                  <Input
                    id="project-title"
                    name="title"
                    required
                    placeholder="AI lead-qualifier"
                    defaultValue={editing?.title ?? ''}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="project-description">Description</FieldLabel>
                  <Textarea
                    id="project-description"
                    name="description"
                    required
                    rows={4}
                    placeholder="What the system does and the outcome it produced."
                    defaultValue={editing?.description ?? ''}
                  />
                </Field>
                <ImageField
                  key={editing?.id ?? 'new'}
                  id="project-image"
                  name="image"
                  label="Project Cover Photo"
                  defaultValue={editing?.image ?? ''}
                  placeholder="/projects/my-project.png"
                  description="Paste an image URL or upload a file."
                />
                <Field>
                  <FieldLabel htmlFor="project-video">Demo Video Link</FieldLabel>
                  <Input
                    id="project-video"
                    name="videoUrl"
                    placeholder="https://youtube.com/watch?v=... or .mp4"
                    defaultValue={editing?.videoUrl ?? ''}
                  />
                  <FieldDescription>
                    YouTube, Vimeo, Loom, or a direct MP4 URL — embedded in the case study.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="project-link">External Link</FieldLabel>
                  <Input
                    id="project-link"
                    name="externalUrl"
                    placeholder="https://github.com/..."
                    defaultValue={editing?.externalUrl ?? ''}
                  />
                  <FieldDescription>Live demo, GitHub, or case study URL.</FieldDescription>
                </Field>
              </FieldGroup>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">{editing ? 'Save changes' : 'Add project'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
