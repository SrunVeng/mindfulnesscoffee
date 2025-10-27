// src/pages/GallaryPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import galleryRaw from "../data/galleryimage.json"

// Safely extract a URL from varied shapes
const srcOf = (it) => (typeof it === "string" ? it : it?.src || it?.image || it?.url || it?.link || "")
// Optional quote per image (no fallback; show only if provided)
const quoteOf = (it) => (typeof it === "object" && (it.quote || it.caption || it.text)) || null
const filenameToAlt = (url) => (url.split("/").pop() || "image").replace(/[-_]/g, " ").split(".")[0]

export default function GallaryPage() {
    const { t } = useTranslation()
    const prefersReduced = useReducedMotion()

    // Normalize input into a consistent slide shape
    const slides = useMemo(() => {
        const arr = Array.isArray(galleryRaw) ? galleryRaw : []
        return arr
            .map((it) => {
                const src = srcOf(it)
                if (!src) return null
                return {
                    src,
                    quote: quoteOf(it),
                    alt: (typeof it === "object" && (it.alt || it.title)) || filenameToAlt(src),
                }
            })
            .filter(Boolean)
    }, [])

    const [index, setIndex] = useState(0)
    const [playing, setPlaying] = useState(true)
    const [direction, setDirection] = useState(1) // 1 -> next, -1 -> prev
    const [imgLoaded, setImgLoaded] = useState(false)
    const hoverPauseRef = useRef(false)

    const hasSlides = slides.length > 0
    const SLIDE_MS = 5500

    // Auto-advance
    useEffect(() => {
        if (!hasSlides || !playing || prefersReduced) return
        const id = setInterval(() => {
            goNext()
        }, SLIDE_MS)
        return () => clearInterval(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playing, hasSlides, prefersReduced, index])

    // Preload next image
    useEffect(() => {
        if (!hasSlides) return
        const next = slides[(index + 1) % slides.length]?.src
        if (next) {
            const img = new Image()
            img.src = next
        }
    }, [index, slides, hasSlides])

    // Keyboard navigation
    useEffect(() => {
        const onKey = (e) => {
            if (!hasSlides) return
            if (e.key === "ArrowRight") goNext()
            if (e.key === "ArrowLeft") goPrev()
            if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault()
                setPlaying((p) => !p)
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasSlides])

    const goNext = () => {
        if (!hasSlides) return
        setDirection(1)
        setImgLoaded(false)
        setIndex((i) => (i + 1) % slides.length)
    }

    const goPrev = () => {
        if (!hasSlides) return
        setDirection(-1)
        setImgLoaded(false)
        setIndex((i) => (i - 1 + slides.length) % slides.length)
    }

    // Motion variants for slide transitions
    const variants = {
        enter: (dir) => ({
            x: prefersReduced ? 0 : dir * 64,
            opacity: 0,
            filter: "blur(8px)",
            scale: prefersReduced ? 1 : 0.98,
        }),
        center: { x: 0, opacity: 1, filter: "blur(0px)", scale: 1 },
        exit: (dir) => ({
            x: prefersReduced ? 0 : dir * -64,
            opacity: 0,
            filter: "blur(8px)",
            scale: prefersReduced ? 1 : 0.98,
        }),
    }

    if (!hasSlides) {
        return (
            <main className="mx-auto max-w-6xl px-4 py-10">
                <h1 className="text-3xl font-semibold">{t("gallery.title", "Gallery")}</h1>
                <p className="mt-3 text-gray-600">
                    {t("gallery.empty", "No images found in galleryimage.json. Add some URLs and reload.")}
                </p>
            </main>
        )
    }

    const current = slides[index]
    const activeQuote = current?.quote || null

    // Swipe thresholds (helps on mobile)
    const SWIPE_OFFSET = 40
    const SWIPE_VELOCITY = 400

    return (
        <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
            {/* Header */}
            <header>
                <h1 className="text-3xl font-semibold tracking-tight py-12 sm:py-12">
                    {t("gallery.title", "Gallery")}
                </h1>
            </header>

            {/* Slideshow */}
            <section
                // Taller on mobile; keep 16:9 from sm+.
                className="relative w-full overflow-hidden rounded-3xl border bg-black sm:bg-gray-100 shadow-sm h-[68vh] min-h-[340px] sm:h-auto sm:aspect-[16/9]"
                onMouseEnter={() => {
                    hoverPauseRef.current = true
                    setPlaying(false)
                }}
                onMouseLeave={() => {
                    hoverPauseRef.current = false
                    setPlaying(true)
                }}
                style={{ touchAction: "pan-y" }}
            >
                {/* Blur backplate to hide letterboxing on mobile */}
                {current?.src && (
                    <img
                        src={current.src}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 z-0 h-full w-full object-cover blur-2xl scale-110 opacity-50 pointer-events-none"
                        draggable={false}
                    />
                )}

                <AnimatePresence custom={direction} mode="popLayout">
                    <motion.img
                        key={current.src}
                        src={current.src}
                        alt={current.alt}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.55, ease: "easeOut" }}
                        // Fit whole image on mobile; switch to cover on sm+
                        className="absolute inset-0 z-10 h-full w-full object-contain sm:object-cover"
                        draggable={false}
                        onLoad={() => setImgLoaded(true)}
                        loading={index === 0 ? "eager" : "lazy"}
                    />
                </AnimatePresence>

                {/* Subtle blur-up while loading */}
                {!imgLoaded && (
                    <div className="absolute inset-0 z-20 animate-pulse bg-gradient-to-br from-gray-200/60 to-gray-100/60 sm:from-gray-200 sm:to-gray-100" />
                )}

                {/* Swipe area (drag to change) — sits on top for mobile */}
                <motion.div
                    className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    dragMomentum={false}
                    onDragEnd={(_, info) => {
                        const offsetX = info.offset.x
                        const velocityX = info.velocity.x
                        if (offsetX < -SWIPE_OFFSET || velocityX < -SWIPE_VELOCITY) goNext()
                        else if (offsetX > SWIPE_OFFSET || velocityX > SWIPE_VELOCITY) goPrev()
                    }}
                />

                {/* Gradient & quote (only if provided) */}
                {activeQuote && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-7 z-20">
                        <div className="rounded-2xl bg-gradient-to-t from-black/60 to-black/0 p-4 text-white backdrop-blur-[1px]">
                            <p className="text-base sm:text-lg md:text-xl italic">“{activeQuote}”</p>
                        </div>
                    </div>
                )}

                {/* Top progress + index */}
                <div className="absolute left-0 right-0 top-0 p-3 z-20">
                    <div className="flex items-center gap-3">
                        <div className="h-1 w-full overflow-hidden rounded-full bg-white/30">
                            {/* Animated fill resets each slide */}
                            <motion.div
                                key={`${index}-${playing}`}
                                className="h-full bg-white/90"
                                initial={{ width: 0 }}
                                animate={{ width: playing ? "100%" : 0 }}
                                transition={{ duration: playing ? SLIDE_MS / 1000 : 0, ease: "linear" }}
                            />
                        </div>
                        <span className="rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
              {index + 1}/{slides.length}
            </span>
                    </div>
                </div>

                {/* Clickable hotspots (prev/next) — hide on mobile so swipe works cleanly */}
                <button
                    onClick={goPrev}
                    className="absolute left-0 top-0 hidden h-full w-1/3 focus:outline-none sm:block z-30"
                    aria-label={t("gallery.prev", "Previous")}
                />
                <button
                    onClick={goNext}
                    className="absolute right-0 top-0 hidden h-full w-1/3 focus:outline-none sm:block z-30"
                    aria-label={t("gallery.next", "Next")}
                />
            </section>

            {/* Dots (minimal) */}
            <nav
                className="mt-6 flex flex-wrap items-center gap-2"
                aria-label={t("gallery.navigation", "Gallery navigation")}
            >
                {slides.map((s, i) => (
                    <button
                        key={s.src + i}
                        onClick={() => {
                            setDirection(i > index ? 1 : -1)
                            setImgLoaded(false)
                            setIndex(i)
                        }}
                        className={[
                            "h-2 w-2 rounded-full transition",
                            i === index ? "bg-[#1f4d28]" : "bg-gray-300 hover:bg-gray-400",
                        ].join(" ")}
                        aria-label={t("gallery.goTo", "Go to slide {{i}}", { i: i + 1 })}
                        aria-current={i === index ? "true" : undefined}
                    />
                ))}
            </nav>
        </main>
    )
}
