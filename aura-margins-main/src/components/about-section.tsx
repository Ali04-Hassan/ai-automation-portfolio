import { AwardIcon, GraduationCapIcon, TerminalIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SectionHeading } from '@/components/section-heading'
import { education, initialCertifications, stats } from '@/lib/portfolio-data'

export function AboutSection() {
  return (
    <section id="about" className="relative w-full overflow-hidden py-20 sm:py-24">
      <div className="section-glow-center pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-12">
      <SectionHeading
        eyebrow="about me"
        title="Engineering student by day, automation architect around the clock"
        description="I design AI systems that replace repetitive human work — support inboxes, phone lines, order lookups, invoice entry — and I ship them as reliable, monitored workflows rather than demos."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="glass relative overflow-hidden">
          <div
            className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCapIcon className="size-4 text-primary" />
              Education timeline
            </CardTitle>
            <CardDescription>Formal training that backs the practical work.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="relative flex flex-col gap-8 border-l border-border pl-6">
              {education.map((item) => (
                <li key={item.title} className="relative">
                  <span
                    className="absolute -left-[27px] top-1.5 size-2.5 rounded-full bg-primary shadow-[0_0_12px_color-mix(in_oklab,var(--primary)_70%,transparent)]"
                    aria-hidden="true"
                  />
                  <p className="font-mono text-[11px] tracking-widest text-primary uppercase">
                    {item.period}
                  </p>
                  <h3 className="mt-1 font-semibold">{item.title}</h3>
                  <p className="text-sm text-foreground/80">{item.org}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.detail}
                  </p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass group rounded-xl p-4 transition-all hover:-translate-y-1 hover:border-primary/40"
              >
                <p className="text-3xl font-bold text-primary transition-[text-shadow] group-hover:[text-shadow:0_0_18px_color-mix(in_oklab,var(--primary)_60%,transparent)]">
                  {stat.value}
                </p>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AwardIcon className="size-4 text-primary" />
                Key certifications
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {initialCertifications.map((cert) => (
                <Badge key={cert.id} variant="outline" className="border-primary/30 text-primary">
                  {cert.title}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="flex items-start gap-3 pt-6">
              <TerminalIcon className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                <span className="text-primary">$</span> philosophy --print
                <br />
                &quot;If a human does it twice a day, it should be a workflow with logging,
                retries, and a fallback path.&quot;
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </section>
  )
}
