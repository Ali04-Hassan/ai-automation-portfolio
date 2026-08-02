export const profile = {
  name: 'Ali Hassan',
  role: 'AI Automation Developer',
  tagline: 'n8n Workflows | AI Voice Agents | RAG Systems',
  summary:
    'Computer Engineering Student @ UET Lahore building production-ready AI systems that automate support, sales, and operations.',
  portrait: '/ali-hassan-portrait.png',
  logo: '/ali-hassan-logo.png',
}

export const links = {
  linkedin: 'https://www.linkedin.com/in/ali-hassan-6814803a8',
  github: 'https://github.com/Ali04-Hassan',
  upwork: 'https://www.upwork.com/freelancers/~017006c6eba7d6cdbc',
  email: 'mailto:2025bscpe20@student.uet.edu.pk',
  whatsapp: 'https://wa.me/923420854464',
  emailPlain: '2025bscpe20@student.uet.edu.pk',
  phonePlain: '+92 342 085 4464',
}

export const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Services', href: '#services' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export const stats = [
  { value: '10+', label: 'Projects Built' },
  { value: '24/7', label: 'Availability' },
  { value: '100%', label: 'Reliability' },
  { value: '5+', label: 'Automation Stacks' },
]

export const education = [
  {
    period: '2025 — 2029',
    title: 'BSc Computer Engineering',
    org: 'University of Engineering & Technology (UET), Lahore',
    detail:
      'Focused on systems, networks, and applied AI — building automation projects alongside coursework.',
  },
  {
    period: '2023 — 2025',
    title: 'Intermediate in Computer Science (ICS)',
    org: 'Superior College',
    detail: 'Graduated with Grade A+ — top of class in programming and mathematics.',
  },
]

export type Service = {
  id: string
  title: string
  description: string
  icon: 'workflow' | 'voice' | 'api' | 'rag' | 'doc'
  points: string[]
}

export const initialServices: Service[] = [
  {
    id: 'workflow-automation',
    title: 'Workflow Automation',
    description:
      'Custom n8n workflows that encode complex backend business logic and run unattended.',
    icon: 'workflow',
    points: ['Error handling & retries', 'Scheduled + webhook triggers', 'Self-hosted or cloud'],
  },
  {
    id: 'ai-voice-agents',
    title: 'AI Voice Agents',
    description:
      'Vapi & ElevenLabs voice agents wired into your CRM, SMS, and calendar for real conversations.',
    icon: 'voice',
    points: ['Inbound & outbound calling', 'Live CRM lookups', 'Call transcripts & logging'],
  },
  {
    id: 'api-crm',
    title: 'API & CRM Integration',
    description:
      'Airtable, Twilio, Shopify, Gmail API and webhook-driven pipelines that keep systems in sync.',
    icon: 'api',
    points: ['REST & GraphQL', 'OAuth + secure secrets', 'Two-way data sync'],
  },
  {
    id: 'rag-chatbots',
    title: 'RAG Systems & Chatbots',
    description:
      'Vector-database Q&A bots trained on your docs using Pinecone and Gemini or Claude.',
    icon: 'rag',
    points: ['Document ingestion', 'Grounded answers with sources', 'Website & WhatsApp embed'],
  },
  {
    id: 'doc-automation',
    title: 'Invoice & Document Automation',
    description:
      'AI-driven data extraction, validation, and duplicate detection for finance operations.',
    icon: 'doc',
    points: ['OCR + LLM extraction', 'Duplicate detection', 'Accounting hand-off'],
  },
]

export type SkillGroup = {
  id: string
  title: string
  skills: string[]
}

export const initialSkillGroups: SkillGroup[] = [
  {
    id: 'ai',
    title: 'AI Systems & Voice',
    skills: ['n8n', 'Vapi', 'ElevenLabs', 'Gemini', 'Claude', 'OpenAI', 'Pinecone'],
  },
  {
    id: 'web',
    title: 'Languages & Web',
    skills: ['Python', 'C++', 'SQL', 'HTML5', 'CSS3', 'JavaScript'],
  },
  {
    id: 'cloud',
    title: 'Integration & Cloud',
    skills: ['Docker', 'Twilio', 'Airtable', 'REST APIs', 'Vercel', 'Shopify'],
  },
]

export type Project = {
  id: string
  title: string
  description: string
  image: string
  videoUrl: string
  externalUrl: string
}

export const initialProjects: Project[] = [
  {
    id: 'ai-support-agent',
    title: 'A 24/7 AI voice & chat agent that handles support, refunds & lost sales',
    description:
      "Built a fully automated AI customer support system for a Shopify store, powered by two AI assistants — one for website/chat, one for phone calls. The system checks order status, processes refund requests, recovers abandoned carts with automatic reminder emails, and recommends products based on purchase history — all running 24/7 with zero manual work. Every interaction is logged automatically. Built with n8n, ElevenLabs, Vapi, and Shopify's API — fully white-labelable and adaptable to any e-commerce store or business.",
    image: '/projects/ai-support-agent.png',
    videoUrl: 'https://www.loom.com/share/6ef35c6f01784fc78cb8b841d7581ed3',
    externalUrl: 'https://github.com/Ali04-Hassan',
  },
]

export type Certification = {
  id: string
  title: string
  issuer: string
  description: string
  image: string
}

export const initialCertifications: Certification[] = [
  {
    id: 'act-ai',
    title: 'ACT AI — National AI Training Programme',
    issuer: 'Government of Pakistan / ACT',
    description:
      'National-level AI training covering machine learning foundations, prompt engineering, and applied AI product building.',
    image: '/certifications/act-ai.png',
  },
  {
    id: 'excel-copilot',
    title: 'Excel and Copilot Fundamentals',
    issuer: 'Microsoft',
    description:
      'Data modelling, formulas, and AI-assisted analysis using Microsoft Copilot inside Excel.',
    image: '/certifications/excel-copilot.png',
  },
]


export type Testimonial = {
  id: string
  name: string
  role: string
  quote: string
  rating: number
}

export const initialTestimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Shopify Store Owner',
    role: 'E-commerce Founder',
    quote:
      'The voice agent answers every call at 3am and pulls real order data. Support tickets dropped and we recovered carts we used to lose.',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Operations Lead',
    role: 'Service Agency',
    quote:
      'Ali mapped our messy manual process into a clean n8n workflow with proper error handling. It has run without a hiccup since launch.',
    rating: 5,
  },
  {
    id: 't3',
    name: 'SaaS Product Manager',
    role: 'B2B SaaS',
    quote:
      'The RAG chatbot answers customer questions straight from our docs with sources. Fast communication and clear documentation throughout.',
    rating: 5,
  },
]
