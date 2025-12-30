
export enum Provider {
  FAWRY = 'فوري',
  AMAN = 'أمان',
  OPAY = 'أوباي',
  MOMKEN = 'ممكن',
  VODAFONE_CASH = 'فودافون كاش',
  ORANGE_CASH = 'أورانج كاش',
  ETISALAT_CASH = 'اتصالات كاش',
  WEE_PAY = 'وي باي'
}

export enum TransactionType {
  DEPOSIT = 'شحن رصيد مورد',
  PAYOUT = 'تحويل لعميل',
  COMMISSION = 'عمولة',
  CASH_OUT = 'سحب كاش'
}

export interface Transaction {
  id: string;
  date: string;
  provider: Provider;
  type: TransactionType;
  amount: number;
  commission: number;
  clientName: string;
  status: 'completed' | 'pending' | 'failed';
  note?: string;
}

export interface Client {
  id: string;
  code: string;
  name: string;
  phone: string;
  balance: number;
  lastTransaction: string;
}

export enum MaintenanceStatus {
  PENDING = 'قيد الانتظار',
  IN_PROGRESS = 'جاري الإصلاح',
  FIXED = 'تم الإصلاح',
  DELIVERED = 'تم التسليم'
}

export interface MaintenanceRecord {
  id: string;
  serialNumber: string;
  clientName: string;
  issue: string;
  receivedDate: string;
  status: MaintenanceStatus;
  cost: number;
}

export interface Supplier {
  id: string;
  provider: Provider;
  currentBalance: number;
  threshold: number;
}

export interface DashboardStats {
  totalRevenue: number;
  dailyOperations: number;
  totalCommission: number;
  providerBalances: Record<Provider, number>;
}
