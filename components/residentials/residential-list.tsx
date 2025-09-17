"use client"

import { Card } from "@/components/ui/card"
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

interface ResidentialListProps {
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

export function ResidentialList({ residentials, onEdit, onDelete }: ResidentialListProps) {
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
    <div className="space-y-4">
      {residentials.map((residential) => {
        const TypeIcon = typeIcons[residential.type]
        const occupancyRate = (residential.occupiedUnits / residential.totalUnits) * 100

        return (
          <Card key={residential.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-3">
                  <TypeIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-lg">{residential.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {residential.address}, {residential.city} - {residential.state}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
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

                  <div className="text-center">
                    <div className="text-lg font-bold">{residential.totalUnits}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{residential.occupiedUnits}</div>
                    <div className="text-xs text-muted-foreground">Ocupadas</div>
                  </div>

                  <div className="text-center min-w-[80px]">
                    <div className="text-lg font-bold">{occupancyRate.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">Ocupação</div>
                    <div className="w-full bg-muted rounded-full h-1 mt-1">
                      <div
                        className={`h-1 rounded-full transition-all ${
                          occupancyRate > 80 ? "bg-green-500" : occupancyRate > 50 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${occupancyRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
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
            </div>

            {residential.description && (
              <p className="text-sm text-muted-foreground mt-3 ml-9">{residential.description}</p>
            )}

            {residential.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3 ml-9">
                {residential.amenities.map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
