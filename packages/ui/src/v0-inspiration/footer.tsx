"use client"

import { useState } from "react"
import { IconBrandFacebook, IconBrandInstagram, IconBrandTwitter, IconMail, IconHeart } from "@tabler/icons-react"

export function Footer() {
  const [easterEggClicks, setEasterEggClicks] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)

  const handleLogoClick = () => {
    const newClicks = easterEggClicks + 1
    setEasterEggClicks(newClicks)

    if (newClicks === 5) {
      setShowEasterEgg(true)
      setTimeout(() => {
        setShowEasterEgg(false)
        setEasterEggClicks(0)
      }, 3000)
    }
  }

  const socialLinks = [
    { icon: IconBrandFacebook, href: "#", label: "Facebook", color: "hover:text-blue-400" },
    { icon: IconBrandInstagram, href: "#", label: "Instagram", color: "hover:text-pink-400" },
    { icon: IconBrandTwitter, href: "#", label: "Twitter", color: "hover:text-sky-400" },
    { icon: IconMail, href: "mailto:contact@coquinate.ro", label: "Email", color: "hover:text-green-400" },
  ]

  return (
    <footer className="bg-[var(--dark-surface)] text-[var(--text-light)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
      {showEasterEgg && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-coral)] via-[var(--primary-warm)] to-[var(--accent-coral)] opacity-20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl animate-bounce">
            🍳✨🥘
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        <div
          onClick={handleLogoClick}
          className={`font-serif text-xl sm:text-2xl font-bold text-[var(--primary-warm)] mb-3 sm:mb-4 opacity-80 cursor-pointer transition-all duration-300 hover:opacity-100 hover:scale-105 select-none ${
            showEasterEgg ? "animate-bounce text-[var(--accent-coral)]" : ""
          }`}
        >
          Coquinate
          {showEasterEgg && (
            <div className="text-xs mt-1 text-[var(--accent-coral)] animate-fade-in-up">
              Mulțumim că ne iubești! <IconHeart size={12} className="inline animate-pulse" />
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 mb-4 sm:mb-6">
          {socialLinks.map((social, index) => (
            <a
              key={social.label}
              href={social.href}
              className={`p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/20 hover:transform hover:-translate-y-1 ${social.color} group`}
              title={social.label}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <social.icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
            </a>
          ))}
        </div>

        <p className="opacity-70 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
          © 2025 Coquinate. Dezvoltat cu pasiune pentru familiile din România.
        </p>

        <div className="mt-3 sm:mt-4">
          <a
            href="/politica-de-confidentialitate.html"
            target="_blank"
            className="text-[var(--text-light)] opacity-70 no-underline text-xs sm:text-sm hover:opacity-100 transition-all duration-200 py-2 px-1 inline-block hover:text-[var(--accent-coral)]"
            rel="noreferrer"
          >
            Politică de Confidențialitate
          </a>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs opacity-50">
            Făcut cu <IconHeart size={12} className="inline text-[var(--accent-coral)] animate-pulse" /> în România
          </p>
        </div>
      </div>
    </footer>
  )
}
