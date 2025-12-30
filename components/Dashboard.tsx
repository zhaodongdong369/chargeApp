
import React, { useMemo, useState } from 'react';
import { ChargingRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  records: ChargingRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  const [timeFrame, setTimeFrame] = useState<'month' | 'year'>('month');

  const stats = useMemo(() => {
    if (records.length === 0) return { totalCost: 0, totalEnergy: 0, avgCost: 0 };
    const totalCost = records.reduce((sum, r) => sum + r.cost, 0);
    const totalEnergy = records.reduce((sum, r) => sum + r.energyKwh, 0);
    return {
      totalCost,
      totalEnergy,
      avgCost: totalEnergy > 0 ? totalCost / totalEnergy : 0
    };
  }, [records]);

  const chartData = useMemo(() => {
    const monthlyData: Record<string, { name: string, cost: number, energy: number }> = {};
    
    // Last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toISOString().substring(0, 7); // YYYY-MM
      monthlyData[key] = { 
        name: d.toLocaleDateString('zh-CN', { month: 'short' }), 
        cost: 0, 
        energy: 0 
      };
    }

    records.forEach(r => {
      const key = r.date.substring(0, 7);
      if (monthlyData[key]) {
        monthlyData[key].cost += r.cost;
        monthlyData[key].energy += r.energyKwh;
      }
    });

    return Object.values(monthlyData);
  }, [records]);

  return (
    <div className="space-y-6 pb-24">
      <h2 className="text-xl font-bold text-slate-800">数据统计</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 font-medium mb-1">总计消费</p>
          <p className="text-2xl font-bold text-emerald-600">¥{stats.totalCost.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 font-medium mb-1">总计电量</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalEnergy.toFixed(1)} <span className="text-sm">kWh</span></p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 col-span-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">平均充电单价</p>
              <p className="text-xl font-bold text-slate-700">¥{stats.avgCost.toFixed(3)} / kWh</p>
            </div>
            <div className="h-10 w-10 bg-amber-50 rounded-full flex items-center justify-center">
              <div className="text-amber-600 font-bold">¥</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-700">消费趋势</h3>
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setTimeFrame('month')}
              className={`text-[10px] px-2 py-1 rounded-md font-bold transition-colors ${timeFrame === 'month' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}
            >
              按月
            </button>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94a3b8' }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                tickFormatter={(val) => `¥${val}`}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                labelFormatter={(label) => `${label}`}
                formatter={(value: any) => [`¥${parseFloat(value).toFixed(2)}`, '消费']}
              />
              <Bar dataKey="cost" radius={[6, 6, 0, 0]} barSize={32}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#10b981' : '#cbd5e1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Detailed Aggregation */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 font-bold text-slate-700">每月明细</div>
        <div className="divide-y divide-slate-50">
          {chartData.filter(d => d.cost > 0).reverse().map((data) => (
            <div key={data.name} className="flex justify-between items-center p-4">
              <div>
                <p className="font-semibold text-slate-800">{data.name}</p>
                <p className="text-xs text-slate-400">消耗 {data.energy.toFixed(1)} kWh</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-600">¥{data.cost.toFixed(2)}</p>
                <p className="text-[10px] text-slate-300">总费用</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
