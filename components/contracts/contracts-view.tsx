"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Filter, Grid3X3, List, AlertTriangle } from "lucide-react"
import { ContractCard } from "@/components/contracts/contract-card"
import { ContractList } from "@/components/contracts/contract-list"
import { ContractDialog } from "@/components/contracts/contract-dialog"
import { ContractFilters } from "@/components/contracts/contract-filters"

// Mock data - será substituído por dados reais posteriormente
const mockContracts = [
  {
    id: 1,
    title: "Contrato - Apartamento 101",
    property: {
      id: 1,
      name: "Apartamento 101",
      address: "Rua das Flores, 123 - Centro",
    },
    tenant: {
      id: 1,
      name: "Maria Silva",
      email: "maria.silva@email.com",
      phone: "(11) 99999-1111",
    },
    startDate: "2024-01-15",
    endDate: "2025-01-14",
    rentValue: 2500,
    depositValue: 2500,
    status: "active",
    type: "residential",
    renewalType: "automatic",
    adjustmentIndex: "IGPM",
    adjustmentPercentage: 0,
    nextAdjustment: "2025-01-15",
    clauses: [
      "O inquilino se compromete a manter o imóvel em bom estado de conservação.",
      "É vedado o uso do imóvel para fins comerciais.",
      "O pagamento do aluguel deve ser efetuado até o dia 10 de cada mês.",
    ],
    documents: [
      {
        id: 1,
        name: "Contrato de Locação.pdf",
        url: "/contract-sample.pdf",
        uploadDate: "2024-01-10",
      },
    ],
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    title: "Contrato - Casa Jardins",
    property: {
      id: 2,
      name: "Casa Jardins",
      address: "Av. Principal, 456 - Jardins",
    },
    tenant: {
      id: 2,
      name: "João Santos",
      email: "joao.santos@email.com",
      phone: "(11) 99999-3333",
    },
    startDate: "2024-02-01",
    endDate: "2025-01-31",
    rentValue: 3200,
    depositValue: 3200,
    status: "active",
    type: "residential",
    renewalType: "manual",
    adjustmentIndex: "IPCA",
    adjustmentPercentage: 0,
    nextAdjustment: "2025-02-01",
    clauses: [
      "O inquilino é responsável pela manutenção do jardim.",
      "Permitido animais de estimação de pequeno porte.",
      "Condomínio por conta do inquilino.",
    ],
    documents: [
      {
        id: 2,
        name: "Contrato Casa Jardins.pdf",
        url: "/contract-sample.pdf",
        uploadDate: "2024-01-28",
      },
    ],
    createdAt: "2024-01-25",
  },
  {
    id: 3,
    title: "Contrato - Loja Centro",
    property: {
      id: 4,
      name: "Loja Centro",
      address: "Rua Comercial, 321 - Centro",
    },
    tenant: {
      id: 4,
      name: "Carlos Lima",
      email: "carlos.lima@empresa.com",
      phone: "(11) 99999-7777",
    },
    startDate: "2024-04-01",
    endDate: "2027-03-31",
    rentValue: 4500,
    depositValue: 9000,
    status: "active",
    type: "commercial",
    renewalType: "manual",
    adjustmentIndex: "IGPM",
    adjustmentPercentage: 0,
    nextAdjustment: "2025-04-01",
    clauses: [
      "Permitido uso comercial conforme alvará de funcionamento.",
      "Inquilino responsável por todas as taxas municipais.",
      "Horário de funcionamento: 8h às 22h.",
    ],
    documents: [
      {
        id: 3,
        name: "Contrato Comercial.pdf",
        url: "/contract-sample.pdf",
        uploadDate: "2024-03-28",
      },
    ],
    createdAt: "2024-03-25",
  },
  {
    id: 4,
    title: "Contrato - Apartamento 205 (Encerrado)",
    property: {
      id: 3,
      name: "Apartamento 205",
      address: "Rua Nova, 789 - Vila Nova",
    },
    tenant: {
      id: 3,
      name: "Ana Costa",
      email: "ana.costa@email.com",
      phone: "(11) 99999-5555",
    },
    startDate: "2023-06-01",
    endDate: "2024-05-31",
    rentValue: 1800,
    depositValue: 1800,
    status: "expired",
    type: "residential",
    renewalType: "manual",
    adjustmentIndex: "IPCA",
    adjustmentPercentage: 8.5,
    nextAdjustment: null,
    clauses: ["Contrato de 12 meses sem renovação automática.", "Inquilino responsável por pequenos reparos."],
    documents: [
      {
        id: 4,
        name: "Contrato Encerrado.pdf",
        url: "/contract-sample.pdf",
        uploadDate: "2023-05-28",
      },
    ],
    createdAt: "2023-05-25",
  },
]

export function ContractsView() {
  const [contracts] = useState(mockContracts)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showDialog, setShowDialog] = useState(false)
  const [selectedContract, setSelectedContract] = useState<(typeof mockContracts)[0] | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.property.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (contract: (typeof mockContracts)[0]) => {
    setSelectedContract(contract)
    setShowDialog(true)
  }

  const handleAdd = () => {
    setSelectedContract(null)
    setShowDialog(true)
  }

  const statusCounts = {
    total: contracts.length,
    active: contracts.filter((c) => c.status === "active").length,
    expired: contracts.filter((c) => c.status === "expired").length,
    expiringSoon: contracts.filter((c) => {
      if (c.status !== "active") return false
      const endDate = new Date(c.endDate)
      const today = new Date()
      const diffTime = endDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 90 && diffDays > 0
    }).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
          <p className="text-muted-foreground">Gerencie os contratos de locação</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Contrato
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vencendo em 90 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 flex items-center">
              {statusCounts.expiringSoon}
              {statusCounts.expiringSoon > 0 && <AlertTriangle className="ml-2 h-4 w-4" />}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expirados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statusCounts.expired}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por contrato, imóvel, inquilino ou endereço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
        <div className="flex items-center space-x-1">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && <ContractFilters />}

      {/* Contracts */}
      <div className="space-y-4">
        {viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} onEdit={handleEdit} />
            ))}
          </div>
        ) : (
          <ContractList contracts={filteredContracts} onEdit={handleEdit} />
        )}

        {filteredContracts.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Nenhum contrato encontrado</h3>
                <p className="text-muted-foreground">Tente ajustar os filtros ou adicione um novo contrato.</p>
                <Button className="mt-4" onClick={handleAdd}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Contrato
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Contract Dialog */}
      <ContractDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        contract={selectedContract}
        onSave={(contract) => {
          // Aqui seria implementada a lógica de salvar
          console.log("Saving contract:", contract)
          setShowDialog(false)
        }}
      />
    </div>
  )
}
