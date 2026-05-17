import { useRef, useState, useEffect } from 'react'
// import { Analytics } from "@vercel/analytics/next"
import { FiUploadCloud, FiInfo, FiAlertTriangle, FiArrowRight, FiLoader, FiRefreshCcw } from 'react-icons/fi'
import { RiContrastDrop2Line, RiVipCrown2Line, RiScissors2Line } from 'react-icons/ri'
import { HiOutlineSparkles } from 'react-icons/hi2'

import { Hero } from './components/Hero'
import { LoadingOverlay } from './components/LoadingOverlay'
import Footer from './components/Footer'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import DownloadPdfButton from './components/pdf/DownloadPdfButton'
import { mockGeminiResponse } from './mockGeminiResponse'

const fallbackReport = {
  season: 'Tu lectura ToneMap',
  undertone: 'Cálido',
  contrast_level: 'Medio-Alto',
  summary: 'ToneMap devuelve una guía limpia y accionable para tu colorimetría. Descubre qué tonos iluminan tu rostro y cuáles debes evitar.',
  why_this_works:
    'La lectura se centra en equilibrar contraste, calidez y presencia visual para que tus colores funcionen en conjunto. Resalta tus facciones de forma natural.',
  best_metals: {
    primary: 'Oro Rosa o Dorado',
    reason: 'Armoniza con la calidez de tu piel sin saturarla.'
  },
  makeup_tips: {
    lipstick: 'Coral suave o melocotón',
    blush: 'Tonos tierra cálidos y ligeros'
  },
  hair_color_advice: 'Reflejos caramelo o cobrizos aportarán muchísima luz natural a tu rostro.',
  best_options: [
    { name: 'Marfil', hex: '#F3E7D7', reason: 'Base suave que ilumina sin endurecer.' },
    { name: 'Terracota', hex: '#B86A4B', reason: 'Acento cálido con mucha presencia.' },
    { name: 'Oliva ahumado', hex: '#7E8661', reason: 'Color interesantemente interesante. Equilibrio natural para looks sobrios.' },
    { name: 'Cacao', hex: '#4A342D', reason: 'Profundidad elegante y estable.' },
    { name: 'Mostaza', hex: '#D4A373', reason: 'Aporta energía y resalta tus facciones.' },
    { name: 'Rojo Ladrillo', hex: '#9C3D38', reason: 'Poderoso y vibrante para destacar.' },
  ],
  neutral_options: [
    { name: 'Beige arena', hex: '#D8C7B0', reason: 'Base limpia y versátil.' },
    { name: 'Topo suave', hex: '#9A8578', reason: 'Mantiene armonía sin apagar.' },
    { name: 'Café latte', hex: '#B59B84', reason: 'Aporta calidez ligera.' },
    { name: 'Gris cálido', hex: '#8E8B87', reason: 'Neutro estable para combinar.' },
  ],
  avoid_options: [
    { name: 'Neones fríos', hex: '#8AA7C5', reason: 'Compiten con tu piel.' },
    { name: 'Blancos puros', hex: '#F8F8F8', reason: 'Su dureza se ve artificial.' },
    { name: 'Negros duros', hex: '#222222', reason: 'Demasiado severos para ti.' },
  ],
}

const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const allowedImageExtensions = new Set(['jpg', 'jpeg', 'png', 'webp'])
const maxImageSizeBytes = 5 * 1024 * 1024

function safeJsonParse(input) {
  try { return JSON.parse(input) } catch { return null }
}

function normalizeApiReport(payload, rawResponse) {
  const report = payload?.report || payload?.analysis
  if (report) return report
  const parsedRaw = safeJsonParse(rawResponse)
  return parsedRaw || null
}

function getReportData(analysis) {
  return analysis || fallbackReport
}

function getFileExtension(fileName) {
  return fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : ''
}

function getFileValidationError(file) {
  if (!file) return ''
  const extension = getFileExtension(file.name)
  const hasAllowedType = allowedImageTypes.has(file.type)
  const hasAllowedExtension = allowedImageExtensions.has(extension)

  if (!hasAllowedType && !hasAllowedExtension) {
    return 'Formato no válido. Sube una imagen JPG, JPEG, PNG o WebP.'
  }
  if (file.size > maxImageSizeBytes) {
    return 'La imagen pesa demasiado. Usa un archivo de hasta 5 MB para un análisis más rápido.'
  }
  return ''
}

// --- SUBCOMPONENTES DE DISEÑO EDITORIAL ---

