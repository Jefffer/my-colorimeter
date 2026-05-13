import { useRef, useState, useEffect } from 'react'
import { AlertTriangle, ArrowRight, LoaderCircle, UploadCloud, Info } from 'lucide-react'
import { Hero } from './components/Hero'
import { LoadingOverlay } from './components/LoadingOverlay'
import Footer from './components/Footer'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

const fallbackReport = {
  season: 'Tu lectura ToneMap',
  undertone: 'pendiente',
  summary: 'ToneMap devuelve una guía limpia y accionable para tu colorimetría.',
  why_this_works:
    'La lectura se centra en equilibrar contraste, calidez y presencia visual para que tus colores funcionen en conjunto.',
  best_options: [
    { name: 'Marfil', hex: '#F3E7D7', reason: 'Base suave que ilumina sin endurecer.' },
    { name: 'Terracota', hex: '#B86A4B', reason: 'Acento cálido con mucha presencia.' },
    { name: 'Oliva ahumado', hex: '#7E8661', reason: 'Equilibrio natural para looks sobrios.' },
    { name: 'Cacao', hex: '#4A342D', reason: 'Profundidad elegante y estable.' },
  ],
  neutral_options: [
    { name: 'Beige arena', hex: '#D8C7B0', reason: 'Base limpia y versátil.' },
    { name: 'Topo suave', hex: '#9A8578', reason: 'Mantiene armonía sin apagar el rostro.' },
    { name: 'Café latte', hex: '#B59B84', reason: 'Aporta calidez sin demasiada saturación.' },
    { name: 'Gris piedra', hex: '#8E8B87', reason: 'Neutro estable para combinar con todo.' },
  ],
  avoid_options: [
    { name: 'Neones fríos', hex: '#8AA7C5', reason: 'Restan equilibrio y compiten con la piel.' },
    { name: 'Grises ceniza', hex: '#C7C7C7', reason: 'Pueden apagar el conjunto.' },
    { name: 'Blancos muy puros', hex: '#F8F8F8', reason: 'Su dureza puede verse fría en cámara.' },
    { name: 'Negros duros', hex: '#222222', reason: 'Demasiado severos para una lectura armónica.' },
  ],
}

const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const allowedImageExtensions = new Set(['jpg', 'jpeg', 'png', 'webp'])
const maxImageSizeBytes = 5 * 1024 * 1024

