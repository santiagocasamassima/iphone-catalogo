"use client"

import { useMemo, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/ProductCard"
import type { Props } from "@/components/ProductCard"

// -----------------------------------------------------
// DETECTAR GENERACIÓN
// -----------------------------------------------------
const getGeneration = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes("iphone 17")) return 17
  if (n.includes("iphone 16")) return 16
  if (n.includes("iphone 15")) return 15
  if (n.includes("iphone 14")) return 14
  if (n.includes("iphone 13")) return 13
  if (n.includes("iphone 12")) return 12
  if (n.includes("iphone 11")) return 11
  return 0
}

// -----------------------------------------------------
// CATEGORÍAS
// -----------------------------------------------------
const CATEGORIES = [
  { id: "iphone", label: "iPhone" },
  { id: "ipad", label: "iPad" },
  { id: "airpods", label: "AirPods" },
  { id: "ps5", label: "PS5" },
  { id: "no-battery", label: "Otros" },
]

// -----------------------------------------------------
// MODELOS IPHONE
// -----------------------------------------------------
const MODELOS_IPHONE = [
  "IPHONE 11",
  "IPHONE 12",
  "IPHONE 13",
  "IPHONE 14",
  "IPHONE 15",
  "IPHONE 16",
  "IPHONE 17",
]

// -----------------------------------------------------
// SUBMODELOS IPHONE
// -----------------------------------------------------
const SUBMODELOS_MAP: Record<string, string[]> = {
  "IPHONE 11": ["11", "11 pro", "11 pro max"],
  "IPHONE 12": ["12", "12 mini", "12 pro", "12 pro max"],
  "IPHONE 13": ["13", "13 mini", "13 pro", "13 pro max"],
  "IPHONE 14": ["14", "14 plus", "14 pro", "14 pro max"],
  "IPHONE 15": ["15", "15 plus", "15 pro", "15 pro max"],
  "IPHONE 16": ["16", "16 plus", "16 pro", "16 pro max"],
  "IPHONE 17": ["17", "17 pro", "17 pro max"],
}

// -----------------------------------------------------
// MATCH EXACTO
// -----------------------------------------------------
function matchesExactModel(name: string, selected: string) {
  const n = name.toLowerCase()
  const s = selected.toLowerCase()

  if (s.includes("pro max")) return n.includes("pro max")
  if (s.includes("pro")) return n.includes("pro") && !n.includes("pro max")
  if (s.includes("mini")) return n.includes("mini")
  if (s.includes("plus")) return n.includes("plus")

  const base = s.replace("iphone", "").trim()
  return (
    n.includes(base) &&
    !n.includes("pro") &&
    !n.includes("mini") &&
    !n.includes("max") &&
    !n.includes("plus")
  )
}

