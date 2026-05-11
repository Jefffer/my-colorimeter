import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Camera,
  LoaderCircle,
  Palette,
  Sparkles,
  UploadCloud,
} from 'lucide-react'
import { LoadingOverlay } from './components/LoadingOverlay'
import './App.css'

const STORAGE_KEYS = {
  previewUrl: 'colorimeter.previewUrl',
  analysis: 'colorimeter.analysis',
  rawResponse: 'colorimeter.rawResponse',
  debugState: 'colorimeter.debugState',
}

const fallbackPalette = [
  { name: 'Marfil', hex: '#F3E7D7', role: 'Base suave' },
  { name: 'Terracota', hex: '#B86A4B', role: 'Acento cálido' },
  { name: 'Oliva ahumado', hex: '#7E8661', role: 'Equilibrio' },
  { name: 'Cacao', hex: '#4A342D', role: 'Profundidad' },
]

const fallbackAvoid = ['Neones fríos', 'Grises ceniza', 'Blancos muy puros', 'Negros duros']

const fallbackReport = {
  season: 'Tu paleta sugerida',
  undertone: 'pendiente',
  summary: 'Gemini devolverá aquí una guía clara de colores adaptada a tu imagen.',
  why_this_works: 'La combinación elegida busca equilibrar tu contraste natural y suavizar o potenciar tus rasgos.',
  best_options: fallbackPalette.map((item) => ({
    name: item.name,
    hex: item.hex,
    reason: item.role,
  })),
  neutral_options: [
    { name: 'Beige arena', hex: '#D8C7B0', reason: 'Funciona como base limpia y versátil.' },
    { name: 'Topo suave', hex: '#9A8578', reason: 'Mantiene armonía sin apagar el rostro.' },
    { name: 'Café latte', hex: '#B59B84', reason: 'Aporta calidez sin demasiada saturación.' },
    { name: 'Gris piedra', hex: '#8E8B87', reason: 'Neutro estable para combinar con todo.' },
  ],
  avoid_options: fallbackAvoid.map((name, index) => ({
    name,
    hex: ['#8AA7C5', '#C7C7C7', '#F8F8F8'][index] || '#222222',
    reason: 'Puede restar equilibrio o endurecer el conjunto.',
  })),
}

function getReportData(analysis) {
  return analysis || fallbackReport
}

function normalizeToneList(input, fallback) {
  if (!Array.isArray(input) || input.length === 0) return fallback
  return input
}

function cleanHex(value, fallback = '#CBB8A2') {
  const normalized = String(value || '').trim()
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalized) ? normalized : fallback
}

function safeJsonParse(input) {
  try {
    return JSON.parse(input)
  } catch {
    return null
  }
}

function mapColorArrayToOptions(colors = [], label = 'Color') {
  return colors
    .map((item, index) => {
      if (typeof item === 'string') {
        return {
          name: `${label} ${index + 1}`,
          hex: cleanHex(item),
          reason: 'Detectado por Gemini para tu armonía cromática.',
        }
      }

      return {
        name: item?.name || `${label} ${index + 1}`,
        hex: cleanHex(item?.hex),
        reason: item?.reason || 'Detectado por Gemini para tu armonía cromática.',
      }
    })
    .filter((item) => item.hex)
}

function mapLegacyImageGenerationToReport(legacy) {
  const sections = Array.isArray(legacy?.elements)
    ? legacy.elements.filter((item) => item?.type === 'color_swatch_section')
    : []

  const bestSection = sections.find((item) => String(item?.label || '').toUpperCase().includes('BEST'))
  const neutralSection = sections.find((item) => String(item?.label || '').toUpperCase().includes('NEUTRAL'))
  const avoidSection = sections.find((item) => String(item?.label || '').toUpperCase().includes('AVOID'))

  const best_options = mapColorArrayToOptions(bestSection?.colors || [], 'Mejor opción').slice(0, 6)
  const neutral_options = mapColorArrayToOptions(neutralSection?.colors || [], 'Neutro').slice(0, 4)
  const avoid_options = mapColorArrayToOptions(avoidSection?.colors || [], 'Evitar').slice(0, 3)

  if (best_options.length === 0 && neutral_options.length === 0 && avoid_options.length === 0) {
    return null
  }

  return {
    season: 'Lectura cromática',
    undertone: 'Detectado por Gemini',
    summary: 'Gemini devolvió un esquema visual legacy. Se convirtió automáticamente a reporte de paleta.',
    why_this_works: 'Este reporte se generó a partir de la estructura de secciones de color devuelta por Gemini.',
    best_options,
    neutral_options,
    avoid_options,
  }
}

