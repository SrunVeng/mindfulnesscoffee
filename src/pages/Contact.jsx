import React, { useMemo } from "react"
import variables from "../data/variables.json"
import { useTranslation } from "react-i18next"
import { Phone, Mail, MapPinned, ExternalLink } from "lucide-react"
import { SiTelegram,SiFacebook } from "react-icons/si"
import {
    parsePhones,
    telegramHref,
    buildDirectionsUrl,
    safeEmbedSrc,
} from "../utils/contactUtils"

export default function Contact() {
    const { t } = useTranslation()

    const cfg = variables || {}
    const info = cfg.contact || {}

    const phones = useMemo(() => parsePhones(info.phone), [info.phone])
    const primaryTel = phones?.[0]
    const tgLink = telegramHref(info.telegram)
    const fbLink = telegramHref(info.facebook)
    const mapEmbed = safeEmbedSrc(info.map?.embedUrl)
    const directionsUrl = buildDirectionsUrl(info.map?.directionsQuery || info.address)


    return (
        <section className="mx-auto max-w-6xl px-4 py-12 space-y-10">
            {/* ---------- Header ---------- */}
            <header className="flex flex-col gap-2">

                <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
          <span className="bg-clip-text text-black">
            {t("contact.title", "Get in touch")}
          </span>
                </h1>
                {info.tagline ? (
                    <p className="max-w-prose text-sm text-gray-600">{info.tagline}</p>
                ) : null}
            </header>

            {/* ---------- Single action bar (no duplicated buttons elsewhere) ---------- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {primaryTel && (
                    <a
                        href={primaryTel.href}
                        aria-label={t("contact.call_primary", "Call")}
                        className="group inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 shadow-sm transition hover:shadow md:h-12"
                    >
                        <Phone className="h-4 w-4" />
                        <span className="font-medium">{t("contact.call", "Call")}</span>
                    </a>
                )}


                {tgLink && (
                    <a
                        href={tgLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 shadow-sm transition hover:shadow md:h-12"
                    >
                        <SiTelegram className="h-4 w-4" />
                        <span className="font-medium">Telegram</span>
                        <ExternalLink className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                    </a>
                )}

                {fbLink && (
                    <a
                        href={fbLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 shadow-sm transition hover:shadow md:h-12"
                    >
                        <SiFacebook className="h-4 w-4" />
                        <span className="font-medium">Facebook</span>
                        <ExternalLink className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                    </a>
                )}

                {directionsUrl && (
                    <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-white bg-brand-gradient shadow-sm transition hover:opacity-90 md:h-12"
                    >
                        <MapPinned className="h-4 w-4" />
                        <span className="font-medium">{t("contact.get_directions", "Directions")}</span>
                        <ExternalLink className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                    </a>
                )}
            </div>

            {/* ---------- Main content ---------- */}
            <div className="grid gap-8 md:grid-cols-2">
                {/* Details card */}
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <div className="space-y-8 text-gray-800">
                        {/* Hero image (purely decorative here, no CTAs to avoid duplication) */}
                        {(cfg.contactImage || cfg.aboutImage) && (

                                <img
                                    src={cfg.contactImage || cfg.aboutImage}
                                    alt={t("contact.hero_alt", "Our space")}
                                    className="h-52 w-full object-cover"
                                    loading="lazy"
                                />

                        )}

                        {/* Phones */}
                        {phones?.length > 0 && (
                            <section aria-labelledby="phones-heading">
                                <div className="mb-3 flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-brand" />
                                    <h2 id="phones-heading" className="font-semibold">
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

                        {/* Email */}
                        {info.email && (
                            <section aria-labelledby="email-heading">
                                <div className="mb-3 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-brand" />
                                    <h2 id="email-heading" className="font-semibold">
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
                        {/* Address & Hours */}
                        {(info.address || info.hours) && (
                            <section className="grid gap-6 sm:grid-cols-2">
                                {info.address && (
                                    <div>
                                        <div className="mb-1 font-semibold">
                                            {t("contact.address", "Address")}
                                        </div>
                                        <address className="not-italic text-gray-700 whitespace-pre-line">
                                            {info.address}
                                        </address>
                                    </div>
                                )}
                                <div>
                                    <div className="mb-1 font-semibold">
                                        {t("contact.hours", "Hours")}
                                    </div>
                                    <p className="text-gray-700">
                                        {info.hours || t("contact.hours_value", "Daily, 7:00–21:00")}
                                    </p>
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                {/* Map card (embed only; no extra Directions button here to avoid duplication) */}
                <div className="rounded-2xl border bg-white p-4 shadow-sm">
                    {mapEmbed ? (
                        <div className="overflow-hidden rounded-xl border">
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
                </div>
            </div>
        </section>
    )
}
