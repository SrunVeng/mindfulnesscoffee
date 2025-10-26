import React, { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import data from "../data/products.json"
import CategoryBar from "../components/CategoryBar.jsx"
import ProductCard from "../components/ProductCard.jsx"

export default function Menu() {
    const { t, i18n } = useTranslation()
    const allCategories = useMemo(() => data.map(d => d.category), [])
    const [active, setActive] = useState("All")
    const [query, setQuery] = useState("")

    const items = useMemo(() => {
        const chosen = active === "All" ? data : data.filter(d => d.category === active)
        const flat = chosen.flatMap(d => d.items.map(it => ({ ...it, _category: d.category })))
        if (!query.trim()) return flat
        const q = query.toLowerCase()
        return flat.filter(it =>
            (it.name?.en || "").toLowerCase().includes(q) ||
            (it.name?.zh || "").toLowerCase().includes(q) ||
            (it.name?.km || "").toLowerCase().includes(q)
        )
    }, [active, query])

    return (
        <section className="mx-auto max-w-6xl px-4 py-10">
            <h1 className="text-3xl font-bold mb-4">{t("menu.title")}</h1>

            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                <div className="flex-1">
                    <CategoryBar
                        categories={allCategories}
                        active={active}
                        onChange={setActive}
                    />
                </div>

                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={t("menu.search_placeholder")}
                    className="w-full md:w-72 px-3 py-2 border rounded-lg"
                />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {items.map(it => (
                    <ProductCard key={it.id} item={it} lang={i18n.language} />
                ))}
            </div>
        </section>
    )
}
