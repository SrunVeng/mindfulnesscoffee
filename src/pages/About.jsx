import React from "react"
import variables from "../data/variables.json"
import { useTranslation } from "react-i18next"
import { motion, useReducedMotion } from "framer-motion"

export default function About() {
    const { t } = useTranslation()
    const team = variables.team.founders
    const aboutImage = variables.aboutImage

    const prefersReduced = useReducedMotion()

    const fadeUp = {
        hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
        show: { opacity: 1, y: 0 },
    }

    const stagger = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: prefersReduced ? 0 : 0.06,
                delayChildren: prefersReduced ? 0 : 0.08,
            },
        },
    }

    return (
        <section className="relative py-16 sm:py-20">
            {/* Ambient background */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-24 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-100 via-orange-50 to-transparent blur-3xl opacity-70" />
                <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-gradient-to-tr from-amber-200/50 to-white/0 blur-2xl" />
                <div className="absolute inset-0 mix-blend-multiply [background-image:radial-gradient(#000/6_1px,transparent_1px)] [background-size:12px_12px] opacity-[0.06]" />
            </div>

            <div className="mx-auto max-w-6xl px-4">
                {/* Top section */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid items-start gap-10 md:grid-cols-2"
                >
                    <motion.div variants={fadeUp}>
                        <h1 className="text-balance text-4xl font-extrabold leading-tight sm:text-5xl">
              <span className="bg-gradient-to-b from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {t("about.title")}
              </span>
                        </h1>

                        <p className="mt-4 max-w-prose text-gray-700 leading-7">
                            {t("about.body")}
                        </p>
                    </motion.div>

                    <motion.figure variants={fadeUp}>
                        <img
                            src={aboutImage}
                            alt={t("about.image_alt")}
                            loading="lazy"
                            className="h-80 w-full object-cover sm:h-[28rem]"
                        />
                    </motion.figure>
                </motion.div>

                {/* Founders */}
                <div className="mt-14 sm:mt-20">
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-3"
                    >
                        <motion.h2 variants={fadeUp} className="text-2xl font-bold sm:text-3xl">
                            {t("about.founders_title")}
                        </motion.h2>
                        <motion.p variants={fadeUp} className="max-w-prose text-sm text-gray-600">
                            {t("about.founders_blurb")}
                        </motion.p>
                    </motion.div>

                    <motion.ul
                        role="list"
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-80px" }}
                        className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {team?.map((member, idx) => (
                            <motion.li
                                key={`${member.name}-${idx}`}
                                variants={fadeUp}
                                className="group relative rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
                            >
                                <figure className="flex items-center gap-4">
                                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-1 ring-gray-200">
                                        <img
                                            src={member.photo}
                                            alt={`${member.name} — ${member.role}`}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <figcaption>
                                        <div className="text-base font-semibold tracking-tight">{member.name}</div>
                                        <div className="text-sm text-gray-600">{member.role}</div>
                                    </figcaption>
                                </figure>
                            </motion.li>
                        ))}
                    </motion.ul>
                </div>
            </div>
        </section>
    )
}
