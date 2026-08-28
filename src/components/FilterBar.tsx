import React from 'react';
import { 
  Search, 
  Filter, 
  FileSpreadsheet, 
  FileText, 
  RotateCcw, 
  X, 
  MapPin, 
  Landmark,
  School
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
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  kabupatenList,
  kecamatanList,
  sekolahList,
  onExportExcel,
  onExportPDF,
  filteredCount,
  totalCount
}) => {
  const hasActiveFilters = Boolean(
    filters.kabupaten || filters.kecamatan || filters.sekolah || filters.search || filters.jenisKelamin || filters.posisi
  );

  return (
    <div className="bg-white p-3 sm:p-3.5 rounded-2xl shadow-2xs border border-slate-200/80 mb-3.5">
      {/* Title, Count & Export Actions in a Compact Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight mr-2">
              Filter Data Responden
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              ({filteredCount} dari {totalCount})
            </span>
          </div>
        </div>

        {/* Action Buttons: Excel, PDF & Reset */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Unduh Excel */}
          <button
            id="btn-export-excel"
            onClick={onExportExcel}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Unduh data dalam format Microsoft Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>

          {/* Unduh PDF */}
          <button
            id="btn-export-pdf"
            onClick={onExportPDF}
            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Unduh laporan dalam format PDF"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          {/* Reset Filter Button */}
          {hasActiveFilters && (
            <button
              id="btn-reset-filters"
              onClick={onResetFilters}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg border border-slate-200/80 transition-all flex items-center gap-1 cursor-pointer"
              title="Kembalikan semua filter ke awal"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Inputs Grid: 4 Kolom (Kabupaten, Kecamatan, Sekolah, Cari) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {/* 1. Filter Kabupaten */}
        <div className="relative">
          <select
            id="filter-select-kabupaten"
            value={filters.kabupaten}
            onChange={(e) => onFilterChange({ kabupaten: e.target.value, kecamatan: '', sekolah: '' })}
            className="w-full pl-2.5 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1.5 focus:ring-blue-500 focus:bg-white text-slate-800 transition-all font-medium"
          >
            <option value="">Semua Kabupaten ({kabupatenList.length})</option>
            {kabupatenList.map((kab) => (
              <option key={kab} value={kab}>
                {kab}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Filter Kecamatan */}
        <div className="relative">
          <select
            id="filter-select-kecamatan"
            value={filters.kecamatan}
            onChange={(e) => onFilterChange({ kecamatan: e.target.value, sekolah: '' })}
            className="w-full pl-2.5 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1.5 focus:ring-blue-500 focus:bg-white text-slate-800 transition-all font-medium"
          >
            <option value="">Semua Kecamatan ({kecamatanList.length})</option>
            {kecamatanList.map((kec) => (
              <option key={kec} value={kec}>
                {kec}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Filter Sekolah / Satuan Pendidikan */}
        <div className="relative">
          <select
            id="filter-select-sekolah"
            value={filters.sekolah}
            onChange={(e) => onFilterChange({ sekolah: e.target.value })}
            className="w-full pl-2.5 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1.5 focus:ring-blue-500 focus:bg-white text-slate-800 transition-all font-medium"
          >
            <option value="">Semua Sekolah ({sekolahList.length})</option>
            {sekolahList.map((sch) => (
              <option key={sch} value={sch}>
                {sch}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Search / Cari */}
        <div className="relative">
          <input
            id="filter-input-search"
            type="text"
            placeholder="Cari Nama / Gugus..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-7 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1.5 focus:ring-blue-500 focus:bg-white text-slate-800 transition-all"
          />
          <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              title="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

