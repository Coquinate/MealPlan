'use client';

import { MorphingBlobs, KitchenSteam, FloatingFoodParticles } from '@coquinate/ui';

export default function TestBlobsPage() {
  return (
    <div className="min-h-screen relative">
      {/* Hero variant */}
      <section className="relative h-screen">
        <MorphingBlobs variant="hero" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">
              Hero Variant
            </h1>
            <p className="text-xl text-gray-600">
              Animație de fundal cu morphing blobs
            </p>
          </div>
        </div>
      </section>

      {/* Subtle variant */}
      <section className="relative h-screen bg-gray-50">
        <MorphingBlobs variant="subtle" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">
              Subtle Variant
            </h1>
            <p className="text-xl text-gray-600">
              Versiune mai subtilă pentru secțiuni secundare
            </p>
          </div>
        </div>
      </section>

      {/* Vibrant variant */}
      <section className="relative h-screen bg-white">
        <MorphingBlobs variant="vibrant" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">
              Vibrant Variant
            </h1>
            <p className="text-xl text-gray-600">
              Culori mai intense pentru CTA sections
            </p>
          </div>
        </div>
      </section>

      {/* Test Floating Particles - Subtle */}
      <section className="relative h-screen bg-gradient-to-b from-green-50 to-white">
        <FloatingFoodParticles variant="subtle" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">
              Particule Subtile
            </h1>
            <p className="text-xl text-gray-600">
              Legume care plutesc delicat în fundal
            </p>
          </div>
        </div>
      </section>

      {/* Test Floating Particles - Medium */}
      <section className="relative h-screen bg-gradient-to-b from-orange-50 to-yellow-50">
        <FloatingFoodParticles variant="medium" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">
              Particule Medium
            </h1>
            <p className="text-xl text-gray-600">
              Mâncăruri tradiționale care dansează
            </p>
          </div>
        </div>
      </section>

      {/* Test Floating Particles - Vibrant */}
      <section className="relative h-screen bg-gradient-to-b from-pink-50 to-orange-50">
        <FloatingFoodParticles variant="vibrant" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">
              Particule Vibrante
            </h1>
            <p className="text-xl text-gray-600">
              Festival de emoji-uri culinare
            </p>
          </div>
        </div>
      </section>

      {/* Test cu conținut real */}
      <section className="relative min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
        <MorphingBlobs variant="hero" className="opacity-30" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">
            Planifică-ți mesele inteligent
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">🥗 Rețete Personalizate</h3>
              <p className="text-gray-600">
                Descoperă rețete adaptate preferințelor și nevoilor tale nutriționale
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">📅 Planificare Săptămânală</h3>
              <p className="text-gray-600">
                Organizează-ți mesele pentru întreaga săptămână cu doar câteva click-uri
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">🛒 Listă de Cumpărături</h3>
              <p className="text-gray-600">
                Generează automat lista de ingrediente necesare pentru rețetele tale
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}