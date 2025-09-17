import { ExpensesView } from "@/components/expenses/expenses-view"

export default function ExpensesPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Despesas e Manutenção</h1>
        <p className="text-muted-foreground mt-2">Gerencie todas as despesas e manutenções dos seus imóveis</p>
      </div>
      <ExpensesView />
    </div>
  )
}
