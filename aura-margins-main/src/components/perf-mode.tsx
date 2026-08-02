import { useEffect } from 'react'

/**
 * Adds `reduce-effects` to <html> on constrained devices (few CPU cores or
 * little memory) or when the user prefers reduced motion. Continuous
 * decorative loops are switched off there; static gradients/glows remain.
 */
export function PerfMode() {
  useEffect(() => {
    const root = document.documentElement
    const cores = navigator.hardwareConcurrency ?? 8
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lowEnd = cores <= 4 || memory <= 4

    if (lowEnd || reduced) root.classList.add('reduce-effects')

    // Pause hero decoration loops while the hero is off-screen.
    const hero = document.querySelector('#home')
    let observer: IntersectionObserver | undefined
    if (hero) {
      observer = new IntersectionObserver(
        ([entry]) => root.classList.toggle('hero-offscreen', !entry?.isIntersecting),
        { rootMargin: '120px' },
      )
      observer.observe(hero)
    }

    return () => {
      observer?.disconnect()
      root.classList.remove('reduce-effects', 'hero-offscreen')
    }
  }, [])

  return null
}
