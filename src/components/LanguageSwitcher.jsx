import React, { useState } from "react"
import { useTranslation } from "react-i18next"
// import { Flag as FlagIcon } from "lucide-react" // not used
import { GB as GBFlag, CN as CNFlag, KH as KHFlag } from "country-flag-icons/react/3x2"

const LANGS = [
    { code: "en", label: "English", Flag: GBFlag },
    { code: "zh", label: "中文",    Flag: CNFlag },
    { code: "km", label: "ខ្មែរ",   Flag: KHFlag }
]

export default function LanguageSwitcher({ compact = false }) {
    const { i18n, t } = useTranslation()
    const [open, setOpen] = useState(false)

    const base = (i18n.language || "en").split("-")[0]
    const current = LANGS.find(l => l.code === base) || LANGS[0]

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50"
                aria-haspopup="menu"
                aria-expanded={open}
                title={t("nav.language")}
            >
                <current.Flag className="h-4 w-6 rounded-[2px] shadow-sm" title={current.label} />
                {!compact && <span className="text-sm">{current.label}</span>}
            </button>

            {open && (
                <div
                    className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg overflow-hidden z-50"
                    role="menu"
                >
                    {LANGS.map((l) => (
                        <button
                            key={l.code}
                            onClick={() => { i18n.changeLanguage(l.code); setOpen(false) }}
                            className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 ${
                                base === l.code ? "bg-gray-50" : ""
                            }`}
                            role="menuitem"
                        >
                            <l.Flag className="h-4 w-6 rounded-[2px] shadow-sm" title={l.label} />
                            <span className="text-sm">{l.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
