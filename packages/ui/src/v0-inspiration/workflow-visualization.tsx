import { IconChefHat, IconFileText, IconStack2, IconArrowDown } from "@tabler/icons-react"

export function WorkflowVisualization() {
  return (
    <div className="relative w-full">
      <div className="block lg:hidden">
        <div className="text-center mb-4">
          <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)] mb-1">Cum funcționează?</h3>
          <p className="text-xs text-[var(--text-muted)]">Un singur efort, trei mese delicioase</p>
        </div>

        <div className="relative max-w-[280px] mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[var(--accent-coral)] via-[var(--primary-warm)] to-[var(--accent-coral)] opacity-30"></div>

          {/* Step 1 */}
          <div className="relative flex items-center mb-3">
            <div className="w-1/2 pr-2 text-right">
              <div className="bg-[var(--surface-white)] border border-[var(--border-light)] rounded-lg p-2 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-end gap-1.5 mb-0.5">
                  <span className="font-serif font-semibold text-xs">Gătești Duminică</span>
                  <div className="bg-[var(--accent-coral-soft)] rounded-md w-6 h-6 flex items-center justify-center">
                    <IconChefHat size={12} className="text-[var(--accent-coral)]" />
                  </div>
                </div>
                <p className="text-[0.65rem] text-[var(--text-muted)] text-right">Prepari o masă principală</p>
              </div>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-[var(--accent-coral)] rounded-full border-2 border-white shadow-sm z-10"></div>
            <div className="w-1/2 pl-2"></div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center mb-2">
            <div className="bg-[var(--surface-eggshell)] rounded-full p-1">
              <IconArrowDown size={12} className="text-[var(--primary-warm)]" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex items-center mb-3">
            <div className="w-1/2 pr-2"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-[var(--primary-warm)] rounded-full border-2 border-white shadow-sm z-10"></div>
            <div className="w-1/2 pl-2">
              <div className="bg-[var(--surface-white)] border border-[var(--border-light)] rounded-lg p-2 shadow-[var(--shadow-soft)]">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="bg-[var(--accent-coral-soft)] rounded-md w-6 h-6 flex items-center justify-center">
                    <IconFileText size={12} className="text-[var(--accent-coral)]" />
                  </div>
                  <span className="font-serif font-semibold text-xs">Refolosești Luni</span>
                </div>
                <p className="text-[0.65rem] text-[var(--text-muted)]">Transformi într-un prânz rapid</p>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center mb-2">
            <div className="bg-[var(--surface-eggshell)] rounded-full p-1">
              <IconArrowDown size={12} className="text-[var(--primary-warm)]" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex items-center">
            <div className="w-1/2 pr-2 text-right">
              <div className="bg-[var(--surface-white)] border border-[var(--border-light)] rounded-lg p-2 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-end gap-1.5 mb-0.5">
                  <span className="font-serif font-semibold text-xs">Reinvenezi Marți</span>
                  <div className="bg-[var(--accent-coral-soft)] rounded-md w-6 h-6 flex items-center justify-center">
                    <IconStack2 size={12} className="text-[var(--accent-coral)]" />
                  </div>
                </div>
                <p className="text-[0.65rem] text-[var(--text-muted)] text-right">Creezi o cină nouă</p>
              </div>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-[var(--accent-coral)] rounded-full border-2 border-white shadow-sm z-10"></div>
            <div className="w-1/2 pl-2"></div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative w-full h-[450px]">
        <svg
          className="absolute top-0 left-0 w-full h-full z-0"
          viewBox="0 0 300 300"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M 110 40 C 40 100, 40 150, 85 175 C 130 200, 180 240, 210 280"
            stroke="var(--border-light)"
            fill="transparent"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </svg>

        <div className="absolute top-0 left-[20%] bg-[var(--surface-white)] border border-[var(--border-light)] rounded-xl p-4 shadow-[var(--shadow-soft)] w-[220px] z-10 hover-lift hover-glow group cursor-pointer animate-breathing workflow-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[var(--accent-coral-soft)] rounded-lg w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <IconChefHat size={20} className="text-[var(--accent-coral)]" />
            </div>
            <span className="font-serif font-semibold text-base">Gătești Duminică</span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">Prepari o masă principală.</p>
        </div>

        <div
          className="absolute top-[45%] left-0 bg-[var(--surface-white)] border border-[var(--border-light)] rounded-xl p-4 shadow-[var(--shadow-soft)] w-[220px] z-10 hover-lift hover-glow group cursor-pointer animate-breathing workflow-card"
          style={{ animationDelay: "1s" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[var(--accent-coral-soft)] rounded-lg w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <IconFileText size={20} className="text-[var(--accent-coral)]" />
            </div>
            <span className="font-serif font-semibold text-base">Refolosești Luni</span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">Transformi într-un prânz rapid.</p>
        </div>

        <div
          className="absolute top-[80%] left-[40%] bg-[var(--surface-white)] border border-[var(--border-light)] rounded-xl p-4 shadow-[var(--shadow-soft)] w-[220px] z-10 hover-lift hover-glow group cursor-pointer animate-breathing workflow-card"
          style={{ animationDelay: "2s" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[var(--accent-coral-soft)] rounded-lg w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <IconStack2 size={20} className="text-[var(--accent-coral)]" />
            </div>
            <span className="font-serif font-semibold text-base">Reinvenezi Marți</span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">Creezi o cină nouă.</p>
        </div>
      </div>
    </div>
  )
}
