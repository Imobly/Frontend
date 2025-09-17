"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Building2, Plus, Search, Grid3X3, List, MapPin, Home } from "lucide-react"
import { ResidentialCard } from "./residential-card"
import { ResidentialList } from "./residential-list"
import { ResidentialDialog } from "./residential-dialog"
import { ResidentialFilters } from "./residential-filters"

interface Residential {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  type: "apartment" | "house" | "commercial"
  totalUnits: number
  occupiedUnits: number
  description?: string
  amenities: string[]
  createdAt: string
}

const mockResidentials: Residential[] = [
  {
    id: "1",
    name: "Residencial Vista Verde",
    address: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    type: "apartment",
    totalUnits: 24,
    occupiedUnits: 18,
    description: "Condomínio moderno com área de lazer completa",
    amenities: ["Piscina", "Academia", "Salão de Festas", "Playground"],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Condomínio Jardim das Palmeiras",
    address: "Av. Central, 456",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "20123-456",
    type: "house",
    totalUnits: 12,
    occupiedUnits: 10,
    description: "Casas em condomínio fechado com segurança 24h",
    amenities: ["Segurança 24h", "Área Verde", "Quadra Esportiva"],
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Edifício Comercial Centro",
    address: "Rua do Comércio, 789",
    city: "Belo Horizonte",
    state: "MG",
    zipCode: "30123-789",
    type: "commercial",
    totalUnits: 8,
    occupiedUnits: 6,
    description: "Salas comerciais no centro da cidade",
    amenities: ["Elevador", "Estacionamento", "Recepção"],
    createdAt: "2024-03-10",
  },
]

export function ResidualsView() {
  const [residentials, setResidentials] = useState<Residential[]>(mockResidentials)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingResidential, setEditingResidential] = useState<Residential | null>(null)
  const [filters, setFilters] = useState({
    type: "",
    city: "",
    occupancy: "",
  })

  const filteredResidentials = residentials.filter((residential) => {
    const matchesSearch =
      residential.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      residential.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      residential.city.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = !filters.type || residential.type === filters.type
    const matchesCity = !filters.city || residential.city.toLowerCase().includes(filters.city.toLowerCase())

    let matchesOccupancy = true
    if (filters.occupancy === "full") {
      matchesOccupancy = residential.occupiedUnits === residential.totalUnits
    } else if (filters.occupancy === "partial") {
      matchesOccupancy = residential.occupiedUnits > 0 && residential.occupiedUnits < residential.totalUnits
    } else if (filters.occupancy === "empty") {
      matchesOccupancy = residential.occupiedUnits === 0
    }

    return matchesSearch && matchesType && matchesCity && matchesOccupancy
  })

  const handleSaveResidential = (residentialData: Omit<Residential, "id" | "createdAt">) => {
    if (editingResidential) {
      setResidentials((prev) =>
        prev.map((r) =>
          r.id === editingResidential.id ? { ...residentialData, id: r.id, createdAt: r.createdAt } : r,
        ),
      )
    } else {
      const newResidential: Residential = {
        ...residentialData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split("T")[0],
      }
      setResidentials((prev) => [...prev, newResidential])
    }
    setIsDialogOpen(false)
    setEditingResidential(null)
  }

  const handleEditResidential = (residential: Residential) => {
    setEditingResidential(residential)
    setIsDialogOpen(true)
  }

  const handleDeleteResidential = (id: string) => {
    setResidentials((prev) => prev.filter((r) => r.id !== id))
  }

  const totalUnits = residentials.reduce((sum, r) => sum + r.totalUnits, 0)
  const totalOccupied = residentials.reduce((sum, r) => sum + r.occupiedUnits, 0)
  const occupancyRate = totalUnits > 0 ? (totalOccupied / totalUnits) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Residenciais</h1>
          <p className="text-muted-foreground">Gerencie seus residenciais e condomínios</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Residencial
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Residenciais</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{residentials.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Unidades</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unidades Ocupadas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalOccupied}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
            <Badge variant={occupancyRate > 80 ? "default" : occupancyRate > 50 ? "secondary" : "destructive"}>
              {occupancyRate.toFixed(1)}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar residenciais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <ResidentialFilters filters={filters} onFiltersChange={setFilters} />

        <div className="flex gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Residentials Display */}
      {viewMode === "grid" ? (
        <ResidentialCard
          residentials={filteredResidentials}
          onEdit={handleEditResidential}
          onDelete={handleDeleteResidential}
        />
      ) : (
        <ResidentialList
          residentials={filteredResidentials}
          onEdit={handleEditResidential}
          onDelete={handleDeleteResidential}
        />
      )}

      {/* Dialog */}
      <ResidentialDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        residential={editingResidential}
        onSave={handleSaveResidential}
      />
    </div>
  )
}
