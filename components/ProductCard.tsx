import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import Image from "next/image"

interface ProductCardProps {
  name: string
  capacity: string
  battery: string
  color: string
  imei: string
  priceARS: string
  priceUSD: string
  image: string
  video: string
}

export function ProductCard({
  name,
  capacity,
  battery,
  color,
  imei,
  priceARS,
  priceUSD,
  image,
  video,
}: ProductCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer border border-gray-200">
      
      {/* Imagen */}
      <div className="relative w-full h-60 bg-gray-50">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-4"
        />
      </div>

      <CardHeader>
        <CardTitle className="text-lg">
          {name} — {capacity}
        </CardTitle>

        <CardDescription className="capitalize text-gray-600">
          {color} • Batería {battery}%
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm text-gray-500">IMEI: {imei}</p>

        <div className="space-y-1">
          <p className="font-bold text-lg">
            {priceARS}
          </p>
          <p className="text-gray-600">
            {priceUSD}
          </p>
        </div>

        {video && (
          <a
            href={video}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm block mt-2"
          >
            ▶ Ver video del producto
          </a>
        )}
      </CardContent>
    </Card>
  )
}

