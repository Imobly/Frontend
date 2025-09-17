"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, TrendingDown, Calendar, Wrench } from "lucide-react"
import { ExpenseCard } from "./expense-card"
import { ExpenseList } from "./expense-list"
import { ExpenseDialog } from "./expense-dialog"
import { ExpenseFilters } from "./expense-filters"
import { ExpenseChart } from "./expense-chart"

interface Expense {
  id: string
  type: "expense" | "maintenance"
  category: string
  description: string
  amount: number
  date: string
  property: string
  status: "pending" | "paid" | "scheduled"
  priority?: "low" | "medium" | "high" | "urgent"
  vendor?: string
  receipt?: string
  notes?: string
}

const mockExpenses: Expense[] = [
  {
    id: "1",
    type: "maintenance",
    category: "Hidráulica",
    description: "Reparo vazamento banheiro",
    amount: 350.0,
    date: "2024-01-15",
    property: "Apartamento Centro - Apt 101",
    status: "paid",
    priority: "urgent",
    vendor: "João Encanador",
    receipt: "receipt-001.pdf",
  },
  {
    id: "2",
    type: "expense",
    category: "IPTU",
    description: "IPTU 2024 - 1ª parcela",
    amount: 1200.0,
    date: "2024-01-10",
    property: "Casa Jardins",
    status: "paid",
  },
  {
    id: "3",
    type: "maintenance",
    category: "Elétrica",
    description: "Troca de disjuntores",
    amount: 280.0,
    date: "2024-01-20",
    property: "Apartamento Centro - Apt 205",
    status: "scheduled",
    priority: "medium",
    vendor: "Elétrica Silva",
  },
  {
    id: "4",
    type: "expense",
    category: "Condomínio",
    description: "Taxa condominial Janeiro",
    amount: 450.0,
    date: "2024-01-05",
    property: "Apartamento Centro - Apt 101",
    status: "pending",
  },
]

export function ExpensesView() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    category: "all",
    status: "all",
    property: "all",
    dateRange: "all",
  })

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      expense.category.toLowerCase().includes(filters.search.toLowerCase()) ||
      expense.property.toLowerCase().includes(filters.search.toLowerCase())
    const matchesType = filters.type === "all" || expense.type === filters.type
    const matchesCategory = filters.category === "all" || expense.category === filters.category
    const matchesStatus = filters.status === "all" || expense.status === filters.status
    const matchesProperty = filters.property === "all" || expense.property === filters.property

    return matchesSearch && matchesType && matchesCategory && matchesStatus && matchesProperty
  })

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const paidExpenses = expenses.filter((e) => e.status === "paid").reduce((sum, expense) => sum + expense.amount, 0)
  const pendingExpenses = expenses
    .filter((e) => e.status === "pending")
    .reduce((sum, expense) => sum + expense.amount, 0)
  const maintenanceCount = expenses.filter((e) => e.type === "maintenance").length
  const urgentMaintenance = expenses.filter((e) => e.type === "maintenance" && e.priority === "urgent").length

  const handleSaveExpense = (expenseData: Omit<Expense, "id">) => {
    if (editingExpense) {
      setExpenses((prev) =>
        prev.map((expense) => (expense.id === editingExpense.id ? { ...expenseData, id: editingExpense.id } : expense)),
      )
    } else {
      const newExpense: Expense = {
        ...expenseData,
        id: Date.now().toString(),
      }
      setExpenses((prev) => [newExpense, ...prev])
    }
    setIsDialogOpen(false)
    setEditingExpense(null)
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setIsDialogOpen(true)
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagas</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {paidExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {expenses.filter((e) => e.status === "paid").length} despesas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Calendar className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              R$ {pendingExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {expenses.filter((e) => e.status === "pending").length} despesas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manutenções</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceCount}</div>
            <p className="text-xs text-muted-foreground">Total registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <Wrench className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger">{urgentMaintenance}</div>
            <p className="text-xs text-muted-foreground">Manutenções urgentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <ExpenseChart expenses={expenses} />

      {/* Filters and Actions */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <ExpenseFilters filters={filters} onFiltersChange={setFilters} />

        <div className="flex items-center gap-2">
          <Button variant={viewMode === "cards" ? "default" : "outline"} size="sm" onClick={() => setViewMode("cards")}>
            Cards
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            Lista
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Despesa
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="text-sm text-muted-foreground">
        Mostrando {filteredExpenses.length} de {expenses.length} despesas
      </div>

      {/* Expenses Display */}
      {viewMode === "cards" ? (
        <ExpenseCard expenses={filteredExpenses} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />
      ) : (
        <ExpenseList expenses={filteredExpenses} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />
      )}

      {/* Dialog */}
      <ExpenseDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        expense={editingExpense}
        onSave={handleSaveExpense}
      />
    </div>
  )
}
