import React from 'react';
import { BookmarkCheck, Building2, BookOpen } from 'lucide-react';
import { LombokSubmenuKey } from '../types';

interface SubmenuNavProps {
  activeSubmenu: LombokSubmenuKey;
  onSelectSubmenu: (key: LombokSubmenuKey) => void;
  totalRespondents?: number;
  kompetensiCount?: number;
  surlingjarCount?: number;
  observasiCount?: number;
}

export const SubmenuNav: React.FC<SubmenuNavProps> = ({
  activeSubmenu,
  onSelectSubmenu,
  kompetensiCount = 0,
  surlingjarCount = 0,
  observasiCount = 0
}) => {
  const tabs = [
    {
      key: 'kompetensi' as LombokSubmenuKey,
      title: 'Survei Kompetensi Literasi',
      icon: BookmarkCheck,
      count: kompetensiCount
    },
    {
      key: 'surlingjar' as LombokSubmenuKey,
      title: 'Surlingjar',
      icon: Building2,
      count: surlingjarCount
    },
    {
      key: 'observasi' as LombokSubmenuKey,
      title: 'Observasi Pembelajaran Literasi',
      icon: BookOpen,
      count: observasiCount
    }
  ];

  return (
    <div className="bg-white border-b border-slate-200/80 px-3 sm:px-6 py-2.5">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubmenu === tab.key;

          return (
            <button
              key={tab.key}
              id={`tab-${tab.key}`}
              onClick={() => onSelectSubmenu(tab.key)}
              className={`
                flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer
                ${isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }
              `}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tab.title}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
