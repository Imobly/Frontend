"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Grid3X3, List, TrendingUp, DollarSign, AlertTriangle, Edit, Trash2, RefreshCw, Receipt } from "lucide-react"
import { useExpenses } from "@/lib/hooks/useExpenses"
import { ExpenseDialog } from "@/components/expenses/expense-dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { ExpenseList } from "@/components/expenses/expense-list"
import { ExpenseCard } from "@/components/expenses/expense-card"

export function ExpensesView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [showDialog, setShowDialog] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null)
  
  const { expenses, loading, error, refetch, createExpense, updateExpense, deleteExpense } = useExpenses()

  // Mostrar loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <div>
          <h2 className="text-xl font-semibold text-center">Carregando Despesas</h2>
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
        title="Erro ao carregar despesas"
        description={`Não foi possível carregar a lista de despesas. ${error}`}
        action={{
          label: "Tentar novamente",
          onClick: refetch
        }}
        variant="error"
      />
    )
  }

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.vendor && expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  const statusCounts = {
    total: expenses.length,
    paid: expenses.filter((e) => e.status === "paid").length,
    pending: expenses.filter((e) => e.status === "pending").length,
    scheduled: expenses.filter((e) => e.status === "scheduled").length,
  }

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const paidAmount = expenses
    .filter((e) => e.status === "paid")
    .reduce((sum, expense) => sum + expense.amount, 0)
  const pendingAmount = expenses
    .filter((e) => e.status === "pending")
    .reduce((sum, expense) => sum + expense.amount, 0)
  const formatCurrency = (amount: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount)

  const urgentExpenses = expenses.filter((e) => e.priority === "urgent").length

  const handleAdd = () => {
    setSelectedExpense(null)
    setShowDialog(true)
  }

  const handleEdit = (expense: any) => {
    setSelectedExpense(expense)
    setShowDialog(true)
  }

  const handleSave = async (expenseData: any) => {
    try {
      console.log("💾 Salvando despesa:", expenseData)
      
      if (selectedExpense) {
        const result = await updateExpense(selectedExpense.id, expenseData)
        console.log("✅ Despesa atualizada:", result)
      } else {
        const result = await createExpense(expenseData)
        console.log("✅ Despesa criada:", result)
      }
      
      setShowDialog(false)
      setSelectedExpense(null)
      await refetch()
    } catch (error) {
      console.error('❌ Erro ao salvar despesa:', error)
    }
  }

  const handleDelete = async (expenseId: string) => {
    if (confirm('Tem certeza que deseja deletar esta despesa?')) {
      await deleteExpense(expenseId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Button */}
      <div className="flex justify-end">
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Nova Despesa
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(totalAmount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagas</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.paid}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(paidAmount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <div className="h-4 w-4 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(pendingAmount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgentExpenses}</div>
            <p className="text-xs text-red-600">
              Necessita atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar despesas..."
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
        {expenses.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="Nenhuma despesa cadastrada"
            description="Comece registrando sua primeira despesa ou manutenção."
            action={{
              label: "Adicionar Primeira Despesa",
              onClick: handleAdd
            }}
          />
        ) : filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma despesa encontrada com os filtros aplicados.</p>
          </div>
        ) : (
          viewMode === "list" ? (
            <ExpenseList expenses={filteredExpenses} onEdit={handleEdit} onDelete={handleDelete} />
          ) : (
            <ExpenseCard expenses={filteredExpenses} onEdit={handleEdit} onDelete={handleDelete} />
          )
        )}
      </div>

      {/* Dialog */}
      <ExpenseDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        expense={selectedExpense}
        onSave={handleSave}
      />
    </div>
  )
}