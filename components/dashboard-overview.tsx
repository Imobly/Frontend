"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Users, CreditCard, TrendingUp, AlertTriangle, Plus, Calendar } from "lucide-react"
import { OverviewChart } from "@/components/overview-chart"
import { RecentPayments } from "@/components/recent-payments"
import { PropertyStatusGrid } from "@/components/property-status-grid"

// Mock data - será substituído por dados reais posteriormente
const mockData = {
  totalProperties: 12,
  occupiedProperties: 10,
  totalTenants: 15,
  activeTenants: 13,
  totalContracts: 18,
  activeContracts: 15,
  monthlyRevenue: 45000,
  pendingPayments: 3,
  overduePayments: 1,
  maintenanceRequests: 2,
}

export function DashboardOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")

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
            <div className="text-2xl font-bold">{mockData.totalProperties}</div>
            <p className="text-xs text-gray-600">
              <span className="text-green-600">{mockData.occupiedProperties} ocupados</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inquilinos Ativos</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.activeTenants}</div>
            <p className="text-xs text-gray-600">de {mockData.totalTenants} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {mockData.monthlyRevenue.toLocaleString("pt-BR")}</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12% vs mês anterior
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
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                {mockData.pendingPayments} pendentes
              </Badge>
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{mockData.overduePayments} atrasado</Badge>
            </div>
            <p className="text-xs text-gray-600 mt-2">{mockData.maintenanceRequests} solicitações de manutenção</p>
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
