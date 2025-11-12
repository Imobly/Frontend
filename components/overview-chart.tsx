"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { useRevenueChart, useExpenseChart } from "@/lib/hooks/useDashboard"
import { RefreshCw } from "lucide-react"

interface OverviewChartProps {
  period?: string
}

// Função para converter período em número de meses
const periodToMonths = (period: string): number => {
  switch (period) {
    case "1month": return 1
    case "3months": return 3
    case "6months": return 6
    case "1year": return 12
    default: return 6
  }
}

export function OverviewChart({ period = "6months" }: OverviewChartProps) {
  const months = periodToMonths(period)
  const { data: revenueData, loading: revenueLoading } = useRevenueChart(months)
  const { data: expenseData, loading: expenseLoading } = useExpenseChart(months)

  // Loading state
  if (revenueLoading || expenseLoading) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Carregando dados...</span>
      </div>
    )
  }

  // Combinar dados de receitas e despesas
  const chartData = revenueData?.data?.map((revenue: any, index: number) => {
    const expense = expenseData?.data?.[index] || { expenses: 0 }
    return {
      name: new Date(revenue.month).toLocaleDateString('pt-BR', { month: 'short' }),
      receitas: revenue.revenue || 0,
      despesas: expense.expenses || 0,
    }
  }) || []
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`}
        />
        <Tooltip
          formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, ""]}
          labelStyle={{ color: "#000" }}
        />
        <Legend />
        <Bar dataKey="receitas" name="Receitas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="despesas" name="Despesas" fill="#1e40af" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
