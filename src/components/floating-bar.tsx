import { Button } from '@/components/ui/button'
import { links } from '@/lib/portfolio-data'
import {
  GitHubIcon,
  GmailIcon,
  LinkedInIcon,
  UpworkIcon,
  WhatsAppIcon,
} from '@/components/brand-icons'

const socials = [
  { label: 'LinkedIn', href: links.linkedin, Icon: LinkedInIcon },
  { label: 'GitHub', href: links.github, Icon: GitHubIcon },
  { label: 'Gmail', href: links.email, Icon: GmailIcon },
  { label: 'WhatsApp', href: links.whatsapp, Icon: WhatsAppIcon },
]

export function FloatingBar() {
  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="glass flex items-center gap-2 rounded-full px-2 py-2 shadow-2xl shadow-background/80">
        <Button asChild
          className="h-9 gap-1.5 rounded-full bg-upwork px-4 text-xs font-semibold text-upwork-foreground shadow-[0_0_20px_color-mix(in_oklab,var(--upwork)_45%,transparent)] hover:bg-upwork/90"
          >
<a href={links.upwork} target="_blank" rel="noopener noreferrer">
          <UpworkIcon className="size-3.5" />
          Hire Me
        </a>
</Button>
        <span className="h-5 w-px bg-border" aria-hidden="true" />
        {socials.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
          >
            <Icon className="size-4" />
          </a>
        ))}
      </div>
    </div>
  )
}
