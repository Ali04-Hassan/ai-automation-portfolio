import { ArrowDownRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { links, profile } from '@/lib/portfolio-data'
import { UpworkIcon } from '@/components/brand-icons'
import { ProfilePortrait } from '@/components/profile-portrait'


const marqueeItems = [
  'n8n',
  'Vapi',
  'ElevenLabs',
  'Gemini',
  'Claude',
  'OpenAI',
  'Pinecone',
  'Shopify API',
  'Twilio',
  'Airtable',
  'Docker',
  'Python',
]

export function HeroSection() {
  return (
    <section id="home" className="relative w-full overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24">
      <div className="hero-wash pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 size-[46rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:px-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col gap-6">
          <span className="glass inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] text-primary uppercase">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            Available for new automation projects
          </span>

          <div className="flex flex-col gap-3">
            <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-glow text-primary">{profile.name}</span>
            </h1>
            <p className="font-mono text-sm text-foreground/90 sm:text-base">
              {profile.role} <span className="text-primary/60">|</span> n8n Workflows{' '}
              <span className="text-primary/60">|</span> AI Voice Agents{' '}
              <span className="text-primary/60">|</span> RAG Systems
            </p>
          </div>

          <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
            {profile.summary}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild
              className="h-11 gap-2 bg-upwork px-5 text-sm font-semibold text-upwork-foreground shadow-[0_0_26px_color-mix(in_oklab,var(--upwork)_45%,transparent)] transition-transform hover:-translate-y-0.5 hover:bg-upwork/90"
              >
<a href={links.upwork} target="_blank" rel="noopener noreferrer">
              <UpworkIcon className="size-4" />
              Hire Me on Upwork
            </a>
</Button>
            <Button asChild
              variant="outline"
              className="glass h-11 gap-2 px-5 text-sm font-semibold transition-transform hover:-translate-y-0.5 hover:text-primary"
              >
<a href="#projects" >
              View Portfolio
              <ArrowDownRightIcon className="size-4" />
            </a>
</Button>
          </div>

          <dl className="mt-4 grid max-w-lg grid-cols-3 gap-3">
            {[
              { k: 'Production AI Systems', v: '10+' },
              { k: 'Autonomous Uptime', v: '24/7' },
              { k: 'Manual Intervention', v: 'Zero' },
            ].map((item) => (
              <div key={item.k} className="glass rounded-xl px-3 py-3">
                <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  {item.k}
                </dt>
                <dd className="mt-1 text-xl font-bold text-primary">{item.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ProfilePortrait />

      </div>

      {/* Edge fade uses overlay gradients instead of mask-image: a mask on the
          scrolling container forces a main-thread repaint every frame. */}
      <div className="marquee-viewport relative mt-16 flex w-full overflow-hidden border-y border-border/60 py-4">
        <div className="marquee-track flex min-w-max animate-marquee items-center gap-8 pr-8">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase"
            >
              {item}
              <span className="ml-8 text-primary/50">/</span>
            </span>
          ))}
        </div>
        <div className="marquee-fade marquee-fade-left" aria-hidden="true" />
        <div className="marquee-fade marquee-fade-right" aria-hidden="true" />
      </div>

    </section>
  )
}
