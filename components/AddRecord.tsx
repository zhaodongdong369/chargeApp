
import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Loader2, Save, X } from 'lucide-react';
import { parseChargingImage } from '../services/geminiService';
import { ChargingRecord } from '../types';

interface AddRecordProps {
  onAdd: (record: Omit<ChargingRecord, 'id'>) => void;
  onCancel: () => void;
}

const AddRecord: React.FC<AddRecordProps> = ({ onAdd, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    energyKwh: '',
    durationMinutes: '',
    cost: '',
    balance: '',
    date: new Date().toISOString().substring(0, 16)
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.readAsDataURL(file);
      });

      const parsedData = await parseChargingImage(base64);
      
      setFormData(prev => ({
        ...prev,
        energyKwh: parsedData.energyKwh?.toString() || '',
        durationMinutes: parsedData.durationMinutes?.toString() || '',
        cost: parsedData.cost?.toString() || '',
        balance: parsedData.balance?.toString() || prev.balance
      }));
    } catch (err) {
      console.error(err);
      alert("识别失败。请尝试重新拍照或手动录入。");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      energyKwh: parseFloat(formData.energyKwh) || 0,
      durationMinutes: parseInt(formData.durationMinutes) || 0,
      cost: parseFloat(formData.cost) || 0,
      balance: parseFloat(formData.balance) || 0,
      date: new Date(formData.date).toISOString()
    });
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">新增充电记录</h2>
        <button onClick={onCancel} className="text-slate-400 p-1">
          <X size={24} />
        </button>
      </div>

      {/* AI Scanner */}
      <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-100 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-1">智能扫描</h3>
          <p className="text-emerald-100 text-sm mb-6">拍摄充电屏幕或账单照片，自动提取数据。</p>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              disabled={loading}
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl py-3 px-4 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
              <span className="font-semibold text-sm">拍照识别</span>
            </button>
            <button 
              type="button"
              disabled={loading}
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl py-3 px-4 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <ImageIcon size={18} />
              <span className="font-semibold text-sm">相册选取</span>
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        {/* Decor */}
        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* Manual Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">充电电量 (kWh)</label>
          <input 
            type="number" 
            step="0.01"
            value={formData.energyKwh}
            onChange={e => setFormData({...formData, energyKwh: e.target.value})}
            placeholder="0.00"
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">充电时长 (分钟)</label>
            <input 
              type="number" 
              value={formData.durationMinutes}
              onChange={e => setFormData({...formData, durationMinutes: e.target.value})}
              placeholder="0"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">花费金额 (¥)</label>
            <input 
              type="number" 
              step="0.01"
              value={formData.cost}
              onChange={e => setFormData({...formData, cost: e.target.value})}
              placeholder="0.00"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">当前余额 (¥)</label>
          <input 
            type="number" 
            step="0.01"
            value={formData.balance}
            onChange={e => setFormData({...formData, balance: e.target.value})}
            placeholder="0.00"
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">充电时间</label>
          <input 
            type="datetime-local" 
            value={formData.date}
            onChange={e => setFormData({...formData, date: e.target.value})}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium"
            required
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
          >
            <Save size={20} />
            <span>保存记录</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecord;
