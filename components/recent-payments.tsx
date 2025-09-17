"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const recentPayments = [
  {
    id: 1,
    tenant: "Maria Silva",
    property: "Apt 101 - Centro",
    amount: 2500,
    status: "paid",
    date: "2024-12-15",
  },
  {
    id: 2,
    tenant: "João Santos",
    property: "Casa - Jardins",
    amount: 3200,
    status: "pending",
    date: "2024-12-10",
  },
  {
    id: 3,
    tenant: "Ana Costa",
    property: "Apt 205 - Vila Nova",
    amount: 1800,
    status: "paid",
    date: "2024-12-08",
  },
  {
    id: 4,
    tenant: "Carlos Lima",
    property: "Loja - Centro",
    amount: 4500,
    status: "overdue",
    date: "2024-12-05",
  },
  {
    id: 5,
    tenant: "Lucia Ferreira",
    property: "Apt 302 - Bela Vista",
    amount: 2200,
    status: "paid",
    date: "2024-12-03",
  },
]

const statusConfig = {
  paid: { label: "Pago", className: "bg-green-100 text-green-800" },
  pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
  overdue: { label: "Atrasado", className: "bg-red-100 text-red-800" },
}

export function RecentPayments() {
  return (
    <div className="space-y-4">
      {recentPayments.map((payment) => (
        <div key={payment.id} className="flex items-center space-x-4">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {payment.tenant
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{payment.tenant}</p>
            <p className="text-xs text-muted-foreground">{payment.property}</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm font-medium">R$ {payment.amount.toLocaleString("pt-BR")}</p>
            <Badge variant="secondary" className={statusConfig[payment.status as keyof typeof statusConfig].className}>
              {statusConfig[payment.status as keyof typeof statusConfig].label}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
