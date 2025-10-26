import React, { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import ProductCardDetail from "./ProductCardDetail.jsx"

/**
 * Clickable product card showing an image.
 * Opens a modal with details.
 *
 * Props:
 * - item
 * - lang?
 * - onAdd?: (item) => void   // optional hook for a cart flow
 */
export default function ProductCard({ item, lang, onAdd }) {
    const { i18n } = useTranslation()
    const [open, setOpen] = useState(false)

    const code = lang || i18n.language || "en"
    const name = item.name?.[code] ?? item.name?.en ?? "—"
    const price = item.price?.toFixed?.(2) ?? "—"

    const openModal = useCallback(() => setOpen(true), [])
    const keyOpen = useCallback((e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setOpen(true)
        }
    }, [])

    return (
        <>
            <div
                className="border rounded-xl bg-white hover:shadow-md transition cursor-pointer focus:outline-none focus:ring"
                onClick={openModal}
                onKeyDown={keyOpen}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`${name}, $${price}`}
            >
                {/* Image always visible */}
                <div className="w-full h-40 overflow-hidden rounded-t-xl bg-gray-50">
                    <img
                        src={item.image}
                        alt={name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>

                {/* Text */}
                <div className="p-4">
                    <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-semibold leading-tight">{name}</h3>
                        <span className="text-sm text-gray-600">${price}</span>
                    </div>
                    {/* Optional category hint */}
                    {item._category && (
                        <div className="text-xs text-gray-500 mt-1">{item._category}</div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <ProductCardDetail
                open={open}
                item={item}
                lang={code}
                onClose={() => setOpen(false)}
                onAdd={onAdd}
            />
        </>
    )
}
