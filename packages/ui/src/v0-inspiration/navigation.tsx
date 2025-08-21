"use client"

import { useState } from "react"
import { ScrollProgress } from "./scroll-progress"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white/70 backdrop-blur-xl py-2 md:py-3 border-b border-white/30 shadow-lg shadow-black/5 sticky top-0 z-50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <a
          href="#"
          className="font-serif text-2xl sm:text-3xl font-bold text-[var(--primary-warm)] no-underline tracking-tight transition-all duration-300 hover:scale-105 hover:text-[var(--accent-coral)] cursor-pointer group"
        >
          <span className="inline-block transition-transform duration-300 group-hover:rotate-3">Coquinate</span>
        </a>

        <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-[var(--surface-eggshell)] rounded-full text-sm text-[var(--text-secondary)] transition-all duration-300 hover:bg-white/80 hover:shadow-md cursor-pointer">
          <span className="w-2 h-2 bg-[var(--accent-coral)] rounded-full animate-subtle-pulse"></span>
          <span className="transition-colors duration-300 hover:text-[var(--text-primary)]">347/500 înscriși</span>
        </div>

        <div className="flex sm:hidden items-center gap-2 px-3 py-1.5 bg-[var(--surface-eggshell)] rounded-full text-xs text-[var(--text-secondary)] transition-all duration-300 hover:bg-white/80 hover:shadow-md cursor-pointer">
          <span className="w-1.5 h-1.5 bg-[var(--accent-coral)] rounded-full animate-subtle-pulse"></span>
          <span className="transition-colors duration-300 hover:text-[var(--text-primary)]">347/500</span>
        </div>
      </div>

      <ScrollProgress />
    </nav>
  )
}
