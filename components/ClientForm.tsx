
import React, { useState } from 'react';
import { Client } from '../types';

interface ClientFormProps {
  onAdd: (client: Client) => void;
  onClose: () => void;
  nextCode: string;
}

const ClientForm: React.FC<ClientFormProps> = ({ onAdd, onClose, nextCode }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    balance: '0'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Client = {
      id: Math.random().toString(36).substr(2, 9),
      code: nextCode,
      name: formData.name,
      phone: formData.phone,
      balance: Number(formData.balance),
      lastTransaction: 'لا يوجد'
    };
    onAdd(newClient);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-6 border-b pb-4">إضافة عميل جديد</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كود العميل</label>
            <input 
              type="text" 
              readOnly
              className="w-full p-3 border rounded-xl bg-gray-100 font-bold"
              value={nextCode}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم العميل / المحل</label>
            <input 
              type="text" 
              required
              placeholder="مثلاً: سنترال المستقبل"
              className="w-full p-3 border rounded-xl bg-gray-50"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
            <input 
              type="tel" 
              required
              placeholder="01xxxxxxxxx"
              className="w-full p-3 border rounded-xl bg-gray-50"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الرصيد الافتتاحي (ج.م)</label>
            <input 
              type="number" 
              required
              className="w-full p-3 border rounded-xl bg-gray-50"
              value={formData.balance}
              onChange={e => setFormData({...formData, balance: e.target.value})}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition"
            >
              إضافة العميل
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

export default ClientForm;
