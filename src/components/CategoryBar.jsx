import React from "react"
import { useTranslation } from "react-i18next"

export default function CategoryBar({ categories, active, onChange }) {
    const { t } = useTranslation()
    return (
        <div className="flex gap-2 overflow-x-auto py-2">
            {["All", ...categories].map(cat => (
                <button
                    key={cat}
                    onClick={() => onChange(cat)}
                    className={`px-3 py-1.5 whitespace-nowrap rounded-full border transition
            ${active === cat ? "bg-brand-gradient text-white border-transparent"
                        : "bg-white hover:bg-gray-50 border-gray-200"}`}
                >
                    {cat === "All" ? "All" : t(`menu.categories.${cat}`)}
                </button>
            ))}
        </div>
    )
}
