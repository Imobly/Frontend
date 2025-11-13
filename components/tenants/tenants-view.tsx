"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Grid3X3, List, Users, UserCheck, UserX, Edit, Trash2, RefreshCw, AlertTriangle } from "lucide-react"
import { useTenants } from "@/lib/hooks/useTenants"
import { TenantDialog } from "@/components/tenants/tenant-dialog"
import { EmptyState } from "@/components/ui/empty-state"

export function TenantsView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showDialog, setShowDialog] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<any | null>(null)
  
  const { tenants, loading, error, refetch, createTenant, updateTenant, deleteTenant } = useTenants()

  // Mostrar loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <div>
          <h2 className="text-xl font-semibold text-center">Carregando Inquilinos</h2>
          <p className="text-gray-500 text-center mt-2">Aguarde um momento...</p>
        </div>
      </div>
    )
  }

  // Mostrar erro
  if (error) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Erro ao carregar inquilinos"
        description={`Não foi possível carregar a lista de inquilinos. ${error}`}
        action={{
          label: "Tentar novamente",
          onClick: refetch
        }}
        variant="error"
      />
    )
  }

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch = 
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.cpf_cnpj.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const statusCounts = {
    total: tenants.length,
    active: tenants.filter((t) => t.status === "active").length,
    inactive: tenants.filter((t) => t.status === "inactive").length,
  }

  const handleAdd = () => {
    setSelectedTenant(null)
    setShowDialog(true)
  }

  const handleEdit = (tenant: any) => {
    setSelectedTenant(tenant)
    setShowDialog(true)
  }

  const handleSave = async (tenantData: any) => {
    try {
      console.log("💾 Salvando inquilino:", tenantData)
      
      if (selectedTenant) {
        const result = await updateTenant(selectedTenant.id, tenantData)
        console.log("✅ Inquilino atualizado:", result)
      } else {
        const result = await createTenant(tenantData)
        console.log("✅ Inquilino criado:", result)
      }
      
      setShowDialog(false)
      setSelectedTenant(null)
      await refetch()
    } catch (error) {
      console.error('❌ Erro ao salvar inquilino:', error)
    }
  }

  const handleDelete = async (tenantId: number) => {
    if (confirm('Tem certeza que deseja deletar este inquilino?')) {
      await deleteTenant(tenantId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inquilinos</h1>
          <p className="text-gray-600">Gerencie seus inquilinos</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Novo Inquilino
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Inquilinos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <p className="text-xs text-muted-foreground">
              Total registrado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.active}</div>
            <p className="text-xs text-muted-foreground">
              Inquilinos ativos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <UserX className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.inactive}</div>
            <p className="text-xs text-muted-foreground">
              Inquilinos inativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar inquilinos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {tenants.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum inquilino cadastrado"
            description="Comece adicionando seu primeiro inquilino ao sistema."
            action={{
              label: "Adicionar Primeiro Inquilino",
              onClick: handleAdd
            }}
          />
        ) : filteredTenants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum inquilino encontrado com os filtros aplicados.</p>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
            {filteredTenants.map((tenant) => (
              <Card key={tenant.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{tenant.name}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(tenant)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(tenant.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    tenant.status === 'active' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {tenant.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">{tenant.email}</p>
                    <p className="text-sm text-gray-600">{tenant.phone}</p>
                    <p className="text-sm text-gray-500">CPF/CNPJ: {tenant.cpf_cnpj}</p>
                    {tenant.profession && (
                      <p className="text-sm text-gray-500">Profissão: {tenant.profession}</p>
                    )}
                    {tenant.birth_date && (
                      <p className="text-sm text-gray-500">
                        Nascimento: {new Date(tenant.birth_date).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  {tenant.emergency_contact && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500">Contato de emergência:</p>
                      <p className="text-xs text-gray-600">
                        {tenant.emergency_contact.name} ({tenant.emergency_contact.relationship}) - {tenant.emergency_contact.phone}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialog */}
      <TenantDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        tenant={selectedTenant}
        onSave={handleSave}
      />
    </div>
  )
}