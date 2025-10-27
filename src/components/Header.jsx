import React, { useEffect, useState, useCallback, useRef, useId } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { AnimatePresence, motion as Motion } from "framer-motion"
import LanguageSwitcher from "./LanguageSwitcher.jsx"
import variables from "../data/variables.json"

const NAV = [
    { to: "/", key: "home", end: true },
    { to: "/menu", key: "menu" },
    { to: "/about", key: "about" },
    { to: "/contact", key: "contact" },
]

// Framer Motion variants declared outside the component to avoid re-creation on each render
const listVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }
const itemVariants = { hidden: { y: 15, opacity: 0 }, show: { y: 0, opacity: 1, transition: { ease: "easeOut" } } }

export default function Header() {
    const { t } = useTranslation()
    const { pathname } = useLocation()
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    const rafTick = useRef(false)
    const menuId = useId()

    // Scroll shrink (rAF-throttled)
    useEffect(() => {
        const onScroll = () => {
            if (rafTick.current) return
            rafTick.current = true
            requestAnimationFrame(() => {
                setScrolled(window.scrollY > 6)
                rafTick.current = false
            })
        }
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    // Close on route change
    useEffect(() => { setOpen(false) }, [pathname])

    // Lock body scroll when menu open
    useEffect(() => {
        const cls = "overflow-hidden"
        if (open) document.body.classList.add(cls)
        else document.body.classList.remove(cls)
        return () => document.body.classList.remove(cls)
    }, [open])

    // ESC to close
    const onKeyDown = useCallback((e) => { if (e.key === "Escape") setOpen(false) }, [])
    const onOverlayKeyDown = useCallback((e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setOpen(false)
        }
    }, [])
    useEffect(() => {
        if (!open) return
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [open, onKeyDown])

    // Close if resizing to md+
    useEffect(() => {
        const onResize = () => { if (window.matchMedia("(min-width:768px)").matches) setOpen(false) }
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [])

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 border-b border-brand-dark
        transition-[height,box-shadow] duration-300 bg-brand-white
        ${scrolled ? "h-14 shadow-md" : "h-16 shadow-sm"}`}
        >
            <div className="mx-auto max-w-6xl px-4 h-full flex items-center justify-between">
                {/* Brand */}
                <Link to="/" className="group flex items-center gap-2">
                    <img
                        src={variables.logo}
                        alt={t("brand")}
                        className="h-9 w-9 rounded-xl bg-brand-white shadow-sm ring-1 ring-brand-30 object-cover group-hover:scale-105 transition"
                    />
                    <span className="font-semibold tracking-tight text-brand-dark group-hover:opacity-90 transition">
            {t("brand")}
          </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-5">
                    {NAV.map(({ to, key, end }) => (
                        <NavLink
                            key={key}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `group relative px-1 text-[13px] md:text-sm leading-5 tracking-tight
                 opacity-85 hover:opacity-100 transition whitespace-nowrap
                 ${isActive ? "opacity-100 font-semibold text-brand-dark" : "text-brand-dark"}`
                            }
                        >
                            {t(`nav.${key}`)}
                            <span
                                className="pointer-events-none absolute left-0 -bottom-1 h-0.5 w-0 rounded-full
                           bg-brand-dark transition-[width] duration-300 group-hover:w-full"
                            />
                        </NavLink>
                    ))}
                </nav>

                {/* Desktop actions */}
                <div className="hidden md:flex items-center gap-2">
                    <div
                        className={open ? "pointer-events-none opacity-50" : ""}
                        aria-disabled={open ? "true" : undefined}
                        title={open ? t("common.disabled", { defaultValue: "Disabled while menu is open" }) : undefined}
                    >
                        <LanguageSwitcher key={open ? "ls-disabled" : "ls-enabled"} />
                    </div>
                </div>

                {/* Mobile actions */}
                <div className="md:hidden flex items-center gap-2">
                    <div
                        className={open ? "pointer-events-none opacity-50" : ""}
                        aria-disabled={open ? "true" : undefined}
                        title={open ? t("common.disabled", { defaultValue: "Disabled while menu is open" }) : undefined}
                    >
                        <LanguageSwitcher key={open ? "lsm-disabled" : "lsm-enabled"} compact />
                    </div>

                    {/* Animated Hamburger */}
                    <button
                        type="button"
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                        aria-controls={open ? menuId : undefined}
                        onClick={() => setOpen((v) => !v)}
                        className="relative w-8 h-8 flex flex-col justify-center items-center"
                    >
                        <Motion.span
                            initial={false}
                            animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="block w-6 h-0.5 bg-brand-dark rounded"
                        />
                        <Motion.span
                            initial={false}
                            animate={open ? { opacity: 0 } : { opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="block w-6 h-0.5 bg-brand-dark rounded my-1"
                        />
                        <Motion.span
                            initial={false}
                            animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="block w-6 h-0.5 bg-brand-dark rounded"
                        />
                    </button>
                </div>
            </div>

            {/* Mobile menu + overlay */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Overlay */}
                        <Motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className={`md:hidden fixed left-0 right-0 bottom-0 z-40 bg-brand-dark-30 backdrop-blur-md ${scrolled ? "top-14" : "top-16"}`}
                            role="button"
                            tabIndex={0}
                            aria-label={t("common.closeMenu", { defaultValue: "Close menu" })}
                            onClick={() => setOpen(false)}
                            onKeyDown={onOverlayKeyDown}
                        />

                        {/* Drawer */}
                        <Motion.div
                            key="drawer"
                            id={menuId}
                            role="dialog"
                            aria-modal="true"
                            aria-label={t("nav.menu", { defaultValue: "Main menu" })}
                            initial={{ y: -40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -30, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 22 }}
                            className="md:hidden absolute top-full left-0 right-0 z-50
                         rounded-b-2xl shadow-2xl overflow-hidden
                         bg-brand-white border-b border-brand-dark-20"
                        >
                            {/* Subtle texture */}
                            <Motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.06 }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0 pointer-events-none mix-blend-multiply [background-image:radial-gradient(#000/6_1px,transparent_1px)] [background-size:12px_12px]"
                            />

                            <Motion.nav
                                className="relative z-10"
                                aria-label={t("nav.menu", { defaultValue: "Main menu" })}
                                initial="hidden"
                                animate="show"
                                exit="hidden"
                                variants={listVariants}
                            >
                                <Motion.ul className="flex flex-col px-4 py-2">
                                    {NAV.map(({ to, key, end }, idx) => (
                                        <Motion.li
                                            key={key}
                                            variants={itemVariants}
                                            whileTap={{ scale: 0.985 }}
                                            className="list-none"
                                        >
                                            <NavLink
                                                to={to}
                                                end={end}
                                                className={({ isActive }) =>
                                                    [
                                                        "group relative block rounded-lg px-4 py-3 transition-colors outline-none",
                                                        "hover:bg-brand-dark-5 active:bg-brand-dark-10",
                                                        "focus-visible:ring-2 ring-brand-30",
                                                        isActive
                                                            ? "bg-brand-dark-10 text-brand-dark font-semibold ring-1 ring-brand-20"
                                                            : "text-brand-dark opacity-85 hover:opacity-100",
                                                    ].join(" ")
                                                }
                                            >
                                                <span className="flex items-center gap-3">
                                                    <span className="flex-1">{t(`nav.${key}`)}</span>
                                                </span>
                                            </NavLink>

                                            {/* Divider */}
                                            {idx < NAV.length - 1 && (
                                                <div aria-hidden className="px-2">
                                                    <div className="h-px bg-brand-dark-20" />
                                                </div>
                                            )}
                                        </Motion.li>
                                    ))}
                                </Motion.ul>
                            </Motion.nav>
                        </Motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Accent line */}
            <div className="h-1 bg-brand-gradient" />
        </header>
    )
}
