// Split "077 636 190 / 093 616 989" into clickable tel: links
export function parsePhones(raw, countryCode = "+855") {
    if (!raw) return []
    return raw
        .split(/[\/,|]/) // support "/", "," or "|"
        .map(s => s.trim())
        .filter(Boolean)
        .map(display => {
            const compact = display.replace(/\s+/g, "")
            let e164
            if (compact.startsWith("+")) {
                e164 = compact
            } else {
                const nums = compact.replace(/[^\d]/g, "")
                if (!nums) return null
                if (nums.startsWith("0")) e164 = countryCode + nums.slice(1)
                else if (nums.startsWith("855")) e164 = "+" + nums
                else e164 = "+" + nums
            }
            return { display, href: `tel:${e164}` }
        })
        .filter(Boolean)
}

// Accept "@user" or full URL
export function telegramHref(val) {
    if (!val) return null
    if (/^https?:\/\//i.test(val)) return val
    const user = val.replace(/^@/, "")
    return `https://t.me/${user}`
}

export function buildDirectionsUrl(q) {
    const dest = q?.trim?.() ? q : ""
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`
}


export function safeEmbedSrc(raw) {
    if (!raw) return null
    const s = String(raw).trim()
    const cutAt = s.indexOf('" width=') > -1 ? s.indexOf('" width=') : s.indexOf(" ")
    const candidate = cutAt > -1 ? s.slice(0, cutAt) : s
    return candidate.replace(/^"+|"+$/g, "")
}