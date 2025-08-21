import { IconMapPin, IconClipboardCheck, IconCircleCheck, IconChefHat } from "@tabler/icons-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function FeaturesSection() {
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation(0.1)

  const features = [
    {
      icon: IconMapPin,
      title: "Gătești cu Ingrediente Locale",
      description:
        "Folosim doar ingrediente comune, ușor de găsit în orice magazin din România. Gătitul devine simplu și fără stres.",
    },
    {
      icon: IconClipboardCheck,
      title: "Listă de Cumpărături Interactivă",
      description:
        "Primești o listă optimizată, organizată pe categorii. Ai nevoie de mai puțin? Modifici cifrele direct în listă.",
    },
    {
      icon: IconCircleCheck,
      title: "Zero Risipă, Zero Stres",
      description:
        "Fiecare ingredient este folosit la maximum. Planul este special gândit pentru a refolosi creativ orice surplus.",
    },
    {
      icon: IconChefHat,
      title: "Fă cunoștință cu Chef AI",
      description:
        "Acum ai propriul tău asistent bucătar, Chef AI! Poartă o conversație naturală, în limba română, pentru a te ghida.",
    },
  ]

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[var(--dark-surface)] text-[var(--text-light)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={featuresRef}
          className={`text-center mb-12 sm:mb-16 transition-all duration-800 ${
            featuresVisible ? "animate-fade-in-up opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-[var(--text-light)]">
            Tot ce ai nevoie, într-un singur loc
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-[var(--dark-surface-raised)] p-4 sm:p-6 md:p-8 rounded-xl border border-[oklch(25%_0.01_200)] hover-lift hover-glow transition-all duration-800 ${
                featuresVisible ? "animate-fade-in-up opacity-100" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-center md:text-left">
                <div className="mb-4 md:mb-6 flex justify-center md:justify-start">
                  <div className="bg-[var(--accent-coral-soft)]/10 p-3 rounded-full">
                    <feature.icon size={28} className="text-[var(--accent-coral-soft)]" />
                  </div>
                </div>
                <h3 className="font-serif text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="opacity-80 text-sm sm:text-base leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
