"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { RefreshCw } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { usePayments } from "@/lib/hooks/usePayments"
import { currencyFormat } from "@/lib/utils"

interface RecentPaymentsProps {
  period?: string
}

const statusConfig = {
  paid: { label: "Pago", className: "bg-green-100 text-green-800" },
  pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
  partial: { label: "Parcial", className: "bg-orange-100 text-orange-800" },
  overdue: { label: "Atrasado", className: "bg-red-100 text-red-800" },
}

export function RecentPayments({ period = "6months" }: RecentPaymentsProps) {
  const { payments, loading, error } = usePayments()
  
  // Pegar apenas os 2 últimos pagamentos ordenados por data de criação
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
    .slice(0, 2)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
        <span className="ml-2 text-sm text-gray-600">Carregando...</span>
      </div>
    )
  }

  if (error || recentPayments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
        <p className="text-sm">{error || "Nenhum pagamento recente"}</p>
      </div>
    )
  }

  const getInitials = (name?: string) => {
    if (!name) return "?"
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  return (
    <div className="space-y-2">
      {recentPayments.map((payment) => {
        const initials = getInitials(payment.tenant_name)
        return (
          <div key={payment.id} className="flex items-center justify-between py-2 border-b last:border-0">
            <div className="flex items-start gap-3 min-w-0">
              <Avatar className="h-9 w-9 text-xs font-semibold bg-muted">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{payment.tenant_name || 'Inquilino desconhecido'}</p>
                <p className="text-xs text-muted-foreground truncate">{payment.property_address || 'Endereço não disponível'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-3">
              <p className="text-sm font-semibold whitespace-nowrap">{currencyFormat(payment.total_amount || 0)}</p>
              <Badge
                variant="secondary"
                className={statusConfig[payment.status as keyof typeof statusConfig]?.className || "bg-gray-100 text-gray-800"}
              >
                {statusConfig[payment.status as keyof typeof statusConfig]?.label || payment.status}
              </Badge>
            </div>
          </div>
        )
      })}
    </div>
  )
}
