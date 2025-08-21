"use client"

import { useState } from "react"
import { IconShare2, IconX } from "@tabler/icons-react"
import { ShareComponent } from "./share-component"

export function FloatingShare() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Share Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[var(--accent-coral)] text-white p-3 rounded-full shadow-lg hover:bg-[var(--accent-coral-soft)] hover:scale-110 transition-all duration-300 z-40 hover-glow"
        aria-label="Distribuie pagina"
      >
        <IconShare2 size={20} />
      </button>

      {/* Share Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg font-semibold">Distribuie Coquinate</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <IconX size={20} />
              </button>
            </div>

            <ShareComponent />
          </div>
        </div>
      )}
    </>
  )
}
