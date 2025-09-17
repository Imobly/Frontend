"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator } from "lucide-react"

interface Payment {
  id?: number
  property: {
    id: number
    name: string
    address: string
  } | null
  tenant: {
    id: number
    name: string
    email: string
  } | null
  contract: {
    id: number
    title: string
  } | null
  dueDate: string
  paymentDate: string | null
  amount: number
  fineAmount: number
  totalAmount: number
  status: string
  paymentMethod: string | null
  description: string
}

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment?: Payment | null
  onSave: (payment: Payment) => void
}

const initialPayment: Payment = {
  property: null,
  tenant: null,
  contract: null,
  dueDate: "",
  paymentDate: null,
  amount: 0,
  fineAmount: 0,
  totalAmount: 0,
  status: "pending",
  paymentMethod: null,
  description: "",
}

// Mock data for dropdowns
const mockProperties = [
  { id: 1, name: "Apartamento 101", address: "Rua das Flores, 123 - Centro" },
  { id: 2, name: "Casa Jardins", address: "Av. Principal, 456 - Jardins" },
  { id: 3, name: "Apartamento 205", address: "Rua Nova, 789 - Vila Nova" },
  { id: 4, name: "Loja Centro", address: "Rua Comercial, 321 - Centro" },
]

const mockTenants = [
  { id: 1, name: "Maria Silva", email: "maria.silva@email.com" },
  { id: 2, name: "João Santos", email: "joao.santos@email.com" },
  { id: 3, name: "Ana Costa", email: "ana.costa@email.com" },
  { id: 4, name: "Carlos Lima", email: "carlos.lima@empresa.com" },
]

const mockContracts = [
  { id: 1, title: "Contrato - Apartamento 101" },
  { id: 2, title: "Contrato - Casa Jardins" },
  { id: 3, title: "Contrato - Loja Centro" },
]

// Configurações de multa (seria configurável no sistema real)
const FINE_SETTINGS = {
  type: "percentage", // "percentage" ou "fixed"
  value: 5, // 5% ou valor fixo
  dailyInterest: 0.033, // 0.033% ao dia
}

export function PaymentDialog({ open, onOpenChange, payment, onSave }: PaymentDialogProps) {
  const [formData, setFormData] = useState<Payment>(initialPayment)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (payment) {
      setFormData(payment)
    } else {
      setFormData(initialPayment)
    }
  }, [payment])

  // Calcular multa automaticamente
  useEffect(() => {
    if (formData.dueDate && formData.amount > 0) {
      const today = new Date()
      const dueDate = new Date(formData.dueDate)

      if (formData.status === "overdue" && today > dueDate) {
        const diffTime = today.getTime() - dueDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        let fineAmount = 0
        if (FINE_SETTINGS.type === "percentage") {
          fineAmount = (formData.amount * FINE_SETTINGS.value) / 100
        } else {
          fineAmount = FINE_SETTINGS.value
        }

        // Adicionar juros diários
        const dailyInterest = (formData.amount * FINE_SETTINGS.dailyInterest * diffDays) / 100
        fineAmount += dailyInterest

        setFormData((prev) => ({
          ...prev,
          fineAmount: Math.round(fineAmount * 100) / 100,
          totalAmount: prev.amount + Math.round(fineAmount * 100) / 100,
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          fineAmount: 0,
          totalAmount: prev.amount,
        }))
      }
    }
  }, [formData.dueDate, formData.amount, formData.status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onSave(formData)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof Payment, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePropertyChange = (propertyId: string) => {
    const property = mockProperties.find((p) => p.id.toString() === propertyId)
    setFormData((prev) => ({ ...prev, property: property || null }))
  }

  const handleTenantChange = (tenantId: string) => {
    const tenant = mockTenants.find((t) => t.id.toString() === tenantId)
    setFormData((prev) => ({ ...prev, tenant: tenant || null }))
  }

  const handleContractChange = (contractId: string) => {
    const contract = mockContracts.find((c) => c.id.toString() === contractId)
    setFormData((prev) => ({ ...prev, contract: contract || null }))
  }

  const calculateFine = () => {
    if (!formData.dueDate || formData.amount <= 0) return

    const today = new Date()
    const dueDate = new Date(formData.dueDate)

    if (today > dueDate) {
      const diffTime = today.getTime() - dueDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      let fineAmount = 0
      if (FINE_SETTINGS.type === "percentage") {
        fineAmount = (formData.amount * FINE_SETTINGS.value) / 100
      } else {
        fineAmount = FINE_SETTINGS.value
      }

      const dailyInterest = (formData.amount * FINE_SETTINGS.dailyInterest * diffDays) / 100
      fineAmount += dailyInterest

      setFormData((prev) => ({
        ...prev,
        fineAmount: Math.round(fineAmount * 100) / 100,
        totalAmount: prev.amount + Math.round(fineAmount * 100) / 100,
        status: "overdue",
      }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{payment ? "Editar Pagamento" : "Novo Pagamento"}</DialogTitle>
          <DialogDescription>
            {payment ? "Edite as informações do pagamento." : "Registre um novo pagamento."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Associações */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="property">Imóvel</Label>
              <Select value={formData.property?.id.toString() || ""} onValueChange={handlePropertyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um imóvel" />
                </SelectTrigger>
                <SelectContent>
                  {mockProperties.map((property) => (
                    <SelectItem key={property.id} value={property.id.toString()}>
                      {property.name} - {property.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenant">Inquilino</Label>
              <Select value={formData.tenant?.id.toString() || ""} onValueChange={handleTenantChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um inquilino" />
                </SelectTrigger>
                <SelectContent>
                  {mockTenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id.toString()}>
                      {tenant.name} - {tenant.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contract">Contrato</Label>
              <Select value={formData.contract?.id.toString() || ""} onValueChange={handleContractChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um contrato" />
                </SelectTrigger>
                <SelectContent>
                  {mockContracts.map((contract) => (
                    <SelectItem key={contract.id} value={contract.id.toString()}>
                      {contract.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="overdue">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Datas e Valores */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Data de Vencimento</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDate">Data de Pagamento</Label>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate || ""}
                onChange={(e) => handleInputChange("paymentDate", e.target.value || null)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", Number(e.target.value))}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
              <Select
                value={formData.paymentMethod || ""}
                onValueChange={(value) => handleInputChange("paymentMethod", value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a forma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                  <SelectItem value="check">Cheque</SelectItem>
                  <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cálculo de Multa */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Cálculo de Multa
              </CardTitle>
              <CardDescription>
                Multa: {FINE_SETTINGS.value}% + {FINE_SETTINGS.dailyInterest}% ao dia após vencimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Valor Original</Label>
                  <div className="text-lg font-semibold">R$ {formData.amount.toLocaleString("pt-BR")}</div>
                </div>

                <div className="space-y-2">
                  <Label>Multa</Label>
                  <div className="text-lg font-semibold text-red-600">
                    R$ {formData.fineAmount.toLocaleString("pt-BR")}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Total</Label>
                  <div className="text-xl font-bold">R$ {formData.totalAmount.toLocaleString("pt-BR")}</div>
                </div>
              </div>

              <Button type="button" variant="outline" onClick={calculateFine} className="mt-4 bg-transparent">
                <Calculator className="mr-2 h-4 w-4" />
                Recalcular Multa
              </Button>
            </CardContent>
          </Card>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Ex: Aluguel referente a dezembro/2024"
              rows={3}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : payment ? "Salvar Alterações" : "Criar Pagamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
