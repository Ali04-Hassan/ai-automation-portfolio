import { MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/section-heading'
import { CliPlayground } from '@/components/cli-playground'
import { links } from '@/lib/portfolio-data'
import {
  GitHubIcon,
  GmailIcon,
  LinkedInIcon,
  UpworkIcon,
  WhatsAppIcon,
} from '@/components/brand-icons'

const channels = [
  { label: 'Email', value: links.emailPlain, href: links.email, Icon: MailIcon },
  { label: 'WhatsApp', value: links.phonePlain, href: links.whatsapp, Icon: PhoneIcon },
  { label: 'Location', value: 'Lahore, Pakistan · remote worldwide', href: null, Icon: MapPinIcon },
]

const socials = [
  { label: 'LinkedIn', href: links.linkedin, Icon: LinkedInIcon },
  { label: 'Upwork', href: links.upwork, Icon: UpworkIcon },
  { label: 'GitHub', href: links.github, Icon: GitHubIcon },
  { label: 'Gmail', href: links.email, Icon: GmailIcon },
  { label: 'WhatsApp', href: links.whatsapp, Icon: WhatsAppIcon },
]

export function ContactSection() {
  return (
    <section id="contact" className="relative w-full overflow-hidden py-20 sm:py-24">
      <div className="section-glow-center pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-12">
      <SectionHeading
        eyebrow="contact"
        title="Let's automate the work you shouldn't be doing"
        description="Tell me the process you repeat every day. I'll map it, build it, and hand it over with documentation."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <ul className="flex flex-col gap-3">
            {channels.map(({ label, value, href, Icon }) => (
              <li key={label} className="glass flex items-center gap-3 rounded-xl px-4 py-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                    {label}
                  </span>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground transition-colors hover:text-primary"
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="text-sm text-foreground">{value}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild
              className="h-11 gap-2 bg-upwork px-5 text-sm font-semibold text-upwork-foreground shadow-[0_0_26px_color-mix(in_oklab,var(--upwork)_45%,transparent)] transition-transform hover:-translate-y-0.5 hover:bg-upwork/90"
              >
<a href={links.upwork} target="_blank" rel="noopener noreferrer">
              <UpworkIcon className="size-4" />
              Hire Me on Upwork
            </a>
</Button>
            <div className="flex items-center gap-1.5">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="glass flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_18px_-4px_color-mix(in_oklab,var(--primary)_70%,transparent)]"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <CliPlayground />
      </div>
      </div>
    </section>
  )
}
