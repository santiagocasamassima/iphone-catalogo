"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/ProductCard"

type Product = {
  name: string
  capacity: string
  battery: string
  color: string
  imei: string
  priceUSD: string
  priceARS: string
  image: string
  video: string
  provider?: string
  location?: string
  cost?: string
  roi?: string
}

const MODELOS = ["iPhone 13", "iPhone 14", "iPhone 15", "iPhone 16"]

export function CatalogClient({ products }: { products: Product[] }) {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesModel = selectedModel
        ? p.name.toLowerCase().includes(selectedModel.toLowerCase())
        : true

      const text = (
        p.name +
        " " +
        p.capacity +
        " " +
        p.color
      ).toLowerCase()

      const matchesSearch = search
        ? text.includes(search.toLowerCase())
        : true

      return matchesModel && matchesSearch
    })
  }, [products, selectedModel, search])

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <Input
        placeholder="Buscar por modelo, capacidad o color..."
        className="max-w-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Chips dinámicos */}
      <div className="flex gap-3 flex-wrap">
        {MODELOS.map((modelo) => (
          <Badge
            key={modelo}
            variant={selectedModel === modelo ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() =>
              setSelectedModel((prev) =>
                prev === modelo ? null : modelo
              )
            }
          >
            {modelo}
          </Badge>
        ))}
      </div>

      {/* Grilla de productos filtrados */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 italic">
          No hay productos que coincidan con el criterio.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((p, i) => (
            <ProductCard
                key={p.imei || i}
                name={p.name}
                capacity={p.capacity}
                battery={p.battery}
                color={p.color}
                imei={p.imei}
                priceUSD={p.priceUSD}
                priceARS={p.priceARS}
                image={p.image}
                video={p.video}
                />
          ))}
        </div>
      )}
    </div>
  )
}
