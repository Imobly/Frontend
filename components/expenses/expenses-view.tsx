"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Grid3X3, List, TrendingUp, DollarSign, AlertTriangle, Edit, Trash2 } from "lucide-react"
import { useExpenses } from "@/lib/hooks/useExpenses"
import { ExpenseDialog } from "@/components/expenses/expense-dialog"

export function ExpensesView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showDialog, setShowDialog] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null)
  
  const { expenses, loading, error, refetch, createExpense, updateExpense, deleteExpense } = useExpenses()

  // Mostrar loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Carregando despesas...</div>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Despesas</h1>
          <p className="text-gray-600">Gerencie despesas e manutenções</p>
        </div>
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
            <p className="text-xs text-muted-foreground">
              R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagas</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.paid}</div>
            <p className="text-xs text-muted-foreground">
              R$ {paidAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <div className="h-4 w-4 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
            <p className="text-xs text-muted-foreground">
              R$ {pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
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
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma despesa encontrada.</p>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
            {filteredExpenses.map((expense) => (
              <Card key={expense.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{expense.description}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(expense)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      expense.status === 'paid' ? 'bg-green-100 text-green-800' :
                      expense.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {expense.status === 'paid' ? 'Paga' :
                       expense.status === 'pending' ? 'Pendente' : 'Agendada'}
                    </span>
                    {expense.priority && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        expense.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        expense.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        expense.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {expense.priority === 'urgent' ? 'Urgente' :
                         expense.priority === 'high' ? 'Alta' :
                         expense.priority === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Categoria: {expense.category}</p>
                    <p className="text-lg font-semibold">
                      R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-500">
                      Data: {new Date(expense.date).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Propriedade ID: {expense.property_id}
                    </p>
                    {expense.vendor && (
                      <p className="text-sm text-gray-600">Fornecedor: {expense.vendor}</p>
                    )}
                    {expense.notes && (
                      <p className="text-sm text-gray-600">Observações: {expense.notes}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
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