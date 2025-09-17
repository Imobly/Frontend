"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Grid3X3, List } from "lucide-react"
import { PropertyCard } from "@/components/properties/property-card"
import { PropertyList } from "@/components/properties/property-list"
import { PropertyDialog } from "@/components/properties/property-dialog"
import { PropertyFilters } from "@/components/properties/property-filters"

const mockProperties = [
  {
    id: 1,
    name: "Apartamento 101",
    address: "Rua das Flores, 123",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    type: "apartment",
    area: 85,
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 1,
    rent: 2500,
    status: "occupied",
    description: "Apartamento moderno com vista para a cidade, próximo ao metrô.",
    images: ["/modern-apartment.png"],
    tenant: "Maria Silva",
    residential: "Edifício Central Plaza",
    unit: "101",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Casa Jardins",
    address: "Av. Principal, 456",
    neighborhood: "Jardins",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-890",
    type: "house",
    area: 180,
    bedrooms: 3,
    bathrooms: 3,
    parkingSpaces: 2,
    rent: 3200,
    status: "occupied",
    description: "Casa espaçosa com jardim e área gourmet.",
    images: ["/house-with-garden.png"],
    tenant: "João Santos",
    residential: "Condomínio Jardins Residencial",
    unit: "Casa 15",
    createdAt: "2024-02-20",
  },
  {
    id: 3,
    name: "Apartamento 205",
    address: "Rua Nova, 789",
    neighborhood: "Vila Nova",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-123",
    type: "apartment",
    area: 65,
    bedrooms: 1,
    bathrooms: 1,
    parkingSpaces: 1,
    rent: 1800,
    status: "vacant",
    description: "Apartamento compacto e bem localizado.",
    images: ["/compact-apartment.png"],
    tenant: null,
    residential: "Edifício Vila Nova",
    unit: "205",
    createdAt: "2024-03-10",
  },
  {
    id: 4,
    name: "Loja Centro",
    address: "Rua Comercial, 321",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-456",
    type: "commercial",
    area: 120,
    bedrooms: 0,
    bathrooms: 2,
    parkingSpaces: 0,
    rent: 4500,
    status: "maintenance",
    description: "Loja comercial em ponto movimentado.",
    images: ["/commercial-store.png"],
    tenant: "Carlos Lima",
    residential: null,
    unit: null,
    createdAt: "2024-04-05",
  },
]

export function PropertiesView() {
  const [properties] = useState(mockProperties)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showDialog, setShowDialog] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<(typeof mockProperties)[0] | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedResidential, setSelectedResidential] = useState<string>("all")

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property.residential && property.residential.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesResidential =
      selectedResidential === "all" ||
      (selectedResidential === "independent" && !property.residential) ||
      property.residential === selectedResidential

    return matchesSearch && matchesResidential
  })

  const handleEdit = (property: (typeof mockProperties)[0]) => {
    setSelectedProperty(property)
    setShowDialog(true)
  }

  const handleAdd = () => {
    setSelectedProperty(null)
    setShowDialog(true)
  }

  const statusCounts = {
    total: properties.length,
    occupied: properties.filter((p) => p.status === "occupied").length,
    vacant: properties.filter((p) => p.status === "vacant").length,
    maintenance: properties.filter((p) => p.status === "maintenance").length,
  }

  const residentials = Array.from(new Set(properties.filter((p) => p.residential).map((p) => p.residential)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Imóveis</h1>
          <p className="text-gray-600">Gerencie sua carteira de imóveis</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Novo Imóvel
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            </div>
            <div>
              <p className="text-xs text-gray-600">Total</p>
              <p className="text-lg font-bold">{statusCounts.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            </div>
            <div>
              <p className="text-xs text-gray-600">Ocupados</p>
              <p className="text-lg font-bold text-green-600">{statusCounts.occupied}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
            </div>
            <div>
              <p className="text-xs text-gray-600">Vagos</p>
              <p className="text-lg font-bold text-gray-600">{statusCounts.vacant}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
            </div>
            <div>
              <p className="text-xs text-gray-600">Manutenção</p>
              <p className="text-lg font-bold text-orange-600">{statusCounts.maintenance}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por nome, endereço, bairro ou residencial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedResidential} onValueChange={setSelectedResidential}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por residencial" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os residenciais</SelectItem>
            <SelectItem value="independent">Imóveis independentes</SelectItem>
            {residentials.map((residential) => (
              <SelectItem key={residential} value={residential!}>
                {residential}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
        <div className="flex items-center space-x-1">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && <PropertyFilters />}

      {/* Properties */}
      <div className="space-y-4">
        {viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} onEdit={handleEdit} />
            ))}
          </div>
        ) : (
          <PropertyList properties={filteredProperties} onEdit={handleEdit} />
        )}

        {filteredProperties.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Nenhum imóvel encontrado</h3>
                <p className="text-gray-600">Tente ajustar os filtros ou adicione um novo imóvel.</p>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleAdd}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Imóvel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Property Dialog */}
      <PropertyDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        property={selectedProperty}
        onSave={(property) => {
          // Aqui seria implementada a lógica de salvar
          console.log("Saving property:", property)
          setShowDialog(false)
        }}
      />
    </div>
  )
}
