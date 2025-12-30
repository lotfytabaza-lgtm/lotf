
import { Provider, Transaction, Client, Supplier, TransactionType, MaintenanceRecord, MaintenanceStatus } from './types';

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: '1', provider: Provider.FAWRY, currentBalance: 15400, threshold: 2000 },
  { id: '2', provider: Provider.AMAN, currentBalance: 8200, threshold: 1500 },
  { id: '3', provider: Provider.OPAY, currentBalance: 12000, threshold: 3000 },
  { id: '4', provider: Provider.VODAFONE_CASH, currentBalance: 4500, threshold: 1000 },
];

export const INITIAL_CLIENTS: Client[] = [
  { id: 'c1', code: '1001', name: 'محل السعادة موبايل', phone: '01012345678', balance: 500, lastTransaction: '2024-05-20' },
  { id: 'c2', code: '1002', name: 'سنترال الأمل', phone: '01198765432', balance: -200, lastTransaction: '2024-05-19' },
  { id: 'c3', code: '1003', name: 'النجم للاتصالات', phone: '01234567890', balance: 1200, lastTransaction: '2024-05-20' },
];

export const MOCK_MAINTENANCE: MaintenanceRecord[] = [
  {
    id: 'm1',
    serialNumber: 'VX-520-998',
    clientName: 'محل السعادة موبايل',
    issue: 'عطل في بيت الكارت',
    receivedDate: '2024-05-21',
    status: MaintenanceStatus.IN_PROGRESS,
    cost: 150
  },
  {
    id: 'm2',
    serialNumber: 'PAX-A920-12',
    clientName: 'النجم للاتصالات',
    issue: 'تغيير بطارية',
    receivedDate: '2024-05-20',
    status: MaintenanceStatus.PENDING,
    cost: 450
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    date: new Date().toISOString(),
    provider: Provider.FAWRY,
    type: TransactionType.PAYOUT,
    amount: 1000,
    commission: 15,
    clientName: 'محل السعادة موبايل',
    status: 'completed'
  },
  {
    id: 't2',
    date: new Date().toISOString(),
    provider: Provider.VODAFONE_CASH,
    type: TransactionType.CASH_OUT,
    amount: 500,
    commission: 5,
    clientName: 'سنترال الأمل',
    status: 'completed'
  }
];

export const PROVIDER_COLORS: Record<Provider, string> = {
  [Provider.FAWRY]: 'bg-yellow-500',
  [Provider.AMAN]: 'bg-green-600',
  [Provider.OPAY]: 'bg-blue-600',
  [Provider.MOMKEN]: 'bg-purple-600',
  [Provider.VODAFONE_CASH]: 'bg-red-600',
  [Provider.ORANGE_CASH]: 'bg-orange-500',
  [Provider.ETISALAT_CASH]: 'bg-green-500',
  [Provider.WEE_PAY]: 'bg-indigo-700',
};
