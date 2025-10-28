import React, { useEffect, useRef, useState, useMemo } from "react"
import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"
import { X } from "lucide-react"
import { labelForCategory } from "../utils/categoryI18n.js"

function isNumber(n) {
    return typeof n === "number" && !Number.isNaN(n)
}
function getBaseLang(code = "en") {
    return code.split("-")[0]
}

// Translate size key -> label with fallbacks (includes "regular")
function sizeLabel(t, key) {
    switch (key) {
        case "s": return t("product.size.s", "Small")
        case "m": return t("product.size.m", "Medium")
        case "l": return t("product.size.l", "Large")
        case "regular": return t("product.size.regular", "Regular")
        default:  return t("product.size.regular", "Regular")
    }
}

// Normalize any price shape into variants [{key,label,price}]
function extractVariants(price, t) {
    if (isNumber(price)) {
        return [{ key: "regular", label: sizeLabel(t, "regular"), price }]
    }
    if (price && typeof price === "object") {
        const out = []
        const knownOrder = ["s", "m", "l", "regular"]
        for (const k of knownOrder) {
            if (isNumber(price[k])) out.push({ key: k, label: sizeLabel(t, k), price: price[k] })
        }
        // Include any other numeric keys just in case
        for (const k of Object.keys(price)) {
            if (!knownOrder.includes(k) && isNumber(price[k])) {
                out.push({ key: k, label: sizeLabel(t, k), price: price[k] })
            }
        }
        return out
    }
    return []
}

function ProductCardDetail({ open, item, lang, onClose, onAdd }) {
    const { t, i18n } = useTranslation()
    const code = getBaseLang(lang || i18n.language || "en")
    const name = item?.name?.[code] ?? item?.name?.en ?? "—"
    const desc = item?.desc?.[code] ?? item?.desc?.en ?? ""
    const categoryLabel = item?._category ? labelForCategory(t, item._category) : ""

    // Build variants from { s,m,l } OR { regular } OR number
    const variants = useMemo(() => extractVariants(item?.price, t), [item, t])
    const [size, setSize] = useState(variants[0]?.key)

    // Reset when opening or when the variants set changes
    useEffect(() => setSize(variants[0]?.key), [open, variants])
    const current = variants.find(v => v.key === size) || variants[0]

    const closeBtnRef = useRef(null)
    const dialogRef = useRef(null)

    useEffect(() => {
        if (!open) return
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        const tmr = setTimeout(() => closeBtnRef.current?.focus(), 0)

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
            clearTimeout(tmr)
        }
    }, [open, onClose])

    if (!open || !item) return null

    const handleOverlay = (e) => {
        if (e.target === e.currentTarget) onClose?.()
    }

    const handleAdd = () => {
        if (!onAdd || !current) return
        onAdd({
            ...item,
            selectedSize: current.key,
            selectedPrice: current.price,
        })
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
                    type="button"
                    ref={closeBtnRef}
                    onClick={onClose}
                    aria-label={t("product.close", "Close")}
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
                            className="w-full h-full md:h-full object-cover"
                            loading="lazy"
                        />
                    </div>

                    {/* Info */}
                    <div className="p-5 md:p-6 bg-[#fffdf9]">
                        <div className="text-sm text-gray-500">{categoryLabel}</div>
                        <h2 id={`product-title-${item.id}`} className="text-2xl font-semibold mt-1 text-[#2d1a14]">
                            {name}
                        </h2>

                        {current && (
                            <div className="mt-2 text-2xl font-extrabold text-[#2d1a14]">
                                ${current.price.toFixed(2)}
                            </div>
                        )}

                        {desc && (
                            <p className="mt-4 text-[#6b5545] leading-7">
                                {desc}
                            </p>
                        )}

                        {/* Size picker — only when there are multiple sizes */}
                        {variants.length > 1 && (
                            <div className="mt-5">
                                <div className="text-sm text-[#6b5545] mb-2">
                                    {t("product.size.label", "Size")}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {variants.map(v => (
                                        <button
                                            key={v.key}
                                            onClick={() => setSize(v.key)}
                                            className={[
                                                "px-3 py-2 rounded-xl border transition",
                                                size === v.key
                                                    ? "border-[#1f4d28] bg-[#fffaf3] text-[#2d1a14]"
                                                    : "border-[#e7dbc9] hover:bg-[#fffaf3]"
                                            ].join(" ")}
                                            aria-pressed={size === v.key}
                                            aria-label={`${t("product.size.label", "Size")}: ${v.label}`}
                                        >
                                            <span className="font-medium">{v.label}</span>
                                            <span className="ml-2 text-sm opacity-80">${v.price.toFixed(2)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex gap-3">
                            {onAdd && (
                                <button
                                    onClick={handleAdd}
                                    className="px-4 py-2 rounded-xl text-white bg-[var(--brand-accent)] shadow-sm transition hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {t("product.add_to_order", "Add to order")}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                            >
                                {t("product.close", "Close")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default React.memo(ProductCardDetail)
