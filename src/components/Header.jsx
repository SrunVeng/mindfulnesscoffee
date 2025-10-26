import React, { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next"
import variables from "../data/variables.json"
import LanguageSwitcher from "./LanguageSwitcher.jsx"
import { Menu as MenuIcon } from "lucide-react"

const navItem = (to, label) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive ? "bg-gray-100 text-brand" : "text-gray-700 hover:bg-gray-50"
            }`
        }
    >
        {label}
    </NavLink>
)

export default function Header() {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
            <div className="mx-auto max-w-6xl px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={variables.logo} alt="logo" className="h-9 w-9" />
                        <span className="font-bold text-lg">{t("brand")}</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        {navItem("/", t("nav.home"))}
                        {navItem("/menu", t("nav.menu"))}
                        {navItem("/about", t("nav.about"))}
                        {navItem("/contact", t("nav.contact"))}
                        <LanguageSwitcher />
                    </nav>

                    <button
                        className="md:hidden p-2 rounded-lg border hover:bg-gray-50"
                        onClick={() => setOpen(v => !v)}
                        aria-label="toggle menu"
                    >
                        <MenuIcon className="h-5 w-5" />
                    </button>
                </div>

                {open && (
                    <div className="md:hidden pb-3 border-t">
                        <div className="flex flex-col gap-1 pt-3">
                            {navItem("/", t("nav.home"))}
                            {navItem("/menu", t("nav.menu"))}
                            {navItem("/about", t("nav.about"))}
                            {navItem("/contact", t("nav.contact"))}
                            <div className="px-1"><LanguageSwitcher compact /></div>
                        </div>
                    </div>
                )}
            </div>
            <div className="h-1 bg-brand-gradient" />
        </header>
    )
}
