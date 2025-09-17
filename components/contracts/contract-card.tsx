"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Building2, User, Calendar, FileText, MoreHorizontal, Edit, Trash2, Eye, Download } from "lucide-react"

interface Contract {
  id: number
  title: string
  property: {
    id: number
    name: string
    address: string
  }
  tenant: {
    id: number
    name: string
    email: string
    phone: string
  }
  startDate: string
  endDate: string
  rentValue: number
  status: string
  type: string
  nextAdjustment: string | null
  documents: Array<{
    id: number
    name: string
    url: string
    uploadDate: string
  }>
}

interface ContractCardProps {
  contract: Contract
  onEdit: (contract: Contract) => void
}

const statusConfig = {
  active: { label: "Ativo", className: "bg-green-100 text-green-800" },
  expired: { label: "Expirado", className: "bg-red-100 text-red-800" },
  pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
}

const typeConfig = {
  residential: "Residencial",
  commercial: "Comercial",
}

export function ContractCard({ contract, onEdit }: ContractCardProps) {
  const isExpiringSoon = () => {
    if (contract.status !== "active") return false
    const endDate = new Date(contract.endDate)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 90 && diffDays > 0
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{contract.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <Badge
                variant="secondary"
                className={statusConfig[contract.status as keyof typeof statusConfig].className}
              >
                {statusConfig[contract.status as keyof typeof statusConfig].label}
              </Badge>
              {isExpiringSoon() && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Vence em breve
                </Badge>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(contract)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center text-sm">
          <Building2 className="mr-2 h-3 w-3 text-muted-foreground" />
          <div>
            <div className="font-medium">{contract.property.name}</div>
            <div className="text-xs text-muted-foreground">{contract.property.address}</div>
          </div>
        </div>

        <div className="flex items-center text-sm">
          <User className="mr-2 h-3 w-3 text-muted-foreground" />
          <div>
            <div className="font-medium">{contract.tenant.name}</div>
            <div className="text-xs text-muted-foreground">{contract.tenant.email}</div>
          </div>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-3 w-3" />
          {new Date(contract.startDate).toLocaleDateString("pt-BR")} -{" "}
          {new Date(contract.endDate).toLocaleDateString("pt-BR")}
        </div>

        <div className="flex items-center text-sm">
          <span className="text-muted-foreground">Tipo:</span>
          <span className="ml-2">{typeConfig[contract.type as keyof typeof typeConfig]}</span>
        </div>

        {contract.documents.length > 0 && (
          <div className="flex items-center text-sm text-muted-foreground">
            <FileText className="mr-2 h-3 w-3" />
            {contract.documents.length} documento{contract.documents.length > 1 ? "s" : ""}
          </div>
        )}

        {contract.nextAdjustment && contract.status === "active" && (
          <div className="text-sm">
            <span className="text-muted-foreground">Próximo reajuste:</span>
            <span className="ml-2">{new Date(contract.nextAdjustment).toLocaleDateString("pt-BR")}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-lg font-bold">R$ {contract.rentValue.toLocaleString("pt-BR")}</span>
          <span className="text-xs text-muted-foreground">/mês</span>
        </div>
      </CardContent>
    </Card>
  )
}
