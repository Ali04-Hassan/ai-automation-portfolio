import { useEffect, useRef, useState } from 'react'

/**
 * High-performance custom cursor.
 * - Inner dot is pinned to the raw pointer position (zero perceived lag).
 * - Outer ring follows with a frame-rate independent spring and scales on hover.
 * - Soft trail is drawn on a lightweight canvas with a small point budget,
 *   clearing only the dirty rect and idling the rAF loop when nothing moves.
 * - The trail is dropped entirely on low-core / low-memory devices; the dot and
 *   ring (pure transforms) still run there.
 * Renders on pointer-fine devices only, and respects prefers-reduced-motion.
 */
export function CursorTrail() {
  const [enabled, setEnabled] = useState(false)
  const [trail, setTrail] = useState(true)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cores = navigator.hardwareConcurrency ?? 8
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
    setTrail(cores > 4 && memory > 4)
    if (fine && !reduced) setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('custom-cursor')

    const canvas = trail ? canvasRef.current : null
    const ctx = canvas?.getContext('2d', { alpha: true }) ?? null
    let width = 0
    let height = 0

    const resize = () => {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)


    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { ...target }
    const points: { x: number; y: number; life: number }[] = []
    let pressed = false
    let hovering = false
    let visible = false
    let scale = 1
    let raf = 0
    let last = performance.now()

    const hoverSelector =
      'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor-hover]'

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX
      target.y = event.clientY

      // Pin the dot immediately — no interpolation, no lag.
      const dotEl = dotRef.current
      if (dotEl) {
        dotEl.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%) scale(${pressed ? 0.6 : 1})`
        if (!visible) {
          visible = true
          dotEl.style.opacity = '1'
          if (ringRef.current) ringRef.current.style.opacity = '0.8'
        }
      }

      const el = event.target as HTMLElement | null
      hovering = Boolean(el?.closest(hoverSelector))
    }
    const onDown = () => (pressed = true)
    const onUp = () => (pressed = false)
    const onLeave = () => {
      visible = false
      if (dotRef.current) dotRef.current.style.opacity = '0'
      if (ringRef.current) ringRef.current.style.opacity = '0'
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    let idleFrames = 0

    const frame = (now: number) => {
      // Frame-rate independent smoothing: same feel at 60Hz and 144Hz.
      const dt = Math.min((now - last) / 16.6667, 3)
      last = now

      const dx = target.x - ring.x
      const dy = target.y - ring.y
      const ringEase = 1 - Math.pow(1 - 0.4, dt)
      ring.x += dx * ringEase
      ring.y += dy * ringEase

      const targetScale = pressed ? 0.75 : hovering ? 1.85 : 1
      scale += (targetScale - scale) * (1 - Math.pow(1 - 0.25, dt))

      const settled =
        Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1 && Math.abs(targetScale - scale) < 0.002
      idleFrames = settled ? idleFrames + 1 : 0

      if (ctx && points.length) {
        // Clear only the region the trail occupies instead of the full viewport.
        let minX = Infinity
        let minY = Infinity
        let maxX = -Infinity
        let maxY = -Infinity
        for (const point of points) {
          if (point.x < minX) minX = point.x
          if (point.y < minY) minY = point.y
          if (point.x > maxX) maxX = point.x
          if (point.y > maxY) maxY = point.y
        }
        const pad = 24
        ctx.clearRect(minX - pad, minY - pad, maxX - minX + pad * 2, maxY - minY + pad * 2)
      }

      if (ctx && !settled) {
        points.push({ x: target.x, y: target.y, life: 1 })
        if (points.length > 12) points.shift()

        ctx.globalCompositeOperation = 'lighter'
        for (let i = 0; i < points.length; i++) {
          const point = points[i]
          if (!point) continue
          point.life *= 0.86
          const t = (i + 1) / points.length
          const radius = 14 * t + 3
          const alpha = point.life * 0.2 * t
          if (alpha <= 0.01) continue
          const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius)
          gradient.addColorStop(0, `rgba(94, 234, 240, ${alpha})`)
          gradient.addColorStop(1, 'rgba(94, 234, 240, 0)')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      } else if (settled) {
        points.length = 0
      }

      if (ringRef.current && !settled) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`
        if (visible) ringRef.current.style.opacity = hovering ? '1' : '0.75'
      }

      // Park the loop while the pointer is at rest: zero work when idle.
      if (idleFrames > 3) {
        raf = 0
        return
      }
      raf = requestAnimationFrame(frame)
    }
    const wake = () => {
      idleFrames = 0
      if (!raf) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }
    window.addEventListener('pointermove', wake, { passive: true })
    window.addEventListener('pointerdown', wake, { passive: true })
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointermove', wake)
      window.removeEventListener('pointerdown', wake)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('custom-cursor')
    }
  }, [enabled, trail])


  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      {trail ? <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-80" /> : null}
      <div
        ref={ringRef}
        style={{ opacity: 0 }}
        className="absolute top-0 left-0 size-8 rounded-full border border-primary/70 opacity-0 shadow-[0_0_18px_-2px_color-mix(in_oklab,var(--primary)_75%,transparent)] transition-opacity duration-150 will-change-transform"
      />
      <div
        ref={dotRef}
        style={{ opacity: 0 }}
        className="absolute top-0 left-0 size-[7px] rounded-full bg-primary opacity-0 shadow-[0_0_12px_color-mix(in_oklab,var(--primary)_90%,transparent)] transition-opacity duration-150 will-change-transform"
      />
    </div>
  )
}
