"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Users } from "lucide-react"

const properties = [
  {
    id: 1,
    name: "Apartamento 101",
    address: "Rua das Flores, 123 - Centro",
    status: "occupied",
    tenant: "Maria Silva",
    rent: 2500,
    nextPayment: "2025-01-15",
  },
  {
    id: 2,
    name: "Casa Jardins",
    address: "Av. Principal, 456 - Jardins",
    status: "occupied",
    tenant: "João Santos",
    rent: 3200,
    nextPayment: "2025-01-10",
  },
  {
    id: 3,
    name: "Apartamento 205",
    address: "Rua Nova, 789 - Vila Nova",
    status: "vacant",
    tenant: null,
    rent: 1800,
    nextPayment: null,
  },
  {
    id: 4,
    name: "Loja Centro",
    address: "Rua Comercial, 321 - Centro",
    status: "maintenance",
    tenant: "Carlos Lima",
    rent: 4500,
    nextPayment: "2025-01-05",
  },
  {
    id: 5,
    name: "Apartamento 302",
    address: "Av. Bela Vista, 654 - Bela Vista",
    status: "occupied",
    tenant: "Lucia Ferreira",
    rent: 2200,
    nextPayment: "2025-01-03",
  },
  {
    id: 6,
    name: "Sala Comercial",
    address: "Ed. Business, 987 - Centro",
    status: "vacant",
    tenant: null,
    rent: 3500,
    nextPayment: null,
  },
]

const statusConfig = {
  occupied: {
    label: "Ocupado",
    className: "bg-green-100 text-green-800",
    color: "hsl(var(--status-occupied))",
  },
  vacant: {
    label: "Vago",
    className: "bg-gray-100 text-gray-800",
    color: "hsl(var(--status-vacant))",
  },
  maintenance: {
    label: "Manutenção",
    className: "bg-orange-100 text-orange-800",
    color: "hsl(var(--status-maintenance))",
  },
}

export function PropertyStatusGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <Card key={property.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold text-sm">{property.name}</h3>
              </div>
              <Badge
                variant="secondary"
                className={statusConfig[property.status as keyof typeof statusConfig].className}
              >
                {statusConfig[property.status as keyof typeof statusConfig].label}
              </Badge>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{property.address}</span>
              </div>

              {property.tenant && (
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{property.tenant}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium text-foreground">R$ {property.rent.toLocaleString("pt-BR")}</span>
                {property.nextPayment && (
                  <span className="text-xs">Próx: {new Date(property.nextPayment).toLocaleDateString("pt-BR")}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