function normalizeApiReport(payload, rawResponse) {
  const directReport = payload?.report
  if (directReport && Array.isArray(directReport.best_options)) {
    return directReport
  }

  const analysisReport = payload?.analysis
  if (analysisReport && Array.isArray(analysisReport.best_options)) {
    return analysisReport
  }

  const legacyReport = mapLegacyImageGenerationToReport(payload?.analysis?.image_generation)
  if (legacyReport) {
    return legacyReport
  }

  const parsedRaw = safeJsonParse(rawResponse)
  if (!parsedRaw) {
    return null
  }

  if (Array.isArray(parsedRaw.best_options)) {
    return parsedRaw
  }

  const parsedLegacy = mapLegacyImageGenerationToReport(parsedRaw?.image_generation)
  if (parsedLegacy) {
    return parsedLegacy
  }

  return null
}

function ToneCard({ tone, variant = 'best' }) {
  const borderClass = variant === 'avoid' ? 'tone-card avoid' : variant === 'neutral' ? 'tone-card neutral' : 'tone-card best'
  return (
    <article className={borderClass}>
      <div className="tone-swatch" style={{ backgroundColor: cleanHex(tone.hex) }} />
      <div className="tone-copy">
        <strong>{tone.name}</strong>
        <span>{cleanHex(tone.hex)}</span>
        <p>{tone.reason}</p>
      </div>
    </article>
  )
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'))
    reader.readAsDataURL(file)
  })
}

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('') // NO persiste en sessionStorage - solo en RAM
  const [analysis, setAnalysis] = useState(() => safeJsonParse(sessionStorage.getItem(STORAGE_KEYS.analysis) || '') || null)
  const [rawResponse, setRawResponse] = useState(() => sessionStorage.getItem(STORAGE_KEYS.rawResponse) || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [debugState, setDebugState] = useState(() => sessionStorage.getItem(STORAGE_KEYS.debugState) || 'Sin respuesta todavía.')
  const fileInputRef = useRef(null)
  const isProcessing = useRef(false) // Protección contra doble-click

  // NO persistir previewUrl - solo guardar análisis y rawResponse

  useEffect(() => {
    if (analysis) {
      sessionStorage.setItem(STORAGE_KEYS.analysis, JSON.stringify(analysis))
    }
  }, [analysis])

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.rawResponse, rawResponse || '')
  }, [rawResponse])

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.debugState, debugState || '')
  }, [debugState])

  const report = getReportData(analysis)
  const bestOptions = normalizeToneList(report.best_options, fallbackReport.best_options)
  const neutralOptions = normalizeToneList(report.neutral_options, fallbackReport.neutral_options)
  const avoidOptions = normalizeToneList(report.avoid_options, fallbackReport.avoid_options)

  const handleFileSelect = async (event) => {
    event?.preventDefault()
    const [file] = event.target.files || []
    if (!file) return

    const nextPreviewUrl = await fileToDataUrl(file)
    setPreviewUrl(nextPreviewUrl)
    setSelectedFile(file)
    setError('')
    setAnalysis(null)
    setRawResponse('')
    setDebugState('Imagen cargada. Lista para generar.')
    sessionStorage.removeItem(STORAGE_KEYS.analysis)
  }

  const openFilePicker = (event) => {
    event?.preventDefault()
    fileInputRef.current?.click()
  }

  const handleGenerate = async (event) => {
    try {
      // Prevenir comportamiento por defecto del navegador
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }

      // Protección contra doble-click
      if (isLoading || isProcessing.current) {
        console.log('⚠️ Ya se está procesando, ignorando click')
        return
      }

      // Marcar como procesando INMEDIATAMENTE
      isProcessing.current = true
      console.log('🎨 handleGenerate: Iniciando proceso')

      // Mostrar loading ANTES de hacer cualquier operación async
      setIsLoading(true)
      setError('')
      setDebugState('⏳ Preparando imagen...')
      setRawResponse('Procesando...')

      // Ahora preparar la imagen
      let imageForRequest = previewUrl
      if (!imageForRequest && selectedFile) {
        console.log('🎨 handleGenerate: Convirtiendo archivo a data URL...')
        imageForRequest = await fileToDataUrl(selectedFile)
      }

      if (!imageForRequest) {
        console.error('🎨 handleGenerate: No image selected')
        setError('Debes seleccionar una imagen antes de generar el reporte')
        setIsLoading(false)
        isProcessing.current = false
        return
      }

      console.log('🎨 handleGenerate: Preparando solicitud')
      const requestBody = {
        image: imageForRequest,
        mimeType: selectedFile?.type || 'image/jpeg',
        fileName: selectedFile?.name || 'restored-image',
      }
      console.log('🎨 handleGenerate: Body size =', new Blob([JSON.stringify(requestBody)]).size, 'bytes')

      console.log('🎨 handleGenerate: Enviando a /api/generate ...')
      setDebugState('⏳ Enviando imagen a Gemini (30 segundos máximo)...')

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      console.log('🎨 handleGenerate: Response received, status =', response.status)
      setDebugState(`⏳ Recibida respuesta con estado ${response.status}... analizando`)

      let payload = {}
      try {
        payload = await response.json()
        console.log('🎨 handleGenerate: JSON parsed successfully')
      } catch (jsonError) {
        console.error('🎨 handleGenerate: JSON Parse Error =', jsonError.message)
        setDebugState(`❌ Estado ${response.status}: Error al parsear respuesta del servidor`)
        setRawResponse(`Error: No se pudo leer la respuesta.\n\nDetalles: ${jsonError.message}`)
        setError('Respuesta inválida del servidor')
        setIsLoading(false)
        isProcessing.current = false
        return
      }

      // SIEMPRE mostrar rawResponse si existe
      if (payload?.rawResponse) {
        console.log('🎨 handleGenerate: rawResponse present, length =', payload.rawResponse.length)
        setRawResponse(payload.rawResponse)
      }

      const normalized = normalizeApiReport(payload, payload?.rawResponse || '')
      console.log('🎨 handleGenerate: normalized report =', normalized ? 'YES' : 'NO')

      if (!response.ok) {
        console.error('🎨 handleGenerate: Response NOT OK. payload.error =', payload?.error)
        setDebugState(`❌ Estado ${response.status}: ${payload?.error || 'respuesta inválida'}`)
        setError(payload?.error || 'No fue posible generar el reporte')
        setIsLoading(false)
        isProcessing.current = false
        return
      }

      if (!normalized) {
        console.warn('🎨 handleGenerate: Response OK but normalized is null')
        setDebugState(`⚠️ Estado ${response.status}: respuesta sin estructura esperada`)
        setError('Gemini respondió, pero en un formato no mapeable. Revisa el JSON crudo en depuración.')
        setIsLoading(false)
        isProcessing.current = false
        return
      }

      // SUCCESS: actualizar analysis con los datos normalizados
      console.log('🎨 handleGenerate: Setting analysis state with normalized data')
      setAnalysis(normalized)
      console.log('🎨 handleGenerate: SUCCESS! Setting final debug state')
      setDebugState(`✅ Estado ${response.status}: respuesta recibida y analizada correctamente`)
      setIsLoading(false)
      isProcessing.current = false
    } catch (requestError) {
      console.error('🎨 handleGenerate: Caught exception:', requestError)
      setDebugState(`❌ Error: ${requestError.message}`)
      setError(requestError.message || 'Hubo un problema al generar el reporte. Revisa la consola del navegador.')
      setIsLoading(false)
      isProcessing.current = false
    }
  }

  const downloadGeneratedImage = () => {
    if (!analysis) return

    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'colorimeter-report.json'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <main className="app-shell">
      <LoadingOverlay 
        isVisible={isLoading} 
        message="Analizando tu imagen..."
        submessage="Gemini está procesando tus rasgos para generar la paleta de colores personalizada."
      />
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={16} />
            Gemini color analysis
          </div>
          <h1>Tu colorimetría, convertida en una guía de colores clara y premium.</h1>
          <p>
            Sube una selfie o foto tipo carnet y obtén una selección de colores recomendados,
            neutros y a evitar, con una explicación simple de por qué te favorecen.
          </p>

          <div className="hero-points">
            <span>
              <Camera size={16} />
              Una sola imagen
            </span>
            <span>
              <Palette size={16} />
              Paleta personalizada
            </span>
            <span>
              <Sparkles size={16} />
              Resultado en texto estructurado
            </span>
          </div>
        </div>        
      </section>

      <section className="workspace-grid">
        <article className="panel upload-panel">
          <div className="panel-head">
            <div>
              <span className="panel-kicker">Paso 1</span>
              <h2>Sube tu imagen</h2>
            </div>
            <Sparkles size={18} />
          </div>

          <input
            ref={fileInputRef}
            className="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
          />

          <button type="button" className="dropzone" onClick={openFilePicker}>
            {previewUrl ? (
              <img className="preview-image" src={previewUrl} alt="Vista previa de la imagen subida" />
            ) : (
              <div className="dropzone-empty">
                <UploadCloud size={28} />
                <strong>Selecciona una foto para empezar</strong>
                <span>JPEG, PNG o WebP. Idealmente con el rostro bien iluminado.</span>
              </div>
            )}
          </button>

          <div className="helper-copy">
            <p>La mejor precisión se consigue con una imagen frontal, sin filtros fuertes y con fondo neutro.</p>
          </div>

          <button type="button" className="generate-button" onClick={handleGenerate} disabled={!previewUrl || isLoading} style={isLoading ? { pointerEvents: 'none', opacity: 0.6 } : {}}>
            {!isLoading ? (
              <>
                Analizar paleta de colores
                <ArrowRight size={18} />
              </>
            ) : (
              <>
                <LoaderCircle size={18} className="spin" />
                Analizando...
              </>
            )}
          </button>

          {error ? <div className="error-banner">{error}</div> : null}
        </article>

        <article className="panel result-panel">
          <div className="panel-head">
            <div>
              <span className="panel-kicker">Paso 2</span>
              <h2>Reporte de color</h2>
            </div>
            <button type="button" className="ghost-button" onClick={downloadGeneratedImage} disabled={!analysis}>
              Descargar JSON
            </button>
          </div>

          <div className="result-stage report-stage">
            {analysis ? (
              <div className="report-body">
                <div className="report-hero">
                  <div>
                    <span className="panel-kicker">Lectura principal</span>
                    <h3>{report.season || 'Tu paleta sugerida'}</h3>
                    <p>{report.summary || fallbackReport.summary}</p>
                  </div>
                  <div className="report-badge">
                    <span>Subtono</span>
                    <strong>{report.undertone || fallbackReport.undertone}</strong>
                  </div>
                </div>

                <div className="report-explainer">
                  <span className="detail-label">Por qué te favorece</span>
                  <p>{report.why_this_works || fallbackReport.why_this_works}</p>
                </div>

                <section className="report-section">
                  <div className="section-headline">
                    <h4>Mejor opción</h4>
                    <span>6 colores</span>
                  </div>
                  <div className="tone-grid">
                    {bestOptions.map((tone) => (
                      <ToneCard key={`${tone.name}-${tone.hex}`} tone={tone} variant="best" />
                    ))}
                  </div>
                </section>

                <section className="report-section">
                  <div className="section-headline">
                    <h4>Neutros</h4>
                    <span>4 colores</span>
                  </div>
                  <div className="tone-grid neutral-grid">
                    {neutralOptions.map((tone) => (
                      <ToneCard key={`${tone.name}-${tone.hex}`} tone={tone} variant="neutral" />
                    ))}
                  </div>
                </section>

                <section className="report-section">
                  <div className="section-headline">
                    <h4>Colores a evitar</h4>
                    <span>3 colores</span>
                  </div>
                  <div className="tone-grid avoid-grid">
                    {avoidOptions.map((tone) => (
                      <ToneCard key={`${tone.name}-${tone.hex}`} tone={tone} variant="avoid" />
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <div className="empty-result">
                <strong>El reporte aparecerá aquí</strong>
                <span>Al generar, verás una lectura de colores con la mejor opción, neutros y tonos a evitar.</span>
              </div>
            )}
          </div>

          <div className="debug-panel">
            <div className="panel-head compact">
              <div>
                <span className="panel-kicker">Debug</span>
                <h2>Respuesta cruda de Gemini</h2>
              </div>
            </div>
            <pre className="debug-output">{rawResponse || 'Aquí aparecerá el texto exacto devuelto por Gemini.'}</pre>
          </div>

          <div className="insight-grid">
            <div className="insight-card">
              <span>Mejor opción</span>
              <strong>{bestOptions.length} tonos</strong>
            </div>
            <div className="insight-card">
              <span>Neutros</span>
              <strong>{neutralOptions.length} tonos</strong>
            </div>
            <div className="insight-card">
              <span>A evitar</span>
              <strong>{avoidOptions.length} tonos</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="raw-response-stage">
        <article className="panel raw-panel">
          <div className="panel-head">
            <div>
              <span className="panel-kicker">Depuración</span>
              <h2>JSON crudo de Gemini</h2>
            </div>
            <span className="debug-pill">{debugState}</span>
          </div>
          <pre className="raw-response-box">{rawResponse || 'Aquí se mostrará exactamente el JSON devuelto por Gemini.'}</pre>
        </article>
      </section>

      <section className="bottom-grid">
        <article className="detail-card">
          <span className="detail-label">Salida estructurada</span>
          <p>
            Gemini devuelve un JSON con seis colores recomendados, cuatro neutros y tres tonos a evitar, junto con una explicación corta.
          </p>
        </article>

        <article className="detail-card muted">
          <span className="detail-label">Pensado para Vercel</span>
          <p>
            La clave de Google AI Studio se consume desde una función serverless, sin exponerla en el cliente.
          </p>
        </article>
      </section>
    </main>
  )
}

export default App
