"use client"

import React, { useState, useEffect } from "react"
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

interface TenantFormData {
  name: string
  email: string
  phone: string
  cpf_cnpj: string
  birth_date: string | null
  profession: string
  emergency_contact?: {
    name: string
    phone: string
    relationship: string
  }
  documents?: {
    id: string
    name: string
    type: 'identity' | 'contract' | 'other'
    url: string
  }[]
  status: 'active' | 'inactive'
}

interface TenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant?: any | null
  onSave: (tenant: TenantFormData) => void
}

const initialTenant: TenantFormData = {
  name: "",
  email: "",
  phone: "",
  cpf_cnpj: "",
  birth_date: null,
  profession: "",
  emergency_contact: {
    name: "",
    phone: "",
    relationship: "",
  },
  documents: [],
  status: "active",
}

export function TenantDialog({ open, onOpenChange, tenant, onSave }: TenantDialogProps) {
  const [formData, setFormData] = useState<TenantFormData>(initialTenant)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || "",
        email: tenant.email || "",
        phone: tenant.phone || "",
        cpf_cnpj: tenant.cpf_cnpj || "",
        birth_date: tenant.birth_date || null,
        profession: tenant.profession || "",
        emergency_contact: tenant.emergency_contact || {
          name: "",
          phone: "",
          relationship: "",
        },
        documents: tenant.documents || [],
        status: tenant.status || "active",
      })
    } else {
      setFormData(initialTenant)
    }
  }, [tenant])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      console.log("💾 Salvando inquilino:", formData)
      await onSave(formData)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof TenantFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof TenantFormData] as any),
        [field]: value,
      },
    }))
  }

  const addDocument = () => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: "",
      type: "identity" as const,
      url: "",
    }
    setFormData(prev => ({ 
      ...prev, 
      documents: [...(prev.documents || []), newDoc] 
    }))
  }

  const removeDocument = (docId: string) => {
    setFormData(prev => ({
      ...prev,
      documents: (prev.documents || []).filter(doc => doc.id !== docId)
    }))
  }

  const updateDocument = (docId: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      documents: (prev.documents || []).map(doc =>
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
              <TabsTrigger value="emergency">Contato de Emergência</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Ex: João da Silva"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Ex: joao@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Ex: (11) 99999-9999"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
                    <Input
                      id="cpf_cnpj"
                      value={formData.cpf_cnpj}
                      onChange={(e) => handleInputChange("cpf_cnpj", e.target.value)}
                      placeholder="Ex: 000.000.000-00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birth_date">Data de Nascimento</Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date || ""}
                      onChange={(e) => handleInputChange("birth_date", e.target.value || null)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profession">Profissão</Label>
                    <Input
                      id="profession"
                      value={formData.profession}
                      onChange={(e) => handleInputChange("profession", e.target.value)}
                      placeholder="Ex: Engenheiro"
                      required
                    />
                  </div>
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

            <TabsContent value="emergency" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contato de Emergência</CardTitle>
                  <CardDescription>
                    Informações de contato para situações de emergência
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="emergency_name">Nome</Label>
                      <Input
                        id="emergency_name"
                        value={formData.emergency_contact?.name || ""}
                        onChange={(e) => handleNestedChange("emergency_contact", "name", e.target.value)}
                        placeholder="Ex: Maria da Silva"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergency_phone">Telefone</Label>
                      <Input
                        id="emergency_phone"
                        value={formData.emergency_contact?.phone || ""}
                        onChange={(e) => handleNestedChange("emergency_contact", "phone", e.target.value)}
                        placeholder="Ex: (11) 88888-8888"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergency_relationship">Relacionamento</Label>
                      <Select 
                        value={formData.emergency_contact?.relationship || ""} 
                        onValueChange={(value) => handleNestedChange("emergency_contact", "relationship", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o relacionamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spouse">Cônjuge</SelectItem>
                          <SelectItem value="parent">Pai/Mãe</SelectItem>
                          <SelectItem value="sibling">Irmão/Irmã</SelectItem>
                          <SelectItem value="child">Filho/Filha</SelectItem>
                          <SelectItem value="friend">Amigo(a)</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documentos</CardTitle>
                  <CardDescription>
                    Gerencie os documentos do inquilino
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button type="button" onClick={addDocument} variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Adicionar Documento
                  </Button>

                  {formData.documents && formData.documents.length > 0 && (
                    <div className="space-y-3">
                      {formData.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="flex-1 grid gap-3 md:grid-cols-3">
                            <Input
                              value={doc.name}
                              onChange={(e) => updateDocument(doc.id, "name", e.target.value)}
                              placeholder="Nome do documento"
                            />
                            <Select
                              value={doc.type}
                              onValueChange={(value) => updateDocument(doc.id, "type", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="identity">Identidade</SelectItem>
                                <SelectItem value="contract">Contrato</SelectItem>
                                <SelectItem value="other">Outro</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              value={doc.url}
                              onChange={(e) => updateDocument(doc.id, "url", e.target.value)}
                              placeholder="URL do documento"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeDocument(doc.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
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