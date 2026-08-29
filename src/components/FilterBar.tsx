import React from 'react';
import { 
  Search, 
  RotateCcw, 
  X,
  FileText,
  Filter
} from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  kabupatenList: string[];
  kecamatanList: string[];
  sekolahList: string[];
  onExportExcel: () => void;
  onExportPDF: () => void;
  filteredCount: number;
  totalCount: number;
  submenuType?: 'kompetensi' | 'surlingjar' | 'observasi';
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  kabupatenList,
  kecamatanList,
  sekolahList,
  onExportPDF,
  filteredCount,
  totalCount,
  submenuType = 'kompetensi'
}) => {
  const hasActiveFilters = Boolean(
    filters.kabupaten || filters.kecamatan || filters.sekolah || filters.search || filters.jenisKelamin || filters.posisi
  );

  const searchPlaceholder = submenuType === 'observasi'
    ? 'Cari observer, guru, sekolah, waktu...'
    : submenuType === 'surlingjar'
    ? 'Cari nama, sekolah, kecamatan...'
    : 'Cari Nama Responden, Sekolah, Gugus...';

  return (
    <div className="bg-white border-b border-slate-200/80 px-3 sm:px-6 py-2.5">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
        {/* Left Filters Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {/* 1. Search Bar */}
          <div className="relative">
            <input
              id="filter-input-search"
              type="text"
              placeholder={searchPlaceholder}
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all placeholder:text-slate-400 font-medium"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            {filters.search && (
              <button
                onClick={() => onFilterChange({ search: '' })}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 2. Filter Kecamatan */}
          <div className="relative">
            <select
              id="filter-select-kecamatan"
              value={filters.kecamatan}
              onChange={(e) => onFilterChange({ kecamatan: e.target.value, sekolah: '' })}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 transition-all font-medium cursor-pointer"
            >
              <option value="">Semua Kecamatan ({kecamatanList.length})</option>
              {kecamatanList.map((kec) => (
                <option key={kec} value={kec}>
                  {kec}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Filter Sekolah */}
          <div className="relative">
            <select
              id="filter-select-sekolah"
              value={filters.sekolah}
              onChange={(e) => onFilterChange({ sekolah: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 transition-all font-medium cursor-pointer"
            >
              <option value="">Semua Sekolah ({sekolahList.length})</option>
              {sekolahList.map((sch) => (
                <option key={sch} value={sch}>
                  {sch}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Filter Gender (for Kompetensi & Surlingjar) or Reset */}
          {submenuType !== 'observasi' ? (
            <div className="relative">
              <select
                id="filter-select-gender"
                value={filters.jenisKelamin}
                onChange={(e) => onFilterChange({ jenisKelamin: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 transition-all font-medium cursor-pointer"
              >
                <option value="">Semua Gender</option>
                <option value="Perempuan">Perempuan</option>
                <option value="Laki-laki">Laki-laki</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center">
              {hasActiveFilters && (
                <button
                  onClick={onResetFilters}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 text-slate-500" />
                  <span>Reset Filter</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Section: Counter, Reset & PDF Export */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 text-xs">
          {hasActiveFilters && submenuType !== 'observasi' && (
            <button
              id="btn-reset-filters-main"
              onClick={onResetFilters}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
              title="Reset semua filter"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <div className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200/60">
            {filteredCount} / {totalCount} Data
          </div>

          <button
            id="btn-export-pdf"
            onClick={onExportPDF}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Download Laporan PDF"
          >
            <FileText className="w-3.5 h-3.5 text-rose-600" />
            <span>PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
