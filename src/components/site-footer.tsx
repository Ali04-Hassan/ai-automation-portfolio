import { LockIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useAdmin } from '@/components/admin-provider'
import { links, navItems, profile } from '@/lib/portfolio-data'
import {
  GitHubIcon,
  GmailIcon,
  LinkedInIcon,
  UpworkIcon,
  WhatsAppIcon,
} from '@/components/brand-icons'

const socials = [
  { label: 'LinkedIn', href: links.linkedin, Icon: LinkedInIcon },
  { label: 'Upwork', href: links.upwork, Icon: UpworkIcon },
  { label: 'Gmail', href: links.email, Icon: GmailIcon },
  { label: 'WhatsApp', href: links.whatsapp, Icon: WhatsAppIcon },
  { label: 'GitHub', href: links.github, Icon: GitHubIcon },
]

export function SiteFooter() {
  const { isAdmin, openPasscode } = useAdmin()

  return (
    <footer className="relative border-t border-border pb-28 pt-14 sm:pb-16">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 font-mono text-sm font-bold text-primary">
                AH
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">{profile.name}</span>
                <span className="font-mono text-[10px] tracking-[0.18em] text-primary/80 uppercase">
                  {profile.role}
                </span>
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Building AI voice agents, n8n workflows, and RAG systems that run without supervision.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-1.5">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="glass flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
            >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <p className="font-mono text-[11px] text-muted-foreground">
              <span className="text-primary">status:</span> open to new projects
            </p>
            <button
              type="button"
              onClick={openPasscode}
              aria-label={isAdmin ? 'Disable admin mode' : 'Admin access'}
              title={isAdmin ? 'Admin mode on — click to exit' : 'Admin access'}
              className={
                isAdmin
                  ? 'flex size-7 items-center justify-center rounded-md border border-primary/50 text-primary'
                  : 'flex size-7 items-center justify-center rounded-md text-muted-foreground/40 transition-colors hover:text-primary'
              }
            >
              <LockIcon className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
