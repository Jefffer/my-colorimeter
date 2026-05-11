import { ArrowDownRight, Camera, Palette, Sparkles } from 'lucide-react'

export function Hero({ onCtaClick }) {
  return (
    <section className="hero-section relative isolate h-screen w-full overflow-hidden">
      {/* Animated color stripes background - shifts slowly */}
      <div className="pointer-events-none absolute inset-0 -z-20 animate-hero-gradient-shift" style={{
        background: 'linear-gradient(90deg, #3d7d3d 0%, #1b9d9d 15%, #0d5f9f 30%, #001a3d 45%, #c41e3a 60%, #6b1b3f 80%, #ff5a7e 100%)',
        backgroundSize: '200% 100%',
      }} />
      
      {/* Animated accent stripes */}
      <div className="pointer-events-none absolute inset-0 -z-20 animate-hero-overlay-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.12)]" />
      </div>

      {/* Dynamic dark overlay - fixed left, animated right */}
      <div className="pointer-events-none absolute inset-0 -z-10 animate-hero-overlay-shift" style={{
        background: 'linear-gradient(90deg, rgba(12,13,16,0.92) 0%, rgba(12,13,16,0.85) 20%, rgba(12,13,16,0.65) 50%, rgba(12,13,16,0.25) 85%, rgba(12,13,16,0.1) 100%)',
      }} />

      {/* Subtle animated light accents - right side focus */}
      <div className="pointer-events-none absolute inset-0 -z-10 animate-pulse" style={{animationDuration: '18s'}}>
        <div className="absolute right-1/3 top-1/3 h-96 w-96 rounded-full bg-gradient-to-l from-accent/20 to-transparent blur-3xl" />
        <div className="absolute right-0 bottom-1/4 h-80 w-80 rounded-full bg-gradient-to-l from-accent-soft/12 to-transparent blur-3xl" />
      </div>

      <div className="flex h-full w-full items-center justify-start">
        <div className="relative z-10 flex flex-col justify-center px-6 py-12 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-accent backdrop-blur-sm">
              <Sparkles size={16} />
              toneMap
            </div>

            <h1 className="max-w-[14ch] text-[clamp(48px,7vw,88px)] font-bold leading-[0.88] tracking-[-0.08em] text-text drop-shadow-lg">
              Tu colorimetría, convertida en una lectura elegante y útil.
            </h1>

            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-text/95 drop-shadow-md sm:text-lg">
              Sube una foto. Obtén una paleta clara, minimalista y fácil de guardar. Menos ruido, más criterio visual.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-text/95 backdrop-blur-sm transition-all hover:bg-white/15">
                <Camera size={16} />
                Una foto
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-text/95 backdrop-blur-sm transition-all hover:bg-white/15">
                <Palette size={16} />
                Paleta personal
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-text/95 backdrop-blur-sm transition-all hover:bg-white/15">
                <Sparkles size={16} />
                Lectura precisa
              </span>
            </div>

            <button
              type="button"
              onClick={onCtaClick}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent via-[#f7dfb7] to-accent-soft px-6 py-4 text-base font-bold tracking-tight text-slate-950 shadow-[0_20px_40px_rgba(240,191,134,0.24)] transition-all duration-300 hover:shadow-[0_24px_48px_rgba(240,191,134,0.32)] hover:-translate-y-1 active:translate-y-0"
            >
              Subir mi foto
              <ArrowDownRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
