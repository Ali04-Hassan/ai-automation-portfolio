import { useEffect, useRef, useState } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  phase: number
  side: -1 | 1
}

type Glyph = {
  x: number
  y: number
  speed: number
  char: string
  life: number
  size: number
}

const GLYPHS = '01<>{}[]/\\$#*+=ABCDEF·λΣ∆'
const CONTENT_WIDTH = 1200 // must stay in sync with the centered page container
const MIN_MARGIN = 96 // below this the margins are too narrow to decorate

/**
 * Decorative ambient layer that lives strictly in the empty left/right margins.
 * - Left: multi-layered breathing mesh gradient (muted cyan / deep blue).
 * - Right: slow vertical stream of glowing data points + matrix glyphs.
 * - Interactive particle constellation on both sides, softly pulled by the cursor.
 * Fixed, pointer-events-none, and never affects the centered content width.
 */
export function SideAmbient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cores = navigator.hardwareConcurrency ?? 8
    const wide = window.matchMedia(`(min-width: ${CONTENT_WIDTH + MIN_MARGIN * 2}px)`).matches
    setActive(wide && !reduced && cores > 4)
  }, [])

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !ctx) return

    let width = 0
    let height = 0
    let margin = 0
    let particles: Particle[] = []
    let glyphs: Glyph[] = []
    const pointer = { x: -9999, y: -9999 }
    let raf = 0

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight
      margin = Math.max(0, (width - CONTENT_WIDTH) / 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const perSide = Math.round(Math.min(24, Math.max(10, margin / 10)))
      particles = []
      for (const side of [-1, 1] as const) {
        for (let i = 0; i < perSide; i++) {
          const base = side === -1 ? 0 : width - margin
          particles.push({
            x: base + Math.random() * margin,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.12,
            vy: (Math.random() - 0.5) * 0.16,
            r: 0.8 + Math.random() * 1.8,
            phase: Math.random() * Math.PI * 2,
            side,
          })
        }
      }

      // Right-edge data stream: glowing points that carry a matrix glyph.
      const streamCount = Math.round(Math.min(22, Math.max(8, margin / 12)))
      glyphs = []
      for (let i = 0; i < streamCount; i++) {
        glyphs.push({
          x: width - margin + 12 + Math.random() * Math.max(8, margin - 28),
          y: Math.random() * height,
          speed: 0.18 + Math.random() * 0.42,
          char: GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? '0',
          life: Math.random(),
          size: 9 + Math.random() * 5,
        })
      }
    }

    build()
    const onResize = () => build()
    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
    }
    const onLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    let last = performance.now()

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 16.6667, 3)
      last = now
      ctx.clearRect(0, 0, width, height)

      if (margin < MIN_MARGIN) {
        raf = requestAnimationFrame(frame)
        return
      }

      ctx.globalCompositeOperation = 'lighter'

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        if (!p) continue
        const leftEdge = p.side === -1 ? 0 : width - margin
        const rightEdge = leftEdge + margin

        // Soft attraction toward a nearby cursor.
        const dx = pointer.x - p.x
        const dy = pointer.y - p.y
        const dist = Math.hypot(dx, dy)
        let excite = 0
        if (dist < 220) {
          excite = 1 - dist / 220
          const pull = excite * 0.02 * dt
          p.vx += dx * pull * 0.05
          p.vy += dy * pull * 0.05
        }

        p.x += p.vx * dt
        p.y += p.vy * dt
        p.vx *= 0.985
        p.vy *= 0.985
        p.phase += 0.012 * dt

        if (p.x < leftEdge) p.x = rightEdge
        if (p.x > rightEdge) p.x = leftEdge
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10

        const twinkle = 0.55 + Math.sin(p.phase) * 0.45
        const alpha = (0.09 + excite * 0.15) * twinkle
        const radius = p.r * (1 + excite * 0.9)
        const glow = radius * 5

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow)
        const hue = p.side === -1 ? '110, 190, 240' : '56, 224, 200'
        gradient.addColorStop(0, `rgba(${hue}, ${alpha})`)
        gradient.addColorStop(1, `rgba(${hue}, 0)`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, glow, 0, Math.PI * 2)
        ctx.fill()

        // Constellation links between close neighbours on the same side.
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          if (!q || q.side !== p.side) continue
          const lx = q.x - p.x
          const ly = q.y - p.y
          const d = Math.hypot(lx, ly)
          if (d > 130) continue
          ctx.strokeStyle = `rgba(${hue}, ${(1 - d / 130) * (0.04 + excite * 0.07)})`
          ctx.lineWidth = 0.6
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(q.x, q.y)
          ctx.stroke()
        }
      }

      // Right-margin matrix / data stream.
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const g of glyphs) {
        g.y += g.speed * dt
        g.life += 0.004 * dt
        if (g.y > height + 20) {
          g.y = -20
          g.x = width - margin + 12 + Math.random() * Math.max(8, margin - 28)
          g.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? '0'
          g.life = 0
        }
        // Fade in and out along the edge for a soft, non-distracting stream.
        const fade = Math.sin(Math.min(1, g.y / height) * Math.PI)
        const alpha = 0.14 * fade * (0.6 + Math.sin(g.life * 3) * 0.4)
        ctx.fillStyle = `rgba(94, 234, 240, ${Math.max(0, alpha).toFixed(3)})`
        ctx.font = `${g.size.toFixed(1)}px ui-monospace, monospace`
        ctx.fillText(g.char, g.x, g.y)

        const dot = ctx.createRadialGradient(g.x, g.y + g.size, 0, g.x, g.y + g.size, g.size * 1.6)
        dot.addColorStop(0, `rgba(56, 224, 200, ${(alpha * 0.9).toFixed(3)})`)
        dot.addColorStop(1, 'rgba(56, 224, 200, 0)')
        ctx.fillStyle = dot
        ctx.beginPath()
        ctx.arc(g.x, g.y + g.size, g.size * 1.6, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [active])

  // Scroll-driven ambient intensity (always on, rAF-throttled, one CSS var).
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    let queued = false
    const apply = () => {
      queued = false
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0
      const wave = 0.7 + Math.sin(progress * Math.PI * 2.2) * 0.3
      wrapper.style.setProperty('--side-ambient', wave.toFixed(3))
    }
    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(apply)
    }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={wrapperRef} className="side-ambient" aria-hidden="true">
      {/* Left: layered mesh gradient that breathes */}
      <span className="side-mesh side-mesh-left" />
      <span className="side-mesh side-mesh-left-alt" />
      {/* Right: ambient column behind the data stream */}
      <span className="side-mesh side-mesh-right" />
      <span className="side-ambient-orb side-ambient-orb-left" />
      <span className="side-ambient-orb side-ambient-orb-left-lower" />
      <span className="side-ambient-orb side-ambient-orb-right" />
      <span className="side-ambient-orb side-ambient-orb-right-lower" />
      {active ? <canvas ref={canvasRef} className="side-ambient-canvas" /> : null}
    </div>
  )
}
