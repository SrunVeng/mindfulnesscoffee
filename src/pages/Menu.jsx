import React, { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { motion, useReducedMotion } from "framer-motion"
import data from "../data/products.json"
import CategoryBar from "../components/CategoryBar.jsx"
import ProductCard from "../components/ProductCard.jsx"

export default function Menu() {
    const { t, i18n } = useTranslation()
    const prefersReduced = useReducedMotion()

    // unique categories in file order
    const allCategories = useMemo(() => {
        const seen = new Set()
        return data.map(d => d.category).filter(c => !seen.has(c) && seen.add(c))
    }, [])

    const [active, setActive] = useState("All")
    const [query, setQuery] = useState("")

    const items = useMemo(() => {
        const chosen = active === "All" ? data : data.filter(d => d.category === active)
        const flat = chosen.flatMap(d => d.items.map(it => ({ ...it, _category: d.category })))
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
        <section className="relative mx-auto max-w-6xl px-4 py-12">
            {/* Ambient background */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-24 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-100 via-orange-50 to-transparent blur-3xl opacity-70" />
                <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-gradient-to-tr from-amber-200/50 to-white/0 blur-2xl" />
                <div className="absolute inset-0 mix-blend-multiply [background-image:radial-gradient(#000/6_1px,transparent_1px)] [background-size:12px_12px] opacity-[0.06]" />
            </div>

            {/* Header card */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded-2xl border border-[#e7dbc9] bg-[#fffaf3] p-6 shadow-sm">
                <h1 className="text-3xl font-extrabold text-[#2d1a14]">{t("menu.title")}</h1>

                <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                    <div className="flex-1">
                        <CategoryBar categories={allCategories} active={active} onChange={setActive} />
                    </div>

                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder={t("menu.search_placeholder")}
                        className="w-full md:w-72 px-3 py-2 rounded-xl border border-[#e7dbc9] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#c9a44c] shadow-sm"
                    />
                </div>
            </motion.div>

            {/* Grid */}
            <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
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
