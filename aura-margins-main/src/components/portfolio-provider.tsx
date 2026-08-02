import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  initialCertifications,
  initialProjects,
  initialServices,
  initialSkillGroups,
  initialTestimonials,
  type Certification,
  type Project,
  type Service,
  type SkillGroup,
  type Testimonial,
} from '@/lib/portfolio-data'

type PortfolioContextValue = {
  skillGroups: SkillGroup[]
  services: Service[]
  projects: Project[]
  certifications: Certification[]
  testimonials: Testimonial[]
  addSkill: (groupId: string, skill: string) => void
  updateSkill: (groupId: string, oldSkill: string, newSkill: string) => void
  removeSkill: (groupId: string, skill: string) => void
  addService: (service: Omit<Service, 'id'>) => void
  updateService: (id: string, service: Omit<Service, 'id'>) => void
  removeService: (id: string) => void
  addProject: (project: Omit<Project, 'id'>) => void
  updateProject: (id: string, project: Omit<Project, 'id'>) => void
  removeProject: (id: string) => void
  addCertification: (certification: Omit<Certification, 'id'>) => void
  updateCertification: (id: string, certification: Omit<Certification, 'id'>) => void
  removeCertification: (id: string) => void
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void
  updateTestimonial: (id: string, testimonial: Omit<Testimonial, 'id'>) => void
  removeTestimonial: (id: string) => void
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null)

const uid = () => Math.random().toString(36).slice(2, 10)

const STORAGE_KEY = 'ali-portfolio-content-v1'

type Stored = {
  skillGroups: SkillGroup[]
  services: Service[]
  projects: Project[]
  certifications: Certification[]
  testimonials: Testimonial[]
}

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(initialSkillGroups)
  const [services, setServices] = useState<Service[]>(initialServices)
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  const hydrated = useRef(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Stored>
        if (parsed.skillGroups) setSkillGroups(parsed.skillGroups)
        if (parsed.services) setServices(parsed.services)
        if (parsed.projects)
          setProjects(
            parsed.projects.map((project) => ({
              ...project,
              image: project.image ?? '',
              videoUrl: project.videoUrl ?? '',
              externalUrl: project.externalUrl ?? '',
            })),
          )
        if (parsed.certifications)
          setCertifications(
            parsed.certifications.map((cert) => ({ ...cert, image: cert.image ?? '' })),
          )

        if (parsed.testimonials) setTestimonials(parsed.testimonials)
      }
    } catch {
      // ignore malformed storage
    }
    hydrated.current = true
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ skillGroups, services, projects, certifications, testimonials }),
      )
    } catch {
      // ignore quota errors
    }
  }, [skillGroups, services, projects, certifications, testimonials])

  const addSkill = useCallback((groupId: string, skill: string) => {
    setSkillGroups((groups) =>
      groups.map((group) =>
        group.id === groupId && !group.skills.includes(skill)
          ? { ...group, skills: [...group.skills, skill] }
          : group,
      ),
    )
  }, [])

  const updateSkill = useCallback((groupId: string, oldSkill: string, newSkill: string) => {
    setSkillGroups((groups) =>
      groups.map((group) =>
        group.id === groupId
          ? { ...group, skills: group.skills.map((item) => (item === oldSkill ? newSkill : item)) }
          : group,
      ),
    )
  }, [])

  const removeSkill = useCallback((groupId: string, skill: string) => {
    setSkillGroups((groups) =>
      groups.map((group) =>
        group.id === groupId
          ? { ...group, skills: group.skills.filter((item) => item !== skill) }
          : group,
      ),
    )
  }, [])

  const addService = useCallback((service: Omit<Service, 'id'>) => {
    setServices((current) => [...current, { ...service, id: uid() }])
  }, [])
  const updateService = useCallback((id: string, service: Omit<Service, 'id'>) => {
    setServices((current) => current.map((item) => (item.id === id ? { ...service, id } : item)))
  }, [])
  const removeService = useCallback((id: string) => {
    setServices((current) => current.filter((item) => item.id !== id))
  }, [])

  const addProject = useCallback((project: Omit<Project, 'id'>) => {
    setProjects((current) => [{ ...project, id: uid() }, ...current])
  }, [])
  const updateProject = useCallback((id: string, project: Omit<Project, 'id'>) => {
    setProjects((current) => current.map((item) => (item.id === id ? { ...project, id } : item)))
  }, [])
  const removeProject = useCallback((id: string) => {
    setProjects((current) => current.filter((item) => item.id !== id))
  }, [])

  const addCertification = useCallback((certification: Omit<Certification, 'id'>) => {
    setCertifications((current) => [...current, { ...certification, id: uid() }])
  }, [])
  const updateCertification = useCallback((id: string, certification: Omit<Certification, 'id'>) => {
    setCertifications((current) =>
      current.map((item) => (item.id === id ? { ...certification, id } : item)),
    )
  }, [])
  const removeCertification = useCallback((id: string) => {
    setCertifications((current) => current.filter((item) => item.id !== id))
  }, [])

  const addTestimonial = useCallback((testimonial: Omit<Testimonial, 'id'>) => {
    setTestimonials((current) => [{ ...testimonial, id: uid() }, ...current])
  }, [])
  const updateTestimonial = useCallback((id: string, testimonial: Omit<Testimonial, 'id'>) => {
    setTestimonials((current) =>
      current.map((item) => (item.id === id ? { ...testimonial, id } : item)),
    )
  }, [])
  const removeTestimonial = useCallback((id: string) => {
    setTestimonials((current) => current.filter((item) => item.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      skillGroups,
      services,
      projects,
      certifications,
      testimonials,
      addSkill,
      updateSkill,
      removeSkill,
      addService,
      updateService,
      removeService,
      addProject,
      updateProject,
      removeProject,
      addCertification,
      updateCertification,
      removeCertification,
      addTestimonial,
      updateTestimonial,
      removeTestimonial,
    }),
    [
      skillGroups,
      services,
      projects,
      certifications,
      testimonials,
      addSkill,
      updateSkill,
      removeSkill,
      addService,
      updateService,
      removeService,
      addProject,
      updateProject,
      removeProject,
      addCertification,
      updateCertification,
      removeCertification,
      addTestimonial,
      updateTestimonial,
      removeTestimonial,
    ],
  )

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider')
  }
  return context
}
