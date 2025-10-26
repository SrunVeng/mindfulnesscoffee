import React from "react"
import { useTranslation } from "react-i18next"
import variables from "../data/variables.json"

export default function Footer() {
    const { t } = useTranslation()
    return (
        <footer className="mt-16 border-t bg-white">
            <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-600">
                <p>
                    {t("footer.legal", { year: new Date().getFullYear(), brand: variables.brandName })}
                </p>
            </div>
        </footer>
    )
}
