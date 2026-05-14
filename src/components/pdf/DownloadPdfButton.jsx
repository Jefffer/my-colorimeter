import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import InfographicDocument from './InfographicDocument'
import { LoaderCircle } from 'lucide-react'

export default function DownloadPdfButton({ report, previewUrl, fileName = 'ToneMap-Infographic.pdf' }) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    if (!report) return
    try {
      setIsGenerating(true)
      const doc = <InfographicDocument report={report} previewUrl={previewUrl} />
      const asPdf = pdf()
      asPdf.updateContainer(doc)
      const blob = await asPdf.toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Error generando PDF', e)
      alert('No fue posible generar el PDF. Intenta nuevamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={!report || isGenerating}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-linear-to-r from-accent via-[#f7dfb7] to-accent-soft px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <>
          <LoaderCircle size={16} className="animate-spin" /> Generando PDF...
        </>
      ) : (
        'Descargar PDF'
      )}
    </button>
  )
}
