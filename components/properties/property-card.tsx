"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MapPin, Bed, Bath, Car, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import Image from "next/image"
import { Property } from "@/lib/types/property"

interface PropertyCardProps {
  property: Property
  onEdit: (property: Property) => void
}

const statusConfig = {
  occupied: { label: "Ocupado", className: "bg-green-100 text-green-800" },
  vacant: { label: "Vago", className: "bg-gray-100 text-gray-800" },
  maintenance: { label: "Manutenção", className: "bg-orange-100 text-orange-800" },
}

const typeConfig = {
  apartment: "Apartamento",
  house: "Casa",
  commercial: "Comercial",
}

export function PropertyCard({ property, onEdit }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image src={property.images?.[0] || "/placeholder.svg"} alt={property.name} fill className="object-cover" />
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(property)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className={statusConfig[property.status as keyof typeof statusConfig].className}>
            {statusConfig[property.status as keyof typeof statusConfig].label}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{property.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="mr-1 h-3 w-3" />
              {property.address}, {property.neighborhood}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tipo:</span>
            <span>{typeConfig[property.type as keyof typeof typeConfig]}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Área:</span>
            <span>{property.area}m²</span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {property.bedrooms > 0 && (
              <div className="flex items-center">
                <Bed className="mr-1 h-3 w-3" />
                {property.bedrooms}
              </div>
            )}
            <div className="flex items-center">
              <Bath className="mr-1 h-3 w-3" />
              {property.bathrooms}
            </div>
            {property.parkingSpaces > 0 && (
              <div className="flex items-center">
                <Car className="mr-1 h-3 w-3" />
                {property.parkingSpaces}
              </div>
            )}
          </div>

          {property.tenant && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Inquilino:</span>
              <span>{property.tenant}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-lg font-bold">R$ {property.rent.toLocaleString("pt-BR")}</span>
            <span className="text-xs text-muted-foreground">/mês</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
