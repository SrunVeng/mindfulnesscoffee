import React, { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { motion, useReducedMotion } from "framer-motion"
import data from "../data/products.json"
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

    const sameCat = (a, b) =>
        (a || "").trim().toLowerCase() === (b || "").trim().toLowerCase()

    // Unique categories in file order (NO "All" here)
    const categories = useMemo(() => {
        const seen = new Set()
        return data
            .map(d => d.category || "")
            .filter(c => {
                const k = c.trim().toLowerCase()
                if (!k || k === "all" || seen.has(k)) return false
                seen.add(k)
                return true
            })
    }, [])

    // Reorder for display so Signature/Premium/Hot Drink(s) are first (if present)
    const displayCategories = useMemo(() => {
        const norm = s => (s || "").trim().toLowerCase()
        const priority = ["signature", "premium", "hot drink", "hot drinks"]
        const pinned = categories.filter(c => priority.includes(norm(c)))
        const rest = categories.filter(c => !priority.includes(norm(c)))
        return [...pinned, ...rest]
    }, [categories])

    // Items (filtered by category + search)
    const items = useMemo(() => {
        const buckets = active === "All"
            ? data
            : data.filter(d => sameCat(d.category, active))

        const flat = buckets.flatMap(d =>
            (d.items || []).map(it => ({ ...it, _category: d.category }))
        )

        const q = query.trim().toLowerCase()
        if (!q) return flat

        return flat.filter(it =>
            (it.name?.en || "").toLowerCase().includes(q) ||
            (it.name?.zh || "").toLowerCase().includes(q) ||
            (it.name?.km || "").toLowerCase().includes(q)
        )
    }, [active, query])

    const fadeUp = {
        hidden: { opacity: 0, y: prefersReduced ? 0 : 18, filter: "blur(6px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
    }

    const stagger = {
        hidden: {},
        show: { transition: { staggerChildren: prefersReduced ? 0 : 0.05, delayChildren: prefersReduced ? 0 : 0.06 } },
    }

    return (
        <section className="relative mx-auto max-w-6xl px-8 py-20">
            {/* Ambient background */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-24 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-100 via-orange-50 to-transparent blur-3xl opacity-70" />
                <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-gradient-to-tr from-amber-200/50 to-white/0 blur-2xl" />
                <div className="absolute inset-0 mix-blend-multiply [background-image:radial-gradient(#000/6_1px,transparent_1px)] [background-size:12px_12px] opacity-[0.06]" />
            </div>

            {/* Header card */}
            <motion.div
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
            </motion.div>

            {/* Grid: 2 items per row on mobile, 3 on large screens */}
            <motion.div
                key={`${active}-${query}`}
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
            >
                {items.map(it => (
                    <motion.div key={it.id} variants={fadeUp}>
                        <ProductCard item={it} lang={i18n.language} />
                    </motion.div>
                ))}
            </motion.div>
        </section>
    )
}
