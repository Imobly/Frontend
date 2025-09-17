"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Building2, User, Calendar, CreditCard, MoreHorizontal, Edit, Trash2, Eye, AlertTriangle } from "lucide-react"
import { Payment } from "@/lib/types/payment"

interface PaymentCardProps {
  payment: Payment
  onEdit: (payment: Payment) => void
}

const statusConfig = {
  paid: { label: "Pago", className: "bg-green-100 text-green-800" },
  pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
  overdue: { label: "Atrasado", className: "bg-red-100 text-red-800" },
}

const paymentMethodConfig = {
  pix: "PIX",
  bank_transfer: "Transferência",
  cash: "Dinheiro",
  check: "Cheque",
  credit_card: "Cartão de Crédito",
}

export function PaymentCard({ payment, onEdit }: PaymentCardProps) {
  const getDaysOverdue = () => {
    if (payment.status !== "overdue") return 0
    const today = new Date()
    const dueDate = new Date(payment.dueDate)
    const diffTime = today.getTime() - dueDate.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge
                variant="secondary"
                className={statusConfig[payment.status as keyof typeof statusConfig].className}
              >
                {statusConfig[payment.status as keyof typeof statusConfig].label}
              </Badge>
              {payment.status === "overdue" && (
                <Badge variant="secondary" className="bg-red-100 text-red-800 flex items-center">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  {getDaysOverdue()} dias
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{payment.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(payment)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center text-sm">
          <Building2 className="mr-2 h-3 w-3 text-muted-foreground" />
          <div>
            <div className="font-medium">{payment.property.name}</div>
            <div className="text-xs text-muted-foreground">{payment.property.address}</div>
          </div>
        </div>

        <div className="flex items-center text-sm">
          <User className="mr-2 h-3 w-3 text-muted-foreground" />
          <div>
            <div className="font-medium">{payment.tenant.name}</div>
            <div className="text-xs text-muted-foreground">{payment.tenant.email}</div>
          </div>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-3 w-3" />
          <div>
            <div>Vencimento: {new Date(payment.dueDate).toLocaleDateString("pt-BR")}</div>
            {payment.paymentDate && <div>Pagamento: {new Date(payment.paymentDate).toLocaleDateString("pt-BR")}</div>}
          </div>
        </div>

        {payment.paymentMethod && (
          <div className="flex items-center text-sm">
            <CreditCard className="mr-2 h-3 w-3 text-muted-foreground" />
            {paymentMethodConfig[payment.paymentMethod as keyof typeof paymentMethodConfig]}
          </div>
        )}

        <div className="space-y-1 pt-2 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Valor:</span>
            <span>R$ {payment.amount.toLocaleString("pt-BR")}</span>
          </div>
          {payment.fineAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Multa:</span>
              <span className="text-red-600">R$ {payment.fineAmount.toLocaleString("pt-BR")}</span>
            </div>
          )}
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>R$ {payment.totalAmount.toLocaleString("pt-BR")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
