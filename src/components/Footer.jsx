import React from "react"
import variables from "../data/variables.json"
import { useTranslation } from "react-i18next"
import { Facebook, Instagram, Send } from "lucide-react"

export default function Footer() {
    const { t } = useTranslation()

    const social = variables.social || {}
    const contact = variables.contact || {}
    const fb = social.facebook
    const ig = social.instagram
    const telegramHandle = contact.telegram
    const tele = telegramHandle ? `https://t.me/${telegramHandle.replace(/^@/, "")}` : null

    return (
        <footer className="text-[var(--brand-ink)]">
            <div className="h-1 bg-brand-gradient"></div>
            <div
                className="container-narrow px-4 md:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left: Logo + Copyright */}
                <div className="flex items-center gap-5">
                    <img
                        src={variables.logo}
                        alt={t("brand")}
                        className="h-8 w-8 rounded-lg bg-white shadow-sm ring-1 ring-[var(--ring)] object-cover"
                    />
                    <span className="text-sm opacity-80">
                        {t("footer.legal", {year: new Date().getFullYear(), brand: t("brand")})}
                    </span>
                </div>

                {/* Right: Social links */}
                <div className="flex gap-6 text-sm font-medium">
                    {fb && (
                        <a
                            href={fb}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:opacity-90 transition"
                            aria-label={t("contact.facebook")}
                            title={t("contact.facebook")}
                        >
                            <Facebook className="w-5 h-5"/>
                            <span className="hidden sm:inline">{t("contact.facebook")}</span>
                        </a>
                    )}
                    {ig && (
                        <a
                            href={ig}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:opacity-90 transition"
                            aria-label={t("contact.instagram", {defaultValue: "Instagram"})}
                            title={t("contact.instagram", {defaultValue: "Instagram"})}
                        >
                            <Instagram className="w-5 h-5"/>
                            <span
                                className="hidden sm:inline">{t("contact.instagram", {defaultValue: "Instagram"})}</span>
                        </a>
                    )}
                    {tele && (
                        <a
                            href={tele}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:opacity-90 transition"
                            aria-label={t("contact.telegram")}
                            title={t("contact.telegram")}
                        >
                            <Send className="w-5 h-5"/>
                            <span className="hidden sm:inline">{t("contact.telegram")}</span>
                        </a>
                    )}
                </div>
            </div>
        </footer>
    )
}
