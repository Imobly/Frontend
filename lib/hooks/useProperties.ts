import { useState, useEffect } from 'react'
import { ApiService, handleApiError } from '@/lib/api'
import { PropertyResponse, PropertyFilters } from '@/lib/types/api'

interface UsePropertiesReturn {
  properties: PropertyResponse[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createProperty: (property: any) => Promise<PropertyResponse | null>
  updateProperty: (id: number, property: any) => Promise<PropertyResponse | null>
  deleteProperty: (id: number) => Promise<boolean>
}

export function useProperties(filters?: PropertyFilters): UsePropertiesReturn {
  const [properties, setProperties] = useState<PropertyResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ApiService.properties.getProperties(filters)
      setProperties(data)
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao carregar propriedades:', err)
    } finally {
      setLoading(false)
    }
  }

  const createProperty = async (property: any): Promise<PropertyResponse | null> => {
    try {
      const newProperty = await ApiService.properties.createProperty(property)
      setProperties(prev => [...prev, newProperty])
      return newProperty
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao criar propriedade:', err)
      return null
    }
  }

  const updateProperty = async (id: number, property: any): Promise<PropertyResponse | null> => {
    try {
      const updatedProperty = await ApiService.properties.updateProperty(id, property)
      setProperties(prev =>
        prev.map(p => p.id === id ? updatedProperty : p)
      )
      return updatedProperty
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao atualizar propriedade:', err)
      return null
    }
  }

  const deleteProperty = async (id: number): Promise<boolean> => {
    try {
      await ApiService.properties.deleteProperty(id)
      setProperties(prev => prev.filter(p => p.id !== id))
      return true
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      console.error('❌ Erro ao deletar propriedade:', err)
      return false
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [filters])

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty
  }
}

// Hook para buscar uma propriedade específica
export function useProperty(id: number) {
  const [property, setProperty] = useState<PropertyResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await ApiService.properties.getProperty(id)
        setProperty(data)
      } catch (err) {
        const errorMessage = handleApiError(err)
        setError(errorMessage)
        console.error('❌ Erro ao carregar propriedade:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProperty()
    }
  }, [id])

  return { property, loading, error }
}