export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex max-w-2xl flex-col gap-2">
        <span className="text-[11px] font-semibold tracking-[0.22em] text-primary uppercase">
          {eyebrow}
        </span>
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        {description ? (
          <p className="text-pretty leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
