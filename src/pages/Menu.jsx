import React, { useMemo, useState, useDeferredValue, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { motion as Motion, useReducedMotion } from "framer-motion"
import useProducts from "../hooks/useProducts.js"
import CategoryBar from "../components/CategoryBar.jsx"
import ProductCard from "../components/ProductCard.jsx"
import { labelForCategory } from "../utils/categoryI18n.js"

const PAGE_SIZE = 12 // adjust as needed

function Pagination({ page, pageCount, onChange }) {
    if (pageCount <= 1) return null
    const go = (p) => onChange(Math.min(Math.max(1, p), pageCount))

    const nums = useMemo(() => {
        const span = 2
        const start = Math.max(1, page - span)
        const end = Math.min(pageCount, page + span)
        const arr = []
        for (let i = start; i <= end; i++) arr.push(i)
        return arr
    }, [page, pageCount])

    return (
        <div className="mt-1">
            {/* Mobile: compact */}
            <div className="md:hidden flex items-center justify-center gap-2">
                <button
                    type="button"
                    onClick={() => go(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg border border-[#e7dbc9] disabled:opacity-40"
                    aria-label="Previous page"
                >
                    ‹
                </button>
                <span className="text-sm text-[#6b5545]">
                    Page {page} of {pageCount}
                </span>
                <button
                    type="button"
                    onClick={() => go(page + 1)}
                    disabled={page === pageCount}
                    className="px-3 py-1.5 rounded-lg border border-[#e7dbc9] disabled:opacity-40"
                    aria-label="Next page"
                >
                    ›
                </button>
            </div>

            {/* Desktop/Tablet: numbered */}
            <div className="hidden md:flex items-center justify-center gap-2">
                <button
                    type="button"
                    onClick={() => go(1)}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg border border-[#e7dbc9] disabled:opacity-40"
                    aria-label="First page"
                >
                    «
                </button>
                <button
                    type="button"
                    onClick={() => go(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg border border-[#e7dbc9] disabled:opacity-40"
                    aria-label="Previous page"
                >
                    ‹
                </button>

                {/* Leading ellipsis */}
                {nums[0] > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => go(1)}
                            className="px-3 py-1.5 rounded-lg border border-[#e7dbc9]"
                        >
                            1
                        </button>
                        {nums[0] > 2 && <span className="px-1 text-[#6b5545]">…</span>}
                    </>
                )}

                {nums.map((n) => {
                    const isActive = n === page
                    return (
                        <button
                            key={n}
                            type="button"
                            onClick={() => go(n)}
                            aria-current={isActive ? "page" : undefined}
                            className={[
                                "px-3 py-1.5 rounded-lg border",
                                isActive
                                    ? "border-[#2d1a14] bg-[#2d1a14] text-white"
                                    : "border-[#e7dbc9] bg-white hover:bg-[#fffaf3] text-[#2d1a14]",
                            ].join(" ")}
                        >
                            {n}
                        </button>
                    )
                })}

                {/* Trailing ellipsis */}
                {nums[nums.length - 1] < pageCount && (
                    <>
                        {nums[nums.length - 1] < pageCount - 1 && (
                            <span className="px-1 text-[#6b5545]">…</span>
                        )}
                        <button
                            type="button"
                            onClick={() => go(pageCount)}
                            className="px-3 py-1.5 rounded-lg border border-[#e7dbc9]"
                        >
                            {pageCount}
                        </button>
                    </>
                )}

                <button
                    type="button"
                    onClick={() => go(page + 1)}
                    disabled={page === pageCount}
                    className="px-3 py-1.5 rounded-lg border border-[#e7dbc9] disabled:opacity-40"
                    aria-label="Next page"
                >
                    ›
                </button>
                <button
                    type="button"
                    onClick={() => go(pageCount)}
                    disabled={page === pageCount}
                    className="px-3 py-1.5 rounded-lg border border-[#e7dbc9] disabled:opacity-40"
                    aria-label="Last page"
                >
                    »
                </button>
            </div>
        </div>
    )
}

// Mobile-only wrapped categories (no horizontal scroll)
const WrappedCategories = React.memo(function WrappedCategories({ categories, active, onChange }) {
    const { t } = useTranslation()
    const eq = (a, b) => (a || "").trim().toLowerCase() === (b || "").trim().toLowerCase()
    const chips = useMemo(() => ["All", ...categories], [categories])

    return (
        <div className="flex flex-wrap gap-2">
            {chips.map((cat) => {
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
                                : "bg-white hover:bg-[#fffaf3] text-[#2d1a14]",
                        ].join(" ")}
                        aria-pressed={isActive}
                    >
                        {labelForCategory(t, cat)}
                    </button>
                )
            })}
        </div>
    )
})

export default function Menu() {
    const { t, i18n } = useTranslation()
    const prefersReduced = useReducedMotion()

    // State
    const [active, setActive] = useState("All")
    const [query, setQuery] = useState("")
    const [page, setPage] = useState(1)

    // Centralized products data and helpers
    const { displayCategories, filterItems } = useProducts()

    // Defer the query to keep typing snappy on large lists
    const deferredQuery = useDeferredValue(query)

    // Items (filtered by category + search)
    const items = useMemo(() => filterItems(active, deferredQuery), [active, deferredQuery, filterItems])

    // Reset to first page whenever filters/search change
    useEffect(() => {
        setPage(1)
    }, [active, deferredQuery])

    const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
    const pageItems = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE
        return items.slice(start, start + PAGE_SIZE)
    }, [items, page])

    // Animation variants
    const fadeUp = useMemo(
        () => ({
            hidden: { opacity: 0, y: prefersReduced ? 0 : 18 },
            show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
        }),
        [prefersReduced]
    )

    const stagger = useMemo(
        () => ({
            hidden: {},
            show: {
                transition: {
                    staggerChildren: prefersReduced ? 0 : 0.05,
                    delayChildren: prefersReduced ? 0 : 0.06,
                },
            },
        }),
        [prefersReduced]
    )

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

                {/* Filters & search */}
                <div className="mt-4 flex flex-col gap-3">
                    {/* Mobile filter (wraps, no scroll) */}
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
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t("menu.search_placeholder", "Search drinks or food...")}
                            className="w-full md:w-72 md:flex-none md:shrink-0 px-3 py-2 rounded-xl border border-[#e7dbc9] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#c9a44c] shadow-sm"
                            aria-label={t("menu.search_aria", "Search menu")}
                        />
                    </div>

                    {/* Mobile search (stacked under wrapped chips) */}
                    <div className="md:hidden">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t("menu.search_placeholder", "Search drinks or food...")}
                            className="w-full px-3 py-2 rounded-xl border border-[#e7dbc9] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#c9a44c] shadow-sm"
                            aria-label={t("menu.search_aria", "Search menu")}
                        />
                    </div>

                    {/* Navigator (pagination) below CategoryBar */}
                    <Pagination page={page} pageCount={pageCount} onChange={setPage} />

                    {/* Results meta */}
                    <div className="text-sm text-[#6b5545]" aria-live="polite">
                        {items.length} {t("menu.results", "results")}
                        {pageCount > 1 && (
                            <> · {t("menu.showing_page", "showing page")} {page}/{pageCount}</>
                        )}
                    </div>
                </div>
            </Motion.div>

            {/* Grid */}
            <Motion.div
                key={`${active}|${deferredQuery}|${page}`}
                variants={stagger}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
            >
                {pageItems.length === 0 ? (
                    <div className="col-span-2 lg:col-span-3 text-center text-[#6b5545] py-10">
                        {t("menu.empty", "No items match your filters.")}
                        <button
                            type="button"
                            className="ml-3 px-3 py-1.5 rounded-lg border border-[#e7dbc9] text-sm hover:bg-[#fffaf3]"
                            onClick={() => {
                                setActive("All")
                                setQuery("")
                                setPage(1)
                            }}
                        >
                            {t("menu.clear_filters", "Clear filters")}
                        </button>
                    </div>
                ) : (
                    pageItems.map((it) => (
                        <Motion.div key={it.id} variants={fadeUp}>
                            <ProductCard item={it} lang={i18n.language} />
                        </Motion.div>
                    ))
                )}
            </Motion.div>
            {/* No bottom pager */}
        </section>
    )
}
