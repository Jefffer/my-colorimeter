import { useEffect, useRef } from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

export default function Footer({ onVisibleChange }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current || !onVisibleChange) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          onVisibleChange(entry.isIntersecting)
        })
      },
      { root: null, threshold: 0.05 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [onVisibleChange])

  return (
    <footer
      ref={ref}
      className="w-full bg-[linear-gradient(120deg,#0c0d10_0%,#1c1f2a_36%,#2a233c_62%,#132223_100%)] text-text"
    >
      <div className="mx-auto max-w-[1260px] px-6 py-14">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_auto] lg:items-end">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted">Transparencia</span>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">ToneMap trabaja con Gemini, sin guardar tu foto.</h3>
            <p className="mt-4 max-w-2xl text-sm text-muted/90">
              El análisis se genera para ti y no se almacena en ningún servidor. Desarrollo claro, procesos visibles y enfoque en tu privacidad.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.linkedin.com/in/jefffer/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-text transition hover:border-accent/40 hover:bg-white/10"
            >
              <FaLinkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href="https://github.com/Jefffer"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-text transition hover:border-accent/40 hover:bg-white/10"
            >
              <FaGithub className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />

        <div className="mt-6 flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-muted">
          <span>Colorimetria personalizada con tono, contraste y armonia.</span>
          <span>Privacidad primero. Resultados claros. Proceso transparente.</span>
        </div>
      </div>
    </footer>
  )
}
