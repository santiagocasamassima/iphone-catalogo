import { fetchSheet } from "@/lib/fetchSheet"
import { CatalogClient } from "@/components/CatalogClient"

// -------------------------------------------------------------
// HELPERS
// -------------------------------------------------------------
function normalizePrice(v: any) {
  if (!v) return ""
  let s = String(v).replace(/[^\d.,]/g, "")

  if (s.includes(".") && s.includes(",")) {
    s = s.replace(/\./g, "")
    s = s.replace(",", ".")
    return s
  }

  if (s.includes(",")) return s.replace(",", ".")

  return s
}

function normalizeColor(raw: any) {
  if (!raw) return ""
  return String(raw).trim().toUpperCase()
}

function normalizeBattery(raw: any) {
  if (!raw) return null
  const m = String(raw).match(/\d+/)
  return m ? Number(m[0]) : null
}

function detectCategory(name: string) {
  const n = name?.toUpperCase() || ""
  if (n.includes("IPHONE")) return "iphone"
  if (n.includes("IPAD")) return "ipad"
  if (n.includes("AIRPODS")) return "airpods"
  if (n.includes("MACBOOK")) return "macbook"
  if (n.includes("PS5") || n.includes("MANDO")) return "ps5"
  return "other"
}

function detectIphoneCondition({ estado, falla, imei, name }: any) {
  const est = String(estado || "").toUpperCase()
  const fall = String(falla || "").trim()
  const ime = String(imei || "").trim()
  const nam = String(name || "").toUpperCase()

  if (!nam.includes("IPHONE")) return null
  if (est.includes("NUEVO") && est.includes("SELLADO")) return "iphone-new"
  if (est.startsWith("OUTLET")) return "iphone-outlet"
  if (fall) return "iphone-outlet"
  if (!ime || ime.length < 5) return "iphone-outlet"

  return "iphone-premium"
}

// -------------------------------------------------------------
// NORMALIZADOR
// -------------------------------------------------------------
function normalizeRow(r: any) {
  return {
    name: r["modelo"] || "",
    capacity: r["capacidad"] || "",
    estado: r["estado"] || "",
    falla: r["falla"] || "",
    imei: r["imei"] || "",
    ubicacion: r["ubicacion"] || "",
    color: normalizeColor(r["color"] || ""),
    battery: normalizeBattery(r["bateria"] || ""),

    video:
      r["video_referencia"]?.toString().trim().toUpperCase() === "VER VIDEO"
        ? "https://www.youtube.com/watch?v=QH2-TGUlwu4"
        : r["video_referencia"] || "",

    priceUSD: normalizePrice(r["venta_usd"] || ""),
    priceARS: normalizePrice(r["venta_ars"] || ""),

    category: detectCategory(r["modelo"] || ""),
    iphoneCondition: detectIphoneCondition({
      estado: r["estado"],
      falla: r["falla"],
      imei: r["imei"],
      name: r["modelo"],
    }),
  }
}

// -------------------------------------------------------------
// PAGE
// -------------------------------------------------------------
export default async function MinoristaPage() {
  const SHEET_ID = "1KiPkhmQLGfhLAmrknRFVEsdTyXcCfKO0NRY9IEvJwVg"
  const GID = "264297055"

  const raw = await fetchSheet(SHEET_ID, GID)

  const rows = raw

  const products = rows
    .map((r: any) => normalizeRow(r))
    .filter((p: any) => p.name.length > 0)
    .filter((p: any) => {
      const u = String(p.ubicacion || "").toUpperCase().trim()
      return u !== "TECNICO"
    })

  return (
    <main className="min-h-screen bg-white text-black">

      {/* HERO */}
      <section className="w-full py-8 text-center bg-white border-b">
        <h1
          className="
            text-4xl md:text-6xl font-semibold tracking-tight
            bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600
            bg-clip-text text-transparent
          "
        >
          RosarioIphone
        </h1>

        <p className="mt-1 text-sm md:text-base text-gray-600">
          Catálogo actualizado • Nuevos • Usados Premium • Outlet
        </p>
      </section>

      {/* CATALOGO */}
      <section id="catalogo" className="px-4 md:px-10 py-10 max-w-7xl mx-auto">
        <CatalogClient products={products as any} />
      </section>

      <footer className="py-10 text-center text-gray-500 text-sm border-t mt-10">
        © {new Date().getFullYear()} RosarioIphone
      </footer>
    </main>
  )
}
