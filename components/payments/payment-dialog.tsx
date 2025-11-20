"use client"

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
import { Calculator, AlertCircle } from "lucide-react"
import { currencyMask, currencyUnmask } from "@/lib/utils/masks"
import { useProperties } from "@/lib/hooks/useProperties"
import { useTenants } from "@/lib/hooks/useTenants"
import { PaymentCreate } from "@/lib/types/api"

interface PaymentFormData {
  property_id: number
  tenant_id: number
  contract_id: number
  due_date: string
  amount: number
  fine_amount: number
  total_amount: number
  status: "pending" | "paid" | "overdue" | "partial"
  payment_method?: "cash" | "transfer" | "pix" | "check" | "card"
  description?: string
}

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment?: any | null
  onSave: (payment: PaymentFormData) => void
}

const initialPayment: PaymentFormData = {
  property_id: 0,
  tenant_id: 0,
  contract_id: 0,
  due_date: "",
  amount: 0,
  fine_amount: 0,
  total_amount: 0,
  status: "pending",
  payment_method: undefined,
  description: "",
}

// Configurações de multa (seria configurável no sistema real)
const FINE_SETTINGS = {
  type: "percentage", // "percentage" ou "fixed"
  value: 5, // 5% ou valor fixo
  dailyInterest: 0.033, // 0.033% ao dia
}

export function PaymentDialog({ open, onOpenChange, payment, onSave }: PaymentDialogProps) {
  const [formData, setFormData] = useState<PaymentFormData>(initialPayment)
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  
  const { properties } = useProperties()
  const { tenants } = useTenants()

  useEffect(() => {
    if (payment) {
      setFormData({
        property_id: payment.property_id || 0,
        tenant_id: payment.tenant_id || 0,
        contract_id: payment.contract_id || 0,
        due_date: payment.due_date || "",
        amount: payment.amount || 0,
        fine_amount: payment.fine_amount || 0,
        total_amount: payment.total_amount || 0,
        status: payment.status || "pending",
        payment_method: payment.payment_method || "",
        description: payment.description || "",
      })
    } else {
      setFormData(initialPayment)
    }
  }, [payment])

  // Calcular multa e total automaticamente
  useEffect(() => {
    if (formData.amount > 0) {
      const today = new Date()
      const dueDate = new Date(formData.due_date)
      
      let fineAmount = 0
      
      // Se está em atraso ou marcado como overdue, calcular multa
      if (formData.due_date && (formData.status === "overdue" || today > dueDate)) {
        const diffTime = today.getTime() - dueDate.getTime()
        const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))

        if (diffDays > 0) {
          if (FINE_SETTINGS.type === "percentage") {
            fineAmount = (formData.amount * FINE_SETTINGS.value) / 100
          } else {
            fineAmount = FINE_SETTINGS.value
          }

          // Adicionar juros diários
          const dailyInterest = (formData.amount * FINE_SETTINGS.dailyInterest * diffDays) / 100
          fineAmount += dailyInterest
          fineAmount = Math.round(fineAmount * 100) / 100
        }
      }

      const totalAmount = formData.amount + fineAmount

      setFormData((prev) => ({
        ...prev,
        fine_amount: fineAmount,
        total_amount: totalAmount,
      }))
    }
  }, [formData.due_date, formData.amount, formData.status])

  // Validação do formulário
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.property_id || formData.property_id === 0) {
      errors.property_id = "Selecione um imóvel"
    }
    if (!formData.tenant_id || formData.tenant_id === 0) {
      errors.tenant_id = "Selecione um inquilino"
    }
    if (!formData.due_date) {
      errors.due_date = "Data de vencimento é obrigatória"
    }
    if (!formData.amount || formData.amount <= 0) {
      errors.amount = "Valor deve ser maior que zero"
    }
    if (!formData.status) {
      errors.status = "Status é obrigatório"
    }
    if (!formData.description || formData.description.trim() === "") {
      errors.description = "Descrição é obrigatória"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      console.log("💾 Salvando pagamento:", formData)
      const paymentData: PaymentCreate = {
        property_id: formData.property_id,
        tenant_id: formData.tenant_id,
        contract_id: formData.contract_id,
        due_date: formData.due_date,
        amount: formData.amount,
        fine_amount: formData.fine_amount,
        total_amount: formData.total_amount,
        status: formData.status,
        payment_method: formData.payment_method,
        description: formData.description || "",
      }
      
      await onSave(paymentData)
      
      // Limpar validações em caso de sucesso
      setValidationErrors({})
    } catch (error) {
      console.error("Erro ao salvar pagamento:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof PaymentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateFine = () => {
    if (!formData.due_date || formData.amount <= 0) return

    const today = new Date()
    const dueDate = new Date(formData.due_date)

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
        fine_amount: Math.round(fineAmount * 100) / 100,
        total_amount: prev.amount + Math.round(fineAmount * 100) / 100,
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
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="property_id">Imóvel *</Label>
              <Select 
                value={formData.property_id === 0 ? "" : formData.property_id.toString()} 
                onValueChange={(value) => handleInputChange("property_id", parseInt(value) || 0)}
              >
                <SelectTrigger className={validationErrors.property_id ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione um imóvel" className="truncate" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id.toString()}>
                      {property.name} - {property.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.property_id && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {validationErrors.property_id}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenant_id">Inquilino *</Label>
              <Select 
                value={formData.tenant_id === 0 ? "" : formData.tenant_id.toString()} 
                onValueChange={(value) => handleInputChange("tenant_id", parseInt(value) || 0)}
              >
                <SelectTrigger className={validationErrors.tenant_id ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione um inquilino" className="truncate" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id.toString()}>
                      {tenant.name} - {tenant.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.tenant_id && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {validationErrors.tenant_id}
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleInputChange("status", value)}
            >
                <SelectTrigger className={validationErrors.status ? "border-red-500" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="overdue">Atrasado</SelectItem>
                  <SelectItem value="partial">Pagamento Parcial</SelectItem>
            </SelectContent>
            </Select>
            {validationErrors.status && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {validationErrors.status}
              </p>
            )}
          </div>

          {/* Datas e Valores */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="due_date">Data de Vencimento *</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange("due_date", e.target.value)}
                className={validationErrors.due_date ? "border-red-500" : ""}
                required
              />
              {validationErrors.due_date && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {validationErrors.due_date}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor *</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                <Input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  value={formData.amount ? currencyMask(formData.amount) : ""}
                  onChange={(e) => {
                    const value = currencyUnmask(e.target.value)
                    handleInputChange("amount", value)
                  }}
                  placeholder="0,00"
                  className={validationErrors.amount ? "border-red-500 pl-10" : "pl-10"}
                  required
                />
              </div>
              {validationErrors.amount && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {validationErrors.amount}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_method">Forma de Pagamento</Label>
              <Select
                value={formData.payment_method || "none"}
                onValueChange={(value) => handleInputChange("payment_method", value === "none" ? undefined : value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a forma (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Não especificado</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="transfer">Transferência Bancária</SelectItem>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                  <SelectItem value="check">Cheque</SelectItem>
                  <SelectItem value="card">Cartão</SelectItem>
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
                    R$ {(formData.fine_amount || 0).toLocaleString("pt-BR")}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Total</Label>
                  <div className="text-xl font-bold">R$ {formData.total_amount.toLocaleString("pt-BR")}</div>
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
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Ex: Aluguel referente a dezembro/2024"
              rows={3}
              className={validationErrors.description ? "border-red-500" : ""}
              required
            />
            {validationErrors.description && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {validationErrors.description}
              </p>
            )}
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