function SectionDivider() {
  return (
    <div className="my-10 flex items-center justify-center gap-4 opacity-40">
      <div className="h-px w-16 md:w-24 bg-linear-to-r from-transparent to-white/30" />
      <div className="h-1.5 w-1.5 rotate-45 border border-white/50" />
      <div className="h-px w-16 md:w-24 bg-linear-to-l from-transparent to-white/30" />
    </div>
  )
}

function InsightCard({ icon: Icon, title, value, description }) {
  return (
    <div className="flex flex-col gap-3 rounded-[20px] border border-white/5 bg-white/[0.015] p-5 transition-colors hover:bg-white/[0.03]">
      <div className="flex items-center gap-3">
        <div className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70">
          <Icon size={16} />
        </div>
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/50">{title}</span>
      </div>
      <div>
        <strong className="block text-sm md:text-base font-medium tracking-wide text-white/90">{value}</strong>
        {description && <p className="mt-1.5 text-[11px] md:text-xs leading-relaxed text-white/50 font-light">{description}</p>}
      </div>
    </div>
  )
}

function ColorList({ title, subtitle, items, accentClass }) {
  return (
    <div className="px-1">
      <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-4">
        <div>
          <h4 className="text-lg md:text-[22px] font-light tracking-wide text-white/90">{title}</h4>
          <p className="mt-1 text-[11px] md:text-sm text-white/50 font-light tracking-wide">{subtitle}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] ${accentClass}`}>
          {items.length}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
        {items.map((item) => (
          <article
            key={`${item.name}-${item.hex}`}
            className="group overflow-hidden rounded-[16px] md:rounded-[20px] border border-white/10 bg-white/[0.02] shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]"
          >
            <div className="relative h-16 md:h-24 w-full overflow-hidden" style={{ backgroundColor: item.hex }}>
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,transparent_50%,rgba(0,0,0,0.2)_100%)] mix-blend-overlay" />
            </div>
            <div className="space-y-2 p-4 md:p-5">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-1 xl:gap-2">
                <strong className="block text-[13px] md:text-[14px] font-medium tracking-wide text-white/90 truncate">{item.name}</strong>
                <span className="self-start xl:self-auto text-[9px] md:text-[10px] font-mono tracking-[0.15em] text-white/50 bg-white/5 px-2 py-0.5 rounded-md uppercase">
                  {item.hex}
                </span>
              </div>
              <p className="text-[11px] md:text-xs leading-relaxed text-white/50 font-light">{item.reason}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function AlertModal({ title, message, onAccept }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Cerrar alerta"
        className="absolute inset-0 cursor-default bg-[#0A0B0E]/80 backdrop-blur-md"
        onClick={(event) => event.preventDefault()}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,17,21,0.98),rgba(22,25,34,0.96))] p-5 md:p-6 shadow-elevated"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(240,191,134,0.8),transparent)]" />
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="rounded-2xl border border-rose-400/15 bg-rose-400/10 p-3 text-rose-300 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] self-start">
            <FiAlertTriangle size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.24em] text-muted">Alerta de carga</span>
            <h2 className="mt-2 text-xl md:text-[22px] font-medium tracking-wide text-text">{title}</h2>
            <p className="mt-2 md:mt-3 text-sm leading-relaxed text-white/60 font-light">{message}</p>
            <div className="mt-5 md:mt-6 flex justify-end">
              <button
                type="button"
                onClick={onAccept}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-linear-to-r from-accent via-[#f7dfb7] to-accent-soft px-5 py-3 text-sm font-bold text-slate-950 transition-transform hover:-translate-y-0.5"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [showMakeup, setShowMakeup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fileAlert, setFileAlert] = useState(null)
  const fileInputRef = useRef(null)
  const uploadSectionRef = useRef(null)
  const isProcessing = useRef(false)

  const report = getReportData(analysis)
  const [, setFooterVisible] = useState(false)
  const [stickyTopOffset, setStickyTopOffset] = useState(24)

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return
      const uploadSection = uploadSectionRef.current
      const footer = document.querySelector('footer')
      
      if (!uploadSection || !footer) {
        setStickyTopOffset(24)
        return
      }

      const uploadRect = uploadSection.getBoundingClientRect()
      const footerRect = footer.getBoundingClientRect()
      const uploadHeight = uploadRect.height
      const spaceToFooter = footerRect.top - uploadRect.top
      
      if (spaceToFooter < uploadHeight) {
        const offset = Math.max(24, uploadHeight - spaceToFooter + 24)
        setStickyTopOffset(offset)
      } else {
        setStickyTopOffset(24)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const openFilePicker = () => fileInputRef.current?.click()
  const scrollToUpload = () => uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const handleFileSelect = async (event) => {
    const [file] = event.target.files || []
    if (!file) return

    const validationError = getFileValidationError(file)
    if (validationError) {
      setFileAlert({ title: 'Formato no válido', message: validationError })
      setError('')
      setSelectedFile(null)
      setPreviewUrl('')
      setAnalysis(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    const nextPreviewUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('No se pudo leer la imagen'))
      reader.readAsDataURL(file)
    })

    setPreviewUrl(nextPreviewUrl)
    setSelectedFile(file)
    setError('')
    setAnalysis(null)
  }

  const handleClear = () => {
    setSelectedFile(null)
    setPreviewUrl('')
    setAnalysis(null)
    setError('')
    setFileAlert(null)
    isProcessing.current = false
    setIsLoading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const loadMockData = () => {
    if (!previewUrl) {
      setError('Sube una imagen primero para cargar los datos de prueba')
      return
    }
    setIsLoading(true)
    setError('')
    setTimeout(() => {
      setAnalysis(fallbackReport)
      setIsLoading(false)
    }, 1200)
  }

  const handleGenerate = async (event) => {
    event.preventDefault()
    if (isLoading || isProcessing.current) return

    isProcessing.current = true
    setIsLoading(true)
    setError('')

    try {
      let imageForRequest = previewUrl
      if (!imageForRequest && selectedFile) {
        imageForRequest = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = () => reject(new Error('No se pudo leer la imagen'))
          reader.readAsDataURL(selectedFile)
        })
      }

      if (!imageForRequest) {
        setError('Debes seleccionar una imagen antes de generar el reporte')
        return
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageForRequest,
          mimeType: selectedFile?.type || 'image/jpeg',
          fileName: selectedFile?.name || 'restored-image',
        }),
      })

      let payload = {}
      try { payload = await response.json() } catch {
        setError('Respuesta inválida del servidor')
        return
      }

      const normalized = normalizeApiReport(payload, payload?.rawResponse || '')
      if (!normalized) {
        setError('No fue posible interpretar la respuesta.')
        return
      }

      if (normalized?.validity && normalized.validity.analyzable === false) {
        setFileAlert({ title: 'No se pudo analizar', message: normalized.validity.reason || 'Imagen no adecuada.' })
        return
      }

      setAnalysis(normalized)
    } catch (requestError) {
      setError(requestError.message || 'Hubo un problema al generar el reporte')
    } finally {
      setIsLoading(false)
      isProcessing.current = false
    }
  }

  return (
    <main className="text-text">
      {fileAlert && <AlertModal title={fileAlert.title} message={fileAlert.message} onAccept={() => setFileAlert(null)} />}

      <LoadingOverlay
        isVisible={isLoading}
        message="Analizando tu imagen..."
        submessage="ToneMap está procesando tu imagen para descubrir tu colorimetría."
      />

      <Hero onCtaClick={scrollToUpload} />

      <div className="min-h-screen bg-[#0A0B0E]">
        <div className="mx-auto flex w-full max-w-[1260px] flex-col gap-6 px-0 py-6 font-sans sm:px-4 md:px-6 lg:py-8">

          <section className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)]">
            
            {/* PANEL IZQUIERDO: SUBIDA */}
            <article
              ref={uploadSectionRef}
              className="scroll-mt-6 rounded-[28px] border border-white/5 bg-surface/60 p-4 sm:p-6 shadow-elevated backdrop-blur-2xl lg:sticky lg:self-start z-10"
              style={{ top: `${stickyTopOffset}px` }}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-accent/80">Paso 1</span>
                  <h2 className="mt-1 md:mt-2 text-xl md:text-[22px] font-light tracking-wide text-white/90">Sube tu foto</h2>
                </div>
                <Tippy content={<span className="text-sm">Usa una foto frontal, bien iluminada y sin filtros fuertes.</span>} delay={[120, 40]} placement="bottom">
                  <button type="button" aria-label="Tips" className="inline-flex items-center justify-center rounded-full bg-white/5 p-2 text-white/50 hover:bg-white/10 transition-colors">
                    <FiInfo size={16} />
                  </button>
                </Tippy>
              </div>

              <input ref={fileInputRef} className="sr-only" type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleFileSelect} />

              <button
                type="button"
                onClick={openFilePicker}
                className="group aspect-[3/4] md:aspect-[4/5] w-full overflow-hidden rounded-[20px] md:rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] p-0 text-left transition-colors hover:border-accent/40 hover:bg-white/[0.04]"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Vista previa" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center gap-2 p-6 text-center">
                    <FiUploadCloud size={32} className="text-white/30" />
                    <strong className="text-lg font-medium text-white/70">Selecciona una imagen</strong>
                    <span className="max-w-[200px] text-xs leading-5 text-white/40 font-light">Formatos JPG, PNG o WebP. Máximo 5MB.</span>
                  </div>
                )}
              </button>

              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!previewUrl || isLoading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-accent via-[#f7dfb7] to-accent-soft px-5 py-3.5 md:py-4 text-sm md:text-base font-bold text-slate-950 shadow-[0_16px_36px_rgba(240,191,134,0.16)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {!isLoading ? <><FiLoader size={18} className="hidden" /> Analizar colorimetría <FiArrowRight size={18} /></> : <><FiLoader size={18} className="animate-spin" /> Analizando...</>}
                </button>

                <button
                  type="button"
                  onClick={loadMockData}
                  disabled={!previewUrl || isLoading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-accent/30 bg-accent/5 px-5 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Probar con datos Demo
                </button>

                <div className="mt-3">
                  <label htmlFor="show-makeup" className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      id="show-makeup"
                      type="checkbox"
                      className="sr-only"
                      checked={showMakeup}
                      onChange={(e) => setShowMakeup(e.target.checked)}
                    />
                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${showMakeup ? 'bg-accent' : 'bg-white/10'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${showMakeup ? 'translate-x-6' : 'translate-x-1'}`} />
                    </div>
                    <span className="text-sm font-medium text-white/80">Mostrar recomendaciones de maquillaje</span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-[16px] border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  <div className="flex items-start gap-3">
                    <FiAlertTriangle size={16} className="mt-0.5 text-rose-400 shrink-0" />
                    <p className="leading-5 font-light">{error}</p>
                  </div>
                </div>
              )}
            </article>

            {/* PANEL DERECHO: RESULTADOS */}
            <div className="flex flex-col gap-6 md:gap-8">
              
              {analysis ? (
                <>
                  {/* PASO 2: HEADER E INSIGHTS */}
                  <article className="rounded-[28px] border border-white/5 bg-surface/60 p-5 md:p-8 shadow-elevated backdrop-blur-2xl">
                    <div className="mb-8 flex items-start justify-between">
                      <div>
                        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-accent/80">Paso 2</span>
                        <h2 className="mt-1 md:mt-2 text-xl md:text-[22px] font-light tracking-wide text-white/90">Tus Resultados</h2>
                      </div>
                      <button
                        type="button"
                        onClick={handleClear}
                        className="group flex items-center gap-1.5 md:gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 md:px-4 md:py-2 transition-all hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 text-white/60"
                      >
                        <FiRefreshCcw size={14} className="transition-transform group-hover:-rotate-180 duration-500" />
                        <span className="hidden sm:inline text-xs font-semibold">Limpiar todo</span>
                        <span className="sm:hidden text-[10px] font-semibold">Limpiar</span>
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Estación / Paleta</span>
                      <h3 className="text-3xl md:text-[40px] font-light tracking-wide text-white/90">
                        {report.season}
                      </h3>
                      
                      {/* Summary Integrado */}
                      {report.summary && (
                        <p className="mt-1 max-w-2xl text-sm md:text-base leading-relaxed text-white/60 font-light">
                          {report.summary}
                        </p>
                      )}

                      {/* Subtono Resaltado */}
                      <div className="mt-4 inline-flex items-center gap-2.5 self-start rounded-xl border border-accent/30 bg-[linear-gradient(135deg,rgba(240,191,134,0.15)_0%,rgba(240,191,134,0.05)_100%)] px-4 py-2 shadow-[0_0_20px_rgba(240,191,134,0.05)]">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/70">Subtono</span>
                        <div className="w-px h-3 bg-accent/30" />
                        <span className="text-sm font-semibold tracking-wide text-accent">{report.undertone}</span>
                      </div>
                    </div>

                    {report.why_this_works && (
                      <div className="mt-8 border-l-[2px] border-accent/40 pl-4 md:pl-5">
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] text-accent/80">¿Por qué funciona esta paleta?</span>
                        <p className="mt-2 text-sm md:text-base leading-relaxed text-white/70 font-light">
                          {report.why_this_works}
                        </p>
                      </div>
                    )}

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {report.contrast_level && (
                        <InsightCard icon={RiContrastDrop2Line} title="Contraste" value={report.contrast_level} />
                      )}
                      {report.best_metals && (
                        <InsightCard icon={RiVipCrown2Line} title="Metales" value={report.best_metals.primary} description={report.best_metals.reason} />
                      )}



                      {report.hair_color_advice && (
                        <div className="col-span-1 md:col-span-2">
                          <InsightCard icon={RiScissors2Line} title="Estilismo de Cabello" value="Sugerencia de Color" description={report.hair_color_advice} />
                        </div>
                      )}

                      {report.makeup_tips && showMakeup && (
                        <div className="col-span-1 md:col-span-2 relative overflow-hidden rounded-[20px] border border-accent/20 bg-accent/5 p-5 md:p-6 transition-colors hover:bg-accent/10">
                          <div className="absolute -right-8 -top-8 text-accent/10 pointer-events-none">
                            <HiOutlineSparkles size={140} />
                          </div>
                          <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-5">
                              <div className="rounded-full border border-accent/20 bg-accent/10 p-2 text-accent">
                                <HiOutlineSparkles size={16} />
                              </div>
                              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-accent">Tu Maquillaje Ideal</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8">
                              <div>
                                <span className="block text-[10px] md:text-[11px] uppercase tracking-widest text-accent/70 mb-1">Labios Recomendados</span>
                                <p className="text-sm md:text-base font-medium text-white/90">{report.makeup_tips.lipstick}</p>
                              </div>
                              <div>
                                <span className="block text-[10px] md:text-[11px] uppercase tracking-widest text-accent/70 mb-1">Rubor Recomendado</span>
                                <p className="text-sm md:text-base font-medium text-white/90">{report.makeup_tips.blush}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>

                  {/* PASO 3: LISTAS DE COLORES (Contenedor Nuevo) */}
                  <article className="rounded-[28px] border border-white/5 bg-surface/60 p-5 md:p-8 shadow-elevated backdrop-blur-2xl">
                    <div className="mb-6 md:mb-8">
                      <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-accent/80">Paso 3</span>
                      <h2 className="mt-1 md:mt-2 text-xl md:text-[22px] font-light tracking-wide text-white/90">Tu Paleta de Colores</h2>
                    </div>

                    <div className="pb-2">
                      <ColorList
                        title="Mejores opciones"
                        subtitle="Tus colores estrella para prendas principales."
                        items={report.best_options}
                        accentClass="border-amber-300/20 bg-amber-300/10 text-amber-200"
                      />
                      <SectionDivider />
                      <ColorList
                        title="Neutros"
                        subtitle="Tus bases para combinar y piezas de fondo de armario."
                        items={report.neutral_options}
                        accentClass="border-slate-300/20 bg-slate-300/10 text-slate-200"
                      />
                      <SectionDivider />
                      <ColorList
                        title="A evitar"
                        subtitle="Tonos que compiten con tu piel o la endurecen."
                        items={report.avoid_options}
                        accentClass="border-rose-300/20 bg-rose-300/10 text-rose-200"
                      />
                    </div>
                  </article>

                  {/* PASO 4: DESCARGAR PDF */}
                  <article className="rounded-[28px] border border-white/5 bg-surface/60 p-5 md:p-8 shadow-elevated backdrop-blur-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-accent/80">Paso 4</span>
                      <h2 className="mt-2 text-lg md:text-xl font-medium tracking-wide text-white/90">Guarda tu reporte</h2>
                      <p className="mt-1 md:mt-2 max-w-sm text-xs md:text-sm leading-relaxed text-white/50 font-light">
                        Descarga tu infografía y llévala contigo cuando vayas de compras o al salón.
                      </p>
                    </div>
                    <div className="w-full sm:w-auto shrink-0">
                      <DownloadPdfButton report={analysis} previewUrl={previewUrl} />
                    </div>
                  </article>
                </>
              ) : (
                /* ESTADO VACÍO */
                <article className="rounded-[28px] border border-white/5 bg-surface/60 p-4 shadow-elevated backdrop-blur-2xl min-h-[500px] flex items-center justify-center">
                  <div className="grid place-items-center text-center px-4 max-w-md">
                    <strong className="block text-xl md:text-[22px] font-light tracking-wide text-white/90">
                      Tu análisis ToneMap aparecerá aquí
                    </strong>
                    <p className="mt-3 text-sm leading-relaxed text-white/50 font-light">
                      Añade tu foto y presiona el botón para descubrir tu colorimetría y recomendaciones de estilo.
                    </p>
                  </div>
                </article>
              )}

            </div>
          </section>
        </div>
        <Footer onVisibleChange={setFooterVisible} />
      </div>
    </main>
  )
}

export default App