"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Home, Edit, Trash2, Eye } from "lucide-react"

interface Residential {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  type: "apartment" | "house" | "commercial"
  totalUnits: number
  occupiedUnits: number
  description?: string
  amenities: string[]
  createdAt: string
}

interface ResidentialCardProps {
  residentials: Residential[]
  onEdit: (residential: Residential) => void
  onDelete: (id: string) => void
}

const typeLabels = {
  apartment: "Apartamento",
  house: "Casa",
  commercial: "Comercial",
}

const typeIcons = {
  apartment: Building2,
  house: Home,
  commercial: Building2,
}

export function ResidentialCard({ residentials, onEdit, onDelete }: ResidentialCardProps) {
  if (residentials.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum residencial encontrado</h3>
        <p className="text-muted-foreground">Comece criando seu primeiro residencial ou ajuste os filtros de busca.</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {residentials.map((residential) => {
        const TypeIcon = typeIcons[residential.type]
        const occupancyRate = (residential.occupiedUnits / residential.totalUnits) * 100

        return (
          <Card key={residential.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <TypeIcon className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{residential.name}</CardTitle>
                </div>
                <Badge
                  variant={
                    residential.type === "apartment"
                      ? "default"
                      : residential.type === "house"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {typeLabels[residential.type]}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {residential.address}, {residential.city} - {residential.state}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {residential.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{residential.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{residential.totalUnits}</div>
                  <div className="text-xs text-muted-foreground">Total de Unidades</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{residential.occupiedUnits}</div>
                  <div className="text-xs text-muted-foreground">Ocupadas</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Taxa de Ocupação</span>
                  <span className="font-medium">{occupancyRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      occupancyRate > 80 ? "bg-green-500" : occupancyRate > 50 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
              </div>

              {residential.amenities.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Comodidades</div>
                  <div className="flex flex-wrap gap-1">
                    {residential.amenities.slice(0, 3).map((amenity) => (
                      <Badge key={amenity} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {residential.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{residential.amenities.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver Unidades
                </Button>
                <Button variant="outline" size="sm" onClick={() => onEdit(residential)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(residential.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
