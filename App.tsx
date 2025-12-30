
import React, { useState, useMemo, useEffect } from 'react';
import { LayoutDashboard, Receipt, Users2, Building2, Settings, Plus, Sparkles, LogOut, Menu, X, Wrench, Monitor, Download, Share2, ShieldCheck, Search, Filter, Smartphone } from 'lucide-react';
import { Transaction, Supplier, Client, Provider, MaintenanceRecord, MaintenanceStatus } from './types';
import { INITIAL_SUPPLIERS, INITIAL_CLIENTS, MOCK_TRANSACTIONS, PROVIDER_COLORS, MOCK_MAINTENANCE } from './constants';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import ClientForm from './components/ClientForm';
import Maintenance from './components/Maintenance';
import { getFinancialInsights } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'clients' | 'suppliers' | 'maintenance' | 'distribution'>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(MOCK_MAINTENANCE);
  
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvider, setFilterProvider] = useState<string>('all');
  
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter logic for transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = tx.clientName.toLowerCase().includes(searchLower) || 
                          tx.provider.toLowerCase().includes(searchLower) ||
                          tx.type.toLowerCase().includes(searchLower);
      const matchesProvider = filterProvider === 'all' || tx.provider === filterProvider;
      return matchesSearch && matchesProvider;
    });
  }, [transactions, searchTerm, filterProvider]);

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions([newTx, ...transactions]);
    setShowAddTxModal(false);
    setSuppliers(prev => prev.map(s => s.provider === newTx.provider ? { ...s, currentBalance: s.currentBalance - newTx.amount } : s));
  };

  const handleAddClient = (newClient: Client) => {
    setClients([...clients, newClient]);
    setShowAddClientModal(false);
  };

  const handleAddMaintenance = (newRecord: MaintenanceRecord) => {
    setMaintenanceRecords([newRecord, ...maintenanceRecords]);
  };

  const handleUpdateMaintenanceStatus = (id: string, status: MaintenanceStatus) => {
    setMaintenanceRecords(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const generateAiSummary = async () => {
    if (isAiLoading) return;
    setIsAiLoading(true);
    try {
      const summary = await getFinancialInsights(transactions, suppliers);
      setAiInsight(summary);
    } catch (e) {
      setAiInsight("حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const getNextClientCode = () => {
    if (clients.length === 0) return "1001";
    const codes = clients.map(c => parseInt(c.code)).filter(c => !isNaN(c));
    const maxCode = codes.length > 0 ? Math.max(...codes) : 1000;
    return (maxCode + 1).toString();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-right" dir="rtl">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-2">
           <Building2 size={24} className="text-blue-600" />
           <h1 className="text-xl font-bold text-gray-800">إي-باي برو</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 right-0 w-64 bg-white border-l shadow-xl transform transition-transform duration-300 z-50
        md:translate-x-0 md:static md:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="hidden md:flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Building2 size={24} />
            </div>
            <h1 className="text-xl font-black text-gray-800 tracking-tight">إي-باي برو</h1>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto no-scrollbar">
            <NavItem active={activeTab === 'dashboard'} icon={<LayoutDashboard size={20} />} label="لوحة التحكم" onClick={() => {setActiveTab('dashboard'); setIsSidebarOpen(false);}} />
            <NavItem active={activeTab === 'transactions'} icon={<Receipt size={20} />} label="العمليات المالية" onClick={() => {setActiveTab('transactions'); setIsSidebarOpen(false);}} />
            <NavItem active={activeTab === 'clients'} icon={<Users2 size={20} />} label="العملاء (المناديب)" onClick={() => {setActiveTab('clients'); setIsSidebarOpen(false);}} />
            <NavItem active={activeTab === 'maintenance'} icon={<Wrench size={20} />} label="صيانة الماكينات" onClick={() => {setActiveTab('maintenance'); setIsSidebarOpen(false);}} />
            <NavItem active={activeTab === 'suppliers'} icon={<Building2 size={20} />} label="الشركات والموردين" onClick={() => {setActiveTab('suppliers'); setIsSidebarOpen(false);}} />
          </nav>

          <div className="pt-4 border-t space-y-1">
            <NavItem active={activeTab === 'distribution'} icon={<Smartphone size={20} className="text-green-600" />} label="تحويل لبرنامج APK" onClick={() => {setActiveTab('distribution'); setIsSidebarOpen(false);}} />
            <NavItem active={false} icon={<Settings size={20} />} label="الإعدادات" onClick={() => {}} />
            <NavItem active={false} icon={<LogOut size={20} className="text-red-500" />} label="تسجيل الخروج" onClick={() => {}} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        {/* Top Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {activeTab === 'dashboard' && 'نظرة عامة'}
              {activeTab === 'transactions' && 'سجل العمليات'}
              {activeTab === 'clients' && 'إدارة العملاء'}
              {activeTab === 'maintenance' && 'قسم الصيانة'}
              {activeTab === 'suppliers' && 'إدارة الشركات'}
              {activeTab === 'distribution' && 'استخراج APK أندرويد'}
            </h2>
            <p className="text-gray-500 text-sm">{new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={generateAiSummary}
              disabled={isAiLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-md hover:opacity-90 transition disabled:opacity-50 text-sm font-medium"
            >
              <Sparkles size={16} />
              {isAiLoading ? 'جاري التحليل...' : 'تحليل ذكي'}
            </button>
            <button 
              onClick={() => setShowAddTxModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition text-sm font-bold"
            >
              <Plus size={16} />
              عملية جديدة
            </button>
          </div>
        </div>

        {/* AI Insight Section */}
        {aiInsight && (
          <div className="mb-8 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 p-6 rounded-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="absolute top-0 right-0 w-1 h-full bg-indigo-500"></div>
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 shrink-0">
                <Sparkles size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-indigo-900 mb-1">التقرير الذكي</h3>
                <p className="text-indigo-800 whitespace-pre-line leading-relaxed text-sm">{aiInsight}</p>
              </div>
              <button onClick={() => setAiInsight('')} className="text-indigo-400 hover:text-indigo-600 p-1">
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="animate-in fade-in duration-300">
          {activeTab === 'dashboard' && <Dashboard transactions={transactions} suppliers={suppliers} />}
          
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                 <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="بحث في العمليات..." 
                      className="w-full pr-10 pl-4 py-2 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
                 <select 
                   className="bg-gray-50 border rounded-xl px-4 py-2 outline-none text-sm font-medium"
                   value={filterProvider}
                   onChange={(e) => setFilterProvider(e.target.value)}
                 >
                   <option value="all">كل الشركات</option>
                   {Object.values(Provider).map(p => <option key={p} value={p}>{p}</option>)}
                 </select>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="p-4 font-bold text-gray-700 text-sm">التاريخ</th>
                        <th className="p-4 font-bold text-gray-700 text-sm">الشركة</th>
                        <th className="p-4 font-bold text-gray-700 text-sm">النوع</th>
                        <th className="p-4 font-bold text-gray-700 text-sm">المبلغ</th>
                        <th className="p-4 font-bold text-gray-700 text-sm">العمولة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredTransactions.length > 0 ? filteredTransactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-gray-50 transition">
                          <td className="p-4 text-xs text-gray-500">
                            {new Date(tx.date).toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'})}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] text-white font-bold ${PROVIDER_COLORS[tx.provider] || 'bg-gray-400'}`}>
                              {tx.provider}
                            </span>
                          </td>
                          <td className="p-4 text-sm font-medium">{tx.type}</td>
                          <td className="p-4 font-bold text-sm">{tx.amount.toLocaleString()} ج.م</td>
                          <td className="p-4 text-green-600 font-bold text-sm">+{tx.commission.toLocaleString()}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan={5} className="p-10 text-center text-gray-400 italic">لا توجد نتائج للبحث</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'clients' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button 
                  onClick={() => setShowAddClientModal(true)} 
                  className="bg-green-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-green-100 hover:bg-green-700 transition"
                >
                  <Plus size={18} />
                  إضافة عميل جديد
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map(client => (
                  <div key={client.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center relative hover:shadow-md transition-all group">
                    <span className="absolute top-4 left-4 bg-gray-50 text-gray-400 px-3 py-1 rounded-lg text-xs font-mono font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">#{client.code}</span>
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform"><Users2 size={32} /></div>
                    <h3 className="text-xl font-bold text-gray-800">{client.name}</h3>
                    <p className="text-gray-500 mb-4 text-sm">{client.phone}</p>
                    <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                      <div><p className="text-[10px] text-gray-400 uppercase font-bold">الرصيد</p><p className={`font-bold ${client.balance < 0 ? 'text-red-500' : 'text-green-600'}`}>{client.balance.toLocaleString()} ج.م</p></div>
                      <div><p className="text-[10px] text-gray-400 uppercase font-bold">آخر عملية</p><p className="font-bold text-gray-700 text-xs">{client.lastTransaction}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <Maintenance 
              records={maintenanceRecords} 
              onAdd={handleAddMaintenance} 
              onUpdateStatus={handleUpdateMaintenanceStatus}
            />
          )}

          {activeTab === 'suppliers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {suppliers.map(sup => (
                <div key={sup.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 h-1 w-full ${PROVIDER_COLORS[sup.provider] || 'bg-gray-400'}`}></div>
                  <h3 className="text-xl font-bold mb-4">{sup.provider}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-gray-500 text-sm">الرصيد الحالي</span><span className="font-bold text-sm">{sup.currentBalance.toLocaleString()} ج.م</span></div>
                    <div className="flex justify-between"><span className="text-gray-500 text-sm">حد التنبيه</span><span className="font-medium text-red-400 text-sm">{sup.threshold.toLocaleString()} ج.م</span></div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
                       <div className={`h-full ${PROVIDER_COLORS[sup.provider]} rounded-full transition-all`} style={{width: `${Math.min(100, (sup.currentBalance/20000)*100)}%`}}></div>
                    </div>
                  </div>
                  <button className="w-full mt-6 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-2 rounded-xl border border-transparent hover:border-gray-200 transition text-sm">كشف حساب مفصل</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'distribution' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl text-white text-center">
                 <Smartphone size={48} className="mx-auto mb-4 opacity-90" />
                 <h3 className="text-2xl font-bold mb-2">حول البرنامج إلى تطبيق APK</h3>
                 <p className="text-blue-100 text-sm mb-6">اتبع الخطوات التالية لتوزيع البرنامج على هواتف الأندرويد ليعمل بشكل احترافي.</p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-sm">
                       <h4 className="font-bold mb-1">الخيار 1: تثبيت فوري (PWA)</h4>
                       <p className="text-xs text-blue-50 opacity-80 leading-relaxed">افتح الرابط في كروم الموبايل واضغط "Add to Home Screen".</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-sm">
                       <h4 className="font-bold mb-1">الخيار 2: استخراج ملف APK</h4>
                       <p className="text-xs text-blue-50 opacity-80 leading-relaxed">استخدم أداة Bubblewrap أو WebIntoApp لتحويل الرابط لملف تثبيت.</p>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                 <h4 className="font-bold mb-4 flex items-center gap-2 text-gray-800"><Download size={20} className="text-blue-600" /> دليل توزيع الويندوز (EXE):</h4>
                 <div className="bg-gray-900 text-indigo-300 p-4 rounded-xl font-mono text-xs overflow-x-auto no-scrollbar">
                    nativefier --name "E-Pay Pro" --icon icon.ico --single-instance "PASTE_URL_HERE"
                 </div>
                 <p className="text-gray-400 text-[10px] mt-2 italic text-center">قم بلصق رابط الموقع بدلاً من كلمة URL_HERE في الكود أعلاه.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showAddTxModal && <TransactionForm onAdd={handleAddTransaction} onClose={() => setShowAddTxModal(false)} />}
      {showAddClientModal && <ClientForm onAdd={handleAddClient} onClose={() => setShowAddClientModal(false)} nextCode={getNextClientCode()} />}
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

const NavItem: React.FC<{ active: boolean, icon: React.ReactNode, label: string, onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
  >
    <span className={`${active ? 'text-white' : 'text-gray-400'}`}>{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

export default App;
