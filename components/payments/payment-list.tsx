"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, Building2, User, AlertTriangle } from "lucide-react"

interface Payment {
  id: number
  property: {
    id: number
    name: string
    address: string
  }
  tenant: {
    id: number
    name: string
    email: string
  }
  dueDate: string
  paymentDate: string | null
  amount: number
  fineAmount: number
  totalAmount: number
  status: string
  paymentMethod: string | null
  description: string
}

interface PaymentListProps {
  payments: Payment[]
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

export function PaymentList({ payments, onEdit }: PaymentListProps) {
  const getDaysOverdue = (payment: Payment) => {
    if (payment.status !== "overdue") return 0
    const today = new Date()
    const dueDate = new Date(payment.dueDate)
    const diffTime = today.getTime() - dueDate.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imóvel / Inquilino</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Multa</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">{payment.property.name}</div>
                      <div className="text-xs text-muted-foreground">{payment.property.address}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">{payment.tenant.name}</div>
                      <div className="text-xs text-muted-foreground">{payment.tenant.email}</div>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{payment.description}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{new Date(payment.dueDate).toLocaleDateString("pt-BR")}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {payment.paymentDate ? (
                    <div>
                      <div>{new Date(payment.paymentDate).toLocaleDateString("pt-BR")}</div>
                      {payment.paymentMethod && (
                        <div className="text-xs text-muted-foreground">
                          {paymentMethodConfig[payment.paymentMethod as keyof typeof paymentMethodConfig]}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-medium">R$ {payment.amount.toLocaleString("pt-BR")}</span>
              </TableCell>
              <TableCell>
                {payment.fineAmount > 0 ? (
                  <span className="font-medium text-red-600">R$ {payment.fineAmount.toLocaleString("pt-BR")}</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <span className="font-bold">R$ {payment.totalAmount.toLocaleString("pt-BR")}</span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col space-y-1">
                  <Badge
                    variant="secondary"
                    className={statusConfig[payment.status as keyof typeof statusConfig].className}
                  >
                    {statusConfig[payment.status as keyof typeof statusConfig].label}
                  </Badge>
                  {payment.status === "overdue" && (
                    <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs flex items-center">
                      <AlertTriangle className="mr-1 h-2 w-2" />
                      {getDaysOverdue(payment)} dias
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
