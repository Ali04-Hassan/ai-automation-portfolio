import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdmin } from '@/components/admin-provider'

export function AdminActions({
  onEdit,
  onDelete,
  label,
  className = '',
}: {
  onEdit: () => void
  onDelete: () => void
  label: string
  className?: string
}) {
  const { isAdmin } = useAdmin()
  if (!isAdmin) return null

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        type="button"
        size="icon"
        variant="outline"
        aria-label={`Edit ${label}`}
        className="glass size-8 hover:text-primary"
        onClick={(event) => {
          event.stopPropagation()
          onEdit()
        }}
      >
        <PencilIcon className="size-3.5" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="outline"
        aria-label={`Delete ${label}`}
        className="glass size-8 hover:text-destructive"
        onClick={(event) => {
          event.stopPropagation()
          onDelete()
        }}
      >
        <Trash2Icon className="size-3.5" />
      </Button>
    </div>
  )
}
