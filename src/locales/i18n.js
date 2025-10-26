import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./en.json"
import zh from "./zh.json"
import km from "./km.json"

function applyLangFont(lng) {
    const base = (lng || "en").split("-")[0] // "en-US" -> "en"
    const root = document.documentElement

    root.setAttribute("lang", base)
    root.classList.remove("lang-en", "lang-zh", "lang-km")
    // only allow our three
    const supported = ["en", "zh", "km"]
    root.classList.add(`lang-${supported.includes(base) ? base : "en"}`)
}

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            zh: { translation: zh },
            km: { translation: km },
        },
        lng: "en",
        fallbackLng: "en",
        interpolation: { escapeValue: false },
    })

// Set initial font + keep it in sync on language change
applyLangFont(i18n.language)
i18n.on("languageChanged", applyLangFont)

export const setLocale = (lng)=>{
    i18n.changeLanguage(lng)
    localStorage.setItem('locale', lng)
    document.documentElement.lang = lng === 'en' ? 'en' : (lng === 'cn' ? 'zh-CN' : 'km')
}
export default i18n
