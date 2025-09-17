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
import { Upload, X } from "lucide-react"

interface Tenant {
  id?: number
  name: string
  email: string
  phone: string
  cpfCnpj: string
  birthDate: string | null
  profession: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  contract: {
    propertyId: number
    propertyName: string
    propertyAddress: string
    startDate: string
    endDate: string
    rent: number
    deposit: number
    interestRate: number
    fineRate: number
  } | null
  documents: {
    id: string
    name: string
    type: 'identity' | 'contract' | 'other'
    url: string
  }[]
  status: string
}

interface TenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant?: Tenant | null
  onSave: (tenant: Tenant) => void
}

const initialTenant: Tenant = {
  name: "",
  email: "",
  phone: "",
  cpfCnpj: "",
  birthDate: null,
  profession: "",
  emergencyContact: {
    name: "",
    phone: "",
    relationship: "",
  },
  contract: null,
  documents: [],
  status: "active",
}

// Mock properties for selection
const mockProperties = [
  { id: 1, name: "Apartamento 101", address: "Rua das Flores, 123 - Centro" },
  { id: 2, name: "Casa Jardins", address: "Av. Principal, 456 - Jardins" },
  { id: 3, name: "Apartamento 205", address: "Rua Nova, 789 - Vila Nova" },
  { id: 4, name: "Loja Centro", address: "Rua Comercial, 321 - Centro" },
]

