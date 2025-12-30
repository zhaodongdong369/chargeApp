
import React, { useState, useEffect } from 'react';
import { ViewType, ChargingRecord } from './types';
import { loadRecords, saveRecords } from './utils/storage';
import Navigation from './components/Navigation';
import RecordList from './components/RecordList';
import Dashboard from './components/Dashboard';
import AddRecord from './components/AddRecord';
import { Zap } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('history');
  const [records, setRecords] = useState<ChargingRecord[]>([]);

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  const handleAddRecord = (newRecord: Omit<ChargingRecord, 'id'>) => {
    const record: ChargingRecord = {
      ...newRecord,
      id: crypto.randomUUID(),
    };
    const updated = [record, ...records];
    setRecords(updated);
    saveRecords(updated);
    setCurrentView('history');
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm("确定要删除这条记录吗？")) {
      const updated = records.filter(r => r.id !== id);
      setRecords(updated);
      saveRecords(updated);
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-40 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-emerald-100 rounded-lg">
            <Zap size={20} className="text-emerald-600 fill-emerald-600" />
          </div>
          <h1 className="text-lg font-black text-slate-800 tracking-tight">电车充电管家</h1>
        </div>
        <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full uppercase">
          专业版
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 pt-6">
        {currentView === 'history' && (
          <RecordList records={records} onDelete={handleDeleteRecord} />
        )}
        
        {currentView === 'add' && (
          <AddRecord onAdd={handleAddRecord} onCancel={() => setCurrentView('history')} />
        )}
        
        {currentView === 'stats' && (
          <Dashboard records={records} />
        )}
      </main>

      {/* Floating Bottom Nav */}
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      {/* iOS style notch area padding */}
      <div className="h-6 bg-white safe-bottom"></div>
    </div>
  );
};

export default App;
