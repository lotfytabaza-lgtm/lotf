
import React, { useState } from 'react';
import { MaintenanceRecord, MaintenanceStatus } from '../types';
import { Plus, Wrench, Clock, CheckCircle, Package, Edit2 } from 'lucide-react';

interface MaintenanceProps {
  records: MaintenanceRecord[];
  onAdd: (record: MaintenanceRecord) => void;
  onUpdateStatus: (id: string, status: MaintenanceStatus) => void;
}

const Maintenance: React.FC<MaintenanceProps> = ({ records, onAdd, onUpdateStatus }) => {
  const [showAddModal, setShowAddModal] = useState(false);
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
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">إدارة صيانة ماكينات التحويل</h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition shadow-md"
        >
          <Plus size={18} />
          تسجيل بلاغ صيانة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map(record => (
          <div key={record.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div className="relative group">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 cursor-pointer ${getStatusStyle(record.status)}`}>
                  {getStatusIcon(record.status)}
                  {record.status}
                </span>
                <div className="hidden group-hover:block absolute top-full right-0 mt-2 bg-white border rounded-xl shadow-xl z-10 w-40 overflow-hidden">
                  {Object.values(MaintenanceStatus).map((status) => (
                    <button
                      key={status}
                      onClick={() => onUpdateStatus(record.id, status)}
                      className="w-full text-right px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                    >
                      نقل إلى {status}
                    </button>
                  ))}
                </div>
              </div>
              <span className="text-xs text-gray-400 font-mono">{record.serialNumber}</span>
            </div>
            
            <h4 className="font-bold text-gray-800 mb-1">{record.clientName}</h4>
            <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg italic">"{record.issue}"</p>
            
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-xs text-gray-500">
                <p>تاريخ الاستلام</p>
                <p className="font-bold">{record.receivedDate}</p>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500">التكلفة</p>
                <p className="font-bold text-orange-600">{record.cost} ج.م</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-6 border-b pb-4 text-orange-600">بلاغ صيانة جديد</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الرقم التسلسلي (S/N)</label>
                <input 
                  type="text" required
                  className="w-full p-3 border rounded-xl bg-gray-50"
                  value={formData.serialNumber}
                  onChange={e => setFormData({...formData, serialNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم العميل</label>
                <input 
                  type="text" required
                  className="w-full p-3 border rounded-xl bg-gray-50"
                  value={formData.clientName}
                  onChange={e => setFormData({...formData, clientName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">وصف العطل</label>
                <textarea 
                  required
                  className="w-full p-3 border rounded-xl bg-gray-50"
                  value={formData.issue}
                  onChange={e => setFormData({...formData, issue: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تكلفة مبدئية</label>
                <input 
                  type="number"
                  className="w-full p-3 border rounded-xl bg-gray-50"
                  value={formData.cost}
                  onChange={e => setFormData({...formData, cost: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-xl">حفظ البلاغ</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
