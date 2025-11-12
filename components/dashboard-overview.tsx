"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Users, CreditCard, TrendingUp, AlertTriangle, Plus, Calendar, RefreshCw } from "lucide-react"
import { OverviewChart } from "@/components/overview-chart"
import { RecentPayments } from "@/components/recent-payments"
import { PropertyStatusGrid } from "@/components/property-status-grid"
import { useDashboard } from "@/lib/hooks/useDashboard"

export function DashboardOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const { summary, loading, error, refetch } = useDashboard()

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Carregando dashboard...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-2">Erro ao carregar dashboard</p>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
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
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Novo Imóvel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Imóveis</CardTitle>
            <Building2 className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.properties.total || 0}</div>
            <p className="text-xs text-gray-600">
              <span className="text-green-600">{summary?.properties.occupied_units || 0} ocupados</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inquilinos Ativos</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.contracts.active || 0}</div>
            <p className="text-xs text-gray-600">contratos ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(summary?.financial.monthly_revenue || 0).toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              Receita mensal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                {summary?.financial.overdue_payments || 0} em atraso
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                {summary?.contracts.expiring_soon || 0} vencendo
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Taxa de ocupação: {((summary?.properties.occupancy_rate || 0) * 100).toFixed(1)}%
            </p>
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
            <RecentPayments />
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
          <PropertyStatusGrid />
        </CardContent>
      </Card>
    </div>
  )
}
