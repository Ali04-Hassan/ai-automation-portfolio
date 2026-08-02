import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AdminProvider } from "@/components/admin-provider";
import { PortfolioProvider } from "@/components/portfolio-provider";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ServicesSection } from "@/components/services-section";
import { SkillsSection } from "@/components/skills-section";
import { ProjectsSection } from "@/components/projects-section";
import { CertificationsSection } from "@/components/certifications-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { ContactSection } from "@/components/contact-section";
import { SiteFooter } from "@/components/site-footer";
import { FloatingBar } from "@/components/floating-bar";
import { CursorTrail } from "@/components/cursor-trail";
import { PerfMode } from "@/components/perf-mode";
import { SideAmbient } from "@/components/side-ambient";
import { InteractivePolish } from "@/components/interactive-polish";


const title = "Ali Hassan — AI Automation Developer | n8n, Voice Agents, RAG";
const description =
  "Ali Hassan builds production-ready AI automation: n8n workflows, Vapi & ElevenLabs voice agents, RAG chatbots, and API integrations that run support, sales, and operations 24/7.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: "Ali Hassan — AI Automation Developer" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <AdminProvider>
      <PortfolioProvider>
        <div className="relative min-h-screen overflow-x-hidden">
          <SideAmbient />
          <SiteHeader />
          <main>
            <HeroSection />
            <AboutSection />
            <ServicesSection />
            <SkillsSection />
            <ProjectsSection />
            <CertificationsSection />
            <TestimonialsSection />
            <ContactSection />
          </main>
          <SiteFooter />
          <FloatingBar />
          <Toaster position="top-center" />
          <CursorTrail />
          <PerfMode />
          <InteractivePolish />
        </div>

      </PortfolioProvider>
    </AdminProvider>
  );
}
