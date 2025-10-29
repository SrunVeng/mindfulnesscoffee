import React from "react"
import { useTranslation } from "react-i18next"
import { motion, useScroll, useTransform } from "framer-motion"
import { Link } from "react-router-dom"
import data from "../data/variables.json"
import ScrollSection from "../components/ScrollSection.jsx"

export default function Home() {
    const { t } = useTranslation()

    // Map available images from variables.json
    const HOME_IMAGES = {
        hero: data.logo,
        farm: data.aboutImage,
        brew: data.contactImage,
        featured: data.feature,
    }

    // Parallax for hero background
    const { scrollYProgress } = useScroll()
    const yBg = useTransform(scrollYProgress, [0, 1], [0, -80])

    const fadeInUp = {
        initial: { opacity: 0, y: 20, filter: "blur(6px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        transition: { duration: 0.8, ease: "easeOut" },
    }

    return (
        <>
            {/* HERO */}
            <section className="relative h-[92vh] min-h-[560px] flex items-center justify-center overflow-hidden bg-[var(--brand-bg)]">
                {/* Parallax image */}
                <motion.div
                    style={{ y: yBg, backgroundImage: `url(${HOME_IMAGES.hero})` }}
                    className="absolute inset-0 bg-cover bg-center scale-110"
                    aria-hidden
                />

                {/* Vignette + tint */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(80% 60% at 50% 40%, rgba(255,255,255,0.00) 0%, rgba(0,0,0,0.35) 100%)",
                    }}
                    aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" aria-hidden />

                {/* Subtle texture */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
                    style={{
                        backgroundImage:
                            "url('data:image/svg+xml;utf8,\
                            <svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27>\
                            <filter id=%27n%27><feTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%272%27/></filter>\
                            <rect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.4%27/></svg>')",
                    }}
                    aria-hidden
                />

                {/* Content */}
                <motion.div {...fadeInUp} className="relative z-10 px-6 text-center max-w-3xl">
                    {/*<h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-sm">*/}
                    {/*    {t("home.heroTitle")}*/}
                    {/*</h1>*/}

                    {/*<p className="mt-4 text-white/90 text-base md:text-lg">*/}
                    {/*    {t("home.heroSubtitle")}*/}
                    {/*</p>*/}

                    <div className="mt-7 flex items-center justify-center gap-3">
                        <Link
                            to="/menu"
                            className="
      inline-flex items-center justify-center rounded-xl
      px-6 py-3 font-semibold
      bg-[color:var(--brand-light)] text-white
      shadow-lg shadow-black/15 transition-all duration-200
      hover:-translate-y-0.5 hover:shadow-xl
      active:translate-y-0 active:shadow-md
      focus:outline-none focus-visible:ring-2
      focus-visible:ring-[color:var(--ring)]
      focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--brand-bg)]
    "
                        >
                            {t('home.cta')}
                        </Link>

                        <Link
                            to="/contact"
                            className="
      inline-flex items-center justify-center rounded-xl
      px-6 py-3 font-semibold
      bg-white text-[color:var(--brand-dark)]
      ring-1 ring-black/10 shadow transition-all duration-200
      hover:bg-[color:var(--brand-light)] hover:text-white hover:ring-transparent hover:shadow-lg
      active:shadow
      focus:outline-none focus-visible:ring-2
      focus-visible:ring-[color:var(--ring)]
      focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--brand-bg)]
    "
                        >
                            {t('nav.contact')}
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* VALUE CARDS */}
            <section className="relative -mt-10 md:-mt-14 z-10 px-4">
                <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    {[
                        { title: t("home.cards.beans.title"), text: t("home.cards.beans.text") },
                        { title: t("home.cards.local.title"), text: t("home.cards.local.text") },
                        { title: t("home.cards.cozy.title"),  text: t("home.cards.cozy.text")  },
                    ].map((c, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            className="rounded-2xl border border-[#e7dbc9] bg-[#fffaf3] p-5 shadow-sm hover:shadow-md transition"
                        >
                            <h3 className="font-semibold text-[#2d1a14]">{c.title}</h3>
                            <p className="mt-1.5 text-sm text-[#6b5545]">{c.text}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* STATS STRIP */}
            <section className="px-4 mt-10">
                <div className="mx-auto max-w-6xl rounded-2xl border border-[#e7dbc9] bg-white/70 p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#e7dbc9] text-center">
                        {[
                            { k: "home.stats.farmers",  n: "2", label: t("home.stats.farmers")  },
                            { k: "home.stats.profiles", n: "5.0★",   label: t("home.stats.profiles") },
                            { k: "home.stats.rating",   n: "5.0★", label: t("home.stats.rating")   },
                        ].map((s, i) => (
                            <motion.div
                                key={s.k}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: i * 0.05 }}
                                className="py-4"
                            >
                                <div className="text-2xl font-extrabold text-[#2d1a14]">{s.n}</div>
                                <div className="text-xs uppercase tracking-wide text-[#857567] mt-1">{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SCROLL SECTIONS */}
            <ScrollSection
                title={t("home.sections.farm.title")}
                subtitle={t("home.sections.farm.subtitle")}
                image={HOME_IMAGES.farm}
            />
            <ScrollSection
                title={t("home.sections.brew.title")}
                subtitle={t("home.sections.brew.subtitle")}
                image={HOME_IMAGES.brew}
                reverse
            />
            <ScrollSection
                title={t("home.sections.featured.title")}
                subtitle={t("home.sections.featured.subtitle")}
                image={HOME_IMAGES.featured}
            />

            {/* CTA BANNER */}
            <section className="px-4 my-12">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto max-w-6xl rounded-2xl bg-[var(--bg-brand)] p-6 md:p-8 text-center "
                >
                    <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-dark)]">
                        {t("home.banner.title")}
                    </h3>
                    <p className="mt-2 text-[var(--text-dark)]">
                        {t("home.banner.subtitle")}
                    </p>
                    <div className="mt-5">
                        <Link
                            to="/menu"
                            className="
                inline-flex items-center justify-center rounded-xl
                bg-[var(--brand-dark)] px-6 py-3 text-white font-semibold
                shadow-md transition-transform hover:scale-[1.03] active:scale-[0.98]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a44c] focus-visible:ring-offset-2
              "
                        >
                            {t("home.cta")}
                        </Link>
                    </div>
                </motion.div>
            </section>
        </>
    )
}