// -----------------------------------------------------
// COMPONENTE PRINCIPAL
// -----------------------------------------------------
export function CatalogClient({ products }: { products: Props[] }) {
  const [selectedCategory, setSelectedCategory] = useState("iphone")
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [selectedSubModel, setSelectedSubModel] = useState<string | null>(null)

  const [search, setSearch] = useState("")

  const [filters, setFilters] = useState({
    capacity: "",
    color: "",
    minPrice: "",
    maxPrice: "",
  })

  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none")
  const [sortGen, setSortGen] = useState<"new" | "old" | "none">("none")

  // PANEL APPLE “FILTROS ▾”
  const [showAdvanced, setShowAdvanced] = useState(false)

  // AUTO-HIDE
  const [hideBar, setHideBar] = useState(false)
  const [lastScroll, setLastScroll] = useState(0)

  useEffect(() => {
    const handle = () => {
      const y = window.scrollY
      if (y > lastScroll && y > 100) setHideBar(true)
      else setHideBar(false)
      setLastScroll(y)
    }
    window.addEventListener("scroll", handle)
    return () => window.removeEventListener("scroll", handle)
  }, [lastScroll])

  // -----------------------------------------------------
  // FILTRADO PRINCIPAL
  // -----------------------------------------------------
  const filtered = useMemo(() => {
    let r = products.filter((p) => {
      const name = p.name.toLowerCase()
      const matchCat = p.category === selectedCategory
      const matchSearch = name.includes(search.toLowerCase())

      if (!matchCat || !matchSearch) return false

      if (selectedCategory === "iphone" && selectedModel) {
        if (!name.includes(selectedModel.toLowerCase())) return false
      }

      if (selectedSubModel && !matchesExactModel(name, selectedSubModel))
        return false

      const price = Number(p.priceUSD || 0)
      if (filters.minPrice && price < Number(filters.minPrice)) return false
      if (filters.maxPrice && price > Number(filters.maxPrice)) return false

      if (filters.capacity && !p.capacity.toLowerCase().includes(filters.capacity.toLowerCase()))
        return false

      if (filters.color && !p.color.toLowerCase().includes(filters.color.toLowerCase()))
        return false

      return true
    })

    if (sortOrder !== "none") {
      r = [...r].sort((a, b) =>
        sortOrder === "asc"
          ? Number(a.priceUSD) - Number(b.priceUSD)
          : Number(b.priceUSD) - Number(a.priceUSD)
      )
    }

    if (selectedCategory === "iphone" && sortGen !== "none") {
      r = [...r].sort((a, b) =>
        sortGen === "new"
          ? getGeneration(b.name) - getGeneration(a.name)
          : getGeneration(a.name) - getGeneration(b.name)
      )
    }

    return r
  }, [
    products,
    selectedCategory,
    selectedModel,
    selectedSubModel,
    search,
    filters,
    sortOrder,
    sortGen,
  ])

  // -----------------------------------------------------
  // AGRUPADO IPHONE
  // -----------------------------------------------------
  const grouped = MODELOS_IPHONE.reduce<Record<string, Props[]>>((acc, model) => {
    if (selectedCategory !== "iphone") return acc
    acc[model] = filtered.filter((p) =>
      p.name.toLowerCase().includes(model.toLowerCase())
    )
    return acc
  }, {})

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------
  return (
    <div key={selectedCategory} className="space-y-16">

      {/* HERO APPLE */}
      <section className="text-center pt-10 pb-6">
        <h1 className="text-5xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent">
            Rosario iPhone
          </span>
        </h1>
        <p className="text-gray-500 text-lg mt-3">
          Tecnología premium, al mejor precio.
        </p>
      </section>

      {/* STICKY APPLE MINIMAL */}
      <div
        className={`
          sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b
          transition-all duration-300
          ${hideBar ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}
          py-4 flex flex-col items-center gap-4
        `}
      >

        {/* SEARCH */}
        <div className="relative w-full max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <Input
            placeholder="Buscar producto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 focus:bg-white transition shadow-sm"
          />
        </div>

        {/* CATEGORÍAS APPLE */}
        <div className="flex gap-2 flex-wrap justify-center">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCategory(c.id)
                setSelectedModel(null)
                setSelectedSubModel(null)
              }}
              className={`
                px-4 py-2 rounded-full text-sm transition
                ${
                  selectedCategory === c.id
                    ? "bg-black text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
              `}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* BOTÓN APPLE “Filtros ▾” */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-gray-600 underline"
        >
          {showAdvanced ? "Ocultar filtros" : "Filtros ▾"}
        </button>

      </div>

      {/* PANEL DE FILTROS APPLE */}
      {showAdvanced && (
        <div className="mx-auto max-w-4xl bg-gray-50 p-6 rounded-3xl shadow-sm border">
          
          {/* MODELOS IPHONE */}
          {selectedCategory === "iphone" && (
            <>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Modelos</h3>
              <div className="flex gap-2 flex-wrap mb-6">
                {MODELOS_IPHONE.map((m) => (
                  <Badge
                    key={m}
                    variant={selectedModel === m ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1.5 rounded-full"
                    onClick={() => {
                      setSelectedModel(selectedModel === m ? null : m)
                      setSelectedSubModel(null)
                    }}
                  >
                    {m}
                  </Badge>
                ))}
              </div>

              {/* SUBMODELOS */}
              {selectedModel && (
                <>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Submodelos</h3>
                  <div className="flex gap-2 flex-wrap mb-6">
                    {SUBMODELOS_MAP[selectedModel]?.map((sub) => (
                      <Badge
                        key={sub}
                        variant={selectedSubModel === sub ? "default" : "outline"}
                        className="cursor-pointer px-3 py-1.5 rounded-full"
                        onClick={() =>
                          setSelectedSubModel(selectedSubModel === sub ? null : sub)
                        }
                      >
                        {sub.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* ▼ FILTROS AVANZADOS */}
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Filtros avanzados</h3>
          <div className="flex flex-wrap gap-4">

            <select
              value={filters.capacity}
              onChange={(e) => setFilters((f) => ({ ...f, capacity: e.target.value }))}
              className="border p-3 rounded-xl bg-white shadow-sm"
            >
              <option value="">Capacidad</option>
              <option value="64">64GB</option>
              <option value="128">128GB</option>
              <option value="256">256GB</option>
              <option value="512">512GB</option>
              <option value="1tb">1TB</option>
            </select>

            <select
              value={filters.color}
              onChange={(e) => setFilters((f) => ({ ...f, color: e.target.value }))}
              className="border p-3 rounded-xl bg-white shadow-sm"
            >
              <option value="">Color</option>
              <option value="black">Negro</option>
              <option value="white">Blanco</option>
              <option value="silver">Silver</option>
              <option value="blue">Azul</option>
              <option value="gold">Dorado</option>
              <option value="red">Rojo</option>
              <option value="pink">Rosa</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="border p-3 rounded-xl bg-white shadow-sm"
            >
              <option value="none">Precio</option>
              <option value="asc">Menor a mayor</option>
              <option value="desc">Mayor a menor</option>
            </select>

            {selectedCategory === "iphone" && (
              <select
                value={sortGen}
                onChange={(e) => setSortGen(e.target.value as any)}
                className="border p-3 rounded-xl bg-white shadow-sm"
              >
                <option value="none">Generación</option>
                <option value="new">Más nuevo</option>
                <option value="old">Más viejo</option>
              </select>
            )}

          </div>
        </div>
      )}

      {/* RESULTADOS iPHONE AGRUPADOS */}
      {selectedCategory === "iphone" &&
        MODELOS_IPHONE.map((m) => {
          const items = grouped[m]
          if (!items?.length) return null

          return (
            <section key={m} className="space-y-6 px-4">
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight border-b pb-2">
                {m}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {items.map((p, i) => (
                  <ProductCard key={p.imei || i} {...p} />
                ))}
              </div>
            </section>
          )
        })}

      {/* OTRAS CATEGORÍAS */}
      {selectedCategory !== "iphone" && (
        <div className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {filtered.map((p, i) => (
            <ProductCard key={p.imei || i} {...p} />
          ))}
        </div>
      )}
    </div>
  )
}

