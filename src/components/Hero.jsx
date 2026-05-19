import { ArrowDownRight } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
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
          <p className="absolute left-1/2 top-1 -translate-x-1/2 text-center text-sm md:text-base font-light uppercase tracking-[0.42em] text-text/68 sm:top-5 md:top-10">
            Introducing ToneMap by{' '}
            <a
              href="https://github.com/Jefffer/my-colorimeter"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-accent/82 transition-colors hover:text-accent/95"
            >
              <FaGithub size={12} className="shrink-0" />
              Jefffer
            </a>
          </p>

          <div className="max-w-3xl pt-12 sm:pt-14">

            <h1 className="mt-5 max-w-[12ch] text-[clamp(40px,6vw,74px)] font-semibold leading-[0.92] tracking-tight text-text/92 drop-shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
              <span className="text-accent/95">ToneMap</span> analiza tu foto y traduce tu colorimetria en una guia clara para vestir y combinar mejor
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-[1.55] text-text/88 drop-shadow-md">
              Detecta subtono, contraste y armonia personal en segundos
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onCtaClick}
                className="group inline-flex items-center gap-3 rounded-full border border-white/12 bg-[linear-gradient(135deg,rgba(240,191,134,0.98),rgba(255,244,227,0.92),rgba(213,236,227,0.92))] px-7 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-950 shadow-[0_20px_45px_rgba(240,191,134,0.25)] transition-all duration-300 hover:shadow-[0_28px_60px_rgba(240,191,134,0.32)]"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-950/10 text-slate-950 transition-transform duration-300 group-hover:rotate-45">
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
