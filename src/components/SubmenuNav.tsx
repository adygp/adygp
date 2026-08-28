import React from 'react';
import { BookCheck, Building2, Eye } from 'lucide-react';
import { LombokSubmenuKey } from '../types';

interface SubmenuNavProps {
  activeSubmenu: LombokSubmenuKey;
  onSelectSubmenu: (key: LombokSubmenuKey) => void;
  totalRespondents?: number;
}

export const SubmenuNav: React.FC<SubmenuNavProps> = ({
  activeSubmenu,
  onSelectSubmenu,
  totalRespondents = 0
}) => {
  const submenus = [
    {
      key: 'kompetensi' as LombokSubmenuKey,
      title: 'Survei Kompetensi Literasi',
      badge: `${totalRespondents} Data`,
      icon: BookCheck,
      isReady: true
    },
    {
      key: 'surlingjar' as LombokSubmenuKey,
      title: 'Surlingjar',
      badge: 'Menyusul',
      icon: Building2,
      isReady: false
    },
    {
      key: 'observasi' as LombokSubmenuKey,
      title: 'Observasi Pembelajaran',
      badge: 'Menyusul',
      icon: Eye,
      isReady: false
    }
  ];

  return (
    <div className="mb-2.5">
      {/* Sleek Minimalist Segmented Tab Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 overflow-x-auto">
        {submenus.map((item) => {
          const Icon = item.icon;
          const isActive = activeSubmenu === item.key;

          return (
            <button
              key={item.key}
              id={`submenu-tab-${item.key}`}
              onClick={() => onSelectSubmenu(item.key)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0
                ${isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }
              `}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.title}</span>
              <span
                className={`
                  text-[10px] font-semibold px-1.5 py-0.2 rounded-md
                  ${isActive 
                    ? 'bg-white/20 text-white' 
                    : item.isReady 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-slate-200 text-slate-600'
                  }
                `}
              >
                {item.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

