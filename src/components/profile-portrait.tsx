import { useCallback, useEffect, useRef, useState } from 'react'
import { ZapIcon } from 'lucide-react'
import { profile } from '@/lib/portfolio-data'
import { cn } from '@/lib/utils'

const AURA_PRESETS = [
  { id: 'neon', label: 'Cyan / Teal / Violet', swatch: 'linear-gradient(135deg,oklch(0.86 0.16 196),oklch(0.78 0.15 178),oklch(0.48 0.22 295))' },
  { id: 'warm', label: 'Warm amber / ember', swatch: 'linear-gradient(135deg,oklch(0.85 0.16 75),oklch(0.78 0.18 45),oklch(0.52 0.2 20))' },
  { id: 'mono', label: 'Monochrome', swatch: 'linear-gradient(135deg,oklch(0.95 0 0),oklch(0.78 0.01 250),oklch(0.45 0.01 250))' },
] as const

type AuraPreset = (typeof AURA_PRESETS)[number]['id']
const STORAGE_KEY = 'portrait-aura-preset'

/**
 * Hero portrait with a rotating gradient aura, pulsing glow layers and a
 * 3D tilt micro-interaction on hover.
 *
 * Performance notes:
 * - Every animated property is `transform`/`opacity` only (compositor thread).
 * - Pointer input is coalesced into a single rAF write per frame.
 * - The sheen is a static gradient moved with translate, never a repainted
 *   radial-gradient string.
 */
