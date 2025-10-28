// Centralized helpers for category i18n

// Map raw category strings from JSON to safe i18n keys
export const KEY_MAP = {
    Signature: "signature",
    Premium: "premium",
    Hot: "hot",
    Cold: "cold",
    COLD: "cold",
    "Frappe/Smothies": "frappe_smoothies",   // common typo in data
    "Frappe/Smoothies": "frappe_smoothies",
    "FRAPPE/SMOOTHIES": "frappe_smoothies",
    "Tea/Passion/Soda": "tea_passion_soda",
    "TEA/PASSION/SODA": "tea_passion_soda",
    Food: "food",
    FOOD: "food",
}

// Unicode-safe normalizer for any unexpected labels
export const normalize = (s) =>
    (s || "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "_") // collapse spaces/symbols to _
        .replace(/^_+|_+$/g, "")          // trim underscores
    || s

export const keyForCategory = (cat) => KEY_MAP[cat] || normalize(cat)

/** Returns the translated label for a category, with sensible fallbacks. */
export function labelForCategory(t, cat) {
    if (!cat) return ""
    if (cat === "All" || cat === "__all__") return t("menu.all", "All")

    const norm = keyForCategory(cat)
    const normKey = `menu.categories.${norm}`
    const rawKey  = `menu.categories.${cat}`

    // Try normalized key → fall back to raw JSON key → fall back to the original label
    return t(normKey, t(rawKey, cat))
}
