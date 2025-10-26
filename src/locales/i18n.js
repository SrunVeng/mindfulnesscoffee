import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// If your files are named exactly en.json, km.json, cn.json:
import en from './en.json'
import km from './km.json'
import zhFromCnFile from './zh.json'   // keep filename if you prefer "cn.json"

// Canonical resources keyed by i18n codes
const resources = {
    en: { translation: en },
    km: { translation: km },
    zh: { translation: zhFromCnFile }, // map the cn.json content to the canonical "zh"
}

const supportedLngs = ['en', 'km', 'zh']

const initial = (() => {
    const saved = localStorage.getItem('lang')
    if (saved) return saved
    const nav = (navigator.language || 'en').toLowerCase()
    if (nav.startsWith('km')) return 'km'
    if (nav.startsWith('zh') || nav.startsWith('cn')) return 'zh'
    return 'en'
})()

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: initial,
        fallbackLng: 'en',
        supportedLngs,
        nonExplicitSupportedLngs: true, // treat zh-CN -> zh, en-US -> en
        interpolation: { escapeValue: false },
        // debug: true,
    })

// Map anything the UI passes to canonical codes used above
const toCanon = (idOrTag = 'en') => {
    const s = idOrTag.toLowerCase()
    if (s === 'kh' || s.startsWith('km')) return 'km'
    if (s === 'cn' || s.startsWith('zh')) return 'zh'
    return 'en'
}

export function setLocale(idOrTag) {
    const next = toCanon(idOrTag)
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
    // keep <html lang=".."> in sync (font switching, a11y, etc.)
    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', next)
    }
}

export default i18n
