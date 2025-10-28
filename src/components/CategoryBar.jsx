import React from "react"
import { useTranslation } from "react-i18next"
import { labelForCategory } from "../utils/categoryI18n.js"

function CategoryBar({ categories, active, onChange }) {
    const { t } = useTranslation()

    return (
        <div className="flex gap-2 overflow-x-auto py-2">
            {["All", ...categories].map((cat) => {
                const isActive = active === cat
                return (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => onChange(cat)}
                        className={[
                            "px-3 py-1.5 whitespace-nowrap rounded-full border transition",
                            isActive
                                ? "bg-brand-dark text-white border-transparent"
                                : "bg-white hover:bg-gray-50 border-gray-200",
                        ].join(" ")}
                        aria-pressed={isActive}
                    >
                        {labelForCategory(t, cat)}
                    </button>
                )
            })}
        </div>
    )
}

export default React.memo(CategoryBar)
