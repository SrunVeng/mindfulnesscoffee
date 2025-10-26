import React, { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { motion, useReducedMotion } from "framer-motion"
import ProductCardDetail from "./ProductCardDetail.jsx"

function isNumber(n) {
    return typeof n === "number" && !Number.isNaN(n)
}

function getBaseLang(code = "en") {
    return code.split("-")[0]
}

export default function ProductCard({ item, lang, onAdd }) {
    const { i18n } = useTranslation()
    const [open, setOpen] = useState(false)
    const prefersReduced = useReducedMotion()

    const code = getBaseLang(lang || i18n.language || "en")
    const name = item?.name?.[code] ?? item?.name?.en ?? "—"

    // Support either a single number or a size map { s, m, l }
    const hasVariants =
        item && typeof item.price === "object" && (isNumber(item.price.s) || isNumber(item.price.m) || isNumber(item.price.l))

    const prices = hasVariants
        ? ["s", "m", "l"].map(k => item.price[k]).filter(isNumber)
        : isNumber(item?.price) ? [item.price] : []

    const min = prices.length ? Math.min(...prices) : null
    const priceLabel = min !== null ? `${hasVariants ? "from " : ""}$${min.toFixed(2)}` : "—"

    const openModal = useCallback(() => setOpen(true), [])
    const keyOpen = useCallback((e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setOpen(true)
        }
    }, [])

    return (
        <>
            <motion.div
                className="border border-[#e7dbc9] rounded-2xl bg-white hover:shadow-md transition cursor-pointer focus:outline-none focus:ring"
                onClick={openModal}
                onKeyDown={keyOpen}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`${name}, ${priceLabel}`}
                whileHover={prefersReduced ? undefined : { y: -2, scale: 1.01 }}
                whileTap={prefersReduced ? undefined : { scale: 0.99 }}
            >
                {/* Image */}
                <div className="w-full h-40 overflow-hidden rounded-t-2xl bg-gray-50">
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
                        <h3 className="font-semibold leading-tight text-[#2d1a14]">{name}</h3>
                        <span className="text-sm text-[#6b5545]">{priceLabel}</span>
                    </div>
                    {item._category && (
                        <div className="text-xs text-gray-500 mt-1">{item._category}</div>
                    )}
                </div>
            </motion.div>

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
