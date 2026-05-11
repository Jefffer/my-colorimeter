import { LoaderCircle } from 'lucide-react'

export function LoadingOverlay({ isVisible, message = 'Analizando...', submessage = '' }) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-page/72 px-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-surface/90 p-8 text-center shadow-elevated">
        <div className="mb-5 flex justify-center">
          <LoaderCircle size={48} className="animate-spin text-accent" />
        </div>
        <h2 className="text-xl font-semibold tracking-[-0.04em] text-text">{message}</h2>
        {submessage ? <p className="mt-3 text-sm leading-6 text-muted">{submessage}</p> : null}
      </div>
    </div>
  )
}
