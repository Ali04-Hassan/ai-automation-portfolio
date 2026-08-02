import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

// useLayoutEffect logs a warning during SSR; fall back to useEffect on the server.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export type LightboxItem = {
  id: string
  src: string
  alt: string
  title: string
  subtitle?: string
  caption?: string
}

type ImageLightboxProps = {
  items: LightboxItem[]
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
  /** Describes the collection for screen readers, e.g. "Certificate gallery". */
  label: string
}

/**
 * Accessible image lightbox.
 * - Radix Dialog provides the focus trap, Escape-to-close and aria-modal semantics.
 * - Arrow keys / Home / End navigate between images.
 * - A polite live region announces the current image and position.
 */
export function ImageLightbox({
  items,
  index,
  onIndexChange,
  onClose,
  label,
}: ImageLightboxProps) {
  const open = index !== null && index >= 0 && index < items.length
  const current = open ? items[index] : null
  const total = items.length
  const openerRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const go = useCallback(
    (next: number) => {
      if (total === 0) return
      onIndexChange((next + total) % total)
    },
    [onIndexChange, total],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (total < 2 && event.key !== 'Home' && event.key !== 'End') return
      switch (event.key) {
        case 'ArrowRight':
        case 'PageDown':
          event.preventDefault()
          go((index ?? 0) + 1)
          break
        case 'ArrowLeft':
        case 'PageUp':
          event.preventDefault()
          go((index ?? 0) - 1)
          break
        case 'Home':
          event.preventDefault()
          go(0)
          break
        case 'End':
          event.preventDefault()
          go(total - 1)
          break
        default:
          break
      }
    },
    [go, index, total],
  )
  // Remember the thumbnail that triggered the lightbox, before Radix moves focus.
  useIsomorphicLayoutEffect(() => {
    if (open) openerRef.current = document.activeElement as HTMLElement | null
  }, [open])

  // Radix keeps the rest of the page inert via aria-hidden but does not set
  // aria-modal, and it re-renders the attribute away, so re-apply it here.
  useEffect(() => {
    const node = contentRef.current
    if (!open || !node) return
    node.setAttribute('aria-modal', 'true')
    const observer = new MutationObserver(() => {
      if (node.getAttribute('aria-modal') !== 'true') node.setAttribute('aria-modal', 'true')
    })
    observer.observe(node, { attributes: true, attributeFilter: ['aria-modal'] })
    return () => observer.disconnect()
  }, [open])

  // Restore focus to the opening thumbnail once the lightbox closes.
  useEffect(() => {
    if (open) return
    const opener = openerRef.current
    if (!opener?.isConnected) return
    const frame = requestAnimationFrame(() => opener.focus())
    return () => cancelAnimationFrame(frame)
  }, [open])


  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-background/90 backdrop-blur-sm" />
        <DialogPrimitive.Content
          ref={contentRef}
          onKeyDown={handleKeyDown}
          onCloseAutoFocus={(event) => {
            // Return focus to the thumbnail that opened the lightbox.
            if (openerRef.current?.isConnected) {
              event.preventDefault()
              openerRef.current.focus()
            }
          }}
          aria-label={label}
          aria-modal="true"
          aria-roledescription="image carousel"
          className={cn(
            'fixed left-1/2 top-1/2 z-50 flex max-h-[92vh] w-[calc(100%-1.5rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2',
            'flex-col gap-4 overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-2xl outline-none sm:p-6',
            'duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-1">
              <DialogPrimitive.Title className="text-balance text-lg font-semibold leading-snug">
                {current?.title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-sm text-muted-foreground">
                {current?.subtitle ?? label}
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close
              aria-label="Close image preview"
              className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <XIcon className="size-5" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>

          <div className="relative flex items-center justify-center">
            {current ? (
              <img
                src={current.src || '/placeholder.svg'}
                alt={current.alt}
                className="max-h-[64vh] w-full rounded-xl border border-border object-contain"
              />
            ) : null}

            {total > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => go((index ?? 0) - 1)}
                  aria-label="Previous image"
                  className="absolute left-2 inline-flex size-11 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition-colors hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <ChevronLeftIcon className="size-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => go((index ?? 0) + 1)}
                  aria-label="Next image"
                  className="absolute right-2 inline-flex size-11 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition-colors hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <ChevronRightIcon className="size-5" aria-hidden="true" />
                </button>
              </>
            ) : null}
          </div>

          {current?.caption ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{current.caption}</p>
          ) : null}

          {total > 1 ? (
            <p className="text-xs text-muted-foreground">
              Use the left and right arrow keys to browse, Escape to close.
            </p>
          ) : null}

          <div aria-live="polite" className="sr-only">
            {current ? `${current.title}. Image ${(index ?? 0) + 1} of ${total}.` : ''}
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}
