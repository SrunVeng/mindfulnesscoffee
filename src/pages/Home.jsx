import React from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

export default function Home() {
    const { t } = useTranslation()
    return (
        <section className="relative">
            <div className="bg-brand-gradient text-white">
                <div className="mx-auto max-w-6xl px-4 py-20">
                    <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-sm">
                        {t("home.headline")}
                    </h1>
                    <Link
                        to="/menu"
                        className="inline-block mt-6 px-5 py-3 bg-white text-brand rounded-lg font-semibold hover:opacity-90"
                    >
                        {t("home.cta")}
                    </Link>
                </div>
            </div>
            <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-xl border">
                    <h3 className="font-semibold mb-2">Fresh Beans</h3>
                    <p className="text-sm text-gray-600">Roasted weekly for balanced flavor.</p>
                </div>
                <div className="p-6 bg-white rounded-xl border">
                    <h3 className="font-semibold mb-2">Local Taste</h3>
                    <p className="text-sm text-gray-600">Signature drinks inspired by Cambodia.</p>
                </div>
                <div className="p-6 bg-white rounded-xl border">
                    <h3 className="font-semibold mb-2">Cozy Space</h3>
                    <p className="text-sm text-gray-600">Your corner to work, chat, and chill.</p>
                </div>
            </div>
        </section>
    )
}
