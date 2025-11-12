"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Filter, Grid3X3, List, AlertTriangle, TrendingUp, CheckCircle, Clock, XCircle } from "lucide-react"
import { usePayments } from "@/lib/hooks/usePayments"
import { PaymentDialog } from "./payment-dialog"
import { PaymentCard } from "./payment-card"
import { PaymentList } from "./payment-list"
import { PaymentCreate, PaymentResponse } from "@/lib/types/api"
import { convertApiToPayment, Payment } from "@/lib/types/payment"



export function PaymentsView() {
  const { payments, loading, error, refetch, createPayment, confirmPayment } = usePayments()
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)

  // Mostrar loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Carregando pagamentos...</div>
      </div>
    )
  }

  // Mostrar erro
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">Erro: {error}</div>
      </div>
    )
  }

  // Converter dados da API para o formato interno
  const convertedPayments = payments.map(convertApiToPayment)

  const filteredPayments = convertedPayments.filter((payment: Payment) => {
    const matchesSearch = 
      payment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.property_id.toString().includes(searchTerm.toLowerCase()) ||
      payment.tenant_id.toString().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const statusCounts = {
    total: payments.length,
    paid: payments.filter((p) => p.status === "paid").length,
    pending: payments.filter((p) => p.status === "pending").length,
    overdue: payments.filter((p) => p.status === "overdue").length,
  }

  const totalAmount = payments.reduce((sum, payment) => sum + payment.total_amount, 0)
  const paidAmount = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, payment) => sum + payment.total_amount, 0)
  const pendingAmount = payments
    .filter((p) => p.status === "pending" || p.status === "overdue")
    .reduce((sum, payment) => sum + payment.total_amount, 0)

  const handleCreatePayment = () => {
    setSelectedPayment(null)
    setIsDialogOpen(true)
  }

  const handleEditPayment = (payment: any) => {
    setSelectedPayment(payment)
    setIsDialogOpen(true)
  }

  const handleSavePayment = async (paymentData: PaymentCreate) => {
    try {
      if (selectedPayment) {
        // Editar pagamento existente (implementar updatePayment no hook se necessário)
        console.log("Editando pagamento:", paymentData)
      } else {
        // Criar novo pagamento
        console.log("📋 Dados do pagamento a serem enviados:", paymentData)
        
        const success = await createPayment(paymentData)
        if (success) {
          setIsDialogOpen(false)
          await refetch()
        }
      }
    } catch (error) {
      console.error("Erro ao salvar pagamento:", error)
    }
  }

  const handleConfirmPayment = async (paymentId: number) => {
    try {
      const success = await confirmPayment(paymentId)
      if (success) {
        refetch()
      }
    } catch (error) {
      console.error("Erro ao confirmar pagamento:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
          <p className="text-gray-600">Gerencie pagamentos e aluguéis</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleCreatePayment}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Pagamento
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pagamentos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <p className="text-xs text-muted-foreground">
              R$ {totalAmount.toLocaleString("pt-BR")} no total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.paid}</div>
            <p className="text-xs text-muted-foreground">
              R$ {paidAmount.toLocaleString("pt-BR")} recebidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando pagamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statusCounts.overdue}</div>
            <p className="text-xs text-muted-foreground">
              R$ {pendingAmount.toLocaleString("pt-BR")} pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pagamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>

        <div className="flex items-center border rounded-md">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="border-0"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="border-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {filteredPayments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum pagamento encontrado</h3>
            <p className="text-gray-500 text-center mb-4">
              {searchTerm 
                ? "Tente ajustar os filtros ou termos de busca"
                : "Comece criando seu primeiro pagamento"
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleCreatePayment}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Pagamento
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPayments.map((payment) => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              onEdit={() => handleEditPayment(payment)}
            />
          ))}
        </div>
      ) : (
        <PaymentList
          payments={filteredPayments}
          onEdit={handleEditPayment}
        />
      )}

      {/* Payment Dialog */}
      <PaymentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        payment={selectedPayment}
        onSave={handleSavePayment}
      />
    </div>
  )
}