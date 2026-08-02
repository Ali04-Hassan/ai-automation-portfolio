import { useEffect, useState } from 'react'
import { MenuIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { links, navItems, profile } from '@/lib/portfolio-data'
import { GitHubIcon, GmailIcon, LinkedInIcon, UpworkIcon } from '@/components/brand-icons'

const socials = [
  { label: 'LinkedIn', href: links.linkedin, Icon: LinkedInIcon },
  { label: 'Upwork', href: links.upwork, Icon: UpworkIcon },
  { label: 'Gmail', href: links.email, Icon: GmailIcon },
  { label: 'GitHub', href: links.github, Icon: GitHubIcon },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'glass border-b border-border shadow-lg shadow-background/60' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6 lg:px-12">
        <a href="#home" className="flex items-center gap-2.5 group">
          <span className="relative flex size-9 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 font-mono text-sm font-bold tracking-tight text-primary shadow-[0_0_18px_color-mix(in_oklab,var(--primary)_25%,transparent)]">
            AH
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {profile.name}
            </span>
            <span className="font-mono text-[10px] tracking-[0.18em] text-primary/80 uppercase">
              {profile.role}
            </span>
          </span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-underline relative rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-1 sm:flex">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_14px_color-mix(in_oklab,var(--primary)_45%,transparent)]"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <XIcon /> : <MenuIcon />}
          </Button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Mobile"
          className="glass grid grid-cols-2 gap-1 border-t border-border px-6 pb-4 pt-3 lg:hidden"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
