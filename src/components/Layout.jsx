import React from "react"
import Header from "./Header.jsx"
import Footer from "./Footer.jsx"
import useResetScrollOnNav from "../hooks/useResetScrollOnNav.js"

export default function Layout({ children }) {
    useResetScrollOnNav() // <-- no DOM elements added

    return (
        <div className="min-h-screen flex flex-col bg-[var(--brand-bg)] text-brand-dark">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )
}
