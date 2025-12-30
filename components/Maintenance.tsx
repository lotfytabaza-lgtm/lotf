
import React, { useState, useMemo } from 'react';
import { MaintenanceRecord, MaintenanceStatus } from '../types';
import { Plus, Wrench, Clock, CheckCircle, Package, Search, Filter, ArrowUpDown } from 'lucide-react';

interface MaintenanceProps {
  records: MaintenanceRecord[];
  onAdd: (record: MaintenanceRecord) => void;
  onUpdateStatus: (id: string, status: MaintenanceStatus) => void;
}

type SortOption = 'date-desc' | 'date-asc' | 'cost-desc' | 'cost-asc';

const Maintenance: React.FC<MaintenanceProps> = ({ records, onAdd, onUpdateStatus }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<MaintenanceStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  const [formData, setFormData] = useState({
    serialNumber: '',
    clientName: '',
    issue: '',
    cost: '0'
  });

  const getStatusStyle = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.PENDING: return 'bg-orange-100 text-orange-700 border-orange-200';
      case MaintenanceStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-700 border-blue-200';
      case MaintenanceStatus.FIXED: return 'bg-green-100 text-green-700 border-green-200';
      case MaintenanceStatus.DELIVERED: return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100';
    }
  };

  const getStatusIcon = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.PENDING: return <Clock size={14} />;
      case MaintenanceStatus.IN_PROGRESS: return <Wrench size={14} />;
      case MaintenanceStatus.FIXED: return <CheckCircle size={14} />;
      case MaintenanceStatus.DELIVERED: return <Package size={14} />;
    }
  };

  const filteredAndSortedRecords = useMemo(() => {
    let result = records.filter(record => {
      const matchesSearch = record.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.issue.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc': return new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime();
        case 'date-asc': return new Date(a.receivedDate).getTime() - new Date(b.receivedDate).getTime();
        case 'cost-desc': return b.cost - a.cost;
        case 'cost-asc': return a.cost - b.cost;
        default: return 0;
      }
    });
  }, [records, searchTerm, statusFilter, sortBy]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: MaintenanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      serialNumber: formData.serialNumber,
      clientName: formData.clientName,
      issue: formData.issue,
      receivedDate: new Date().toISOString().split('T')[0],
      status: MaintenanceStatus.PENDING,
      cost: Number(formData.cost)
    };
    onAdd(newRecord);
    setShowAddModal(false);
    setFormData({ serialNumber: '', clientName: '', issue: '', cost: '0' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-bold">إدارة صيانة الماكينات</h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-lg shadow-orange-100 text-sm font-bold"
        >
          <Plus size={18} />
          تسجيل بلاغ صيانة
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="بحث بالاسم، السيريال، أو العطل..." 
            className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 outline-none transition text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
          <Filter size={16} className="text-gray-400" />
          <select 
            className="bg-transparent outline-none text-xs font-bold text-gray-600 py-1"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">كل الحالات</option>
            {Object.values(MaintenanceStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
          <ArrowUpDown size={16} className="text-gray-400" />
          <select 
            className="bg-transparent outline-none text-xs font-bold text-gray-600 py-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="date-desc">التاريخ (الأحدث)</option>
            <option value="date-asc">التاريخ (الأقدم)</option>
            <option value="cost-desc">التكلفة (الأعلى)</option>
            <option value="cost-asc">التكلفة (الأقل)</option>
          </select>
        </div>
      </div>

      {/* Records Grid */}
      {filteredAndSortedRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedRecords.map(record => (
            <div key={record.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="relative">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 cursor-pointer ${getStatusStyle(record.status)}`}>
                    {getStatusIcon(record.status)}
                    {record.status}
                  </span>
                  {/* Status Dropdown Menu */}
                  <div className="hidden group-hover:block absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-10 w-44 overflow-hidden divide-y divide-gray-50">
                    {Object.values(MaintenanceStatus).map((status) => (
                      <button
                        key={status}
                        onClick={() => onUpdateStatus(record.id, status)}
                        className={`w-full text-right px-4 py-2.5 text-[11px] hover:bg-gray-50 transition-colors ${record.status === status ? 'font-bold text-orange-600 bg-orange-50' : 'text-gray-600'}`}
                      >
                        نقل إلى {status}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-mono tracking-tighter bg-gray-50 px-2 py-1 rounded">S/N: {record.serialNumber}</span>
              </div>
              
              <h4 className="font-bold text-gray-800 mb-1.5">{record.clientName}</h4>
              <p className="text-xs text-gray-500 mb-4 bg-gray-50/50 p-3 rounded-xl border border-dashed border-gray-200 min-h-[50px]">
                {record.issue}
              </p>
              
              <div className="flex justify-between items-end pt-4 border-t border-gray-50">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-gray-400">تاريخ الاستلام</p>
                  <p className="text-xs font-bold text-gray-700">{record.receivedDate}</p>
                </div>
                <div className="text-left space-y-0.5">
                  <p className="text-[10px] text-gray-400">تكلفة الإصلاح</p>
                  <p className="text-sm font-black text-orange-600">{record.cost.toLocaleString()} ج.م</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            <Search size={32} />
          </div>
          <h4 className="text-gray-800 font-bold mb-1">لا توجد نتائج</h4>
          <p className="text-gray-400 text-sm">جرب تغيير معايير البحث أو الفلترة</p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-800">بلاغ صيانة جديد</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400">
                <Plus className="rotate-45" size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-600 mr-1">الرقم التسلسلي (S/N)</label>
                <input 
                  type="text" required
                  placeholder="مثال: VX-520-XXXX"
                  className="w-full p-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:ring-4 focus:ring-orange-50 focus:border-orange-200 outline-none transition text-sm"
                  value={formData.serialNumber}
                  onChange={e => setFormData({...formData, serialNumber: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-600 mr-1">اسم العميل</label>
                <input 
                  type="text" required
                  placeholder="اسم صاحب الماكينة"
                  className="w-full p-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:ring-4 focus:ring-orange-50 focus:border-orange-200 outline-none transition text-sm"
                  value={formData.clientName}
                  onChange={e => setFormData({...formData, clientName: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-600 mr-1">وصف العطل بالتفصيل</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="ما الذي يشتكي منه العميل؟"
                  className="w-full p-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:ring-4 focus:ring-orange-50 focus:border-orange-200 outline-none transition text-sm resize-none"
                  value={formData.issue}
                  onChange={e => setFormData({...formData, issue: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-600 mr-1">تكلفة مبدئية (ج.م)</label>
                <input 
                  type="number"
                  placeholder="0.00"
                  className="w-full p-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:ring-4 focus:ring-orange-50 focus:border-orange-200 outline-none transition text-sm"
                  value={formData.cost}
                  onChange={e => setFormData({...formData, cost: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-700 transition active:scale-95">حفظ البلاغ</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-200 transition">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