function safeJsonParse(input) {
  try {
    return JSON.parse(input)
  } catch {
    return null
  }
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

function ColorList({ title, subtitle, items, accentClass }) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-white/4 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-lg font-semibold tracking-[-0.03em] text-white">{title}</h4>
          <p className="mt-1 text-sm text-white/55">{subtitle}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${accentClass}`}>
          {items.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <article
            key={`${item.name}-${item.hex}`}
            className="overflow-hidden rounded-[20px] border border-white/8 bg-slate-950/35"
          >
            <div className="relative h-20 w-full overflow-hidden" style={{ backgroundColor: item.hex }}>
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_35%,rgba(255,255,255,0)_72%)]" />
            </div>
            <div className="space-y-2 p-4">
              <div>
                <strong className="block text-sm font-semibold text-white">{item.name}</strong>
                <span className="text-xs tracking-[0.18em] text-white/45">{item.hex}</span>
              </div>
              <p className="text-sm leading-6 text-white/65">{item.reason}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function AlertModal({ title, message, onAccept }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Cerrar alerta"
        className="absolute inset-0 cursor-default bg-page/72 backdrop-blur-md"
        onClick={(event) => event.preventDefault()}
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="file-alert-title"
        aria-describedby="file-alert-message"
        className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,17,21,0.98),rgba(22,25,34,0.96))] p-6 shadow-elevated"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(240,191,134,0.8),transparent)]" />

        <div className="flex items-start gap-4">
          <div className="rounded-2xl border border-rose-400/15 bg-rose-400/10 p-3 text-rose-100 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <AlertTriangle size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted">Alerta de carga</span>
            <h2 id="file-alert-title" className="mt-2 text-[22px] font-semibold tracking-[-0.04em] text-text">
              {title}
            </h2>
            <p id="file-alert-message" className="mt-3 text-sm leading-6 text-white/70">
              {message}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onAccept}
                className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-accent via-[#f7dfb7] to-accent-soft px-5 py-3 text-sm font-extrabold text-slate-950 shadow-[0_16px_36px_rgba(240,191,134,0.16)] transition-transform hover:-translate-y-0.5"
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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fileAlert, setFileAlert] = useState(null)
  const fileInputRef = useRef(null)
  const uploadSectionRef = useRef(null)
  const isProcessing = useRef(false)

  const report = getReportData(analysis)
  const [, setFooterVisible] = useState(false)
  const [stickyTopOffset, setStickyTopOffset] = useState(24) // default top-6 in px

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
      
      // Space available from top of upload to footer
      const spaceToFooter = footerRect.top - uploadRect.top
      
      // If there's not enough space, push the element down gradually
      if (spaceToFooter < uploadHeight) {
        // Calculate how much to offset to make room for footer
        const offset = Math.max(24, uploadHeight - spaceToFooter + 24)
        setStickyTopOffset(offset)
      } else {
        // Normal sticky position
        setStickyTopOffset(24)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Call once on mount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleFileSelect = async (event) => {
    const [file] = event.target.files || []
    if (!file) return

    const validationError = getFileValidationError(file)
    if (validationError) {
      setFileAlert({
        title: 'Formato de imagen no válido',
        message: validationError,
      })
      setError('')
      setSelectedFile(null)
      setPreviewUrl('')
      setAnalysis(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

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

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const closeFileAlert = () => {
    setFileAlert(null)
  }

  const handleGenerate = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (isLoading || isProcessing.current) return

    isProcessing.current = true
    setIsLoading(true)
    setError('')

    console.info('toneMap: iniciando procesamiento de imagen')
    try {
      let imageForRequest = previewUrl
      console.debug('toneMap: preparando imagen para envío')
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

      const requestBody = {
        image: imageForRequest,
        mimeType: selectedFile?.type || 'image/jpeg',
        fileName: selectedFile?.name || 'restored-image',
      }

      console.debug('toneMap: enviando imagen a /api/generate')
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      let payload = {}
      try {
        payload = await response.json()
      } catch {
        console.warn('toneMap: respuesta inválida del servidor (no JSON)')
        setError('Respuesta inválida del servidor')
        return
      }

      console.info(`toneMap: respuesta recibida, status=${response.status}`)
      if (payload?.model) console.info(`toneMap: modelo usado = ${payload.model}`)

      // Some error responses (422) may include a rawResponse JSON with validity=false
      let parsedRawResponse = null
      try {
        if (payload?.report) parsedRawResponse = payload.report
        else if (payload?.analysis) parsedRawResponse = payload.analysis
        else if (payload?.rawResponse) parsedRawResponse = JSON.parse(payload.rawResponse)
      } catch {
        parsedRawResponse = null
      }

      if (parsedRawResponse?.validity && parsedRawResponse.validity.analyzable === false) {
        // Show modal with reason from backend and do not treat as generic error
        setFileAlert({ title: 'No se pudo analizar la imagen', message: parsedRawResponse.validity.reason || 'Imagen no adecuada para análisis' })
        return
      }

      if (!response.ok) {
        console.warn(`toneMap: error desde Gemini: status=${response.status}`)
        setError(payload?.error || 'No fue posible generar el reporte')
        return
      }

      const normalized = normalizeApiReport(payload, payload?.rawResponse || '')
      if (!normalized) {
        setError('No fue posible interpretar la respuesta de ToneMap')
        return
      }

      // If backend reports the image is not analyzable, surface a modal with the reason
      if (normalized?.validity && normalized.validity.analyzable === false) {
        setAnalysis(normalized)
        setFileAlert({ title: 'No se pudo analizar la imagen', message: normalized.validity.reason || 'Imagen no adecuada para análisis' })
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

  const downloadGeneratedImage = () => {
    if (!analysis) return

    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'tonemap-report.json'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <main className="text-text">
      {fileAlert ? (
        <AlertModal title={fileAlert.title} message={fileAlert.message} onAccept={closeFileAlert} />
      ) : null}

      <LoadingOverlay
        isVisible={isLoading}
        message="Analizando tu imagen..."
        submessage="ToneMap está procesando tu imagen para generar la paleta de colores personalizada."
      />

      {/* Hero fullscreen */}
      <Hero onCtaClick={scrollToUpload} />

      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(240,191,134,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(213,236,227,0.1),_transparent_20%),linear-gradient(180deg,_#17191d_0%,_#0c0d10_100%)]">
        <div className="mx-auto flex w-full max-w-[1260px] flex-col gap-6 px-4 py-4 font-sans sm:px-5 lg:px-6 lg:py-6">

        <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)]">
          <article
            ref={uploadSectionRef}
            className="scroll-mt-6 rounded-[28px] border border-white/10 bg-surface/80 p-5 shadow-elevated backdrop-blur-2xl sm:p-6 lg:sticky lg:self-start"
            style={{ top: `${stickyTopOffset}px` }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">Paso 1</span>
                <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.04em] text-text">Sube tu imagen</h2>
              </div>
              <div className="flex items-center gap-3">
                {/* <UploadCloud size={18} className="text-muted" /> */}
                <Tippy
                  content={
                    <span className="text-sm">
                      Usa una imagen frontal, con buena iluminación, sin filtros fuertes y con fondo neutro.
                    </span>
                  }
                    delay={[120, 40]}
                    placement="bottom"
                    theme="site"
                >
                  <button
                    type="button"
                    aria-label="Tips para una mejor lectura"
                    className="inline-flex items-center justify-center rounded-full bg-white/3 p-1 text-muted hover:opacity-90"
                  >
                    <Info size={14} />
                  </button>
                </Tippy>
              </div>
            </div>

            <input
              ref={fileInputRef}
              className="sr-only"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
            />

            <button
              type="button"
              onClick={openFilePicker}
              className="group aspect-3/4 w-full overflow-hidden rounded-[24px] border border-dashed border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(240,191,134,0.06),transparent_30%),radial-gradient(circle_at_78%_0%,rgba(213,236,227,0.07),transparent_24%),rgba(255,255,255,0.03)] p-0 text-left transition-colors hover:border-accent/40"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Vista previa de la imagen subida"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center gap-3 p-6 text-center">
                  <UploadCloud size={30} className="text-muted" />
                  <strong className="text-[20px] font-semibold text-text">Selecciona una foto para empezar</strong>
                  <span className="max-w-sm text-sm leading-6 text-muted">
                    JPG, JPEG, PNG o WebP. Usa una imagen ligera de hasta 5 MB y con el rostro bien iluminado.
                  </span>
                </div>
              )}
            </button>

            {/* Info tooltip moved to the upload header for a more consistent layout */}

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!previewUrl || isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-accent via-[#f7dfb7] to-accent-soft px-5 py-4 font-extrabold text-slate-950 shadow-[0_16px_36px_rgba(240,191,134,0.16)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {!isLoading ? (
                  <>
                    Analizar colorimetria
                    <ArrowRight size={18} />
                  </>
                ) : (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Analizando...
                  </>
                )}
              </button>
            </div>

            {error ? (
              <div className="mt-4 rounded-[20px] border border-rose-400/18 bg-[linear-gradient(180deg,rgba(127,29,29,0.22),rgba(69,10,10,0.16))] px-4 py-3.5 text-sm text-rose-100 shadow-[0_12px_30px_rgba(127,29,29,0.12)]">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-full bg-rose-400/10 p-2 text-rose-200">
                    <AlertTriangle size={14} />
                  </span>
                  <div>
                    <strong className="block text-sm font-semibold text-rose-50">No se pudo cargar la imagen</strong>
                    <p className="mt-1 leading-6 text-rose-100/90">{error}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </article>

          <article className="rounded-[28px] border border-white/10 bg-surface/80 p-5 shadow-elevated backdrop-blur-2xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">Paso 2</span>
                <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.04em] text-text">Tu lectura ToneMap</h2>
              </div>
              <div className="flex items-center gap-2">
                {analysis ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-text transition-transform hover:-translate-y-0.5"
                  >
                    Limpiar todo
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={downloadGeneratedImage}
                  disabled={!analysis}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-text transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Descargar JSON
                </button>
              </div>
            </div>

            <div className="min-h-[520px] rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(240,191,134,0.08),transparent_28%),radial-gradient(circle_at_top_right,_rgba(213,236,227,0.08),transparent_22%),rgba(255,255,255,0.03)]">
              {analysis ? (
                <div className="grid gap-5 p-4 sm:p-5">
                  <section className="flex flex-col gap-4 rounded-[22px] border border-white/10 bg-surface-soft/60 p-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">Lectura principal</span>
                      <h3 className="mt-2 text-[clamp(24px,3vw,38px)] font-semibold tracking-[-0.05em] text-text">
                        {report.season || 'Tu lectura ToneMap'}
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                        {report.summary || fallbackReport.summary}
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(240,191,134,0.14),rgba(255,255,255,0.04))] px-4 py-3.5 lg:min-w-[180px] lg:self-start">
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">Subtono</span>
                      <strong className="mt-1.5 block text-[20px] leading-tight text-text">
                        {report.undertone || fallbackReport.undertone}
                      </strong>
                    </div>
                  </section>

                  <section className="rounded-[24px] border border-white/10 bg-surface-soft/60 p-5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">Tonos que funcionan</span>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">
                      {report.why_this_works || fallbackReport.why_this_works}
                    </p>
                  </section>

                  <div className="grid gap-4">
                    <ColorList
                      title="Mejores opciones"
                      subtitle="Colores más favorables para tu lectura"
                      items={report.best_options || fallbackReport.best_options}
                      accentClass="border-amber-300/20 bg-amber-300/10 text-amber-100"
                    />
                    <ColorList
                      title="Neutros"
                      subtitle="Bases versátiles para tu guardarropa"
                      items={report.neutral_options || fallbackReport.neutral_options}
                      accentClass="border-emerald-200/20 bg-emerald-200/10 text-emerald-100"
                    />
                    <ColorList
                      title="A evitar"
                      subtitle="Tonos que tienden a endurecer o apagar"
                      items={report.avoid_options || fallbackReport.avoid_options}
                      accentClass="border-rose-200/20 bg-rose-200/10 text-rose-100"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid min-h-[520px] place-items-center p-8 text-center">
                  <div className="max-w-md">
                    <strong className="block text-[22px] font-semibold tracking-[-0.04em] text-text">
                      Tu lectura aparecerá aquí
                    </strong>
                    <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
                      Sube una foto, analiza la imagen y descarga el JSON si quieres conservar el resultado.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </article>
        </section>
        
        </div>
        <Footer onVisibleChange={setFooterVisible} />
      </div>
    </main>
  )
}

export default App
