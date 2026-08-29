import React from 'react';
import { 
  Menu, 
  RefreshCw, 
  FileSpreadsheet, 
  Code2, 
  GraduationCap
} from 'lucide-react';
import { MainMenuKey, LombokSubmenuKey } from '../types';

interface HeaderProps {
  activeMenu: MainMenuKey;
  activeSubmenu: LombokSubmenuKey;
  onSelectMenu: (menu: MainMenuKey) => void;
  onSelectSubmenu?: (sub: LombokSubmenuKey) => void;
  onRefreshData?: () => void;
  onExportExcel?: () => void;
  onOpenEmbedModal?: () => void;
  isLoading?: boolean;
  isUsingFallback?: boolean;
  lastUpdated?: Date | null;
  onToggleMobileSidebar?: () => void;
  totalRecords?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeMenu,
  activeSubmenu,
  onSelectMenu,
  onSelectSubmenu,
  onRefreshData,
  onExportExcel,
  onOpenEmbedModal,
  isLoading = false,
  isUsingFallback = false,
  lastUpdated,
  onToggleMobileSidebar,
  totalRecords = 0
}) => {
  const getMenuBadge = () => {
    switch (activeMenu) {
      case 'lombok': return 'LOMBOK';
      case 'dompu': return 'DOMPU';
      case 'bima': return 'BIMA';
      case 'numerasi': return 'NUMERASI';
      case 'nonprioritas': return 'NONPRIORITAS';
      default: return 'SIGAP';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Section: Mobile Menu + Title & Badges */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            id="btn-toggle-sidebar-mobile"
            onClick={onToggleMobileSidebar}
            className="p-1.5 -ml-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900 tracking-tight truncate">
                  Baseline Literasi dan Numerasi
                </h1>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80 shrink-0">
                  {getMenuBadge()}
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SIGAP
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium truncate hidden xs:block">
                Sekolah/Madrasah Prioritas • Sistem Informasi & Asesmen Baseline
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Live Google Sheets status pill */}
          <div 
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isUsingFallback 
                ? 'bg-amber-50 text-amber-800 border-amber-200' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
            }`}
            title={lastUpdated ? `Pembaruan terakhir: ${lastUpdated.toLocaleTimeString('id-ID')}` : 'Sinkronisasi Aktif'}
          >
            <span className={`w-2 h-2 rounded-full ${isUsingFallback ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
            <span>{isUsingFallback ? 'Data Tersimpan' : 'Live Google Sheets'}</span>
          </div>

          {/* Sync / Refresh Button */}
          {onRefreshData && (
            <button
              id="btn-refresh-data"
              onClick={onRefreshData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              title="Muat Ulang Data Terbaru dari Google Sheets"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isLoading ? 'Sinkron...' : 'Sinkron Data'}</span>
            </button>
          )}

          {/* Export Excel Button */}
          {onExportExcel && (
            <button
              id="btn-export-excel"
              onClick={onExportExcel}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Download Seluruh Data ke Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Excel</span>
            </button>
          )}

          {/* Embed / Google Sites Code Button */}
          {onOpenEmbedModal && (
            <button
              id="btn-embed-modal"
              onClick={onOpenEmbedModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-all active:scale-95 cursor-pointer"
              title="Salin Kode Embed untuk Google Sites"
            >
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden md:inline">Embed</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
