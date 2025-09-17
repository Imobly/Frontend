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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, FileText } from "lucide-react"

interface Contract {
  id?: number
  title: string
  property: {
    id: number
    name: string
    address: string
  } | null
  tenant: {
    id: number
    name: string
    email: string
    phone: string
  } | null
  startDate: string
  endDate: string
  rentValue: number
  cautionValue: number
  fineRate: number
  dailyInterestRate: number
  status: string
  type: string
  renewalType: string
  documents: Array<{
    id: number
    name: string
    url: string
    uploadDate: string
  }>
}

interface ContractDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contract?: Contract | null
  onSave: (contract: Contract) => void
}

const initialContract: Contract = {
  title: "",
  property: null,
  tenant: null,
  startDate: "",
  endDate: "",
  rentValue: 0,
  cautionValue: 0,
  fineRate: 2,
  dailyInterestRate: 0.033,
  status: "active",
  type: "residential",
  renewalType: "manual",
  documents: [],
}

// Mock data for dropdowns
const mockProperties = [
  { id: 1, name: "Apartamento 101", address: "Rua das Flores, 123 - Centro" },
  { id: 2, name: "Casa Jardins", address: "Av. Principal, 456 - Jardins" },
  { id: 3, name: "Apartamento 205", address: "Rua Nova, 789 - Vila Nova" },
  { id: 4, name: "Loja Centro", address: "Rua Comercial, 321 - Centro" },
]

const mockTenants = [
  { id: 1, name: "Maria Silva", email: "maria.silva@email.com", phone: "(11) 99999-1111" },
  { id: 2, name: "João Santos", email: "joao.santos@email.com", phone: "(11) 99999-3333" },
  { id: 3, name: "Ana Costa", email: "ana.costa@email.com", phone: "(11) 99999-5555" },
  { id: 4, name: "Carlos Lima", email: "carlos.lima@empresa.com", phone: "(11) 99999-7777" },
]

export function ContractDialog({ open, onOpenChange, contract, onSave }: ContractDialogProps) {
  const [formData, setFormData] = useState<Contract>(initialContract)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (contract) {
      setFormData(contract)
    } else {
      setFormData(initialContract)
    }
  }, [contract])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onSave(formData)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof Contract, value: any) => {
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

  const addDocument = () => {
    const newDoc = {
      id: Date.now(),
      name: `Documento ${formData.documents.length + 1}.pdf`,
      url: "/contract-sample.pdf",
      uploadDate: new Date().toISOString().split("T")[0],
    }
    setFormData((prev) => ({ ...prev, documents: [...prev.documents, newDoc] }))
  }

  const removeDocument = (index: number) => {
    setFormData((prev) => ({ ...prev, documents: prev.documents.filter((_, i) => i !== index) }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{contract ? "Editar Contrato" : "Novo Contrato"}</DialogTitle>
          <DialogDescription>
            {contract ? "Edite as informações do contrato." : "Crie um novo contrato de locação."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
              <TabsTrigger value="terms">Termos</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Contrato</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Ex: Contrato - Apartamento 101"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residencial</SelectItem>
                      <SelectItem value="commercial">Comercial</SelectItem>
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
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Término</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
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
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="expired">Expirado</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="terms" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rentValue">Valor do Aluguel (R$)</Label>
                  <Input
                    id="rentValue"
                    type="number"
                    value={formData.rentValue}
                    onChange={(e) => handleInputChange("rentValue", Number(e.target.value))}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cautionValue">Valor da Caução (R$) - Opcional</Label>
                  <Input
                    id="cautionValue"
                    type="number"
                    value={formData.cautionValue}
                    onChange={(e) => handleInputChange("cautionValue", Number(e.target.value))}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fineRate">Taxa de Multa (%)</Label>
                  <Input
                    id="fineRate"
                    type="number"
                    value={formData.fineRate}
                    onChange={(e) => handleInputChange("fineRate", Number(e.target.value))}
                    placeholder="2"
                    min="0"
                    step="0.01"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Percentual de multa aplicado sobre o valor do aluguel em caso de atraso
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dailyInterestRate">Juros por Dia (%)</Label>
                  <Input
                    id="dailyInterestRate"
                    type="number"
                    value={formData.dailyInterestRate}
                    onChange={(e) => handleInputChange("dailyInterestRate", Number(e.target.value))}
                    placeholder="0.033"
                    min="0"
                    step="0.001"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Percentual de juros aplicado por dia de atraso (ex: 0.033% = 1% ao mês)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="renewalType">Tipo de Renovação</Label>
                  <Select
                    value={formData.renewalType}
                    onValueChange={(value) => handleInputChange("renewalType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automática</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documentos do Contrato</CardTitle>
                  <CardDescription>Faça upload dos documentos relacionados ao contrato</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {formData.documents.map((doc, index) => (
                      <div key={doc.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{doc.name}</div>
                          <div className="text-xs text-gray-500">
                            Upload: {new Date(doc.uploadDate).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="h-20 border-dashed bg-transparent hover:bg-blue-50"
                      onClick={addDocument}
                    >
                      <div className="flex flex-col items-center">
                        <Upload className="h-6 w-6 mb-2 text-blue-600" />
                        <span className="text-sm">Upload Documento</span>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Salvando..." : contract ? "Salvar Alterações" : "Criar Contrato"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
