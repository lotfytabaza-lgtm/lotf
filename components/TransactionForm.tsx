
import React, { useState } from 'react';
import { Provider, TransactionType, Transaction } from '../types';

interface TransactionFormProps {
  onAdd: (tx: Transaction) => void;
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    provider: Provider.FAWRY,
    type: TransactionType.PAYOUT,
    amount: '',
    commission: '',
    clientName: '',
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      provider: formData.provider,
      type: formData.type,
      amount: Number(formData.amount),
      commission: Number(formData.commission),
      clientName: formData.clientName,
      status: 'completed',
      note: formData.note
    };
    onAdd(newTx);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-6 border-b pb-4">تسجيل عملية جديدة</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الشركة / الخدمة</label>
            <select 
              className="w-full p-3 border rounded-xl bg-gray-50"
              value={formData.provider}
              onChange={e => setFormData({...formData, provider: e.target.value as Provider})}
            >
              {Object.values(Provider).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نوع العملية</label>
            <select 
              className="w-full p-3 border rounded-xl bg-gray-50"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as TransactionType})}
            >
              {Object.values(TransactionType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ (ج.م)</label>
              <input 
                type="number" 
                required
                className="w-full p-3 border rounded-xl bg-gray-50"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">العمولة المستحقة</label>
              <input 
                type="number" 
                required
                className="w-full p-3 border rounded-xl bg-gray-50"
                value={formData.commission}
                onChange={e => setFormData({...formData, commission: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم العميل / السنترال</label>
            <input 
              type="text" 
              required
              placeholder="مثلاً: سنترال الحرية"
              className="w-full p-3 border rounded-xl bg-gray-50"
              value={formData.clientName}
              onChange={e => setFormData({...formData, clientName: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات إضافية</label>
            <textarea 
              className="w-full p-3 border rounded-xl bg-gray-50"
              rows={2}
              value={formData.note}
              onChange={e => setFormData({...formData, note: e.target.value})}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition"
            >
              حفظ العملية
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
