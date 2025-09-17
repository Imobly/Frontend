"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Filter, Grid3X3, List } from "lucide-react"
import { TenantCard } from "@/components/tenants/tenant-card"
import { TenantList } from "@/components/tenants/tenant-list"
import { TenantDialog } from "@/components/tenants/tenant-dialog"
import { TenantFilters } from "@/components/tenants/tenant-filters"

// Mock data - será substituído por dados reais posteriormente
const mockTenants = [
  {
    id: 1,
    name: "Maria Silva",
    email: "maria.silva@email.com",
    phone: "(11) 99999-1111",
    cpfCnpj: "123.456.789-00",
    birthDate: "1985-03-15",
    profession: "Engenheira",
    emergencyContact: {
      name: "João Silva",
      phone: "(11) 99999-2222",
      relationship: "Cônjuge",
    },
    address: {
      street: "Rua das Palmeiras, 456",
      neighborhood: "Vila Madalena",
      city: "São Paulo",
      state: "SP",
      zipCode: "05432-100",
    },
    property: {
      id: 1,
      name: "Apartamento 101",
      address: "Rua das Flores, 123 - Centro",
    },
    contractStart: "2024-01-15",
    contractEnd: "2025-01-14",
    rent: 2500,
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    name: "João Santos",
    email: "joao.santos@email.com",
    phone: "(11) 99999-3333",
    cpfCnpj: "987.654.321-00",
    birthDate: "1978-07-22",
    profession: "Advogado",
    emergencyContact: {
      name: "Ana Santos",
      phone: "(11) 99999-4444",
      relationship: "Esposa",
    },
    address: {
      street: "Av. Paulista, 1000",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
    },
    property: {
      id: 2,
      name: "Casa Jardins",
      address: "Av. Principal, 456 - Jardins",
    },
    contractStart: "2024-02-01",
    contractEnd: "2025-01-31",
    rent: 3200,
    status: "active",
    createdAt: "2024-01-25",
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(11) 99999-5555",
    cpfCnpj: "456.789.123-00",
    birthDate: "1990-11-08",
    profession: "Designer",
    emergencyContact: {
      name: "Carlos Costa",
      phone: "(11) 99999-6666",
      relationship: "Pai",
    },
    address: {
      street: "Rua Augusta, 2000",
      neighborhood: "Consolação",
      city: "São Paulo",
      state: "SP",
      zipCode: "01305-000",
    },
    property: null,
    contractStart: null,
    contractEnd: null,
    rent: 0,
    status: "inactive",
    createdAt: "2024-03-01",
  },
  {
    id: 4,
    name: "Carlos Lima",
    email: "carlos.lima@empresa.com",
    phone: "(11) 99999-7777",
    cpfCnpj: "12.345.678/0001-90",
    birthDate: null,
    profession: "Empresário",
    emergencyContact: {
      name: "Lucia Lima",
      phone: "(11) 99999-8888",
      relationship: "Sócia",
    },
    address: {
      street: "Rua Comercial, 500",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01001-000",
    },
    property: {
      id: 4,
      name: "Loja Centro",
      address: "Rua Comercial, 321 - Centro",
    },
    contractStart: "2024-04-01",
    contractEnd: "2025-03-31",
    rent: 4500,
    status: "active",
    createdAt: "2024-03-25",
  },
]

export function TenantsView() {
  const [tenants] = useState(mockTenants)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showDialog, setShowDialog] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<(typeof mockTenants)[0] | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.cpfCnpj.includes(searchTerm) ||
      (tenant.property?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false),
  )

  const handleEdit = (tenant: (typeof mockTenants)[0]) => {
    setSelectedTenant(tenant)
    setShowDialog(true)
  }

  const handleAdd = () => {
    setSelectedTenant(null)
    setShowDialog(true)
  }

  const statusCounts = {
    total: tenants.length,
    active: tenants.filter((t) => t.status === "active").length,
    inactive: tenants.filter((t) => t.status === "inactive").length,
    withProperty: tenants.filter((t) => t.property !== null).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inquilinos</h1>
          <p className="text-muted-foreground">Gerencie os inquilinos dos seus imóveis</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Inquilino
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
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{statusCounts.inactive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Com Imóvel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statusCounts.withProperty}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email, CPF/CNPJ ou imóvel..."
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
      {showFilters && <TenantFilters />}

      {/* Tenants */}
      <div className="space-y-4">
        {viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTenants.map((tenant) => (
              <TenantCard key={tenant.id} tenant={tenant} onEdit={handleEdit} />
            ))}
          </div>
        ) : (
          <TenantList tenants={filteredTenants} onEdit={handleEdit} />
        )}

        {filteredTenants.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Nenhum inquilino encontrado</h3>
                <p className="text-muted-foreground">Tente ajustar os filtros ou adicione um novo inquilino.</p>
                <Button className="mt-4" onClick={handleAdd}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Inquilino
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tenant Dialog */}
      <TenantDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        tenant={selectedTenant}
        onSave={(tenant) => {
          // Aqui seria implementada a lógica de salvar
          console.log("Saving tenant:", tenant)
          setShowDialog(false)
        }}
      />
    </div>
  )
}
