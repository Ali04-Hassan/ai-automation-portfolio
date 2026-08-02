import { useRef, useState } from 'react'
import { TerminalIcon } from 'lucide-react'
import { links, profile, initialServices as services } from '@/lib/portfolio-data'

type Line = { type: 'input' | 'output'; text: string }

const helpText = [
  'available commands:',
  '  about       → who I am',
  '  projects    → selected automation builds',
  '  stack       → core tooling',
  '  services    → what I build',
  '  contact     → how to reach me',
  '  hire        → Upwork profile',
  '  clear       → clear the terminal',
]

const banner: Line[] = [
  { type: 'output', text: 'ali-hassan-cli v1.0.0 — type "help" to list commands' },
  { type: 'output', text: '' },
  ...helpText.map((text) => ({ type: 'output' as const, text })),
]

function run(command: string): string[] {
  const cmd = command.trim().toLowerCase()

  switch (cmd) {
    case 'help':
      return helpText
    case 'about':
    case 'whoami':
      return [`${profile.name} — ${profile.role}`, profile.summary]
    case 'projects':
      return [
        'selected builds:',
        '  01  AI voice agent for inbound sales calls (Vapi + n8n)',
        '  02  RAG support chatbot over company docs (Pinecone + Gemini)',
        '  03  E-commerce ops automation (Shopify API + Airtable)',
        'scroll to #projects for full case studies.',
      ]
    case 'stack':
      return ['n8n · Vapi · ElevenLabs · Gemini · Claude · Pinecone', 'Python · JS · Docker · Vercel']
    case 'services':
      return services.map((service) => `- ${service.title}`)
    case 'contact':
      return [`email:    ${links.emailPlain}`, `whatsapp: ${links.phonePlain}`]
    case 'hire':
      return [`opening upwork profile → ${links.upwork}`]
    case '':
      return []
    default:
      return [`command not found: ${cmd}. try "help"`]
  }
}

export function CliPlayground() {
  const [history, setHistory] = useState<Line[]>(banner)
  const [value, setValue] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const command = value
    const output = run(command)

    if (command.trim().toLowerCase() === 'clear') {
      setHistory(banner)
      setValue('')
      return
    }

    setHistory((current) => [
      ...current,
      { type: 'input', text: command },
      ...output.map((text) => ({ type: 'output' as const, text })),
    ])
    setValue('')

    if (command.trim().toLowerCase() === 'hire') {
      window.open(links.upwork, '_blank', 'noreferrer,noopener')
    }

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
    })
  }

  return (
    <div
      className="glass overflow-hidden rounded-xl border-border/80 shadow-[0_24px_60px_-24px_color-mix(in_oklab,var(--primary)_45%,transparent)]"
      onClick={() => inputRef.current?.focus()}
    >
      {/* macOS-style window chrome */}
      <div className="relative flex items-center gap-2 border-b border-border/80 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--card)_92%,transparent),color-mix(in_oklab,var(--background)_92%,transparent))] px-3.5 py-2.5">
        <span className="flex gap-2" aria-hidden="true">
          <span className="size-3 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.35)]" />
          <span className="size-3 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.35)]" />
          <span className="size-3 rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.35)]" />
        </span>
        <span className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 font-terminal text-[11px] font-medium tracking-tight text-foreground/70">
          <TerminalIcon className="size-3.5 text-primary" />
          ali@automation — zsh
        </span>
      </div>

      <div
        ref={scrollRef}
        className="h-72 overflow-y-auto bg-[color-mix(in_oklab,var(--background)_88%,black)] p-4 font-terminal text-[12.5px] leading-relaxed"
        aria-live="polite"
      >
        <div className="flex flex-col gap-0.5">
          {history.map((line, index) => (
            <p
              key={index}
              className={
                line.type === 'input'
                  ? 'text-foreground'
                  : 'whitespace-pre-wrap text-foreground/65'
              }
            >
              {line.type === 'input' ? (
                <>
                  <span className="text-upwork">ali@automation</span>
                  <span className="text-muted-foreground">:</span>
                  <span className="text-primary">~</span>
                  <span className="text-foreground/80"> $ </span>
                  {line.text}
                </>
              ) : (
                line.text || '\u00A0'
              )}
            </p>
          ))}
        </div>
      </div>

      <form
        onSubmit={submit}
        className="flex items-center gap-1.5 border-t border-border/80 bg-[color-mix(in_oklab,var(--background)_88%,black)] px-4 py-3 font-terminal text-[12.5px]"
      >
        <span aria-hidden="true" className="whitespace-pre">
          <span className="text-upwork">ali@automation</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-primary">~</span>
          <span className="text-foreground"> $ </span>
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-label="Terminal command input"
          placeholder="type help"
          spellCheck={false}
          autoComplete="off"
          className="w-full bg-transparent font-terminal text-[12.5px] text-foreground caret-primary placeholder:text-muted-foreground/50 focus:outline-none"
        />
        {!value && (
          <span
            className="animate-caret -ml-1 inline-block h-4 w-[7px] shrink-0 bg-primary"
            aria-hidden="true"
          />
        )}
      </form>
    </div>
  )
}
