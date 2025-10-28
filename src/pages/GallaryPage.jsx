// src/pages/GallaryPage.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import galleryRaw from "../data/galleryimage.json"

// --- Utils ---------------------------------------------------------------
const srcOf = (it) => (typeof it === "string" ? it : it?.src || it?.image || it?.url || it?.link || "")
const quoteOf = (it) => (typeof it === "object" && (it.quote || it.caption || it.text)) || null
const filenameToAlt = (url) => (url.split("/").pop() || "image").replace(/[-_]/g, " ").split(".")[0]

// Small helper to detect coarse pointers (touch) for UX decisions
const isTouchDevice = () =>
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(pointer: coarse)").matches

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

    const hasSlides = slides.length > 0
    const [index, setIndex] = useState(0)
    const [playing, setPlaying] = useState(true)
    const [direction, setDirection] = useState(1) // 1 -> next, -1 -> prev
    const [imgLoaded, setImgLoaded] = useState(false)
    const [touchMode] = useState(isTouchDevice())
    const SLIDE_MS = 5500

    const timeoutRef = useRef(null)

    // --- Navigation ---------------------------------------------------------
    const goTo = useCallback(
        (i, dir = 1) => {
            if (!hasSlides) return
            setDirection(dir)
            setImgLoaded(false)
            setIndex(((i % slides.length) + slides.length) % slides.length)
        },
        [hasSlides, slides.length],
    )

    const goNext = useCallback(() => goTo(index + 1, 1), [goTo, index])
    const goPrev = useCallback(() => goTo(index - 1, -1), [goTo, index])

    const togglePlay = useCallback(() => {
        // Allow toggling even when reduced motion is on (user intent wins)
        setPlaying((p) => !p)
    }, [])

    // --- Autoplay using timeout (less churn than setInterval) --------------
    useEffect(() => {
        if (!hasSlides || !playing || prefersReduced || slides.length <= 1) return
        timeoutRef.current && clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(goNext, SLIDE_MS)
        return () => {
            timeoutRef.current && clearTimeout(timeoutRef.current)
        }
    }, [hasSlides, playing, prefersReduced, index, slides.length, goNext])

    // Preload neighbors for smoother transitions
    useEffect(() => {
        if (!hasSlides) return
        const next = slides[(index + 1) % slides.length]?.src
        const prev = slides[(index - 1 + slides.length) % slides.length]?.src
        ;[next, prev].forEach((url) => {
            if (!url) return
            const img = new Image()
            img.src = url
        })
    }, [index, slides, hasSlides])

    // Keyboard navigation (desktop)
    useEffect(() => {
        if (!hasSlides) return
        const onKey = (e) => {
            if (e.key === "ArrowRight") goNext()
            else if (e.key === "ArrowLeft") goPrev()
            else if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault()
                togglePlay()
            }
        }
        window.addEventListener("keydown", onKey, { passive: false })
        return () => window.removeEventListener("keydown", onKey)
    }, [hasSlides, goNext, goPrev, togglePlay])

    // Pause when tab not visible to save work
    useEffect(() => {
        const onVis = () => {
            if (document.hidden) {
                setPlaying(false)
            }
        }
        document.addEventListener("visibilitychange", onVis)
        return () => document.removeEventListener("visibilitychange", onVis)
    }, [])

    // --- Motion variants (memoized per prefersReduced) ----------------------
    const variants = useMemo(
        () => ({
            enter: (dir) => ({
                x: prefersReduced ? 0 : dir * 64,
                opacity: 0,
                filter: "blur(8px)",
                scale: prefersReduced ? 1 : 0.985,
            }),
            center: { x: 0, opacity: 1, filter: "blur(0px)", scale: 1 },
            exit: (dir) => ({
                x: prefersReduced ? 0 : dir * -64,
                opacity: 0,
                filter: "blur(8px)",
                scale: prefersReduced ? 1 : 0.985,
            }),
        }),
        [prefersReduced],
    )

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
                className="relative w-full overflow-hidden rounded-3xl border bg-black sm:bg-gray-100 shadow-sm h-[68vh] min-h-[340px] sm:h-auto sm:aspect-[16/9]"
                style={{ touchAction: "pan-y" }}
                aria-roledescription="carousel"
                aria-label={t("gallery.carousel", "Image slideshow")}
            >
                {/* Blur backplate to hide letterboxing */}
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
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute inset-0 z-10 h-full w-full object-contain sm:object-cover"
                        draggable={false}
                        onLoad={() => setImgLoaded(true)}
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                    />
                </AnimatePresence>

                {/* Subtle blur-up while loading */}
                {!imgLoaded && (
                    <div
                        className="absolute inset-0 z-20 animate-pulse bg-gradient-to-br from-gray-200/60 to-gray-100/60 sm:from-gray-200 sm:to-gray-100"
                        aria-hidden="true"
                    />
                )}

                {/* Swipe area (drag to change) */}
                <motion.div
                    className="absolute inset-0 z-30"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.18}
                    dragMomentum={false}
                    onDragStart={() => setPlaying(false)}
                    onDragEnd={(_, info) => {
                        const offsetX = info.offset.x
                        const velocityX = info.velocity.x
                        if (offsetX < -SWIPE_OFFSET || velocityX < -SWIPE_VELOCITY) goNext()
                        else if (offsetX > SWIPE_OFFSET || velocityX > SWIPE_VELOCITY) goPrev()
                    }}
                />

                {/* Quote (optional) */}
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
                            <motion.div
                                key={`${index}-${playing}`}
                                className="h-full bg-white/90"
                                initial={{ width: 0 }}
                                animate={{ width: playing ? "100%" : 0 }}
                                transition={{ duration: playing ? SLIDE_MS / 1000 : 0, ease: "linear" }}
                            />
                        </div>
                        <span className="rounded-full bg-black/60 px-2 py-0.5 text-xs text-white" aria-live="polite">
              {index + 1}/{slides.length}
            </span>
                    </div>
                </div>

                {/* Arrow Controls (visible on all devices) */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-3 z-40">
                    <button
                        type="button"
                        onClick={() => {
                            setPlaying(false) // user intent: manual
                            goPrev()
                        }}
                        className="inline-flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/60 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                        aria-label={t("gallery.prev", "Previous")}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setPlaying(false)
                            goNext()
                        }}
                        className="inline-flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/60 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                        aria-label={t("gallery.next", "Next")}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                {/* Play/Pause control (works on mobile — fixes "cannot resume") */}
                <div className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 z-40">
                    <button
                        type="button"
                        onClick={togglePlay}
                        className="inline-flex items-center gap-2 rounded-full bg-black/55 text-white px-3 py-2 backdrop-blur hover:bg-black/65 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                        aria-pressed={!playing ? "true" : "false"}
                        aria-label={playing ? t("gallery.pause", "Pause") : t("gallery.play", "Play")}
                        title={playing ? t("gallery.pause", "Pause") : t("gallery.play", "Play")}
                    >
                        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        <span className="text-xs hidden sm:inline">{playing ? t("gallery.pause", "Pause") : t("gallery.play", "Play")}</span>
                    </button>
                </div>
            </section>

            {/* Dots */}
            <nav className="mt-6 flex flex-wrap items-center gap-2" aria-label={t("gallery.navigation", "Gallery navigation")}>
                {slides.map((s, i) => (
                    <button
                        key={s.src + i}
                        onClick={() => {
                            setPlaying(false)
                            goTo(i, i > index ? 1 : -1)
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

            {/* Hint for touch users */}
            {touchMode && (
                <p className="mt-3 text-xs text-gray-500">
                    {t("gallery.hint", "Tip: swipe, tap arrows, or use Play/Pause to control the slideshow.")}
                </p>
            )}
        </main>
    )
}
