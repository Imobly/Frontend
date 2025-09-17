"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Filter, Grid3X3, List, AlertTriangle, TrendingUp } from "lucide-react"
import { PaymentCard } from "@/components/payments/payment-card"
import { PaymentList } from "@/components/payments/payment-list"
import { PaymentDialog } from "@/components/payments/payment-dialog"
import { PaymentFilters } from "@/components/payments/payment-filters"
import { PaymentChart } from "@/components/payments/payment-chart"
import { Payment, PaymentFormData } from "@/lib/types/payment"

// Mock data - será substituído por dados reais posteriormente
const mockPayments = [
  {
    id: 1,
    property: {
      id: 1,
      name: "Apartamento 101",
      address: "Rua das Flores, 123 - Centro",
    },
    tenant: {
      id: 1,
      name: "Maria Silva",
      email: "maria.silva@email.com",
    },
    contract: {
      id: 1,
      title: "Contrato - Apartamento 101",
    },
    dueDate: "2024-12-10",
    paymentDate: "2024-12-08",
    amount: 2500,
    fineAmount: 0,
    totalAmount: 2500,
    status: "paid",
    paymentMethod: "bank_transfer",
    description: "Aluguel referente a dezembro/2024",
    createdAt: "2024-11-25",
  },
  {
    id: 2,
    property: {
      id: 2,
      name: "Casa Jardins",
      address: "Av. Principal, 456 - Jardins",
    },
    tenant: {
      id: 2,
      name: "João Santos",
      email: "joao.santos@email.com",
    },
    contract: {
      id: 2,
      title: "Contrato - Casa Jardins",
    },
    dueDate: "2024-12-15",
    paymentDate: null,
    amount: 3200,
    fineAmount: 0,
    totalAmount: 3200,
    status: "pending",
    paymentMethod: null,
    description: "Aluguel referente a dezembro/2024",
    createdAt: "2024-11-30",
  },
  {
    id: 3,
    property: {
      id: 4,
      name: "Loja Centro",
      address: "Rua Comercial, 321 - Centro",
    },
    tenant: {
      id: 4,
      name: "Carlos Lima",
      email: "carlos.lima@empresa.com",
    },
    contract: {
      id: 3,
      title: "Contrato - Loja Centro",
    },
    dueDate: "2024-12-05",
    paymentDate: null,
    amount: 4500,
    fineAmount: 225, // 5% de multa
    totalAmount: 4725,
    status: "overdue",
    paymentMethod: null,
    description: "Aluguel referente a dezembro/2024",
    createdAt: "2024-11-20",
  },
  {
    id: 4,
    property: {
      id: 1,
      name: "Apartamento 101",
      address: "Rua das Flores, 123 - Centro",
    },
    tenant: {
      id: 1,
      name: "Maria Silva",
      email: "maria.silva@email.com",
    },
    contract: {
      id: 1,
      title: "Contrato - Apartamento 101",
    },
    dueDate: "2024-11-10",
    paymentDate: "2024-11-09",
    amount: 2500,
    fineAmount: 0,
    totalAmount: 2500,
    status: "paid",
    paymentMethod: "pix",
    description: "Aluguel referente a novembro/2024",
    createdAt: "2024-10-25",
  },
  {
    id: 5,
    property: {
      id: 2,
      name: "Casa Jardins",
      address: "Av. Principal, 456 - Jardins",
    },
    tenant: {
      id: 2,
      name: "João Santos",
      email: "joao.santos@email.com",
    },
    contract: {
      id: 2,
      title: "Contrato - Casa Jardins",
    },
    dueDate: "2024-11-15",
    paymentDate: "2024-11-18",
    amount: 3200,
    fineAmount: 96, // 3% de multa
    totalAmount: 3296,
    status: "paid",
    paymentMethod: "bank_transfer",
    description: "Aluguel referente a novembro/2024",
    createdAt: "2024-10-30",
  },
]

