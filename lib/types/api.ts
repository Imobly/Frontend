// Tipos base para a API
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}

// PROPRIEDADES
export interface PropertyBase {
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  type: 'apartment' | 'house' | 'commercial' | 'studio';
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  rent: number;
  status: 'vacant' | 'occupied' | 'maintenance' | 'inactive';
  description?: string;
  images?: string[];
  is_residential: boolean;
  tenant?: string;
}

export interface PropertyCreate extends PropertyBase {}

export interface PropertyUpdate extends Partial<PropertyBase> {}

export interface PropertyResponse extends PropertyBase {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// INQUILINOS
export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface TenantDocument {
  id?: string;
  name: string;
  type: 'rg' | 'cpf' | 'cnh' | 'comprovante_residencia' | 'comprovante_renda' | 'contrato' | 'outros';
  url?: string;
  file_type?: string;
  size?: number;
  uploaded_at?: string;
}

export interface TenantBase {
  name: string;
  email: string;
  phone: string;
  cpf_cnpj: string;
  birth_date?: string;
  profession: string;
  emergency_contact?: EmergencyContact;
  documents?: TenantDocument[];
  status: 'active' | 'inactive';
}

export interface TenantCreate extends TenantBase {}

export interface TenantUpdate extends Partial<TenantBase> {}

export interface TenantResponse extends TenantBase {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// UNIDADES
export interface UnitBase {
  property_id: number;
  number: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  rent: number;
  status: 'vacant' | 'occupied' | 'maintenance';
  tenant?: string;
}

export interface UnitCreate extends UnitBase {}

export interface UnitUpdate extends Partial<UnitBase> {}

export interface UnitResponse extends UnitBase {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// CONTRATOS
export interface ContractBase {
  title: string;
  property_id: number;
  tenant_id: number;
  start_date: string;
  end_date: string;
  rent: number;
  deposit: number;
  interest_rate: number;
  fine_rate: number;
  status: 'active' | 'expired' | 'terminated';
  document_url?: string;
}

export interface ContractCreate extends ContractBase {}

export interface ContractUpdate extends Partial<ContractBase> {}

export interface ContractResponse extends ContractBase {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// PAGAMENTOS
export interface PaymentBase {
  property_id: number;
  tenant_id: number;
  contract_id: number;
  due_date: string;
  payment_date?: string;
  amount: number;
  fine_amount: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  payment_method?: 'cash' | 'transfer' | 'pix' | 'check' | 'card';
  description?: string;
}

export interface PaymentCreate extends PaymentBase {}

export interface PaymentUpdate extends Partial<PaymentBase> {}

export interface PaymentResponse extends PaymentBase {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface PaymentConfirm {
  payment_date?: string;
  amount_paid?: number;
}

export interface BulkPaymentConfirm {
  payment_ids: number[];
  payment_date?: string;
}

// DESPESAS
export interface ExpenseDocument {
  id?: string;
  name: string;
  type: 'comprovante' | 'nota_fiscal' | 'recibo' | 'outros';
  url: string;
  file_type?: string;
  size?: number;
  uploaded_at?: string;
}

export interface ExpenseBase {
  type: 'expense' | 'maintenance';
  category: string;
  description: string;
  amount: number;
  date: string;
  property_id: number;
  status: 'pending' | 'paid' | 'scheduled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  vendor?: string;
  number?: string;
  receipt?: string;
  documents?: ExpenseDocument[];
}

export interface ExpenseCreate extends ExpenseBase {}

export interface ExpenseUpdate extends Partial<ExpenseBase> {}

export interface ExpenseResponse extends ExpenseBase {
  id: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface ExpenseSummary {
  category: string;
  total: number;
  count: number;
}

// NOTIFICAÇÕES
export interface NotificationBase {
  type: 'contract_expiring' | 'payment_overdue' | 'maintenance_urgent' | 'system_alert' | 'reminder';
  title: string;
  message: string;
  date: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read_status: boolean;
  action_required: boolean;
  related_id?: string;
  related_type?: 'contract' | 'payment' | 'maintenance' | 'property';
}

export interface NotificationCreate extends NotificationBase {}

export interface NotificationUpdate extends Partial<NotificationBase> {}

export interface NotificationResponse extends NotificationBase {
  id: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface NotificationCount {
  unread_count: number;
}

// DASHBOARD
export interface DashboardSummary {
  properties: {
    total: number;
    total_units: number;
    occupied_units: number;
    occupancy_rate: number;
  };
  contracts: {
    active: number;
    expiring_soon: number;
  };
  financial: {
    monthly_revenue: number;
    monthly_expenses: number;
    net_profit: number;
    overdue_payments: number;
  };
  notifications: {
    unread_count: number;
  };
}

export interface RevenueChartData {
  data: Array<{
    month: string;
    revenue: number;
  }>;
}

export interface ExpenseChartData {
  data: Array<{
    month: string;
    expenses: number;
  }>;
}

export interface PropertyPerformance {
  properties: Array<{
    property_id: number;
    property_name: string;
    revenue: number;
    expenses: number;
    net_income: number;
    occupancy_rate: number;
    occupied_units: number;
    total_units: number;
  }>;
}

export interface RecentActivity {
  activities: Array<{
    type: 'payment' | 'contract';
    description: string;
    date: string;
    related_id: number;
  }>;
}

// FILTROS E QUERIES
export interface PropertyFilters {
  skip?: number;
  limit?: number;
  property_type?: string;
  status?: string;
  min_rent?: number;
  max_rent?: number;
  min_area?: number;
  max_area?: number;
}

export interface TenantFilters {
  skip?: number;
  limit?: number;
  name?: string;
  email?: string;
  cpf?: string;
}

export interface PaymentFilters {
  skip?: number;
  limit?: number;
  contract_id?: number;
  status?: string;
  month?: number;
  year?: number;
}

export interface ExpenseFilters {
  skip?: number;
  limit?: number;
  property_id?: number;
  category?: string;
  month?: number;
  year?: number;
}

export interface NotificationFilters {
  skip?: number;
  limit?: number;
  read?: boolean;
  type?: string;
}

export interface UnitFilters {
  skip?: number;
  limit?: number;
  property_id?: number;
  status?: string;
}

export interface ContractFilters {
  skip?: number;
  limit?: number;
  status?: string;
  tenant_id?: number;
  property_id?: number;
}

// ERROS DA API
export interface ApiError {
  detail: string;
}

// HEALTH CHECK
export interface HealthCheck {
  status: string;
}

// ROOT RESPONSE
export interface RootResponse {
  message: string;
  version: string;
  docs: string;
}