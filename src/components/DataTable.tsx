import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Eye, 
  Info,
  Building2,
  MapPin,
  Landmark,
  User,
  GraduationCap
} from 'lucide-react';
import { Respondent } from '../types';

interface DataTableProps {
  data: Respondent[];
  onSelectRow?: (respondent: Respondent) => void;
}

type SortField = 'id' | 'kabupaten' | 'kecamatan' | 'sekolah' | 'nama' | 'jenisKelamin' | 'posisiJabatan' | 'gugus' | 'score';
type SortOrder = 'asc' | 'desc';

export const DataTable: React.FC<DataTableProps> = ({ data, onSelectRow }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Sort logic
  const sortedData = useMemo(() => {
    const list = [...data];
    list.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'score') {
        aVal = a.numericScore;
        bVal = b.numericScore;
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal, 'id') 
          : bVal.localeCompare(aVal, 'id');
      }

      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
    return list;
  }, [data, sortField, sortOrder]);

  // Pagination calculation
  const totalPages = Math.max(Math.ceil(sortedData.length / pageSize), 1);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, safeCurrentPage, pageSize]);

  return (
    <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden mb-8">
      {/* Table Top Controls */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Tabel Data Survei Kompetensi Pembelajaran Literasi
            </h4>
            <p className="text-xs text-slate-500">
              Menampilkan {paginatedData.length > 0 ? (safeCurrentPage - 1) * pageSize + 1 : 0} -{' '}
              {Math.min(safeCurrentPage * pageSize, sortedData.length)} dari {sortedData.length} responden
            </p>
          </div>
        </div>

        {/* Page size dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-600">
          <span>Baris per halaman:</span>
          <select
            id="select-page-size"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 font-bold bg-gray-50 border border-gray-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 border-b border-gray-100 font-bold select-none text-[11px] uppercase tracking-wider">
              {/* 1. Nomor */}
              <th 
                onClick={() => handleSort('id')}
                className="py-3.5 px-3.5 text-center cursor-pointer hover:bg-gray-100 transition-colors w-14"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>No</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* 2. Kabupaten */}
              <th 
                onClick={() => handleSort('kabupaten')}
                className="py-3.5 px-3 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <Landmark className="w-3 h-3 text-indigo-500" />
                  <span>Kabupaten</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* 3. Kecamatan */}
              <th 
                onClick={() => handleSort('kecamatan')}
                className="py-3.5 px-3 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-500" />
                  <span>Kecamatan</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* 4. Nama Sekolah (Unit Kerja) */}
              <th 
                onClick={() => handleSort('sekolah')}
                className="py-3.5 px-3 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-emerald-500" />
                  <span>Nama Sekolah (Unit Kerja)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* 5. Nama Guru */}
              <th 
                onClick={() => handleSort('nama')}
                className="py-3.5 px-3 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 text-indigo-500" />
                  <span>Nama Guru</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* 6. Jenis Kelamin */}
              <th 
                onClick={() => handleSort('jenisKelamin')}
                className="py-3.5 px-3 text-center cursor-pointer hover:bg-gray-100 transition-colors w-28"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Jenis Kelamin</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* 7. Posisi / Jabatan */}
              <th 
                onClick={() => handleSort('posisiJabatan')}
                className="py-3.5 px-3 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Posisi / Jabatan</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* 8. Gugus / KKMI */}
              <th 
                onClick={() => handleSort('gugus')}
                className="py-3 px-3 text-center cursor-pointer hover:bg-slate-200/70 transition-colors w-28"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Gugus / KKMI</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Action Column */}
              <th className="py-3 px-3 text-center w-20">
                <span>Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <Info className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-600">Tidak ada data yang sesuai filter</p>
                  <p className="text-xs text-slate-400 mt-1">Coba ubah kata kunci atau reset filter kabupaten/kecamatan/sekolah.</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => {
                const actualIndex = (safeCurrentPage - 1) * pageSize + index + 1;
                const isFemale = item.jenisKelamin?.toLowerCase().includes('perempuan');
                const isMale = item.jenisKelamin?.toLowerCase().includes('laki');

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/50 transition-colors group cursor-pointer"
                    onClick={() => onSelectRow && onSelectRow(item)}
                  >
                    {/* 1. Nomor */}
                    <td className="py-3 px-3.5 text-center font-bold text-slate-500">
                      {actualIndex}
                    </td>

                    {/* 2. Kolom Kabupaten */}
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-medium border border-indigo-100">
                        {item.kabupaten || 'Lombok Tengah'}
                      </span>
                    </td>

                    {/* 3. Kolom Kecamatan */}
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                        {item.kecamatan || 'Tidak Tercantum'}
                      </span>
                    </td>

                    {/* 4. Kolom Nama Sekolah */}
                    <td className="py-3 px-3 font-medium text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="line-clamp-1">{item.sekolah || '-'}</span>
                      </div>
                    </td>

                    {/* 5. Kolom Nama Guru */}
                    <td className="py-3 px-3 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.nama || '-'}
                    </td>

                    {/* 6. Kolom Jenis Kelamin */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`
                          inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border
                          ${isFemale 
                            ? 'bg-pink-50 text-pink-700 border-pink-200' 
                            : isMale 
                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                          }
                        `}
                      >
                        {item.jenisKelamin || '-'}
                      </span>
                    </td>

                    {/* 6. Kolom Posisi / Jabatan */}
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium text-[11px] border border-indigo-100">
                        {item.posisiJabatan || '-'}
                      </span>
                    </td>

                    {/* 7. Kolom Gugus / KKMI */}
                    <td className="py-3 px-3 text-center text-slate-600 font-medium">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[11px] border border-amber-200">
                        {item.gugus || '-'}
                      </span>
                    </td>

                    {/* Detail Action */}
                    <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectRow && onSelectRow(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Lihat Detail Responden"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 sm:p-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
        <div className="text-xs text-slate-500 font-medium">
          Halaman <strong className="text-slate-800 font-bold">{safeCurrentPage}</strong> dari{' '}
          <strong className="text-slate-800 font-bold">{totalPages}</strong> ({sortedData.length} total responden)
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={safeCurrentPage === 1}
            className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 text-slate-600 hover:bg-gray-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
            title="Halaman Pertama"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={safeCurrentPage === 1}
            className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 text-slate-600 hover:bg-gray-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Quick Page Jump indicators */}
          <div className="flex items-center gap-1 px-1">
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {safeCurrentPage}
            </span>
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={safeCurrentPage === totalPages}
            className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 text-slate-600 hover:bg-gray-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
            title="Halaman Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={safeCurrentPage === totalPages}
            className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 text-slate-600 hover:bg-gray-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
            title="Halaman Terakhir"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
