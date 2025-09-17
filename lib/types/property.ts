export interface Unit {
  id: number
  number: string
  area: number
  bedrooms: number
  bathrooms: number
  rent: number
  status: 'vacant' | 'occupied' | 'maintenance'
  tenant?: string
}

export interface Property {
  id: number
  name: string
  address: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  type: string
  area: number
  bedrooms: number
  bathrooms: number
  parkingSpaces: number
  rent: number
  status: string
  description: string
  images: string[]
  units?: Unit[]
  isResidential?: boolean
  tenant?: string | null
  createdAt: string
}

export interface PropertyFormData {
  id?: number
  name: string
  address: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  type: string
  area: number
  bedrooms: number
  bathrooms: number
  parkingSpaces: number
  rent: number
  status: string
  description: string
  images: string[]
  units?: Unit[]
  isResidential?: boolean
  tenant?: string | null
  createdAt?: string
}