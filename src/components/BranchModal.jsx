// src/components/BranchModal.jsx
// Note: define a red token in your CSS if you want a custom one:
// :root { --brand-red: #e11d48; }

import React, { useEffect, useRef, useMemo } from "react"
import { motion as Motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { X, MapPinned, Phone, Mail, ExternalLink } from "lucide-react"
import { useTranslation } from "react-i18next"
import { parsePhones } from "../utils/contactUtils"

// Build a Google Maps URL from branch data, prioritizing an explicit link.
const resolveMapsHref = (branch) => {
    if (!branch) return null
    // 1) If you provide an explicit link: { map: { url: "https://maps.google.com/..." } }
    if (branch.map?.url) return branch.map.url

    // 2) Otherwise build a query-based link
    const query = branch.map?.directionsQuery || branch.address || branch.name
    return query
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
        : null
}

export default function BranchModal({ open, branch, onClose }) {
    const { t } = useTranslation()
    const prefersReduced = useReducedMotion()
    const closeBtnRef = useRef(null)

    // lock scroll + focus
    useEffect(() => {
        if (!open) return
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        closeBtnRef.current?.focus()
        return () => { document.body.style.overflow = prev }
    }, [open])

    // esc to close
    useEffect(() => {
        if (!open) return
        const onKey = (e) => e.key === "Escape" && onClose?.()
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [open, onClose])

    const phones = useMemo(() => parsePhones(branch?.phone), [branch])

    const fade = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } }
    const panel = {
        hidden: { opacity: 0, y: prefersReduced ? 0 : 20, scale: prefersReduced ? 1 : 0.98 },
        show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: "easeOut" } },
        exit:   { opacity: 0, y: prefersReduced ? 0 : 12, scale: prefersReduced ? 1 : 0.98, transition: { duration: 0.18 } },
    }

    const handleDirections = () => {
        const href = resolveMapsHref(branch)
        if (href) window.open(href, "_blank", "noopener,noreferrer")
    }

    if (!open) return null

    // Subtle hover/click animations
    const motionCTA = prefersReduced
        ? {}
        : {
            whileHover: { y: -1 },
            whileTap: { scale: 0.96, transition: { type: "spring", stiffness: 500, damping: 30 } },
        }

    return (
        <AnimatePresence>
            <Motion.div
                key="overlay"
                className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px]"
                initial="hidden" animate="show" exit="hidden"
                variants={fade}
                onClick={onClose}
            />
            <Motion.div
                key="panel"
                role="dialog" aria-modal="true" aria-labelledby="branch-modal-title"
                className="fixed inset-0 z-[101] grid place-items-center px-4"
                initial="hidden" animate="show" exit="exit"
                variants={panel}
            >
                <div
                    className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                    // Ensure red is always defined (can be overridden globally in :root)
                    style={{ "--brand-red": "#e11d48" }}
                >
                    {/* Header */}
                    <div className="flex items-center gap-4 p-4 border-b border-gray-200">
                        <h2 id="branch-modal-title" className="text-base sm:text-lg font-semibold text-[color:var(--brand-dark)]">
                            {branch?.name || t("contact.branch", "Branch")}
                        </h2>
                    </div>

                    {/* Image */}
                    {branch?.image && (
                        <img
                            src={branch.image}
                            alt={`${branch.name || "Branch"} photo`}
                            className="h-44 w-full object-cover"
                            loading="lazy"
                            decoding="async"
                        />
                    )}

                    {/* Content */}
                    <div className="p-5 space-y-5 text-sm text-[#6b5545]">
                        {branch?.address && (
                            <section>
                                <div className="mb-1 font-semibold text-[color:var(--brand-dark)]">{t("contact.address", "Address")}</div>
                                <address className="not-italic whitespace-pre-line">{branch.address}</address>
                            </section>
                        )}

                        {branch?.hours && (
                            <section>
                                <div className="mb-1 font-semibold text-[color:var(--brand-dark)]">{t("contact.hours", "Hours")}</div>
                                <p>{branch.hours}</p>
                            </section>
                        )}

                        {phones?.length > 0 && (
                            <section>
                                <div className="mb-1 font-semibold text-[color:var(--brand-dark)] flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    {t("contact.phone", "Phone")}
                                </div>
                                <ul className="space-y-1">
                                    {phones.map((p) => (
                                        <li key={p.href}>
                                            <a
                                                href={p.href}
                                                onClick={(e) => e.stopPropagation()}
                                                className="underline decoration-dotted underline-offset-4 hover:decoration-solid"
                                            >
                                                {p.display}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {branch?.email && (
                            <section>
                                <div className="mb-1 font-semibold text-[color:var(--brand-dark)] flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    {t("contact.email", "Email")}
                                </div>
                                <a
                                    href={`mailto:${branch.email}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="break-all underline decoration-dotted underline-offset-4 hover:decoration-solid"
                                >
                                    {branch.email}
                                </a>
                            </section>
                        )}
                    </div>

                    {/* Slim sticky CTA bar — Directions (left) / Close (right, red) */}
                    <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur border-t border-gray-200 px-3 py-3">
                        <div className="flex items-center justify-between gap-3">
                            {/* Directions — compact, brand dark, hover/click animation */}
                            <Motion.button
                                {...motionCTA}
                                onClick={handleDirections}
                                ref={closeBtnRef}
                                className={[
                                    "inline-flex items-center gap-2 rounded-md",
                                    "px-2.5 py-1.5 text-sm font-semibold whitespace-nowrap",
                                    "bg-[color:var(--brand-dark)] text-white",
                                    "shadow-sm hover:shadow-md active:shadow-none",
                                    "hover:brightness-110 active:brightness-95",
                                    "transition-[transform,box-shadow,filter]",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                                ].join(" ")}
                                aria-label={t("contact.get_directions", "Get Directions")}
                            >
                                <MapPinned className="h-4 w-4 shrink-0" />
                                <span>{t("contact.get_directions", "Get Directions")}</span>
                                <ExternalLink className="h-4 w-4 opacity-90" />
                            </Motion.button>

                            {/* Close — red */}
                            <Motion.button
                                {...motionCTA}
                                onClick={onClose}
                                className={[
                                    "inline-flex items-center gap-2 rounded-md",
                                    "px-2.5 py-1.5 text-sm font-semibold whitespace-nowrap",
                                    "text-white border border-transparent",
                                    "bg-[var(--brand-red)] hover:brightness-110 active:brightness-95",
                                    "shadow-sm hover:shadow-md active:shadow-none",
                                    "transition-[transform,box-shadow,filter]",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]",
                                ].join(" ")}
                                aria-label={t("common.close", "Close")}
                            >
                                <X className="h-4 w-4" />
                                <span>{t("common.close", "Close")}</span>
                            </Motion.button>
                        </div>
                    </div>
                </div>
            </Motion.div>
        </AnimatePresence>
    )
}
