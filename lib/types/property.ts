// Import tipos da API para compatibilidade
import { PropertyResponse, UnitResponse } from './api'

export interface Unit {
  id: number
  number: string
  area: number
  bedrooms: number
  bathrooms: number
  rent: number
  status: 'vacant' | 'occupied' | 'maintenance'
  tenant?: string
  property_id?: number
  created_at?: string
  updated_at?: string
}

export interface Property {
  id: number
  name: string
  address: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  zip_code?: string // compatibilidade com API
  type: 'apartment' | 'house' | 'commercial' | 'studio'
  area: number
  bedrooms: number
  bathrooms: number
  parkingSpaces: number
  parking_spaces?: number // compatibilidade com API
  rent: number
  status: 'vacant' | 'occupied' | 'maintenance' | 'inactive'
  description?: string
  images?: string[]
  units?: Unit[]
  isResidential?: boolean
  is_residential?: boolean // compatibilidade com API
  tenant?: string | null
  createdAt?: string
  created_at?: string // compatibilidade com API
  updated_at?: string
}

export interface PropertyFormData {
  id?: number
  name: string
  address: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  zip_code?: string
  type: 'apartment' | 'house' | 'commercial' | 'studio'
  area: number
  bedrooms: number
  bathrooms: number
  parkingSpaces: number
  parking_spaces?: number
  rent: number
  status: 'vacant' | 'occupied' | 'maintenance' | 'inactive'
  description?: string
  images?: string[]
  units?: Unit[]
  isResidential?: boolean
  is_residential?: boolean
  tenant?: string | null
  createdAt?: string
  created_at?: string
  updated_at?: string
}

// Funções utilitárias para conversão entre formatos
export const convertApiToProperty = (apiProperty: PropertyResponse): Property => ({
  id: apiProperty.id,
  name: apiProperty.name,
  address: apiProperty.address,
  neighborhood: apiProperty.neighborhood,
  city: apiProperty.city,
  state: apiProperty.state,
  zipCode: apiProperty.zip_code,
  zip_code: apiProperty.zip_code,
  type: apiProperty.type,
  area: apiProperty.area,
  bedrooms: apiProperty.bedrooms,
  bathrooms: apiProperty.bathrooms,
  parkingSpaces: apiProperty.parking_spaces,
  parking_spaces: apiProperty.parking_spaces,
  rent: apiProperty.rent,
  status: apiProperty.status,
  description: apiProperty.description,
  images: apiProperty.images,
  isResidential: apiProperty.is_residential,
  is_residential: apiProperty.is_residential,
  tenant: apiProperty.tenant,
  createdAt: apiProperty.created_at,
  created_at: apiProperty.created_at,
  updated_at: apiProperty.updated_at
})

export const convertPropertyToApi = (property: PropertyFormData): Partial<PropertyResponse> => ({
  name: property.name,
  address: property.address,
  neighborhood: property.neighborhood,
  city: property.city,
  state: property.state,
  zip_code: property.zipCode || property.zip_code,
  type: property.type,
  area: property.area,
  bedrooms: property.bedrooms,
  bathrooms: property.bathrooms,
  parking_spaces: property.parkingSpaces || property.parking_spaces || 0,
  rent: property.rent,
  status: property.status,
  description: property.description,
  images: property.images,
  is_residential: property.isResidential ?? property.is_residential ?? true,
  tenant: property.tenant || undefined
})