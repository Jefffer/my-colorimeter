import { LoaderCircle } from 'lucide-react'
import '../styles/LoadingOverlay.css'

export function LoadingOverlay({ isVisible, message = 'Analizando con Gemini...', submessage = '' }) {
  if (!isVisible) return null

  return (
    <div className="loading-overlay">
      <div className="loading-overlay-content">
        <div className="loading-spinner">
          <LoaderCircle size={48} />
        </div>
        <h2>{message}</h2>
        {submessage && <p>{submessage}</p>}
      </div>
    </div>
  )
}
