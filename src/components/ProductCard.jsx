import React, { useCallback, useState, lazy, Suspense } from "react"
import { useTranslation } from "react-i18next"
import { motion as Motion, useReducedMotion } from "framer-motion"
import { labelForCategory } from "../utils/categoryI18n.js"

const ProductCardDetail = lazy(() => import("./ProductCardDetail.jsx"))

function isNumber(n) {
    return typeof n === "number" && !Number.isNaN(n)
}

function getBaseLang(code = "en") {
    return code.split("-")[0]
}

// Map size key -> label with i18n fallbacks
function sizeLabel(t, key) {
    switch (key) {
        case "s": return t("product.size.s", "Small")
        case "m": return t("product.size.m", "Medium")
        case "l": return t("product.size.l", "Large")
        case "regular": return t("product.size.regular", "Regular")
        default: return t("product.size.regular", "Regular")
    }
}

// Normalize any price shape into variants [{key,label,price}]
function extractVariants(price, t) {
    if (isNumber(price)) return [{ key: "regular", label: sizeLabel(t, "regular"), price }]
    if (price && typeof price === "object") {
        const out = []
        const knownOrder = ["s", "m", "l", "regular"]
        for (const k of knownOrder) {
            if (isNumber(price[k])) out.push({ key: k, label: sizeLabel(t, k), price: price[k] })
        }
        for (const k of Object.keys(price)) {
            if (!knownOrder.includes(k) && isNumber(price[k])) {
                out.push({ key: k, label: sizeLabel(t, k), price: price[k] })
            }
        }
        return out
    }
    return []
}

function ProductCard({ item, lang, onAdd }) {
    const { t, i18n } = useTranslation()
    const [open, setOpen] = useState(false)
    const prefersReduced = useReducedMotion()

    const code = getBaseLang(lang || i18n.language || "en")
    const name = item?.name?.[code] ?? item?.name?.en ?? "—"

    // Build variants and price label
    const variants = extractVariants(item?.price, t)
    const hasMultiple = variants.length > 1
    const min = variants.length ? Math.min(...variants.map(v => v.price)) : null
    const priceLabel = min !== null
        ? hasMultiple ? `${t("product.from", "from")} $${min.toFixed(2)}` : `$${min.toFixed(2)}`
        : "—"

    const categoryLabel = item?._category ? labelForCategory(t, item._category) : null

    const openModal = useCallback(() => setOpen(true), [])
    const keyOpen = useCallback((e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setOpen(true)
        }
    }, [])

    return (
        <>
            <Motion.div
                className="h-full flex flex-col border border-[#e7dbc9] rounded-2xl bg-white hover:shadow-md transition cursor-pointer focus:outline-none focus:ring"
                onClick={openModal}
                onKeyDown={keyOpen}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`${name}, ${priceLabel}`}
                whileHover={prefersReduced ? undefined : { y: -2, scale: 1.01 }}
                whileTap={prefersReduced ? undefined : { scale: 0.99 }}
                style={{ contentVisibility: "auto" }}
            >
                {/* Image area: constant aspect ratio, show full image (no crop) */}
                <div className="relative w-full aspect-[4/3] rounded-t-2xl bg-gray-50 overflow-hidden">
                    <img
                        src={item.image}
                        alt={name}
                        className="absolute inset-0 w-full h-full object-contain"
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                </div>

                {/* Text area: fixed layout to equalize heights */}
                <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-baseline justify-between gap-2">
                        <h3
                                className="font-semibold text-sm leading-tight text-[#2d1a14]"
                            style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                minHeight: "2.3em" // reserve space for up to 2 lines
                            }}
                            title={name}
                        >
                            {name}
                        </h3>
                    </div>
                    <span className="text-sm text-bg-brand-light shrink-0">{priceLabel}</span>
                    {/* Reserve exactly one line for category (keeps card heights identical) */}
                    <div className="text-xs text-gray-500 mt-1 min-h-[1rem]">
                        {categoryLabel ?? "\u00A0"}
                    </div>

                    {/* Spacer to push content to top if needed (keeps bottom padding consistent) */}
                    <div className="mt-auto" />
                </div>
            </Motion.div>

            {open && (
                <Suspense fallback={null}>
                    <ProductCardDetail
                        open={open}
                        item={item}
                        lang={code}
                        onClose={() => setOpen(false)}
                        onAdd={onAdd}
                    />
                </Suspense>
            )}
        </>
    )
}

function shallowEqual(a, b) {
    if (a === b) return true
    if (!a || !b) return false
    return (
        a.id === b.id &&
        a.image === b.image &&
        a._category === b._category &&
        JSON.stringify(a.name) === JSON.stringify(b.name)
    )
}

export default React.memo(ProductCard, (prev, next) => {
    if (prev.lang !== next.lang) return false
    if (prev.onAdd !== next.onAdd) return false
    return shallowEqual(prev.item, next.item)
})
