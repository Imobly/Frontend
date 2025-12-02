"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Users, CreditCard, TrendingUp, AlertTriangle, Calendar, RefreshCw } from "lucide-react"
import { OverviewChart } from "@/components/overview-chart"
import { RecentPayments } from "@/components/recent-payments"
import { PropertyStatusGrid } from "@/components/property-status-grid"
import { useDashboard } from "@/lib/hooks/useDashboard"
import { usePayments } from "@/lib/hooks/usePayments"
import { useExpenses } from "@/lib/hooks/useExpenses"
import { EmptyState } from "@/components/ui/empty-state"
import { currencyFormat } from "@/lib/utils"

export function DashboardOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const { summary, stats, loading, error, refetch } = useDashboard(selectedPeriod)
  const { payments, loading: paymentsLoading } = usePayments()
  const { expenses, loading: expensesLoading } = useExpenses()
  
  // Calcular totais reais - TODOS os pagamentos (independente do status)
  const totalReceitas = payments.reduce((sum, payment) => sum + (payment.total_amount || 0), 0)
  const totalDespesas = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
  const receitaLiquida = totalReceitas - totalDespesas
  const pagamentosAtrasados = payments.filter(p => p.status === 'overdue').length
  
  // Debug temporário
  console.log('📊 Dashboard Debug:', {
    totalPayments: payments.length,
    totalReceitas,
    payments: payments.map(p => ({ id: p.id, total_amount: p.total_amount, status: p.status })),
    totalExpenses: expenses.length,
    totalDespesas
  })

  // Loading state
  if (loading || paymentsLoading || expensesLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <div>
          <h2 className="text-xl font-semibold text-center">Carregando Dashboard</h2>
          <p className="text-gray-500 text-center mt-2">Aguarde enquanto carregamos seus dados...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Erro ao carregar dashboard"
        description={`Não foi possível carregar os dados do dashboard. ${error}`}
        action={{
          label: "Tentar novamente",
          onClick: refetch
        }}
        variant="error"
      />
    )
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-600">Visão geral da sua carteira de imóveis</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Selecionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Último mês</SelectItem>
              <SelectItem value="3months">Últimos 3 meses</SelectItem>
              <SelectItem value="6months">Últimos 6 meses</SelectItem>
              <SelectItem value="1year">Último ano</SelectItem>
              <SelectItem value="custom">Período customizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-6">
        <Card className="max-w-[200px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Imóveis</CardTitle>
            <Building2 className="h-3 w-3 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{summary?.properties.total || 0}</div>
            <p className="text-xs text-gray-600">
              <span className="text-green-600">{summary?.properties.occupied_units || 0} ocupados</span>
            </p>
          </CardContent>
        </Card>

        <Card className="max-w-[200px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Inquilinos</CardTitle>
            <Users className="h-3 w-3 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{summary?.contracts.active || 0}</div>
            <p className="text-xs text-gray-600">
              <span className="text-blue-600">{summary?.contracts.active || 0} ativos</span>
            </p>
          </CardContent>
        </Card>

        <Card className="max-w-[200px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Receitas</CardTitle>
            <TrendingUp className="h-3 w-3 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-600">
              {currencyFormat(totalReceitas)}
            </div>
            <p className="text-xs text-gray-600">mensal</p>
          </CardContent>
        </Card>

        <Card className="max-w-[200px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Despesas</CardTitle>
            <CreditCard className="h-3 w-3 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-red-600">
              {currencyFormat(totalDespesas)}
            </div>
            <p className="text-xs text-gray-600">mensal</p>
          </CardContent>
        </Card>

        <Card className="max-w-[200px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Rec. Líquida</CardTitle>
            <TrendingUp className="h-3 w-3 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-blue-600">
              {currencyFormat(receitaLiquida)}
            </div>
            <p className="text-xs text-gray-600">mensal</p>
          </CardContent>
        </Card>

        <Card className="max-w-[200px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Status</CardTitle>
            <AlertTriangle className="h-3 w-3 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">{pagamentosAtrasados}</div>
            <p className="text-xs text-gray-600">em atraso</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Receitas vs Despesas</CardTitle>
            <CardDescription>Comparativo do período selecionado</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart period={selectedPeriod} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Pagamentos Recentes</CardTitle>
            <CardDescription>Últimas transações registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentPayments period={selectedPeriod} />
          </CardContent>
        </Card>
      </div>

      {/* Property Status Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Status dos Imóveis</CardTitle>
          <CardDescription>Visão rápida do status de todos os imóveis</CardDescription>
        </CardHeader>
        <CardContent>
          <PropertyStatusGrid period={selectedPeriod} />
        </CardContent>
      </Card>
    </div>
  )
}
