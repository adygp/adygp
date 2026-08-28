import React from 'react';
import { Menu, RefreshCw, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { MainMenuKey, LombokSubmenuKey } from '../types';

interface HeaderProps {
  activeMenu: MainMenuKey;
  activeSubmenu: LombokSubmenuKey;
  onOpenMobileSidebar: () => void;
  onRefreshData: () => void;
  isLoading: boolean;
  lastUpdated: Date | null;
  totalRecords: number;
  isUsingFallback: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeMenu,
  activeSubmenu,
  onOpenMobileSidebar,
  onRefreshData,
  isLoading,
  lastUpdated,
  totalRecords,
  isUsingFallback
}) => {
  const getMenuLabel = () => {
    switch (activeMenu) {
      case 'lombok': return 'Kabupaten Lombok';
      case 'dompu': return 'Kabupaten Dompu';
      case 'bima': return 'Kabupaten Bima';
      case 'numerasi': return 'Program Numerasi';
      case 'nonprioritas': return 'Wilayah Nonprioritas';
      default: return activeMenu;
    }
  };

  const getSubmenuLabel = () => {
    if (activeMenu !== 'lombok') return null;
    switch (activeSubmenu) {
      case 'kompetensi': return 'Survei Kompetensi Pembelajaran Literasi';
      case 'surlingjar': return 'Surlingjar';
      case 'observasi': return 'Observasi Pembelajaran Literasi';
      default: return activeSubmenu;
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/90 shadow-2xs px-3 sm:px-6 py-2 sm:py-2.5">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle & Breadcrumb */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            id="btn-open-mobile-sidebar"
            onClick={onOpenMobileSidebar}
            className="p-1.5 -ml-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-gray-100 lg:hidden transition-colors cursor-pointer"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 truncate">
              <span className="text-blue-600 font-extrabold">{getMenuLabel()}</span>
              {getSubmenuLabel() && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-600 truncate">{getSubmenuLabel()}</span>
                </>
              )}
            </div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight truncate">
              {activeMenu === 'lombok' 
                ? (activeSubmenu === 'kompetensi' ? 'Survei Kompetensi Pembelajaran Literasi (ArrayKom)' : getSubmenuLabel())
                : getMenuLabel()
              }
            </h2>
          </div>
        </div>

        {/* Right: Live Sync & Refresh Action */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-slate-700">
            {isUsingFallback ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-amber-700 text-[11px]">Snapshot Offline ({totalRecords})</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-700 text-[11px]">Live Sheet ({totalRecords})</span>
              </>
            )}
          </div>

          {/* Refresh button */}
          <button
            id="btn-refresh-spreadsheet-data"
            onClick={onRefreshData}
            disabled={isLoading}
            className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs font-bold rounded-lg border border-gray-300 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Muat Ulang Data dari Google Spreadsheet"
          >
            <RefreshCw className={`w-3 h-3 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline text-xs">{isLoading ? 'Memuat...' : 'Segarkan Data'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
