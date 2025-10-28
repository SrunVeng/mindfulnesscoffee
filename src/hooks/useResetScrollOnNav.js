// useResetScrollOnNav.js
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function useResetScrollOnNav() {
    const { pathname, search, hash } = useLocation()

    // Force top on each navigation (no smooth scrolling)
    useEffect(() => {
        if (hash) {
            // If navigating to an anchor, go to that element; otherwise top
            requestAnimationFrame(() => {
                const el = document.querySelector(hash)
                if (el) {
                    el.scrollIntoView({ behavior: "auto", block: "start" })
                } else {
                    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
                }
            })
            return
        }
        window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    }, [pathname, search, hash])

    // Stop the browser from restoring old scroll on back/forward
    useEffect(() => {
        const prev = window.history.scrollRestoration
        try { window.history.scrollRestoration = "manual" } catch {}
        return () => { try { window.history.scrollRestoration = prev || "auto" } catch {} }
    }, [])
}
