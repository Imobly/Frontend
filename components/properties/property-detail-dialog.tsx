"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, MapPin, Bed, Bath, Car, Edit, Trash2 } from "lucide-react"
import { Property } from "@/lib/types/property"
import Image from "next/image"

interface PropertyDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  property: Property
  onEdit: (property: Property) => void
  onDelete: (id: number) => void
}

const statusConfig = {
  occupied: { label: "Ocupado", className: "bg-green-100 text-green-800" },
  vacant: { label: "Vago", className: "bg-gray-100 text-gray-800" },
  maintenance: { label: "Manutenção", className: "bg-orange-100 text-orange-800" },
}

const typeConfig = {
  apartment: "Apartamento",
  house: "Casa",
  commercial: "Comercial",
}

export function PropertyDetailDialog({
  open,
  onOpenChange,
  property,
  onEdit,
  onDelete,
}: PropertyDetailDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Construir URLs completas das imagens
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'
  const images = property.images && property.images.length > 0 
    ? property.images.map(img => img.startsWith('http') ? img : `${baseUrl}${img}`)
    : ["/placeholder.svg"]

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir o imóvel "${property.name}"?`)) {
      onDelete(property.id)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] h-[95vh] p-0">
        <div className="grid md:grid-cols-2 gap-0 h-full">
          {/* Coluna Esquerda - Galeria de Imagens */}
          <div className="relative bg-black h-full flex items-center justify-center">
            {/* Imagem Principal */}
            <div className="relative w-full h-full">
              <Image
                src={images[currentImageIndex]}
                alt={`${property.name} - Foto ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Navegação do Carrossel */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 p-0 bg-white/90 hover:bg-white"
                  onClick={handlePreviousImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 p-0 bg-white/90 hover:bg-white"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                {/* Indicadores de Imagem */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "w-8 bg-white"
                          : "w-2 bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>

                {/* Contador de Imagens */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Coluna Direita - Informações */}
          <div className="flex flex-col h-full max-h-[95vh]">
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <DialogTitle className="text-2xl mb-2">{property.name}</DialogTitle>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span className="text-sm">
                      {property.address}, {property.neighborhood} - {property.city}/{property.state}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Badge className={statusConfig[property.status as keyof typeof statusConfig].className}>
                  {statusConfig[property.status as keyof typeof statusConfig].label}
                </Badge>
                <Badge variant="outline">{typeConfig[property.type as keyof typeof typeConfig]}</Badge>
              </div>
            </DialogHeader>

            {/* Conteúdo Scrollável */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-6">
                {/* Preço */}
                <div className="bg-primary/5 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Valor do Aluguel</p>
                  <p className="text-3xl font-bold text-primary">
                    R$ {property.rent.toLocaleString("pt-BR")}
                    <span className="text-base font-normal text-muted-foreground">/mês</span>
                  </p>
                </div>

                {/* Características */}
                <div>
                  <h3 className="font-semibold mb-3">Características</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bed className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Quartos</p>
                        <p className="font-semibold">{property.bedrooms}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bath className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Banheiros</p>
                        <p className="font-semibold">{property.bathrooms}</p>
                      </div>
                    </div>

                    {property.parkingSpaces > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Car className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Vagas</p>
                          <p className="font-semibold">{property.parkingSpaces}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">m²</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Área</p>
                        <p className="font-semibold">{property.area}m²</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                {property.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Descrição</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>
                )}

                {/* Inquilino */}
                {property.tenant && (
                  <div>
                    <h3 className="font-semibold mb-2">Inquilino Atual</h3>
                    <p className="text-sm">{property.tenant}</p>
                  </div>
                )}

                {/* Endereço Completo */}
                <div>
                  <h3 className="font-semibold mb-2">Endereço Completo</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{property.address}</p>
                    <p>{property.neighborhood}</p>
                    <p>
                      {property.city} - {property.state}
                    </p>
                    {property.zipCode && <p>CEP: {property.zipCode}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer com Ações */}
            <div className="border-t px-6 py-4 flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onEdit(property)
                  onOpenChange(false)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
