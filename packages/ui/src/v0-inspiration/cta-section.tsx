"use client"

import { FloatingParticles } from "./floating-particles"

export function CTASection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[var(--primary-warm)] to-[var(--accent-coral)] text-white text-center relative overflow-hidden">
      <FloatingParticles />

      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-tight leading-tight">
          Gata să transformi haosul din bucătărie în armonie?
        </h2>
        <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 opacity-95 max-w-2xl mx-auto leading-relaxed">
          Înscrie-te acum pe lista de așteptare. Locurile pentru acces beta sunt limitate!
        </p>
        <a
          href="#"
          className="inline-block bg-white text-[var(--primary-warm)] py-3 sm:py-4 px-8 sm:px-12 rounded-lg font-bold text-base sm:text-lg border-none cursor-pointer no-underline transition-all duration-300 shadow-[var(--shadow-soft)] hover:transform hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:shadow-white/20 min-h-[48px] flex items-center justify-center relative overflow-hidden group cta-glow-button"
        >
          <span className="relative z-10">Prinde oferta!</span>
          {/* Glow effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </a>
      </div>
    </section>
  )
}
