import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Camera,
  ImageDown,
  LoaderCircle,
  Palette,
  Sparkles,
  UploadCloud,
} from 'lucide-react'
import './App.css'

const fallbackPalette = [
  { name: 'Marfil', hex: '#F3E7D7', role: 'Base suave' },
  { name: 'Terracota', hex: '#B86A4B', role: 'Acento cálido' },
  { name: 'Oliva ahumado', hex: '#7E8661', role: 'Equilibrio' },
  { name: 'Cacao', hex: '#4A342D', role: 'Profundidad' },
]

const fallbackAvoid = ['Neones fríos', 'Grises ceniza', 'Blancos muy puros', 'Negros duros']

function escapeXml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function normalizeList(input, fallback) {
  if (Array.isArray(input) && input.length > 0) return input
  return fallback
}

function dataUrlToSvg(title, analysis) {
  const palette = normalizeList(analysis.palette, fallbackPalette)
  const avoid = normalizeList(analysis.avoid_colors, fallbackAvoid)
  const bestColors = normalizeList(analysis.best_colors, ['Marfil tostado', 'Rosa empolvado', 'Verde salvia'])

  const paletteRows = palette.slice(0, 4).map((item, index) => {
    const color = typeof item === 'string' ? item : item.hex || '#CBB8A2'
    const label = typeof item === 'string' ? item : item.name || `Color ${index + 1}`
    const role = typeof item === 'string' ? '' : item.role || ''

    return `
      <g transform="translate(0, ${index * 112})">
        <rect x="0" y="0" width="860" height="96" rx="28" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" />
        <rect x="22" y="22" width="52" height="52" rx="18" fill="${escapeXml(color)}" />
        <text x="96" y="42" fill="#F6F1EA" font-size="25" font-weight="700" font-family="Inter, Arial, sans-serif">${escapeXml(label)}</text>
        <text x="96" y="70" fill="#B9B1A6" font-size="18" font-weight="500" font-family="Inter, Arial, sans-serif">${escapeXml(role)}</text>
        <text x="780" y="52" text-anchor="end" fill="#D9D1C5" font-size="18" font-weight="600" font-family="JetBrains Mono, Consolas, monospace">${escapeXml(color)}</text>
      </g>
    `
  }).join('')

  const avoidRows = avoid.slice(0, 4).map((item, index) => {
    const label = typeof item === 'string' ? item : item.name || item.hex || `Evita ${index + 1}`
    return `
      <g transform="translate(${index % 2 === 0 ? 0 : 288}, ${Math.floor(index / 2) * 82})">
        <rect x="0" y="0" width="260" height="64" rx="22" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)" />
        <circle cx="26" cy="32" r="7" fill="#FF7B7B" />
        <text x="46" y="38" fill="#F4EBE0" font-size="18" font-weight="600" font-family="Inter, Arial, sans-serif">${escapeXml(label)}</text>
      </g>
    `
  }).join('')

  const bestRows = bestColors.slice(0, 4).map((item, index) => {
    const label = typeof item === 'string' ? item : item.name || item.hex || `Color ${index + 1}`
    return `
      <g transform="translate(${index % 2 === 0 ? 0 : 288}, ${Math.floor(index / 2) * 82})">
        <rect x="0" y="0" width="260" height="64" rx="22" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)" />
        <circle cx="26" cy="32" r="7" fill="#7CF2C5" />
        <text x="46" y="38" fill="#F4EBE0" font-size="18" font-weight="600" font-family="Inter, Arial, sans-serif">${escapeXml(label)}</text>
      </g>
    `
  }).join('')

  const summary = escapeXml(
    analysis.summary ||
      'Análisis equilibrado con una paleta de contraste medio y tonos suaves que respetan la armonía natural del rostro.',
  )

  const season = escapeXml(analysis.season || title || 'Informe cromático')
  const undertone = escapeXml(analysis.undertone || 'neutral')

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1800" viewBox="0 0 1400 1800" fill="none">
      <defs>
        <linearGradient id="bg" x1="160" y1="120" x2="1280" y2="1680" gradientUnits="userSpaceOnUse">
          <stop stop-color="#1A1412" />
          <stop offset="0.52" stop-color="#231A19" />
          <stop offset="1" stop-color="#110F12" />
        </linearGradient>
        <radialGradient id="glow1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(260 220) rotate(45) scale(380 420)">
          <stop stop-color="#E7B57C" stop-opacity="0.34" />
          <stop offset="1" stop-color="#E7B57C" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="glow2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1160 320) rotate(120) scale(420 500)">
          <stop stop-color="#7ACFBE" stop-opacity="0.18" />
          <stop offset="1" stop-color="#7ACFBE" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1400" height="1800" rx="60" fill="url(#bg)" />
      <circle cx="260" cy="220" r="380" fill="url(#glow1)" />
      <circle cx="1160" cy="320" r="460" fill="url(#glow2)" />
      <rect x="70" y="70" width="1260" height="1660" rx="44" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" />

      <text x="110" y="155" fill="#F8F0E4" font-size="24" letter-spacing="3" font-weight="700" font-family="Inter, Arial, sans-serif">COLORIMETER / GEMINI REPORT</text>
      <text x="110" y="250" fill="#FFF7EF" font-size="66" font-weight="800" font-family="Inter, Arial, sans-serif">${season}</text>
      <text x="110" y="302" fill="#DCCFBE" font-size="24" font-weight="500" font-family="Inter, Arial, sans-serif">Tono detectado: ${undertone}</text>

      <rect x="110" y="360" width="1180" height="240" rx="36" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
      <text x="150" y="430" fill="#B9F1DC" font-size="20" font-weight="700" letter-spacing="2" font-family="Inter, Arial, sans-serif">SUMMARY</text>
      <text x="150" y="488" fill="#FAF4EC" font-size="32" font-weight="600" font-family="Inter, Arial, sans-serif">${summary.slice(0, 1100)}</text>

      <text x="110" y="690" fill="#F9EFE4" font-size="28" font-weight="700" font-family="Inter, Arial, sans-serif">Paleta recomendada</text>
      <g transform="translate(110 730)">${paletteRows}</g>

      <text x="110" y="1236" fill="#F9EFE4" font-size="28" font-weight="700" font-family="Inter, Arial, sans-serif">Colores a evitar</text>
      <g transform="translate(110 1276)">${avoidRows}</g>

      <text x="760" y="1236" fill="#F9EFE4" font-size="28" font-weight="700" font-family="Inter, Arial, sans-serif">Mejores encajes</text>
      <g transform="translate(760 1276)">${bestRows}</g>

      <rect x="110" y="1600" width="1180" height="120" rx="30" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" />
      <text x="150" y="1650" fill="#F8F0E4" font-size="20" font-weight="700" letter-spacing="2" font-family="Inter, Arial, sans-serif">NEXT STEP</text>
      <text x="150" y="1690" fill="#DCCFBE" font-size="24" font-weight="500" font-family="Inter, Arial, sans-serif">Usa estas bases para construir outfits, maquillaje y fondo fotográfico coherentes.</text>
    </svg>
  `)}`
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
  const [previewUrl, setPreviewUrl] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)
  const previewUrlRef = useRef('')

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
      }
    }
  }, [])

  const generatedImage = analysis ? dataUrlToSvg(analysis.season || 'Informe cromático', analysis) : ''

  const handleFileSelect = (event) => {
    const [file] = event.target.files || []
    if (!file) return

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
    }

    const nextPreviewUrl = URL.createObjectURL(file)
    previewUrlRef.current = nextPreviewUrl
    setPreviewUrl(nextPreviewUrl)
    setSelectedFile(file)
    setError('')
    setAnalysis(null)
  }

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleGenerate = async () => {
    if (!selectedFile || isLoading) return

    try {
      setIsLoading(true)
      setError('')

      const imageDataUrl = await fileToDataUrl(selectedFile)
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageDataUrl,
          mimeType: selectedFile.type || 'image/jpeg',
          fileName: selectedFile.name,
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.error || 'No fue posible generar el reporte')
      }

      setAnalysis(payload.analysis)
    } catch (requestError) {
      setError(requestError.message || 'Hubo un problema al generar la imagen')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadGeneratedImage = () => {
    if (!generatedImage) return

    const link = document.createElement('a')
    link.href = generatedImage
    link.download = 'colorimeter-report.svg'
    link.click()
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={16} />
            Gemini color analysis
          </div>
          <h1>Tu colorimetría, convertida en una pieza visual limpia y premium.</h1>
          <p>
            Sube una selfie o foto tipo carnet y obtén una infografía con los tonos que
            mejor armonizan con tu piel, cabello y ojos, además de los colores a evitar.
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
              <ImageDown size={16} />
              Resultado tipo infografía
            </span>
          </div>
        </div>

        <div className="hero-badge">
          <div>
            <strong>Diseño minimalista</strong>
            <span>Impactante, oscuro, editorial.</span>
          </div>
          <ArrowRight size={18} />
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

          <button type="button" className="generate-button" onClick={handleGenerate} disabled={!selectedFile || isLoading}>
            {isLoading ? (
              <>
                <LoaderCircle size={18} className="spin" />
                Generando reporte...
              </>
            ) : (
              <>
                Generar imagen
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {error ? <div className="error-banner">{error}</div> : null}
        </article>

        <article className="panel result-panel">
          <div className="panel-head">
            <div>
              <span className="panel-kicker">Paso 2</span>
              <h2>Resultado generado</h2>
            </div>
              <button type="button" className="ghost-button" onClick={downloadGeneratedImage} disabled={!generatedImage}>
              Descargar
            </button>
          </div>

          <div className="result-stage">
            {isLoading ? (
              <div className="loading-state">
                <LoaderCircle size={34} className="spin" />
                <strong>Analizando rasgos y construyendo la infografía</strong>
                <span>Gemini está clasificando armonía, contrastes y paletas recomendadas.</span>
              </div>
            ) : generatedImage ? (
              <img className="result-image" src={generatedImage} alt="Infografía generada con recomendaciones de color" />
            ) : (
              <div className="empty-result">
                <strong>El resultado aparecerá aquí</strong>
                <span>Al generar, verás una composición vertical lista para usar o compartir.</span>
              </div>
            )}
          </div>

          <div className="insight-grid">
            <div className="insight-card">
              <span>Paleta</span>
              <strong>{analysis?.palette?.length ?? 4} tonos</strong>
            </div>
            <div className="insight-card">
              <span>Evitar</span>
              <strong>{analysis?.avoid_colors?.length ?? 4} grupos</strong>
            </div>
            <div className="insight-card">
              <span>Lectura</span>
              <strong>{analysis?.season || 'Pendiente'}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="bottom-grid">
        <article className="detail-card">
          <span className="detail-label">Lo que devuelve Gemini</span>
          <p>
            La API genera una lectura cromática estructurada para que la interfaz pueda transformarla en una infografía limpia y consistente.
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
