export interface Payment {
  id: number
  property: {
    id: number
    name: string
    address: string
  }
  tenant: {
    id: number
    name: string
    email: string
  }
  contract: {
    id: number
    title: string
  }
  dueDate: string
  paymentDate: string | null
  amount: number
  fineAmount: number
  totalAmount: number
  status: string
  paymentMethod: string | null
  description: string
  createdAt: string
}

export interface PaymentFormData {
  id?: number
  property: {
    id: number
    name: string
    address: string
  } | null
  tenant: {
    id: number
    name: string
    email: string
  } | null
  contract: {
    id: number
    title: string
  } | null
  dueDate: string
  paymentDate: string | null
  amount: number
  fineAmount: number
  totalAmount: number
  status: string
  paymentMethod: string | null
  description: string
  createdAt?: string
}