export function ProfilePortrait() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const raf = useRef(0)
  const next = useRef({ rx: 0, ry: 0, scale: 1, x: 0, y: 0 })
  const [preset, setPreset] = useState<AuraPreset>('neon')

  // Read persisted choice after hydration to avoid an SSR mismatch.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as AuraPreset | null
    if (saved && AURA_PRESETS.some((p) => p.id === saved)) setPreset(saved)
  }, [])

  const swatchRefs = useRef<Array<HTMLButtonElement | null>>([])

  const choosePreset = useCallback((id: AuraPreset) => {
    setPreset(id)
    window.localStorage.setItem(STORAGE_KEY, id)
  }, [])

  const onSwatchKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const last = AURA_PRESETS.length - 1
      let target: number | null = null
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') target = index === last ? 0 : index + 1
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') target = index === 0 ? last : index - 1
      else if (event.key === 'Home') target = 0
      else if (event.key === 'End') target = last
      else if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        choosePreset(AURA_PRESETS[index]!.id)
        return
      }
      if (target === null) return
      event.preventDefault()
      choosePreset(AURA_PRESETS[target]!.id)
      swatchRefs.current[target]?.focus()
    },
    [choosePreset],
  )


  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const schedule = useCallback(() => {
    if (raf.current) return
    raf.current = requestAnimationFrame(() => {
      raf.current = 0
      const { rx, ry, scale, x, y } = next.current
      if (cardRef.current) {
        // A persistent 3D transform keeps the whole card subtree off the
        // compositor, so it is only applied while the pointer is over it.
        cardRef.current.style.transform =
          rx === 0 && ry === 0 && scale === 1
            ? ''
            : `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${scale})`
      }
      if (shineRef.current) {
        shineRef.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      }
    })
  }, [])

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== 'mouse') return
      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const px = (x / rect.width) * 100
      const py = (y / rect.height) * 100
      next.current = { rx: (50 - py) / 7, ry: (px - 50) / 7, scale: 1.05, x, y }
      schedule()
    },
    [schedule],
  )

  const activate = useCallback(() => {
    wrapRef.current?.classList.add('is-hovered')
    if (cardRef.current) cardRef.current.style.willChange = 'transform'
    if (shineRef.current) shineRef.current.style.opacity = '1'
  }, [])

  const onPointerEnter = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== 'mouse') return
      activate()
    },
    [activate],
  )

  const onPointerLeave = useCallback(() => {
    next.current = { ...next.current, rx: 0, ry: 0, scale: 1 }
    schedule()
    wrapRef.current?.classList.remove('is-hovered')
    if (shineRef.current) shineRef.current.style.opacity = '0'
    // Drop the promotion hint once the tilt settles back to flat.
    window.setTimeout(() => {
      if (cardRef.current) cardRef.current.style.willChange = ''
    }, 600)
  }, [schedule])

  // Touch: a tap lifts and glows the card without any pointer-tracked tilt.
  const onTouchStart = useCallback(() => {
    activate()
    next.current = { ...next.current, rx: 0, ry: 0, scale: 1.04 }
    schedule()
  }, [activate, schedule])

  // Keyboard: arrows tilt the card, Enter/Space toggles the lit state,
  // Escape returns it to rest.
  const onFocus = useCallback(() => activate(), [activate])

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const step = 4
      const { rx, ry } = next.current
      let handled = true
      switch (event.key) {
        case 'ArrowUp':
          next.current = { ...next.current, rx: Math.min(rx + step, 12), scale: 1.05 }
          break
        case 'ArrowDown':
          next.current = { ...next.current, rx: Math.max(rx - step, -12), scale: 1.05 }
          break
        case 'ArrowLeft':
          next.current = { ...next.current, ry: Math.max(ry - step, -12), scale: 1.05 }
          break
        case 'ArrowRight':
          next.current = { ...next.current, ry: Math.min(ry + step, 12), scale: 1.05 }
          break
        case 'Enter':
        case ' ':
          activate()
          next.current = { ...next.current, scale: next.current.scale > 1 ? 1 : 1.05 }
          break
        case 'Escape':
          next.current = { ...next.current, rx: 0, ry: 0, scale: 1 }
          break
        default:
          handled = false
      }
      if (!handled) return
      event.preventDefault()
      activate()
      schedule()
    },
    [activate, schedule],
  )

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4 lg:max-w-none">
    <div
      ref={wrapRef}
      data-aura={preset}
      className="portrait-stage group relative w-full"
      role="group"
      tabIndex={0}
      aria-label="Portrait of Ali Hassan, AI Systems Engineer, open for global remote roles. Use the arrow keys to tilt the card, Escape to reset."
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onPointerLeave}
      onTouchCancel={onPointerLeave}
      onFocus={onFocus}
      onBlur={onPointerLeave}
      onKeyDown={onKeyDown}
    >

      <div
        className="pointer-events-none absolute inset-x-6 -bottom-6 h-24 rounded-full bg-primary/20 blur-3xl"
        aria-hidden="true"
      />
      {/* One animated halo only. Softness is baked into the gradient stops, so
          no filter: blur() layer is re-rasterized while opacity animates; the
          wider accent wash stays static and paints once. */}
      <div className="halo-soft halo-accent pointer-events-none absolute -inset-10" aria-hidden="true" />
      <div className="animate-halo halo-soft halo-primary pointer-events-none absolute -inset-6" aria-hidden="true" />
      {/* Rotating conic aura — transform-driven, no filter blur */}
      <div
        className="aura-orbit pointer-events-none absolute -inset-4 rounded-[2rem] opacity-70"
        aria-hidden="true"
      />



      <div className="animate-float-slow">
        <div
          ref={cardRef}
          className="aura-border portrait-card relative overflow-hidden rounded-2xl shadow-[0_0_60px_-20px_color-mix(in_oklab,var(--primary)_70%,transparent)]"
        >
          <div className="portrait-glow" aria-hidden="true" />
          <div className="portrait-pulse-ring" aria-hidden="true" />
          <div className="aura-ring" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 animate-scan bg-gradient-to-b from-transparent via-primary/20 to-transparent"
            aria-hidden="true"
          />
          <div ref={shineRef} className="portrait-shine z-10" aria-hidden="true" />
          <img
            src={profile.portrait || '/placeholder.svg'}
            alt="Portrait of Ali Hassan, AI Automation Developer"
            width={1163}
            height={1400}
            loading="eager"
            className="portrait-studio h-auto w-full object-cover transition-[filter] duration-500 group-hover:brightness-[1.07]"
          />

          <div className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-background/70 px-3 py-2 backdrop-blur transition-all duration-300 group-hover:border-primary/70 group-hover:bg-background/85 group-hover:shadow-[0_0_28px_-8px_color-mix(in_oklab,var(--primary)_75%,transparent)]">
            <ZapIcon className="size-3.5 shrink-0 text-primary" />
            <span className="text-center font-mono text-[11px] leading-tight text-foreground/90">
              AI Systems Engineer{' '}
              <span className="text-primary/60">|</span> Open for Global Remote Roles
            </span>
          </div>
        </div>
      </div>
    </div>

    <div className="flex flex-wrap items-center justify-center gap-2">
      <span id="aura-preset-label" className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
        Aura
      </span>
      <div role="radiogroup" aria-labelledby="aura-preset-label" className="flex items-center gap-2">
        {AURA_PRESETS.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => {
              swatchRefs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={preset === p.id}
            aria-label={`Aura preset: ${p.label}`}
            title={p.label}
            tabIndex={preset === p.id ? 0 : -1}
            onClick={() => choosePreset(p.id)}
            onKeyDown={(e) => onSwatchKeyDown(e, i)}
            className={cn(
              'size-6 rounded-full border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              preset === p.id ? 'border-primary ring-2 ring-primary/50' : 'border-border/70',
            )}
            style={{ backgroundImage: p.swatch }}
          >
            <span className="sr-only">{p.label}</span>
          </button>
        ))}
      </div>
      <span aria-live="polite" className="sr-only">
        {AURA_PRESETS.find((p) => p.id === preset)?.label} aura preset selected
      </span>
    </div>

    </div>
  )
}