export function TenantDialog({ open, onOpenChange, tenant, onSave }: TenantDialogProps) {
  const [formData, setFormData] = useState<Tenant>(initialTenant)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (tenant) {
      setFormData(tenant)
    } else {
      setFormData(initialTenant)
    }
  }, [tenant])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onSave(formData)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Tenant] as any),
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handlePropertyChange = (propertyId: string) => {
    if (propertyId === "none") {
      setFormData((prev) => ({ ...prev, contract: null }))
    } else {
      const property = mockProperties.find(p => p.id.toString() === propertyId)
      if (property) {
        setFormData((prev) => ({
          ...prev,
          contract: {
            propertyId: property.id,
            propertyName: property.name,
            propertyAddress: property.address,
            startDate: "",
            endDate: "",
            rent: 0,
            deposit: 0,
            interestRate: 0,
            fineRate: 0,
          }
        }))
      }
    }
  }

  const addDocument = () => {
    const newDoc = {
      id: Date.now().toString(),
      name: "Novo Documento",
      type: 'other' as const,
      url: "",
    }
    setFormData((prev) => ({ ...prev, documents: [...prev.documents, newDoc] }))
  }

  const removeDocument = (docId: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== docId)
    }))
  }

  const updateDocument = (docId: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.map(doc => 
        doc.id === docId ? { ...doc, [field]: value } : doc
      )
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tenant ? "Editar Inquilino" : "Novo Inquilino"}</DialogTitle>
          <DialogDescription>
            {tenant ? "Edite as informações do inquilino." : "Adicione um novo inquilino ao sistema."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="contract">Contrato</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nome completo do inquilino"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                  <Input
                    id="cpfCnpj"
                    value={formData.cpfCnpj}
                    onChange={(e) => handleInputChange("cpfCnpj", e.target.value)}
                    placeholder="000.000.000-00 ou 00.000.000/0001-00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate || ""}
                    onChange={(e) => handleInputChange("birthDate", e.target.value || null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profession">Profissão</Label>
                  <Input
                    id="profession"
                    value={formData.profession}
                    onChange={(e) => handleInputChange("profession", e.target.value)}
                    placeholder="Profissão do inquilino"
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
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contatos Principais */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações de Contato</CardTitle>
                  <CardDescription>Dados principais para comunicação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="email@exemplo.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contato de Emergência */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contato de Emergência</CardTitle>
                  <CardDescription>Pessoa para contato em caso de emergência</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="emergency-name">Nome</Label>
                      <Input
                        id="emergency-name"
                        value={formData.emergencyContact.name}
                        onChange={(e) => handleInputChange("emergencyContact", { ...formData.emergencyContact, name: e.target.value })}
                        placeholder="Nome do contato"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergency-phone">Telefone</Label>
                      <Input
                        id="emergency-phone"
                        value={formData.emergencyContact.phone}
                        onChange={(e) => handleInputChange("emergencyContact", { ...formData.emergencyContact, phone: e.target.value })}
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergency-relationship">Parentesco</Label>
                      <Input
                        id="emergency-relationship"
                        value={formData.emergencyContact.relationship}
                        onChange={(e) => handleInputChange("emergencyContact", { ...formData.emergencyContact, relationship: e.target.value })}
                        placeholder="Ex: Pai, Mãe, Irmão"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contract" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações do Contrato</CardTitle>
                  <CardDescription>Configure o contrato de locação do inquilino</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="property">Imóvel</Label>
                      <Select value={formData.contract?.propertyId.toString() || "none"} onValueChange={handlePropertyChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um imóvel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nenhum imóvel</SelectItem>
                          {mockProperties.map((property) => (
                            <SelectItem key={property.id} value={property.id.toString()}>
                              {property.name} - {property.address}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.contract && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="rent">Valor do Aluguel (R$)</Label>
                          <Input
                            id="rent"
                            type="number"
                            value={formData.contract.rent}
                            onChange={(e) => handleInputChange("contract", { ...formData.contract, rent: Number(e.target.value) })}
                            placeholder="0"
                            min="0"
                            step="0.01"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="deposit">Caução (R$)</Label>
                          <Input
                            id="deposit"
                            type="number"
                            value={formData.contract.deposit}
                            onChange={(e) => handleInputChange("contract", { ...formData.contract, deposit: Number(e.target.value) })}
                            placeholder="0"
                            min="0"
                            step="0.01"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="startDate">Data de Início</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={formData.contract.startDate}
                            onChange={(e) => handleInputChange("contract", { ...formData.contract, startDate: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="endDate">Data de Término</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={formData.contract.endDate}
                            onChange={(e) => handleInputChange("contract", { ...formData.contract, endDate: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="interestRate">Taxa de Juros (%)</Label>
                          <Input
                            id="interestRate"
                            type="number"
                            value={formData.contract.interestRate}
                            onChange={(e) => handleInputChange("contract", { ...formData.contract, interestRate: Number(e.target.value) })}
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
                            value={formData.contract.fineRate}
                            onChange={(e) => handleInputChange("contract", { ...formData.contract, fineRate: Number(e.target.value) })}
                            placeholder="0"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documentos</CardTitle>
                  <CardDescription>Anexe documentos pessoais e contratuais do inquilino</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button type="button" onClick={addDocument} variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Adicionar Documento
                    </Button>

                    {formData.documents.map((doc) => (
                      <Card key={doc.id}>
                        <CardContent className="pt-4">
                          <div className="grid gap-4 md:grid-cols-4">
                            <div className="space-y-2">
                              <Label htmlFor={`doc-name-${doc.id}`}>Nome do Documento</Label>
                              <Input
                                id={`doc-name-${doc.id}`}
                                value={doc.name}
                                onChange={(e) => updateDocument(doc.id, "name", e.target.value)}
                                placeholder="Nome do documento"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`doc-type-${doc.id}`}>Tipo</Label>
                              <Select value={doc.type} onValueChange={(value) => updateDocument(doc.id, "type", value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="identity">Documento de Identidade</SelectItem>
                                  <SelectItem value="contract">Contrato</SelectItem>
                                  <SelectItem value="other">Outro</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`doc-url-${doc.id}`}>URL/Caminho</Label>
                              <Input
                                id={`doc-url-${doc.id}`}
                                value={doc.url}
                                onChange={(e) => updateDocument(doc.id, "url", e.target.value)}
                                placeholder="URL ou caminho do arquivo"
                              />
                            </div>

                            <div className="flex items-end">
                              <Button type="button" variant="outline" size="sm" onClick={() => removeDocument(doc.id)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}