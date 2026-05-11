import { ArrowDownRight, Camera, Palette, Sparkles } from 'lucide-react'

export function Hero({ onCtaClick }) {
  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(18,21,26,0.96)_0%,rgba(28,31,38,0.9)_44%,rgba(244,214,176,0.24)_100%)] p-6 shadow-elevated sm:p-8 lg:min-h-[580px] lg:p-8">
      <div className="pointer-events-none absolute inset-[-20%] -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(240,191,134,0.35),transparent_24%),radial-gradient(circle_at_78%_18%,rgba(213,236,227,0.24),transparent_20%),radial-gradient(circle_at_52%_84%,rgba(255,255,255,0.13),transparent_18%)] blur-2xl" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:52px_52px] opacity-20 [mask-image:linear-gradient(180deg,rgba(0,0,0,0.95),transparent_92%)]" />

      <div className="pointer-events-none absolute left-[6%] top-[12%] -z-10 h-[220px] w-[220px] rounded-full bg-[rgba(240,191,134,0.18)] blur-3xl" />
      <div className="pointer-events-none absolute right-[4%] top-[6%] -z-10 h-[320px] w-[320px] rounded-full bg-[rgba(213,236,227,0.16)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[10%] right-[24%] -z-10 h-[180px] w-[180px] rounded-full bg-[rgba(255,255,255,0.1)] blur-3xl" />

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            <Sparkles size={16} />
            toneMap
          </div>

          <h1 className="max-w-[11ch] text-[clamp(44px,6vw,80px)] font-semibold leading-[0.92] tracking-[-0.07em] text-text">
            Tu colorimetría, convertida en una lectura elegante y útil.
          </h1>

          <p className="mt-5 max-w-2xl text-[18px] leading-7 text-muted">
            toneMap analiza tu imagen y te devuelve una paleta clara, minimalista y fácil de guardar.
            Menos ruido, más criterio visual.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-text/90">
              <Camera size={16} />
              Una foto
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-text/90">
              <Palette size={16} />
              Paleta personal
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-text/90">
              <Sparkles size={16} />
              Lectura precisa
            </span>
          </div>

          <button
            type="button"
            onClick={onCtaClick}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent via-[#f7dfb7] to-accent-soft px-5 py-4 text-sm font-extrabold tracking-[-0.01em] text-slate-950 shadow-[0_18px_40px_rgba(240,191,134,0.18)] transition-transform hover:-translate-y-0.5"
          >
            Subir mi foto
            <ArrowDownRight size={18} />
          </button>
        </div>

        <div className="relative">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
            <div className="grid gap-4">
              <span className="block rounded-[22px] border border-white/10 bg-[linear-gradient(135deg,rgba(57,77,61,0.92),rgba(27,37,33,0.96))] px-4 py-5 text-sm font-bold tracking-[0.02em] text-text/90">
                Deep Olive
              </span>
              <span className="block rounded-[22px] border border-white/10 bg-[linear-gradient(135deg,rgba(190,149,103,0.86),rgba(122,92,71,0.94))] px-4 py-5 text-sm font-bold tracking-[0.02em] text-text/90">
                Warm Camel
              </span>
              <span className="block rounded-[22px] border border-white/10 bg-[linear-gradient(135deg,rgba(250,242,231,0.98),rgba(223,236,229,0.92))] px-4 py-5 text-sm font-bold tracking-[0.02em] text-slate-900">
                Soft Cream
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted/80">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-center">Dark</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-center">Mid</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-center">Light</span>
          </div>
        </div>
      </div>
    </section>
  )
}
