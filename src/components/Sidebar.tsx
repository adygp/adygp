import React from 'react';
import { 
  MapPin, 
  Layers, 
  BarChart3, 
  Compass, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { MainMenuKey } from '../types';

interface SidebarProps {
  activeMenu: MainMenuKey;
  onSelectMenu: (menu: MainMenuKey) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsedDesktop: boolean;
  onToggleDesktop: () => void;
}

interface MenuItemConfig {
  key: MainMenuKey;
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  isReady: boolean;
}

export const MENU_ITEMS: MenuItemConfig[] = [
  {
    key: 'lombok',
    label: 'Lombok',
    sublabel: 'Aktif (3 Submenu)',
    icon: MapPin,
    isReady: true
  },
  {
    key: 'dompu',
    label: 'Dompu',
    sublabel: 'Tahap Input Data',
    icon: Compass,
    isReady: false
  },
  {
    key: 'bima',
    label: 'Bima',
    sublabel: 'Tahap Input Data',
    icon: MapPin,
    isReady: false
  },
  {
    key: 'numerasi',
    label: 'Numerasi',
    sublabel: 'Tahap Input Data',
    icon: BarChart3,
    isReady: false
  },
  {
    key: 'nonprioritas',
    label: 'Nonprioritas',
    sublabel: 'Tahap Input Data',
    icon: Layers,
    isReady: false
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  onSelectMenu,
  isOpenMobile,
  onCloseMobile,
  isCollapsedDesktop,
  onToggleDesktop
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        id="main-sidebar"
        className={`
          fixed top-0 bottom-0 left-0 z-50 flex flex-col
          bg-[#1E293B] text-white
          border-r border-slate-700/80 shadow-2xl transition-all duration-300 ease-in-out
          ${isOpenMobile ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsedDesktop ? 'lg:w-20' : 'lg:w-64'}
        `}
      >
        {/* Sidebar Header Brand */}
        <div className="p-4 sm:p-5 border-b border-slate-700/80 flex items-center justify-between min-h-[72px]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/30 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            {!isCollapsedDesktop && (
              <div className="transition-opacity duration-200">
                <h1 className="text-white font-bold text-xs uppercase tracking-wider leading-tight">
                  Dashboard Baseline Literasi dan Numerasi
                </h1>
              </div>
            )}
          </div>

          {/* Close button on Mobile */}
          <button
            id="btn-close-mobile-sidebar"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Header: Pilih Kabupaten/Tujuan */}
        <div className="px-4 pt-4 pb-2">
          {!isCollapsedDesktop ? (
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Pilih Kabupaten/Tujuan
            </p>
          ) : (
            <div className="h-4 flex items-center justify-center">
              <div className="w-4 h-0.5 bg-slate-700 rounded-full" />
            </div>
          )}
        </div>

        {/* Menu Navigation Items */}
        <nav className="flex-1 px-3 py-1 space-y-2 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.key;

            return (
              <button
                key={item.key}
                id={`sidebar-menu-${item.key}`}
                onClick={() => {
                  onSelectMenu(item.key);
                  if (window.innerWidth < 1024) {
                    onCloseMobile();
                  }
                }}
                title={isCollapsedDesktop ? item.label : undefined}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150 cursor-pointer
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_0_0_#1E40AF] transform -translate-y-0.5 font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white font-medium'
                  }
                `}
              >
                <span
                  className={`
                    w-2 h-2 rounded-full shrink-0 transition-colors
                    ${isActive ? 'bg-white' : item.isReady ? 'bg-emerald-400' : 'bg-slate-500'}
                  `}
                />

                {!isCollapsedDesktop ? (
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <span className="text-xs tracking-wide">{item.label}</span>
                    {item.isReady ? (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-emerald-300'}`}>
                        Aktif
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">
                        Input
                      </span>
                    )}
                  </div>
                ) : (
                  <Icon className="w-4 h-4 text-slate-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Banner & Desktop Collapse Toggle */}
        <div className="p-4 border-t border-slate-700/80 bg-slate-900/50 mt-auto">
          {!isCollapsedDesktop && (
            <div className="p-2.5 mb-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-300 mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Google Sheet</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Wilayah aktif: <span className="text-white font-medium">Lombok (ArrayKom)</span>
              </p>
            </div>
          )}

          {/* Desktop Toggle Button */}
          <button
            id="btn-toggle-desktop-sidebar"
            onClick={onToggleDesktop}
            className="w-full py-2 bg-slate-700 hover:bg-slate-650 text-slate-300 hover:text-white text-xs font-semibold rounded-lg border-b-2 border-slate-900 transition-all active:translate-y-0.5 active:border-b-0 hidden lg:flex items-center justify-center gap-2"
            title={isCollapsedDesktop ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            {isCollapsedDesktop ? (
              <ChevronRight className="w-4 h-4 text-blue-400" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
