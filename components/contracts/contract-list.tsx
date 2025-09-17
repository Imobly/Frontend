"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, Download, Building2, User } from "lucide-react"

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
}

interface ContractListProps {
  contracts: Contract[]
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

export function ContractList({ contracts, onEdit }: ContractListProps) {
  const isExpiringSoon = (contract: Contract) => {
    if (contract.status !== "active") return false
    const endDate = new Date(contract.endDate)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 90 && diffDays > 0
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contrato</TableHead>
            <TableHead>Imóvel</TableHead>
            <TableHead>Inquilino</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Aluguel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell>
                <div className="font-medium">{contract.title}</div>
                {contract.nextAdjustment && contract.status === "active" && (
                  <div className="text-xs text-muted-foreground">
                    Reajuste: {new Date(contract.nextAdjustment).toLocaleDateString("pt-BR")}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">{contract.property.name}</div>
                    <div className="text-xs text-muted-foreground">{contract.property.address}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">{contract.tenant.name}</div>
                    <div className="text-xs text-muted-foreground">{contract.tenant.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{new Date(contract.startDate).toLocaleDateString("pt-BR")}</div>
                  <div className="text-muted-foreground">{new Date(contract.endDate).toLocaleDateString("pt-BR")}</div>
                </div>
              </TableCell>
              <TableCell>{typeConfig[contract.type as keyof typeof typeConfig]}</TableCell>
              <TableCell className="font-medium">R$ {contract.rentValue.toLocaleString("pt-BR")}</TableCell>
              <TableCell>
                <div className="flex flex-col space-y-1">
                  <Badge
                    variant="secondary"
                    className={statusConfig[contract.status as keyof typeof statusConfig].className}
                  >
                    {statusConfig[contract.status as keyof typeof statusConfig].label}
                  </Badge>
                  {isExpiringSoon(contract) && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                      Vence em breve
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
