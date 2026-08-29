import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Eye, 
  Search,
  X,
  Building2,
  MapPin,
  Landmark,
  User,
  GraduationCap,
  Users,
  Calendar,
  Clock,
  UserCheck
} from 'lucide-react';
import { Respondent } from '../types';

interface DataTableProps {
  data: Respondent[];
  submenuType?: 'kompetensi' | 'surlingjar' | 'observasi';
  onSelectRow?: (respondent: Respondent) => void;
}

type SortField = 
  | 'id' 
  | 'kabupaten' 
  | 'kecamatan' 
  | 'sekolah' 
  | 'nama' 
  | 'namaObserver' 
  | 'namaGuru' 
  | 'jumlahMurid' 
  | 'hariTanggal' 
  | 'waktu' 
  | 'jenisKelamin' 
  | 'posisiJabatan' 
  | 'gugus' 
  | 'score';

type SortOrder = 'asc' | 'desc';

export const DataTable: React.FC<DataTableProps> = ({ data, submenuType = 'kompetensi', onSelectRow }) => {
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

  const isSurlingjar = submenuType === 'surlingjar';
  const isObservasi = submenuType === 'observasi';

  const renderScoreBadge = (scoreStr: string, numScore: number) => {
    if (!scoreStr || scoreStr === '-') return <span className="text-slate-400">-</span>;
    
    // Determine score style based on score value
    if (numScore < 50) {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
          {scoreStr}
        </span>
      );
    }
    if (numScore < 70) {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          {scoreStr}
        </span>
      );
    }
    return (
      <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        {scoreStr}
      </span>
    );
  };

  return (
    <div className="bg-white border-t border-slate-200 overflow-hidden">
      {/* Top Controls & Pagination summary */}
      <div className="p-3 sm:px-6 py-2.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div className="text-xs text-slate-500 font-medium">
          Menampilkan <strong className="text-slate-800 font-semibold">{paginatedData.length > 0 ? (safeCurrentPage - 1) * pageSize + 1 : 0}</strong> -{' '}
          <strong className="text-slate-800 font-semibold">{Math.min(safeCurrentPage * pageSize, sortedData.length)}</strong> dari{' '}
          <strong className="text-slate-800 font-semibold">{sortedData.length}</strong> total data
        </div>

        {/* Page size dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-600">
          <span>Baris:</span>
          <select
            id="select-page-size"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2.5 py-1 font-semibold bg-slate-50 border border-slate-200 rounded text-slate-700 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold select-none text-[11px] uppercase tracking-wider">
              {/* 1. NO */}
              <th 
                onClick={() => handleSort('id')}
                className="py-3.5 px-3.5 text-center cursor-pointer hover:bg-slate-100 transition-colors w-14"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>NO</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* OBSERVASI SPECIFIC COLUMNS */}
              {isObservasi ? (
                <>
                  {/* 2. NAMA OBSERVER */}
                  <th 
                    onClick={() => handleSort('namaObserver')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>NAMA OBSERVER</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 3. NAMA GURU */}
                  <th 
                    onClick={() => handleSort('namaGuru')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>NAMA GURU</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 4. SEKOLAH / SATUAN */}
                  <th 
                    onClick={() => handleSort('sekolah')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>SEKOLAH / SATUAN</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 5. KECAMATAN */}
                  <th 
                    onClick={() => handleSort('kecamatan')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>KECAMATAN</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 6. JUMLAH MURID */}
                  <th 
                    onClick={() => handleSort('jumlahMurid')}
                    className="py-3.5 px-4 text-center cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>JUMLAH MURID</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 7. HARI / TANGGAL */}
                  <th 
                    onClick={() => handleSort('hariTanggal')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>HARI / TANGGAL</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 8. WAKTU */}
                  <th 
                    onClick={() => handleSort('waktu')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>WAKTU</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                </>
              ) : isSurlingjar ? (
                /* SURLINGJAR COLUMNS */
                <>
                  {/* 2. NAMA RESPONDEN */}
                  <th 
                    onClick={() => handleSort('nama')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>NAMA RESPONDEN</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 3. SEKOLAH / SATUAN */}
                  <th 
                    onClick={() => handleSort('sekolah')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>SEKOLAH / SATUAN</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 4. KECAMATAN */}
                  <th 
                    onClick={() => handleSort('kecamatan')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>KECAMATAN</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 5. KABUPATEN */}
                  <th 
                    onClick={() => handleSort('kabupaten')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>KABUPATEN</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 6. JENIS KELAMIN */}
                  <th 
                    onClick={() => handleSort('jenisKelamin')}
                    className="py-3.5 px-4 text-center cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>JENIS KELAMIN</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                </>
              ) : (
                /* KOMPETENSI COLUMNS (Matches image.png exact columns) */
                <>
                  {/* 2. NAMA RESPONDEN */}
                  <th 
                    onClick={() => handleSort('nama')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>NAMA RESPONDEN</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 3. SEKOLAH / SATUAN */}
                  <th 
                    onClick={() => handleSort('sekolah')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>SEKOLAH / SATUAN</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 4. KECAMATAN */}
                  <th 
                    onClick={() => handleSort('kecamatan')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>KECAMATAN</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 5. GUGUS */}
                  <th 
                    onClick={() => handleSort('gugus')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>GUGUS</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 6. POSISI / JABATAN */}
                  <th 
                    onClick={() => handleSort('posisiJabatan')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>POSISI / JABATAN</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 7. SKOR */}
                  <th 
                    onClick={() => handleSort('score')}
                    className="py-3.5 px-4 text-center cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>SKOR</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                </>
              )}

              {/* AKSI */}
              <th className="py-3.5 px-4 text-center w-16">
                <span>AKSI</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={isObservasi ? 9 : isSurlingjar ? 7 : 8} className="py-12 text-center text-slate-400">
                  <p className="font-semibold text-slate-600 text-sm">Tidak ada data yang sesuai filter</p>
                  <p className="text-xs text-slate-400 mt-1">Silakan sesuaikan kata kunci atau reset filter.</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => {
                const actualIndex = (safeCurrentPage - 1) * pageSize + index + 1;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-sky-50/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectRow && onSelectRow(item)}
                  >
                    {/* 1. NO */}
                    <td className="py-3.5 px-3.5 text-center font-medium text-slate-400">
                      {actualIndex}
                    </td>

                    {/* OBSERVASI ROW DATA */}
                    {isObservasi ? (
                      <>
                        {/* Nama Observer */}
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {item.namaObserver || '-'}
                        </td>

                        {/* Nama Guru */}
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {item.namaGuru || item.nama || '-'}
                        </td>

                        {/* Sekolah */}
                        <td className="py-3.5 px-4 text-slate-700">
                          {item.sekolah || '-'}
                        </td>

                        {/* Kecamatan */}
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 font-semibold text-xs border border-blue-100">
                            {item.kecamatan || 'Tidak Tercantum'}
                          </span>
                        </td>

                        {/* Jumlah Murid */}
                        <td className="py-3.5 px-4 text-center font-bold text-emerald-700">
                          {item.jumlahMurid || '-'}
                        </td>

                        {/* Hari / Tanggal */}
                        <td className="py-3.5 px-4 text-slate-600">
                          {item.hariTanggal || '-'}
                        </td>

                        {/* Waktu */}
                        <td className="py-3.5 px-4 text-slate-600">
                          {item.waktu || '-'}
                        </td>
                      </>
                    ) : isSurlingjar ? (
                      /* SURLINGJAR ROW DATA */
                      <>
                        {/* Nama Responden */}
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {item.nama || '-'}
                        </td>

                        {/* Sekolah */}
                        <td className="py-3.5 px-4 text-slate-700">
                          {item.sekolah || '-'}
                        </td>

                        {/* Kecamatan */}
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 font-semibold text-xs border border-blue-100">
                            {item.kecamatan || 'Tidak Tercantum'}
                          </span>
                        </td>

                        {/* Kabupaten */}
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {item.kabupaten || 'Lombok Tengah'}
                        </td>

                        {/* Jenis Kelamin */}
                        <td className="py-3.5 px-4 text-center text-slate-600">
                          {item.jenisKelamin || '-'}
                        </td>
                      </>
                    ) : (
                      /* KOMPETENSI ROW DATA (Exact matching image.png) */
                      <>
                        {/* 2. NAMA RESPONDEN */}
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {item.nama || '-'}
                        </td>

                        {/* 3. SEKOLAH / SATUAN */}
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {item.sekolah || '-'}
                        </td>

                        {/* 4. KECAMATAN */}
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 font-semibold text-xs border border-blue-100">
                            {item.kecamatan || 'Tidak Tercantum'}
                          </span>
                        </td>

                        {/* 5. GUGUS */}
                        <td className="py-3.5 px-4 text-slate-600">
                          {item.gugus || '-'}
                        </td>

                        {/* 6. POSISI / JABATAN */}
                        <td className="py-3.5 px-4 text-slate-700">
                          {item.posisiJabatan || '-'}
                        </td>

                        {/* 7. SKOR */}
                        <td className="py-3.5 px-4 text-center">
                          {renderScoreBadge(item.score, item.numericScore)}
                        </td>
                      </>
                    )}

                    {/* AKSI */}
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectRow && onSelectRow(item)}
                        className="w-7 h-7 inline-flex items-center justify-center rounded-full text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
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
      <div className="p-3 sm:px-6 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
        <div className="text-xs text-slate-500 font-medium">
          Halaman <strong className="text-slate-800 font-semibold">{safeCurrentPage}</strong> dari{' '}
          <strong className="text-slate-800 font-semibold">{totalPages}</strong>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={safeCurrentPage === 1}
            className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all text-xs"
            title="Halaman Pertama"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={safeCurrentPage === 1}
            className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all text-xs"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Current Page */}
          <div className="flex items-center gap-1 px-1">
            <span className="w-8 h-8 rounded bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              {safeCurrentPage}
            </span>
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={safeCurrentPage === totalPages}
            className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all text-xs"
            title="Halaman Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={safeCurrentPage === totalPages}
            className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all text-xs"
            title="Halaman Terakhir"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
