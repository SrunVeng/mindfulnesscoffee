// src/components/layout/LanguageSwitch.jsx
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { setLocale } from '../locales/i18n.js'
import { GB, KH, CN } from 'country-flag-icons/react/3x2'

const LOCALES = [
    { id: 'kh', code: 'ខ្មែរ',  Flag: KH },   // UI id (maps to km)
    { id: 'en', code: 'English', Flag: GB },
    { id: 'cn', code: '中文',    Flag: CN },   // UI id (maps to zh)
]

// helpers: map between UI ids and i18next ids
const toCanon = (idOrTag = 'en') => {
    const s = idOrTag.toLowerCase()
    if (s === 'kh' || s.startsWith('km')) return 'km'
    if (s === 'cn' || s.startsWith('zh')) return 'zh'
    return 'en'
}
const toUiId = (resolved = 'en') => {
    const s = resolved.toLowerCase()
    if (s.startsWith('km')) return 'kh'
    if (s.startsWith('zh')) return 'cn'
    return 'en'
}

export default function LanguageSwitch() {
    const { i18n } = useTranslation()
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    const currentUiId = toUiId(i18n.resolvedLanguage || i18n.language || 'en')
    const current = LOCALES.find(l => l.id === currentUiId) || LOCALES[0]
    const CurrentFlag = current.Flag

    // close on outside click
    useEffect(() => {
        const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
        document.addEventListener('pointerdown', onDoc, { passive: true })
        return () => document.removeEventListener('pointerdown', onDoc)
    }, [])

    // close on Esc
    useEffect(() => {
        const onEsc = (e) => { if (e.key === 'Escape') setOpen(false) }
        if (open) window.addEventListener('keydown', onEsc)
        return () => window.removeEventListener('keydown', onEsc)
    }, [open])

    const pick = (uiId) => {
        // map UI id (kh/cn/en) -> canonical (km/zh/en)
        const next = toCanon(uiId)
        setLocale(next) // this calls i18n.changeLanguage internally
        setOpen(false)
    }

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2 rounded-2xl border border-[var(--ring)] bg-white/90 px-3 py-1.5
                   hover:bg-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-ink)]/20"
            >
                <CurrentFlag className="h-4 w-auto rounded-[2px] shadow-sm" />
                <span className="text-sm font-medium">{current.code}</span>
                <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </button>

            {/* Dropdown */}
            <div
                className={`absolute right-0 z-50 mt-2 w-28 rounded-2xl border border-[var(--ring)] bg-white/95 backdrop-blur shadow-lg
                    origin-top-right transition transform
                    ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            >
                <ul className="p-1">
                    {LOCALES.map(({ id, code, Flag }) => (
                        <li key={id}>
                            <button
                                onClick={() => pick(id)}
                                className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm
                            hover:bg-[var(--brand-bg)]/60 transition ${id===currentUiId ? 'font-semibold' : ''}`}
                            >
                                <Flag className="h-4 w-auto rounded-[2px] shadow-sm" />
                                <span>{code}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
