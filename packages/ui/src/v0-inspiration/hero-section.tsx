import { useEffect, useState } from "react"
import { WorkflowVisualization } from "./workflow-visualization"
import { EmailCapture } from "./email-capture"
import { ProgressIndicator } from "./progress-indicator"

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      >
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[var(--accent-coral)] to-[var(--primary-warm)] rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-[var(--primary-warm)] to-[var(--accent-coral)] rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-8 relative z-10">
        {/* Desktop: Exact layout matching original HTML */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-[1.1fr_1fr] gap-16 items-center">
            {/* Left Column: Content */}
            <div className="hero-content">
              <h1 className="font-serif text-[3.5rem] font-bold leading-[1.15] tracking-[-0.03em] mb-6">
                Spune adio întrebării
                <br />
                <span className="bg-gradient-to-r from-[var(--primary-warm)] to-[var(--accent-coral)] bg-clip-text text-transparent">
                  „Ce mâncăm azi?"
                </span>
              </h1>

              <p className="text-[1.2rem] text-[var(--text-secondary)] mb-10 max-w-[550px] leading-relaxed">
                Primește săptămânal un plan de mese inteligent, conceput să elimine efortul și risipa. Descoperă rețete
                creative unde <strong>gătești o singură dată și mănânci de trei ori.</strong>
              </p>

              <div className="grid grid-cols-3 gap-6 mb-10 py-6 border-t border-b border-[var(--border-light)]">
                <div>
                  <span className="font-serif text-[1.75rem] font-semibold text-[var(--primary-warm)] block leading-tight">
                    Până la 5 Ore
                  </span>
                  <span className="text-[0.85rem] text-[var(--text-muted)] mt-1 block">economisite săptămânal</span>
                </div>
                <div>
                  <span className="font-serif text-[1.75rem] font-semibold text-[var(--primary-warm)] block leading-tight">
                    Până la 50%
                  </span>
                  <span className="text-[0.85rem] text-[var(--text-muted)] mt-1 block">risipă alimentară redusă</span>
                </div>
                <div>
                  <span className="font-serif text-[1.75rem] font-semibold text-[var(--primary-warm)] block leading-tight">
                    Până la 400
                  </span>
                  <span className="text-[0.85rem] text-[var(--text-muted)] mt-1 block">RON economisiți lunar</span>
                </div>
              </div>

              <ProgressIndicator />
              <EmailCapture />
            </div>

            {/* Right Column: Workflow Visualization */}
            <div className="relative min-h-[450px] flex justify-center items-center">
              <WorkflowVisualization />
            </div>
          </div>
        </div>

        {/* Mobile & Tablet: More compact stacked layout */}
        <div className="lg:hidden">
          <div className="hero-content text-center mb-6">
            <h1 className="font-serif text-[2.75rem] font-bold leading-tight tracking-tight mb-4">
              Spune adio întrebării
              <br />
              <span className="bg-gradient-to-br from-[var(--primary-warm)] to-[var(--accent-coral)] bg-clip-text text-transparent">
                „Ce mâncăm azi?"
              </span>
            </h1>

            <p className="text-[1.2rem] text-[var(--text-secondary)] mb-6 max-w-[500px] mx-auto leading-relaxed">
              Primește săptămânal un plan de mese inteligent, conceput să elimine efortul și risipa. Descoperă rețete
              creative unde <strong>gătești o singură dată și mănânci de trei ori.</strong>
            </p>

            <div className="grid grid-cols-3 gap-2 mb-6 py-4 border-t border-b border-[var(--border-light)]">
              <div className="text-center">
                <span className="font-serif text-lg font-semibold text-[var(--primary-warm)] block leading-tight">
                  5 Ore
                </span>
                <span className="text-[0.7rem] text-[var(--text-muted)] mt-0.5 block">economisite</span>
              </div>
              <div className="text-center">
                <span className="font-serif text-lg font-semibold text-[var(--primary-warm)] block leading-tight">
                  50%
                </span>
                <span className="text-[0.7rem] text-[var(--text-muted)] mt-0.5 block">mai puțină risipă</span>
              </div>
              <div className="text-center">
                <span className="font-serif text-lg font-semibold text-[var(--primary-warm)] block leading-tight">
                  400 RON
                </span>
                <span className="text-[0.7rem] text-[var(--text-muted)] mt-0.5 block">economisiți</span>
              </div>
            </div>

            <ProgressIndicator />
            <EmailCapture />
          </div>

          <div className="mt-6">
            <WorkflowVisualization />
          </div>
        </div>
      </div>
    </section>
  )
}
