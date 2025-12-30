
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Transaction, Supplier, Provider } from '../types';
import { PROVIDER_COLORS } from '../constants';
import { TrendingUp, Users, Wallet, Activity, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  suppliers: Supplier[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, suppliers }) => {
  const totalVolume = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalCommission = transactions.reduce((acc, t) => acc + t.commission, 0);
  const activeOps = transactions.length;

  const chartData = suppliers.map(s => ({
    name: s.provider,
    balance: s.currentBalance,
  }));

  const lowBalanceSuppliers = suppliers.filter(s => s.currentBalance < s.threshold);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="إجمالي حجم التداول" 
          value={`${totalVolume.toLocaleString()} ج.م`} 
          icon={<TrendingUp className="text-blue-600" />} 
          trend="+12%"
        />
        <StatCard 
          title="إجمالي العمولات" 
          value={`${totalCommission.toLocaleString()} ج.م`} 
          icon={<Activity className="text-green-600" />} 
          trend="+5%"
        />
        <StatCard 
          title="عدد العمليات اليوم" 
          value={activeOps.toString()} 
          icon={<Users className="text-purple-600" />} 
        />
        <StatCard 
          title="رصيد الموردين الكلي" 
          value={`${suppliers.reduce((a, b) => a + b.currentBalance, 0).toLocaleString()} ج.م`} 
          icon={<Wallet className="text-orange-600" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">توزيع الأرصدة لدى الشركات</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="balance" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(PROVIDER_COLORS)[index % 8]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts & Low Balances */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} />
            تنبيهات الأرصدة
          </h3>
          <div className="space-y-4">
            {lowBalanceSuppliers.length > 0 ? (
              lowBalanceSuppliers.map(s => (
                <div key={s.id} className="p-3 bg-red-50 border border-red-100 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-red-800">{s.provider}</p>
                    <p className="text-sm text-red-600">الرصيد: {s.currentBalance} ج.م</p>
                  </div>
                  <button className="text-xs bg-red-600 text-white px-3 py-1 rounded-full">شحن الآن</button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-10">جميع الأرصدة في حالة جيدة</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, trend?: string }> = ({ title, value, icon, trend }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h4 className="text-2xl font-bold mt-1">{value}</h4>
      {trend && <span className="text-xs text-green-500 font-bold mt-2 inline-block">{trend} من أمس</span>}
    </div>
    <div className="p-3 bg-gray-50 rounded-xl">
      {icon}
    </div>
  </div>
);

export default Dashboard;
