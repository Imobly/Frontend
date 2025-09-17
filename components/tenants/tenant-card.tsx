"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Phone, Building2, MoreHorizontal, Edit, Trash2, Eye, Calendar } from "lucide-react"

interface Tenant {
  id: number
  name: string
  email: string
  phone: string
  cpfCnpj: string
  profession: string
  property: {
    id: number
    name: string
    address: string
  } | null
  contractStart: string | null
  contractEnd: string | null
  rent: number
  status: string
}

interface TenantCardProps {
  tenant: Tenant
  onEdit: (tenant: Tenant) => void
}

const statusConfig = {
  active: { label: "Ativo", className: "bg-green-100 text-green-800" },
  inactive: { label: "Inativo", className: "bg-gray-100 text-gray-800" },
}

export function TenantCard({ tenant, onEdit }: TenantCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(tenant.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{tenant.name}</h3>
              <p className="text-sm text-muted-foreground">{tenant.profession}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className={statusConfig[tenant.status as keyof typeof statusConfig].className}>
              {statusConfig[tenant.status as keyof typeof statusConfig].label}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(tenant)}>
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
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Mail className="mr-2 h-3 w-3" />
          {tenant.email}
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Phone className="mr-2 h-3 w-3" />
          {tenant.phone}
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">CPF/CNPJ:</span> {tenant.cpfCnpj}
        </div>

        {tenant.property ? (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center text-sm">
              <Building2 className="mr-2 h-3 w-3 text-muted-foreground" />
              <div>
                <div className="font-medium">{tenant.property.name}</div>
                <div className="text-xs text-muted-foreground">{tenant.property.address}</div>
              </div>
            </div>

            {tenant.contractStart && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-3 w-3" />
                Contrato: {new Date(tenant.contractStart).toLocaleDateString("pt-BR")} -{" "}
                {tenant.contractEnd ? new Date(tenant.contractEnd).toLocaleDateString("pt-BR") : "Indefinido"}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-lg font-bold">R$ {tenant.rent.toLocaleString("pt-BR")}</span>
              <span className="text-xs text-muted-foreground">/mês</span>
            </div>
          </div>
        ) : (
          <div className="pt-2 border-t">
            <div className="text-sm text-muted-foreground text-center py-2">Sem imóvel vinculado</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
