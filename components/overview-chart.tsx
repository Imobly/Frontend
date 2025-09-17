"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  {
    name: "Jul",
    receitas: 42000,
    despesas: 8500,
  },
  {
    name: "Ago",
    receitas: 44000,
    despesas: 9200,
  },
  {
    name: "Set",
    receitas: 43500,
    despesas: 7800,
  },
  {
    name: "Out",
    receitas: 45000,
    despesas: 8900,
  },
  {
    name: "Nov",
    receitas: 46500,
    despesas: 9500,
  },
  {
    name: "Dez",
    receitas: 45000,
    despesas: 8200,
  },
]

export function OverviewChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
