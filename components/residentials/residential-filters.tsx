"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ResidentialFiltersProps {
  filters: {
    type: string
    city: string
    occupancy: string
  }
  onFiltersChange: (filters: { type: string; city: string; occupancy: string }) => void
}

export function ResidentialFilters({ filters, onFiltersChange }: ResidentialFiltersProps) {
  const clearFilters = () => {
    onFiltersChange({ type: "", city: "", occupancy: "" })
  }

  const hasActiveFilters = filters.type || filters.city || filters.occupancy

  return (
    <div className="flex gap-2 items-center">
      <Select value={filters.type} onValueChange={(value) => onFiltersChange({ ...filters, type: value })}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          <SelectItem value="apartment">Apartamento</SelectItem>
          <SelectItem value="house">Casa</SelectItem>
          <SelectItem value="commercial">Comercial</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Cidade"
        value={filters.city}
        onChange={(e) => onFiltersChange({ ...filters, city: e.target.value })}
        className="w-[120px]"
      />

      <Select value={filters.occupancy} onValueChange={(value) => onFiltersChange({ ...filters, occupancy: value })}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Ocupação" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          <SelectItem value="full">Totalmente Ocupado</SelectItem>
          <SelectItem value="partial">Parcialmente Ocupado</SelectItem>
          <SelectItem value="empty">Vazio</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
