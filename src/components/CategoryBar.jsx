import React from "react"
import { useTranslation } from "react-i18next"

// Map raw category strings from JSON to safe i18n keys
const KEY_MAP = {
    Signature: "signature",
    Premium: "premium",
    Hot: "hot",
    Cold: "cold",
    COLD: "cold",
    "Frappe/Smothies": "frappe_smoothies",   // common typo in data
    "Frappe/Smoothies": "frappe_smoothies",
    "FRAPPE/SMOOTHIES": "frappe_smoothies",
    "Tea/Passion/Soda": "tea_passion_soda",
    "TEA/PASSION/SODA": "tea_passion_soda",
    Food: "food",
    FOOD: "food",
}

// Unicode-safe normalizer for any unexpected labels
const normalize = (s) =>
    (s || "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "_") // collapse spaces/symbols to _
        .replace(/^_+|_+$/g, "")          // trim underscores
    || s

export default function CategoryBar({ categories, active, onChange }) {
    const { t } = useTranslation()

    const labelFor = (cat) => {
        if (cat === "All") return t("menu.all", "All")

        const norm = KEY_MAP[cat] || normalize(cat)
        const normKey = `menu.categories.${norm}`
        const rawKey = `menu.categories.${cat}`

        // Try normalized key → fall back to raw JSON key → fall back to the original label
        return t(normKey, t(rawKey, cat))
    }

    return (
        <div className="flex gap-2 overflow-x-auto py-2">
            {["All", ...categories].map((cat) => (
                <button
                    key={cat}
                    onClick={() => onChange(cat)}
                    className={`px-3 py-1.5 whitespace-nowrap rounded-full border transition
          ${active === cat
                        ? "bg-brand-gradient text-white border-transparent"
                        : "bg-white hover:bg-gray-50 border-gray-200"}`}
                    aria-pressed={active === cat}
                >
                    {labelFor(cat)}
                </button>
            ))}
        </div>
    )
}
