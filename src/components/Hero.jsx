import { ArrowDownRight, Camera, Palette, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export function Hero({ onCtaClick }) {
  const rainbowTransition = { duration: 34, repeat: Infinity, ease: 'linear' }

  return (
    <section className="hero-section relative isolate h-screen w-full overflow-hidden">
      {/* Aurora-like animated layers: multiple soft, blurred color blobs that morph and move */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        {/* Intense rainbow sweep layer - full hero coverage with clockwise rotation only */}
        <motion.div
          className="aurora-rainbow"
          style={{
            background: 'linear-gradient(120deg, #ff004d 0%, #ff7a00 14%, #ffd500 28%, #4cff00 42%, #00e5ff 58%, #3b4cff 72%, #ff00d7 86%, #ff004d 100%)',
          }}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={rainbowTransition}
        />
        <motion.div
          className="aurora-layer aurora-1"
          style={{ background: 'radial-gradient(40% 60% at 20% 30%, rgba(255,90,140,0.55) 0%, rgba(255,90,140,0.12) 35%, transparent 65%)' }}
          initial={{ opacity: 0.65 }}
          animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -2, 0], opacity: [0.65, 0.75, 0.68] }}
          transition={{ duration: 34, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />

        <motion.div
          className="aurora-layer aurora-2"
          style={{ background: 'radial-gradient(50% 70% at 70% 40%, rgba(80,200,220,0.5) 0%, rgba(80,200,220,0.08) 40%, transparent 70%)' }}
          initial={{ opacity: 0.58 }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, -4, 3, 0], opacity: [0.58, 0.72, 0.62] }}
          transition={{ duration: 38, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />

        <motion.div
          className="aurora-layer aurora-3"
          style={{ background: 'radial-gradient(60% 50% at 50% 70%, rgba(160,120,255,0.45) 0%, rgba(160,120,255,0.08) 45%, transparent 75%)' }}
          initial={{ opacity: 0.48 }}
          animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -3, 0], opacity: [0.48, 0.66, 0.52] }}
          transition={{ duration: 42, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />

        <motion.div
          className="aurora-layer aurora-4"
          style={{ background: 'radial-gradient(50% 60% at 30% 80%, rgba(255,200,120,0.45) 0%, rgba(255,200,120,0.06) 40%, transparent 75%)' }}
          initial={{ opacity: 0.42 }}
          animate={{ scale: [1, 1.06, 1], rotate: [0, -3, 4, 0], opacity: [0.42, 0.58, 0.46] }}
          transition={{ duration: 36, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />

        <motion.div
          className="aurora-layer aurora-5"
          style={{ background: 'radial-gradient(40% 50% at 80% 20%, rgba(100,255,180,0.45) 0%, rgba(100,255,180,0.06) 40%, transparent 75%)' }}
          initial={{ opacity: 0.46 }}
          animate={{ scale: [1, 1.06, 1], rotate: [0, 3, -2, 0], opacity: [0.46, 0.62, 0.5] }}
          transition={{ duration: 40, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
      </div>

      {/* Dynamic dark overlay - fixed left, animated right */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(90deg, rgba(12,13,16,0.92) 0%, rgba(12,13,16,0.85) 20%, rgba(12,13,16,0.65) 50%, rgba(12,13,16,0.25) 85%, rgba(12,13,16,0.1) 100%)',
        }}
      />

      {/* (Removed subtle light 'circles' to keep background purely color-based) */}

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
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-accent via-[#f7dfb7] to-accent-soft px-6 py-4 text-base font-bold tracking-tight text-slate-950 shadow-[0_20px_40px_rgba(240,191,134,0.24)] transition-all duration-300 hover:shadow-[0_24px_48px_rgba(240,191,134,0.32)] hover:-translate-y-1 active:translate-y-0"
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
