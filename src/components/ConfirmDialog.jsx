import { useEffect, useRef } from 'react'

export default function ConfirmDialog({ open, title, children, confirmLabel, cancelLabel = 'Cancel', tone = 'accent', onConfirm, onCancel }) {
  const confirmRef = useRef(null)

  useEffect(() => {
    if (!open) return
    confirmRef.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  const confirmClass = tone === 'danger' ? 'bg-bad text-on-bad hover:opacity-90' : 'bg-accent text-on-accent hover:opacity-90'

  return (
    <div className="gutter fixed inset-0 z-50 flex items-end justify-center bg-scrim py-6 sm:items-center" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="rise w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-card"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-title" className="font-display text-xl font-bold">
          {title}
        </h2>
        <div className="mt-3 text-[15px] text-muted">{children}</div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 rounded-xl border border-line px-5 font-semibold text-ink transition-colors hover:bg-sunken"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={`h-11 rounded-xl px-5 font-semibold transition-opacity ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
