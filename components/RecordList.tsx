
import React from 'react';
import { ChargingRecord } from '../types';
import { Zap, Clock, Wallet, Calendar } from 'lucide-react';

interface RecordListProps {
  records: ChargingRecord[];
  onDelete: (id: string) => void;
}

const RecordList: React.FC<RecordListProps> = ({ records, onDelete }) => {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="bg-slate-100 p-6 rounded-full mb-4">
          <Zap size={48} className="opacity-50" />
        </div>
        <p className="text-lg font-medium">暂无记录</p>
        <p className="text-sm">点击下方的 + 号开始记录您的第一次充电。</p>
      </div>
    );
  }

  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-4 pb-24">
      <h2 className="text-xl font-bold text-slate-800 px-1">充电历史</h2>
      {sortedRecords.map((record) => (
        <div key={record.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 relative group overflow-hidden transition-all active:bg-slate-50">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
              <Calendar size={14} className="mr-1" />
              {new Date(record.date).toLocaleString('zh-CN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
            <button 
              onClick={() => onDelete(record.id)}
              className="text-rose-400 hover:text-rose-600 p-1 text-xs"
            >
              删除
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-50 rounded-lg mr-3">
                <Zap size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">充电量</p>
                <p className="text-lg font-bold text-slate-700">{record.energyKwh} <span className="text-xs font-normal">kWh</span></p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <Clock size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">时长</p>
                <p className="text-lg font-bold text-slate-700">{record.durationMinutes} <span className="text-xs font-normal">分钟</span></p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-2 bg-amber-50 rounded-lg mr-3">
                <Wallet size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">费用</p>
                <p className="text-lg font-bold text-slate-700">¥{record.cost.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                <div className="w-[18px] h-[18px] flex items-center justify-center font-bold text-[10px] text-indigo-600 border-2 border-indigo-600 rounded-full">¥</div>
              </div>
              <div>
                <p className="text-xs text-slate-400">当前余额</p>
                <p className="text-lg font-bold text-slate-700">¥{record.balance.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecordList;
