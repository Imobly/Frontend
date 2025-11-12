"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload } from "lucide-react"
import { useProperties } from "@/lib/hooks/useProperties"

interface ExpenseFormData {
  type: "maintenance" | "expense"
  category: string
  description: string
  amount: number
  date: string
  property_id: number
  status: "pending" | "paid" | "scheduled"
  priority?: "low" | "medium" | "high" | "urgent"
  vendor?: string
  receipt?: string
  notes?: string
}

interface ExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expense?: any | null
  onSave: (expense: ExpenseFormData) => void
}

const expenseCategories = [
  "IPTU",
  "Condomínio", 
  "Seguro",
  "Taxa de Administração",
  "Publicidade",
  "Documentação",
  "Advocacia",
  "Contabilidade",
  "Outros",
]

const maintenanceCategories = [
  "Hidráulica",
  "Elétrica", 
  "Pintura",
  "Limpeza",
  "Jardinagem",
  "Ar Condicionado",
  "Elevador",
  "Portaria",
  "Segurança",
  "Outros",
]

const initialExpense: ExpenseFormData = {
  type: "expense",
  category: "",
  description: "",
  amount: 0,
  date: new Date().toISOString().split("T")[0],
  property_id: 0,
  status: "pending",
  priority: "medium",
  vendor: "",
  receipt: "",
  notes: "",
}

export function ExpenseDialog({ open, onOpenChange, expense, onSave }: ExpenseDialogProps) {
  const [formData, setFormData] = useState<ExpenseFormData>(initialExpense)
  const [isLoading, setIsLoading] = useState(false)
  
  const { properties } = useProperties()

  useEffect(() => {
    if (expense) {
      setFormData({
        type: expense.type || "expense",
        category: expense.category || "",
        description: expense.description || "",
        amount: expense.amount || 0,
        date: expense.date || new Date().toISOString().split("T")[0],
        property_id: expense.property_id || 0,
        status: expense.status || "pending",
        priority: expense.priority || "medium",
        vendor: expense.vendor || "",
        receipt: expense.receipt || "",
        notes: expense.notes || "",
      })
    } else {
      setFormData(initialExpense)
    }
  }, [expense])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("💾 Salvando despesa:", formData)
      await onSave(formData)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof ExpenseFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const categories = formData.type === "maintenance" ? maintenanceCategories : expenseCategories

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{expense ? "Editar Despesa" : "Nova Despesa"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={formData.type} onValueChange={(value) => handleInputChange("type", value)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expense">Despesa</TabsTrigger>
              <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
            </TabsList>

            <TabsContent value="expense" className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="property_id">Imóvel *</Label>
                    <Select value={formData.property_id.toString()} onValueChange={(value) => handleInputChange("property_id", parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o imóvel" />
                      </SelectTrigger>
                      <SelectContent>
                        {properties.map((property) => (
                          <SelectItem key={property.id} value={property.id.toString()}>
                            {property.name} - {property.address}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor (R$) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", parseFloat(e.target.value) || 0)}
                      placeholder="0,00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Data *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      required
                    />
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
                        <SelectItem value="scheduled">Agendado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Descreva a despesa..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendor">Fornecedor</Label>
                  <Input
                    id="vendor"
                    value={formData.vendor}
                    onChange={(e) => handleInputChange("vendor", e.target.value)}
                    placeholder="Nome do fornecedor"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receipt">Comprovante (URL)</Label>
                  <Input
                    id="receipt"
                    value={formData.receipt}
                    onChange={(e) => handleInputChange("receipt", e.target.value)}
                    placeholder="https://exemplo.com/comprovante.pdf"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Observações adicionais..."
                    rows={2}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="property_id">Imóvel *</Label>
                    <Select value={formData.property_id.toString()} onValueChange={(value) => handleInputChange("property_id", parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o imóvel" />
                      </SelectTrigger>
                      <SelectContent>
                        {properties.map((property) => (
                          <SelectItem key={property.id} value={property.id.toString()}>
                            {property.name} - {property.address}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor (R$) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", parseFloat(e.target.value) || 0)}
                      placeholder="0,00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Data *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      required
                    />
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
                        <SelectItem value="scheduled">Agendado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Descreva o serviço de manutenção..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendor">Prestador de Serviço</Label>
                  <Input
                    id="vendor"
                    value={formData.vendor}
                    onChange={(e) => handleInputChange("vendor", e.target.value)}
                    placeholder="Nome da empresa/profissional"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receipt">Comprovante (URL)</Label>
                  <Input
                    id="receipt"
                    value={formData.receipt}
                    onChange={(e) => handleInputChange("receipt", e.target.value)}
                    placeholder="https://exemplo.com/nota-fiscal.pdf"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Detalhes técnicos, materiais utilizados, etc..."
                    rows={2}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : expense ? "Salvar Alterações" : "Criar Despesa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}