
import React from 'react';
import { ViewType } from '../types';
import { History, PlusCircle, BarChart3 } from 'lucide-react';

interface NavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2 safe-bottom z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <button 
          onClick={() => onViewChange('history')}
          className={`flex flex-col items-center p-2 transition-colors ${currentView === 'history' ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          <History size={24} />
          <span className="text-[10px] mt-1 font-medium">历史</span>
        </button>
        
        <button 
          onClick={() => onViewChange('add')}
          className={`flex flex-col items-center p-2 -mt-8 bg-emerald-600 rounded-full shadow-lg border-4 border-slate-50 transition-transform active:scale-95 ${currentView === 'add' ? 'text-white' : 'text-white'}`}
        >
          <PlusCircle size={32} />
        </button>
        
        <button 
          onClick={() => onViewChange('stats')}
          className={`flex flex-col items-center p-2 transition-colors ${currentView === 'stats' ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          <BarChart3 size={24} />
          <span className="text-[10px] mt-1 font-medium">统计</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
