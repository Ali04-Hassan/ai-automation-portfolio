import { useEffect } from 'react'

/**
 * Global, delegated interaction polish — one observer + two listeners total,
 * so adding it costs nothing per element:
 * - Scroll reveal: sections and headings fade up once when they enter view.
 * - 3D tilt: pointer-driven, transform-only tilt on cards and primary buttons.
 * Everything animates `transform` / `opacity` only, and is disabled for
 * reduced-motion or low-end devices.
 */
export function InteractivePolish() {
  // Scroll reveal
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('main section, main section h2, main section h3'),
    )

    if (reduced) {
      for (const el of targets) el.classList.add('is-revealed')
      return
    }

    for (const el of targets) {
      el.classList.add(el.tagName === 'SECTION' ? 'reveal-up' : 'reveal-heading')
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )

    for (const el of targets) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Pointer-driven 3D tilt (delegated)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(hover: none)').matches
    if (reduced || coarse) return

    const SELECTOR = '[data-tilt], .card-glow, .tilt-3d'
    let current: HTMLElement | null = null
    let queued = false
    let px = 0
    let py = 0

    const apply = () => {
      queued = false
      const el = current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const rx = (py - rect.top) / rect.height - 0.5
      const ry = (px - rect.left) / rect.width - 0.5
      el.style.setProperty('--tilt-x', `${(-rx * 6).toFixed(2)}deg`)
      el.style.setProperty('--tilt-y', `${(ry * 6).toFixed(2)}deg`)
    }

    const reset = (el: HTMLElement) => {
      el.classList.remove('is-tilting')
      el.style.removeProperty('--tilt-x')
      el.style.removeProperty('--tilt-y')
    }

    const onMove = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(SELECTOR) ?? null
      if (target !== current) {
        if (current) reset(current)
        current = target
        if (current) current.classList.add('is-tilting')
      }
      if (!current) return
      px = event.clientX
      py = event.clientY
      if (queued) return
      queued = true
      requestAnimationFrame(apply)
    }

    const onLeave = () => {
      if (current) reset(current)
      current = null
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      if (current) reset(current)
    }
  }, [])

  return null
}
