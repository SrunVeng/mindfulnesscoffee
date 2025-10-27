import raw from "../data/products.json"

// Build immutable, precomputed views once at module init
const DATA = Array.isArray(raw) ? raw : []

// Flatten items with category metadata
const FLAT = DATA.flatMap((section) => {
  const cat = section?.category || ""
  const items = Array.isArray(section?.items) ? section.items : []
  return items.map((it) => ({ ...it, _category: cat }))
})

// Unique categories in file order
const CATEGORIES = (() => {
  const seen = new Set()
  const out = []
  for (const s of DATA) {
    const c = (s?.category || "").trim()
    const k = c.toLowerCase()
    if (!k || k === "all" || seen.has(k)) continue
    seen.add(k)
    out.push(c)
  }
  return out
})()

const DISPLAY_CATEGORIES = (() => {
  const norm = (s) => (s || "").trim().toLowerCase()
  const priority = ["signature", "premium", "hot drink", "hot drinks"]
  const pinned = CATEGORIES.filter((c) => priority.includes(norm(c)))
  const rest = CATEGORIES.filter((c) => !priority.includes(norm(c)))
  return [...pinned, ...rest]
})()

// Simple index by id if present
const BY_ID = (() => {
  const map = new Map()
  for (const it of FLAT) {
    if (it && (it.id || it.slug)) map.set(it.id ?? it.slug, it)
  }
  return map
})()

const getById = (idOrSlug) => BY_ID.get(idOrSlug)

const filterItems = (active = "All", q = "") => {
  const sameCat = (a, b) => (a || "").trim().toLowerCase() === (b || "").trim().toLowerCase()

  const inCat = active === "All" ? FLAT : FLAT.filter((it) => sameCat(it._category, active))

  const query = (q || "").trim().toLowerCase()
  if (!query) return inCat

  return inCat.filter((it) =>
    (it.name?.en || "").toLowerCase().includes(query) ||
    (it.name?.zh || "").toLowerCase().includes(query) ||
    (it.name?.km || "").toLowerCase().includes(query)
  )
}

const API = {
  categories: CATEGORIES,
  displayCategories: DISPLAY_CATEGORIES,
  items: FLAT,
  getById,
  filterItems,
}

export default function useProducts() {
  return API
}

export { useProducts }
