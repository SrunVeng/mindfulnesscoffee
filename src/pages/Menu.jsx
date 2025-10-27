import React, { useMemo, useState, useDeferredValue } from "react"
import { useTranslation } from "react-i18next"
import { motion as Motion, useReducedMotion } from "framer-motion"
import useProducts from "../hooks/useProducts.js"
import CategoryBar from "../components/CategoryBar.jsx"
import ProductCard from "../components/ProductCard.jsx"

// Mobile-only wrapped categories (no horizontal scroll)
function WrappedCategories({ categories, active, onChange }) {
    const eq = (a, b) => (a || "").trim().toLowerCase() === (b || "").trim().toLowerCase()
    const chips = useMemo(() => ["All", ...categories], [categories])

    return (
        <div className="flex flex-wrap gap-2">
            {chips.map(cat => {
                const isActive = eq(cat, active)
                return (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => onChange(cat)}
                        className={[
                            "px-3 py-1.5 rounded-xl border text-sm transition",
                            "border-[#e7dbc9]",
                            isActive
                                ? "bg-[#2d1a14] text-white"
                                : "bg-white hover:bg-[#fffaf3] text-[#2d1a14]"
                        ].join(" ")}
                        aria-pressed={isActive}
                    >
                        {cat}
                    </button>
                )
            })}
        </div>
    )
}

export default function Menu() {
    const { t, i18n } = useTranslation()
    const prefersReduced = useReducedMotion()

    // State first (avoid TDZ issues)
    const [active, setActive] = useState("All")
    const [query, setQuery] = useState("")


    // Centralized products data and helpers
    const { displayCategories, filterItems } = useProducts()

    // Defer the query to keep typing snappy on large lists
    const deferredQuery = useDeferredValue(query)

    // Items (filtered by category + search)
    const items = useMemo(() => {
        return filterItems(active, deferredQuery)
    }, [active, deferredQuery, filterItems])

    // Memoized animation variants (avoid re-creating objects and drop costly CSS blur)
    const fadeUp = useMemo(() => ({
        hidden: { opacity: 0, y: prefersReduced ? 0 : 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    }), [prefersReduced])

    const stagger = useMemo(() => ({
        hidden: {},
        show: { transition: { staggerChildren: prefersReduced ? 0 : 0.05, delayChildren: prefersReduced ? 0 : 0.06 } },
    }), [prefersReduced])

    return (
        <section className="relative mx-auto max-w-6xl px-8 py-20">
            {/* Ambient background */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-24 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-100 via-orange-50 to-transparent blur-3xl opacity-70" />
                <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-gradient-to-tr from-amber-200/50 to-white/0 blur-2xl" />
                <div className="absolute inset-0 mix-blend-multiply [background-image:radial-gradient(#000/6_1px,transparent_1px)] [background-size:12px_12px] opacity-[0.06]" />
            </div>

            {/* Header card */}
            <Motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="rounded-2xl border border-[#e7dbc9] bg-[#fffaf3] p-6 shadow-sm"
            >
                <h1 className="text-3xl font-extrabold text-[#2d1a14]">
                    {t("menu.title", "Our Menu")}
                </h1>

                {/* On mobile: wrapped chips (no scroll). On md+: original CategoryBar */}
                <div className="mt-4 flex flex-col gap-3">
                    {/* Mobile filter (always visible, wraps to multiple lines) */}
                    <div className="md:hidden">
                        <WrappedCategories
                            categories={displayCategories}
                            active={active}
                            onChange={setActive}
                        />
                    </div>

                    {/* Desktop/tablet filter */}
                    <div className="hidden md:flex md:flex-row md:items-center md:gap-6">
                        <div className="flex-1 min-w-0">
                            <CategoryBar
                                categories={displayCategories}
                                active={active}
                                onChange={setActive}
                            />
                        </div>

                        <input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder={t("menu.search_placeholder", "Search drinks or food...")}
                            className="w-full md:w-72 md:flex-none md:shrink-0 px-3 py-2 rounded-xl border border-[#e7dbc9] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#c9a44c] shadow-sm"
                            aria-label={t("menu.search_aria", "Search menu")}
                        />
                    </div>

                    {/* Mobile search (stacked under wrapped chips) */}
                    <div className="md:hidden">
                        <input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder={t("menu.search_placeholder", "Search drinks or food...")}
                            className="w-full px-3 py-2 rounded-xl border border-[#e7dbc9] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#c9a44c] shadow-sm"
                            aria-label={t("menu.search_aria", "Search menu")}
                        />
                    </div>
                </div>
            </Motion.div>

            {/* Grid: 2 items per row on mobile, 3 on large screens */}
            <Motion.div
                key={`${active}|${deferredQuery}`}
                variants={stagger}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
            >
                {items.length === 0 ? (
                    <div className="col-span-2 lg:col-span-3 text-center text-[#6b5545] py-10">
                        {t("menu.empty", "No items match your filters.")}
                        <button
                            type="button"
                            className="ml-3 px-3 py-1.5 rounded-lg border border-[#e7dbc9] text-sm hover:bg-[#fffaf3]"
                            onClick={() => { setActive("All"); setQuery(""); }}
                        >
                            {t("menu.clear_filters", "Clear filters")}
                        </button>
                    </div>
                ) : (
                    items.map(it => (
                        <Motion.div key={it.id} variants={fadeUp}>
                            <ProductCard item={it} lang={i18n.language} />
                        </Motion.div>
                    ))
                )}
            </Motion.div>
        </section>
    )
}
