import React, { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"
import { X } from "lucide-react"

export default function ProductCardDetail({ open, item, lang, onClose, onAdd }) {
    const { i18n } = useTranslation()
    const code = lang || i18n.language || "en"
    const name = item?.name?.[code] ?? item?.name?.en ?? "—"
    const desc = item?.desc?.[code] ?? item?.desc?.en ?? ""
    const closeBtnRef = useRef(null)
    const dialogRef = useRef(null)

    useEffect(() => {
        if (!open) return
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        const t = setTimeout(() => closeBtnRef.current?.focus(), 0)

        const onKey = (e) => {
            if (e.key === "Escape") onClose?.()
            if (e.key === "Tab") {
                const focusable = dialogRef.current?.querySelectorAll(
                    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
                )
                if (!focusable || focusable.length === 0) return
                const list = Array.from(focusable)
                const first = list[0]
                const last = list[list.length - 1]
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault()
                    last.focus()
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault()
                    first.focus()
                }
            }
        }
        window.addEventListener("keydown", onKey)

        return () => {
            document.body.style.overflow = prev
            window.removeEventListener("keydown", onKey)
            clearTimeout(t)
        }
    }, [open, onClose])

    if (!open || !item) return null

    const handleOverlay = (e) => {
        if (e.target === e.currentTarget) onClose?.()
    }

    return createPortal(
        <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onMouseDown={handleOverlay}
            aria-hidden={false}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`product-title-${item.id}`}
                className="relative w-full max-w-3xl rounded-2xl bg-white border border-[#e7dbc9] shadow-xl overflow-hidden"
                onMouseDown={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <button
                    ref={closeBtnRef}
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-3 right-3 p-2 rounded-lg border border-[#e7dbc9] hover:bg-[#fffaf3] focus:outline-none focus:ring"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="grid md:grid-cols-2">
                    {/* Image */}
                    <div className="relative bg-gray-50">
                        <img
                            src={item.image}
                            alt={name}
                            className="w-full h-64 md:h-full object-cover"
                            loading="lazy"
                        />
                    </div>

                    {/* Info */}
                    <div className="p-5 md:p-6 bg-[#fffdf9]">
                        <div className="text-sm text-gray-500">{item._category ?? ""}</div>
                        <h2 id={`product-title-${item.id}`} className="text-2xl font-semibold mt-1 text-[#2d1a14]">
                            {name}
                        </h2>

                        <div className="mt-2 text-2xl font-extrabold text-[#2d1a14]">
                            ${item.price?.toFixed?.(2) ?? "—"}
                        </div>

                        {desc && (
                            <p className="mt-4 text-[#6b5545] leading-7">
                                {desc}
                            </p>
                        )}

                        <div className="mt-6 flex gap-3">
                            {onAdd && (
                                <button
                                    onClick={() => onAdd(item)}
                                    className="px-4 py-2 rounded-xl text-white bg-[var(--brand-accent)] shadow-sm transition hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Add to order
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-xl border border-[#e7dbc9] hover:bg-[#fffaf3]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}