export function PaymentsView() {
  const [payments] = useState(mockPayments)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list" | "property">("list")
  const [showDialog, setShowDialog] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null)

  const filteredPayments = payments.filter(
    (payment) =>
      payment.property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.property.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowDialog(true)
  }

  const handleAdd = () => {
    setSelectedPayment(null)
    setShowDialog(true)
  }

  const statusCounts = {
    total: payments.length,
    paid: payments.filter((p) => p.status === "paid").length,
    pending: payments.filter((p) => p.status === "pending").length,
    overdue: payments.filter((p) => p.status === "overdue").length,
  }

  const financialSummary = {
    totalReceived: payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.totalAmount, 0),
    totalPending: payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.totalAmount, 0),
    totalOverdue: payments.filter((p) => p.status === "overdue").reduce((sum, p) => sum + p.totalAmount, 0),
    totalFines: payments.reduce((sum, p) => sum + p.fineAmount, 0),
  }

  // Group payments by property
  const paymentsByProperty = payments.reduce((acc, payment) => {
    const propertyId = payment.property.id
    if (!acc[propertyId]) {
      acc[propertyId] = {
        property: payment.property,
        payments: []
      }
    }
    acc[propertyId].payments.push(payment)
    return acc
  }, {} as Record<number, { property: typeof payments[0]['property'], payments: typeof payments }>)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'overdue': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
          <p className="text-muted-foreground">Gerencie os pagamentos e multas</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Pagamento
        </Button>
      </div>

      {/* Financial Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {financialSummary.totalReceived.toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-muted-foreground">{statusCounts.paid} pagamentos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              R$ {financialSummary.totalPending.toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-muted-foreground">{statusCounts.pending} pagamentos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 flex items-center">
              R$ {financialSummary.totalOverdue.toLocaleString("pt-BR")}
              {statusCounts.overdue > 0 && <AlertTriangle className="ml-2 h-4 w-4" />}
            </div>
            <p className="text-xs text-muted-foreground">{statusCounts.overdue} pagamentos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total em Multas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              R$ {financialSummary.totalFines.toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              Receita adicional
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentChart />
        </CardContent>
      </Card>

      {/* Property-based View */}
      <Card>
        <CardHeader>
          <CardTitle>Pagamentos por Propriedade</CardTitle>
          <p className="text-sm text-gray-600">Visualize os pagamentos organizados por imóvel</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.values(paymentsByProperty).map(({ property, payments: propertyPayments }) => (
              <div key={property.id} className="border rounded-lg p-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setSelectedPropertyId(selectedPropertyId === property.id ? null : property.id)}
                >
                  <div>
                    <h3 className="font-medium">{property.name}</h3>
                    <p className="text-sm text-gray-600">{property.address}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="text-green-600 font-medium">
                        {propertyPayments.filter(p => p.status === 'paid').length} pagos
                      </span>
                      <span className="mx-2">•</span>
                      <span className="text-yellow-600 font-medium">
                        {propertyPayments.filter(p => p.status === 'pending').length} pendentes
                      </span>
                      <span className="mx-2">•</span>
                      <span className="text-red-600 font-medium">
                        {propertyPayments.filter(p => p.status === 'overdue').length} atrasados
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      {selectedPropertyId === property.id ? '−' : '+'}
                    </Button>
                  </div>
                </div>

                {selectedPropertyId === property.id && (
                  <div className="mt-4 space-y-3">
                    {propertyPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="font-medium">{payment.tenant.name}</p>
                              <p className="text-sm text-gray-600">{payment.description}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(payment.status)}`}>
                              {payment.status === 'paid' ? 'Pago' : 
                               payment.status === 'pending' ? 'Pendente' : 'Atrasado'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${getStatusColor(payment.status)}`}>
                            R$ {payment.totalAmount.toLocaleString('pt-BR')}
                          </p>
                          <p className="text-sm text-gray-600">
                            Venc: {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por imóvel, inquilino ou descrição..."
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
      {showFilters && <PaymentFilters />}

      {/* Payments */}
      <div className="space-y-4">
        {viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} onEdit={handleEdit} />
            ))}
          </div>
        ) : (
          <PaymentList payments={filteredPayments} onEdit={handleEdit} />
        )}

        {filteredPayments.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Nenhum pagamento encontrado</h3>
                <p className="text-muted-foreground">Tente ajustar os filtros ou adicione um novo pagamento.</p>
                <Button className="mt-4" onClick={handleAdd}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Pagamento
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Payment Dialog */}
      <PaymentDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        payment={selectedPayment}
        onSave={(payment) => {
          // Aqui seria implementada a lógica de salvar
          console.log("Saving payment:", payment)
          setShowDialog(false)
        }}
      />
    </div>
  )
}
