import React from "react"
import variables from "../data/variables.json"
import { useTranslation } from "react-i18next"
import { motion as Motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

// Animation factories to keep objects stable and avoid re-creation noise
const createFadeUp = (reduced) => ({
    hidden: { opacity: 0, y: reduced ? 0 : 20, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: "easeOut" } },
})
const createStagger = (reduced) => ({
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.06, delayChildren: reduced ? 0 : 0.08 } },
})

export default function About() {
    const { t } = useTranslation()
    const team = variables.team.founders
    const aboutImage = variables.logo

    const prefersReduced = useReducedMotion()
    const { scrollYProgress } = useScroll()
    const yBg = useTransform(scrollYProgress, [0, 1], [0, -60])

    const fadeUp = createFadeUp(prefersReduced)
    const stagger = createStagger(prefersReduced)

    return (
        <main className="relative">
            {/* HERO (parallax image + tint + subtle texture, aligned with Home) */}
            <section className="relative isolate z-0 h-[92vh] min-h-[560px] flex items-center justify-center overflow-hidden bg-[var(--brand-bg)]">
                <Motion.div
                    style={{ y: yBg, backgroundImage: `url(${aboutImage})` }}
                    className="absolute inset-0 bg-cover bg-center scale-110"
                    aria-hidden
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(80% 60% at 50% 40%, rgba(255,255,255,0.00) 0%, rgba(0,0,0,0.35) 100%)",
                    }}
                    aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" aria-hidden />
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

                <Motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="relative z-10 px-6 text-center max-w-3xl"
                >
                    <h1 className="text-white text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-sm">
                        {t("about.title")}
                    </h1>
                </Motion.div>
            </section>

            {/* STORY CARD */}
            <section className="px-4 -mt-10 md:-mt-14 relative z-10">
                <Motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                    className="mx-auto max-w-6xl rounded-2xl border border-[#e7dbc9] bg-[#fffaf3] p-6 md:p-8 shadow-sm"
                >
                    <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] items-start">
                        <article className="prose prose-sm sm:prose-base max-w-none text-[#2d1a14]">
                            <p className="leading-7 text-[#6b5545] whitespace-pre-line">{t("about.body")}</p>
                        </article>

                        <figure className="rounded-xl overflow-hidden ring-1 ring-[#e7dbc9]">
                            <img
                                src={aboutImage}
                                alt={t("about.image_alt")}
                                loading="lazy"
                                className="h-64 w-full object-cover sm:h-80 md:h-full"
                            />
                        </figure>
                    </div>
                </Motion.div>
            </section>

            {/* FOUNDERS */}
            <section className="px-4 mt-12 md:mt-14">
                <div className="mx-auto max-w-6xl">
                    <Motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-3"
                    >
                        <Motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-[#2d1a14]">
                            {t("about.founders_title")}
                        </Motion.h2>
                        <Motion.p variants={fadeUp} className="max-w-prose text-sm text-[#6b5545]">
                            {t("about.founders_blurb")}
                        </Motion.p>
                    </Motion.div>

                    <Motion.ul
                        role="list"
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-80px" }}
                        className="py-6 mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {team?.map((member, idx) => (
                            <Motion.li
                                key={`${member.name}-${idx}`}
                                variants={fadeUp}
                                className="group relative rounded-2xl border border-[#e7dbc9] bg-white p-5 shadow-sm hover:shadow-md transition"
                            >
                                <figure className="flex items-center gap-4">
                                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-1 ring-[#e7dbc9]">
                                        <img
                                            src={member.photo}
                                            alt={`${member.name} — ${member.role}`}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <figcaption>
                                        <div className="text-base font-semibold tracking-tight text-[#2d1a14]">{member.name}</div>
                                        <div className="text-sm text-[#6b5545]">{member.role}</div>
                                    </figcaption>
                                </figure>
                            </Motion.li>
                        ))}
                    </Motion.ul>
                </div>
            </section>

            {/* Ambient dots background (very subtle, like Home) */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 mix-blend-multiply [background-image:radial-gradient(#000/6_1px,transparent_1px)] [background-size:12px_12px] opacity-[0.04]"
            />
        </main>
    )
}
