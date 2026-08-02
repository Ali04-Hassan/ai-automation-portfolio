import { useState } from 'react'
import { PencilIcon, PlusIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { SectionHeading } from '@/components/section-heading'
import { usePortfolio } from '@/components/portfolio-provider'
import { useAdmin } from '@/components/admin-provider'

export function SkillsSection() {
  const { isAdmin } = useAdmin()
  const { skillGroups, addSkill, updateSkill, removeSkill } = usePortfolio()
  const [open, setOpen] = useState(false)
  const [groupId, setGroupId] = useState(skillGroups[0]?.id ?? 'ai')
  const [skill, setSkill] = useState('')
  const [editingSkill, setEditingSkill] = useState<string | null>(null)

  function openAdd() {
    setEditingSkill(null)
    setSkill('')
    setOpen(true)
  }

  function openEdit(group: string, item: string) {
    setGroupId(group)
    setEditingSkill(item)
    setSkill(item)
    setOpen(true)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = skill.trim()
    if (!value) return
    if (editingSkill) {
      updateSkill(groupId, editingSkill, value)
      toast.success('Skill updated')
    } else {
      addSkill(groupId, value)
      toast.success(`Added "${value}" to your stack`)
    }
    setSkill('')
    setEditingSkill(null)
    setOpen(false)
  }

  return (
    <section id="skills" className="relative w-full overflow-hidden py-20 sm:py-24">
      <div className="section-glow-right pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-12">
        <SectionHeading
          eyebrow="skills"
          title="The stack behind the automations"
          description="Grouped by how I actually use them: AI systems, code, and the integrations that glue everything together."
          action={
            isAdmin ? (
              <Button
                variant="outline"
                className="glass h-9 gap-1.5 px-4 hover:text-primary"
                onClick={openAdd}
              >
                <PlusIcon data-icon="inline-start" />
                Add Skill
              </Button>
            ) : null
          }
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <Card key={group.id} className="glass">
              <CardHeader>
                <CardTitle className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                  {group.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {group.skills.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1">
                    <Badge
                      variant="outline"
                      className="cursor-default border-border bg-background/40 px-2.5 py-1 text-xs text-foreground/85 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_16px_-4px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
                    >
                      {item}
                      {isAdmin ? (
                        <>
                          <button
                            type="button"
                            aria-label={`Edit ${item}`}
                            className="ml-1.5 text-muted-foreground hover:text-primary"
                            onClick={() => openEdit(group.id, item)}
                          >
                            <PencilIcon className="size-3" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete ${item}`}
                            className="ml-1 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              removeSkill(group.id, item)
                              toast.success('Skill removed')
                            }}
                          >
                            <XIcon className="size-3" />
                          </button>
                        </>
                      ) : null}
                    </Badge>
                  </span>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next)
            if (!next) setEditingSkill(null)
          }}
        >
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>{editingSkill ? 'Edit skill' : 'Add a skill'}</DialogTitle>
                <DialogDescription>
                  Pick a category and set the technology name.
                </DialogDescription>
              </DialogHeader>

              <FieldGroup>
                <Field>
                  <FieldLabel>Category</FieldLabel>
                  <ToggleGroup
                    type="single"
                    value={groupId}
                    onValueChange={(value) => {
                      if (value) setGroupId(value)
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-wrap"
                  >
                    {skillGroups.map((group) => (
                      <ToggleGroupItem key={group.id} value={group.id}>
                        {group.title}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Field>
                <Field>
                  <FieldLabel htmlFor="skill-name">Skill</FieldLabel>
                  <Input
                    id="skill-name"
                    value={skill}
                    onChange={(event) => setSkill(event.target.value)}
                    placeholder="e.g. LangChain"
                    autoComplete="off"
                  />
                </Field>
              </FieldGroup>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={!skill.trim()}>
                  {editingSkill ? 'Save changes' : 'Add skill'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
