import React, { useMemo } from "react"
import variables from "../data/variables.json"
import { useTranslation } from "react-i18next"
import { Phone, Mail, MapPinned, ExternalLink } from "lucide-react"
import {SiFacebook, SiTelegram,} from "react-icons/si"
import { motion, useReducedMotion } from "framer-motion"
import {
    parsePhones,
    telegramHref,
    buildDirectionsUrl,
    safeEmbedSrc,
} from "../utils/contactUtils"

const normalizeUrl = (u) => {
    if (!u) return null
    return /^https?:\/\//i.test(u) ? u : `https://${u}`
}

export default function Contact() {
    const { t } = useTranslation()
    const prefersReduced = useReducedMotion()

    const cfg = variables
    const info = cfg.contact

    const phones = useMemo(() => parsePhones(info.phone), [info.phone])
    const primaryTel = phones?.[0]
    const tgLink = telegramHref(info.telegram) || normalizeUrl(info.telegram)
    const fbLink = normalizeUrl(info.facebook) // fixed: don't use telegramHref here
    const mapEmbed = safeEmbedSrc(info.map?.embedUrl)
    const directionsUrl = buildDirectionsUrl(info.map?.directionsQuery || info.address)

    // Animations
    const fadeUp = {
        hidden: { opacity: 0, y: prefersReduced ? 0 : 18, filter: "blur(6px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
    }
    const stagger = {
        hidden: {},
        show: { transition: { staggerChildren: prefersReduced ? 0 : 0.06, delayChildren: prefersReduced ? 0 : 0.06 } },
    }

    // Consistent button styles
    const BTN_BASE =
        "group inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 md:h-12 font-medium transition-all " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 active:scale-[0.98]"
    const BTN_SOFT =
        BTN_BASE + " border-[#e7dbc9] bg-[#fffaf3] text-[#2d1a14] shadow-sm hover:-translate-y-0.5 hover:shadow-md"
    const BTN_OUTLINE =
        BTN_BASE + " border-[#e7dbc9] bg-white text-[#2d1a14] shadow-sm hover:bg-[#fffaf3] hover:-translate-y-0.5 hover:shadow-md"
    const BTN_PRIMARY =
        BTN_BASE + " border-transparent bg-[var(--brand-accent)] text-black shadow-sm hover:-translate-y-0.5 hover:shadow-md"

    return (
        <section className="relative mx-auto max-w-6xl px-4 py-12 space-y-10">
            {/* Ambient background aligned with Home */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-24 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-100 via-orange-50 to-transparent blur-3xl opacity-70" />
                <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-gradient-to-tr from-amber-200/50 to-white/0 blur-2xl" />
                <div className="absolute inset-0 mix-blend-multiply [background-image:radial-gradient(#000/6_1px,transparent_1px)] [background-size:12px_12px] opacity-[0.06]" />
            </div>

            {/* Header */}
            <motion.header
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col gap-2"
            >
                <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold leading-tight">
                    <span className="bg-clip-text text-black">{t("contact.title", "Get in touch")}</span>
                </motion.h1>
                {info.tagline ? (
                    <motion.p variants={fadeUp} className="max-w-prose text-sm text-gray-600">
                        {info.tagline}
                    </motion.p>
                ) : null}
            </motion.header>

            {/* Single action bar */}
            <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
                {primaryTel && (
                    <motion.a
                        variants={fadeUp}
                        href={primaryTel.href}
                        aria-label={t("contact.call_primary", "Call")}
                        className={BTN_OUTLINE}
                    >
                        <Phone className="h-4 w-4 shrink-0" />
                        <span>{t("contact.call", "Call")}</span>
                    </motion.a>
                )}

                {tgLink && (
                    <motion.a
                        variants={fadeUp}
                        href={tgLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t("contact.telegram", "Telegram")}
                        className={BTN_OUTLINE}
                    >
                        <SiTelegram className="h-4 w-4 shrink-0" />
                        <span>{t("contact.telegram", "Telegram")}</span>
                        <ExternalLink className="h-4 w-4 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                )}

                {fbLink && (
                    <motion.a
                        variants={fadeUp}
                        href={fbLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t("contact.facebook", "Facebook")}
                        className={BTN_OUTLINE}
                    >
                        <SiFacebook className="h-4 w-4 shrink-0" />
                        <span>{t("contact.facebook", "Facebook")}</span>
                        <ExternalLink className="h-4 w-4 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                )}

                {directionsUrl && (
                    <motion.a
                        variants={fadeUp}
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t("contact.get_directions", "Directions")}
                        className={BTN_OUTLINE + " hover:scale-[1.02]"}
                    >
                        <MapPinned className="h-4 w-4 shrink-0" />
                        <span>{t("contact.get_directions", "Directions")}</span>
                        <ExternalLink className="h-4 w-4 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                )}
            </motion.div>

            {/* Main content */}
            <div className="grid gap-8 md:grid-cols-2">
                {/* Details card */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                    className="rounded-2xl border border-[#e7dbc9] bg-[#fffaf3] p-6 shadow-sm"
                >
                    <div className="space-y-8 text-gray-800">
                        {(cfg.contactImage || cfg.aboutImage) && (
                            <img
                                src={cfg.logo || cfg.logo}
                                alt={t("contact.hero_alt", "Our space")}
                                className="h-52 w-full object-cover rounded-lg ring-1 ring-[#e7dbc9]"
                                loading="lazy"
                            />
                        )}

                        {phones?.length > 0 && (
                            <section aria-labelledby="phones-heading">
                                <div className="mb-3 flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-[#2d1a14]" />
                                    <h2 id="phones-heading" className="font-semibold text-[#2d1a14]">
                                        {t("contact.phone", "Phone")}
                                    </h2>
                                </div>
                                <ul className="space-y-1">
                                    {phones.map((p) => (
                                        <li key={p.href}>
                                            <a
                                                href={p.href}
                                                className="underline decoration-dotted underline-offset-4 hover:decoration-solid"
                                            >
                                                {p.display}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {info.email && (
                            <section aria-labelledby="email-heading">
                                <div className="mb-3 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-[#2d1a14]" />
                                    <h2 id="email-heading" className="font-semibold text-[#2d1a14]">
                                        {t("contact.email", "Email")}
                                    </h2>
                                </div>
                                <a
                                    href={`mailto:${info.email}`}
                                    className="break-all underline decoration-dotted underline-offset-4 hover:decoration-solid"
                                >
                                    {info.email}
                                </a>
                            </section>
                        )}

                        {(info.address || info.hours) && (
                            <section className="grid gap-6 sm:grid-cols-2">
                                {info.address && (
                                    <div>
                                        <div className="mb-1 font-semibold text-[#2d1a14]">
                                            {t("contact.address", "Address")}
                                        </div>
                                        <address className="not-italic text-[#6b5545] whitespace-pre-line">
                                            {info.address}
                                        </address>
                                    </div>
                                )}
                                <div>
                                    <div className="mb-1 font-semibold text-[#2d1a14]">
                                        {t("contact.hours", "Hours")}
                                    </div>
                                    <p className="text-[#6b5545]">
                                        {info.hours || t("contact.hours_value", "Daily, 7:00–21:00")}
                                    </p>
                                </div>
                            </section>
                        )}
                    </div>
                </motion.div>

                {/* Map card */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                    className="rounded-2xl border border-[#e7dbc9] bg-white p-4 shadow-sm"
                >
                    {mapEmbed ? (
                        <div className="overflow-hidden rounded-xl border border-[#e7dbc9]">
                            <iframe
                                title={t("contact.map_title", "Map")}
                                src={mapEmbed}
                                className="w-full h-80 md:h-[28rem]"
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    ) : (
                        <div className="p-6 text-sm text-gray-600">
                            {t("contact.map_unavailable", "Map unavailable.")}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    )
}
