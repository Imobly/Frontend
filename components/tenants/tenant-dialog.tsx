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
  address: {
    street: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
  property: {
    id: number
    name: string
    address: string
  } | null
  contractStart: string | null
  contractEnd: string | null
  rent: number
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
  address: {
    street: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  },
  property: null,
  contractStart: null,
  contractEnd: null,
  rent: 0,
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
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
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
    const property = mockProperties.find((p) => p.id.toString() === propertyId)
    setFormData((prev) => ({ ...prev, property: property || null }))
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="contact">Contato</TabsTrigger>
              <TabsTrigger value="address">Endereço</TabsTrigger>
              <TabsTrigger value="property">Imóvel</TabsTrigger>
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
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contato de Emergência</CardTitle>
                  <CardDescription>Pessoa para contato em caso de emergência</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName">Nome</Label>
                      <Input
                        id="emergencyName"
                        value={formData.emergencyContact.name}
                        onChange={(e) => handleInputChange("emergencyContact.name", e.target.value)}
                        placeholder="Nome do contato"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Telefone</Label>
                      <Input
                        id="emergencyPhone"
                        value={formData.emergencyContact.phone}
                        onChange={(e) => handleInputChange("emergencyContact.phone", e.target.value)}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyRelationship">Parentesco</Label>
                      <Input
                        id="emergencyRelationship"
                        value={formData.emergencyContact.relationship}
                        onChange={(e) => handleInputChange("emergencyContact.relationship", e.target.value)}
                        placeholder="Ex: Cônjuge, Pai, Mãe"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="address" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="street">Endereço</Label>
                  <Input
                    id="street"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange("address.street", e.target.value)}
                    placeholder="Rua, número, complemento"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={formData.address.neighborhood}
                    onChange={(e) => handleInputChange("address.neighborhood", e.target.value)}
                    placeholder="Nome do bairro"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange("address.city", e.target.value)}
                    placeholder="Nome da cidade"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={formData.address.state}
                    onChange={(e) => handleInputChange("address.state", e.target.value)}
                    placeholder="SP"
                    maxLength={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    value={formData.address.zipCode}
                    onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
                    placeholder="00000-000"
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="property" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vinculação de Imóvel</CardTitle>
                  <CardDescription>Associe o inquilino a um imóvel e defina os termos do contrato</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="property">Imóvel</Label>
                      <Select value={formData.property?.id.toString() || "none"} onValueChange={handlePropertyChange}>
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

                    <div className="space-y-2">
                      <Label htmlFor="rent">Valor do Aluguel (R$)</Label>
                      <Input
                        id="rent"
                        type="number"
                        value={formData.rent}
                        onChange={(e) => handleInputChange("rent", Number(e.target.value))}
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contractStart">Início do Contrato</Label>
                      <Input
                        id="contractStart"
                        type="date"
                        value={formData.contractStart || ""}
                        onChange={(e) => handleInputChange("contractStart", e.target.value || null)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contractEnd">Fim do Contrato</Label>
                      <Input
                        id="contractEnd"
                        type="date"
                        value={formData.contractEnd || ""}
                        onChange={(e) => handleInputChange("contractEnd", e.target.value || null)}
                      />
                    </div>
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
              {isLoading ? "Salvando..." : tenant ? "Salvar Alterações" : "Criar Inquilino"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
