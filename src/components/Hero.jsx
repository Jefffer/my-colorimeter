import { ArrowDownRight, Camera, Palette, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export function Hero({ onCtaClick }) {
  const rainbowTransition = { duration: 34, repeat: Infinity, ease: 'linear' }

  return (
    <section className="hero-section relative isolate h-screen w-full overflow-hidden">
      {/* Aurora-like animated layers: multiple soft, blurred color blobs that morph and move */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div className="aurora-rainbow-shell">
          {/* Intense rainbow sweep layer - circular, centered, and sized to cover the hero diagonal */}
          <motion.div
            className="aurora-rainbow"
            style={{
              background: 'conic-gradient(from 90deg at 50% 50%, #ff004d, #ff7a00, #ffd500, #4cff00, #00e5ff, #3b4cff, #ff00d7, #ff004d)',
            }}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={rainbowTransition}
          />
        </div>
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

      <div className="flex h-full w-full items-center justify-start">
        <div className="relative z-10 flex w-full flex-col justify-center px-6 py-12 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-5 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-md">
              <div className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-[linear-gradient(135deg,rgba(240,191,134,0.92),rgba(213,236,227,0.84))] text-slate-950 shadow-[0_12px_28px_rgba(240,191,134,0.18)]">
                <Sparkles size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold uppercase tracking-[0.34em] text-accent/95">toneMap</span>
                <span className="text-[12px] font-medium tracking-[0.12em] text-text/70">lectura cromática precisa</span>
              </div>
            </div>

            <h1 className="mt-8 max-w-[11ch] text-[clamp(54px,8vw,96px)] font-semibold leading-[0.9] tracking-tighter text-text drop-shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
              Tu <span className="bg-clip-text text-accent/85">colorimetría</span> convertida en una lectura elegante y útil.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-[1.55] text-text/88 drop-shadow-md">
              <span className="font-semibold text-text">Sube una foto</span> y obtén una paleta clara, minimalista y fácil de guardar. Menos ruido, más criterio visual.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onCtaClick}
                className="group inline-flex items-center gap-3 rounded-full border border-white/12 bg-[linear-gradient(135deg,rgba(240,191,134,0.98),rgba(255,244,227,0.92),rgba(213,236,227,0.92))] px-7 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-950 shadow-[0_20px_45px_rgba(240,191,134,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(240,191,134,0.32)] active:translate-y-0"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-950/10 text-slate-950 transition-transform duration-300 group-hover:rotate-12">
                  <ArrowDownRight size={18} />
                </span>
                Subir mi foto
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
