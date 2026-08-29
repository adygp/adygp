import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  Briefcase, 
  ChevronDown,
  ChevronUp,
  UserCheck,
  Building2
} from 'lucide-react';
import { Respondent, ChartDataPoint } from '../types';

interface ChartsSectionProps {
  data: Respondent[];
  submenuType?: 'kompetensi' | 'surlingjar' | 'observasi';
  onSelectKecamatanFilter?: (kec: string) => void;
  onSelectSekolahFilter?: (sekolah: string) => void;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  data,
  submenuType = 'kompetensi',
  onSelectKecamatanFilter,
  onSelectSekolahFilter
}) => {
  const isSurlingjar = submenuType === 'surlingjar';
  const isObservasi = submenuType === 'observasi';

  const [activeTab, setActiveTab] = useState<'kecamatan' | 'gender' | 'posisi' | 'sekolah' | 'observer'>('kecamatan');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  // 1. Data per Kecamatan
  const kecamatanCounts: Record<string, number> = {};
  data.forEach((item) => {
    const k = item.kecamatan || 'Tidak Tercantum';
    kecamatanCounts[k] = (kecamatanCounts[k] || 0) + 1;
  });

  const kecamatanData: ChartDataPoint[] = Object.entries(kecamatanCounts)
    .map(([name, value]) => ({
      name,
      value,
      percentage: data.length > 0 ? (value / data.length) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value);

  const maxKecamatanVal = Math.max(...kecamatanData.map((d) => d.value), 1);

  // 2. Data per Jenis Kelamin (for Kompetensi & Surlingjar)
  const genderCounts: Record<string, number> = {};
  data.forEach((item) => {
    const g = item.jenisKelamin || 'Lainnya';
    genderCounts[g] = (genderCounts[g] || 0) + 1;
  });

  const genderColors: Record<string, { bg: string; text: string; fill: string; barBg: string }> = {
    'Perempuan': {
      bg: 'bg-pink-50',
      text: 'text-pink-600',
      fill: 'bg-pink-500',
      barBg: 'bg-pink-100'
    },
    'Laki-laki': {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      fill: 'bg-blue-500',
      barBg: 'bg-blue-100'
    },
    'Lainnya': {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      fill: 'bg-emerald-500',
      barBg: 'bg-emerald-100'
    }
  };

  const genderData: ChartDataPoint[] = Object.entries(genderCounts).map(([name, value]) => ({
    name,
    value,
    percentage: data.length > 0 ? (value / data.length) * 100 : 0
  }));

  // 3. Data per Posisi/Jabatan (for Kompetensi)
  const posisiCounts: Record<string, number> = {};
  data.forEach((item) => {
    const p = item.posisiJabatan || 'Lainnya';
    posisiCounts[p] = (posisiCounts[p] || 0) + 1;
  });

  const posisiData: ChartDataPoint[] = Object.entries(posisiCounts)
    .map(([name, value]) => ({
      name,
      value,
      percentage: data.length > 0 ? (value / data.length) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value);

  const maxPosisiVal = Math.max(...posisiData.map((d) => d.value), 1);

  // 4. Data per Sekolah/Madrasah (Top SD/MI)
  const sekolahCounts: Record<string, number> = {};
  data.forEach((item) => {
    const s = item.sekolah || '-';
    if (s !== '-') {
      sekolahCounts[s] = (sekolahCounts[s] || 0) + 1;
    }
  });

  const sekolahData: ChartDataPoint[] = Object.entries(sekolahCounts)
    .map(([name, value]) => ({
      name,
      value,
      percentage: data.length > 0 ? (value / data.length) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 20);

  const maxSekolahVal = Math.max(...sekolahData.map((d) => d.value), 1);

  // 5. Data per Observer (for Observasi)
  const observerCounts: Record<string, number> = {};
  data.forEach((item) => {
    const obs = item.namaObserver || '-';
    if (obs !== '-') {
      observerCounts[obs] = (observerCounts[obs] || 0) + 1;
    }
  });

  const observerData: ChartDataPoint[] = Object.entries(observerCounts)
    .map(([name, value]) => ({
      name,
      value,
      percentage: data.length > 0 ? (value / data.length) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 20);

  const maxObserverVal = Math.max(...observerData.map((d) => d.value), 1);

  const chartTitle = isObservasi
    ? 'Statistik Visual Observasi Pembelajaran'
    : isSurlingjar 
    ? 'Statistik Visual Surlingjar' 
    : 'Statistik Visual Responden';

  return (
    <div className={`bg-white rounded-xl border border-slate-200/80 shadow-2xs transition-all mb-2.5 ${isCollapsed ? 'p-2 sm:p-2.5' : 'p-3 sm:p-4'}`}>
      {/* Header with Tab Switcher & Collapse Toggle */}
      <div className={`flex flex-wrap items-center justify-between gap-2 ${isCollapsed ? '' : 'pb-2.5 border-b border-slate-100'}`}>
        <div 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="p-1 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
            <BarChart3 className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
              {chartTitle}
            </span>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-semibold border border-blue-200/60">
              {data.length} Data
            </span>
          </div>
        </div>

        {/* Minimalist Tabs & Collapse Button */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/70">
            <button
              id="tab-chart-kecamatan"
              onClick={() => {
                setActiveTab('kecamatan');
                setIsCollapsed(false);
              }}
              className={`
                flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer
                ${activeTab === 'kecamatan' && !isCollapsed
                  ? 'bg-white text-blue-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
                }
              `}
            >
              <BarChart3 className="w-3 h-3" />
              <span>Kecamatan</span>
            </button>

            {isObservasi ? (
              <>
                <button
                  id="tab-chart-observer"
                  onClick={() => {
                    setActiveTab('observer');
                    setIsCollapsed(false);
                  }}
                  className={`
                    flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer
                    ${activeTab === 'observer' && !isCollapsed
                      ? 'bg-white text-blue-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                    }
                  `}
                >
                  <UserCheck className="w-3 h-3" />
                  <span>Observer</span>
                </button>

                <button
                  id="tab-chart-sekolah"
                  onClick={() => {
                    setActiveTab('sekolah');
                    setIsCollapsed(false);
                  }}
                  className={`
                    flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer
                    ${activeTab === 'sekolah' && !isCollapsed
                      ? 'bg-white text-blue-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                    }
                  `}
                >
                  <Building2 className="w-3 h-3" />
                  <span>SD/MI</span>
                </button>
              </>
            ) : isSurlingjar ? (
              <>
                <button
                  id="tab-chart-gender"
                  onClick={() => {
                    setActiveTab('gender');
                    setIsCollapsed(false);
                  }}
                  className={`
                    flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer
                    ${activeTab === 'gender' && !isCollapsed
                      ? 'bg-white text-blue-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                    }
                  `}
                >
                  <PieIcon className="w-3 h-3" />
                  <span>Gender</span>
                </button>

                <button
                  id="tab-chart-sekolah"
                  onClick={() => {
                    setActiveTab('sekolah');
                    setIsCollapsed(false);
                  }}
                  className={`
                    flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer
                    ${activeTab === 'sekolah' && !isCollapsed
                      ? 'bg-white text-blue-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                    }
                  `}
                >
                  <Briefcase className="w-3 h-3" />
                  <span>SD/MI</span>
                </button>
              </>
            ) : (
              <>
                <button
                  id="tab-chart-gender"
                  onClick={() => {
                    setActiveTab('gender');
                    setIsCollapsed(false);
                  }}
                  className={`
                    flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer
                    ${activeTab === 'gender' && !isCollapsed
                      ? 'bg-white text-blue-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                    }
                  `}
                >
                  <PieIcon className="w-3 h-3" />
                  <span>Gender</span>
                </button>

                <button
                  id="tab-chart-posisi"
                  onClick={() => {
                    setActiveTab('posisi');
                    setIsCollapsed(false);
                  }}
                  className={`
                    flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer
                    ${activeTab === 'posisi' && !isCollapsed
                      ? 'bg-white text-blue-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                    }
                  `}
                >
                  <Briefcase className="w-3 h-3" />
                  <span>Jabatan</span>
                </button>
              </>
            )}
          </div>

          {/* Toggle Sembunyikan / Tampilkan */}
          <button
            id="btn-toggle-chart-collapse"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
            title={isCollapsed ? 'Tampilkan Detail Grafik' : 'Sembunyikan Grafik'}
          >
            <span className="text-[11px]">{isCollapsed ? 'Buka Grafik' : 'Tutup'}</span>
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Chart Body (Collapsible & Ultra-Compact) */}
      {!isCollapsed && (
        <div className="pt-2.5">
          {/* View 1: Kecamatan */}
          {activeTab === 'kecamatan' && (
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 px-0.5">
                <span>Klik nama kecamatan untuk memfilter tabel langsung</span>
                <span className="text-slate-500 font-medium hidden sm:inline">Urutan Data Tertinggi</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 max-h-44 sm:max-h-48 overflow-y-auto pr-1">
                {kecamatanData.map((item, index) => {
                  const widthPct = Math.max((item.value / maxKecamatanVal) * 100, 3);

                  return (
                    <div
                      key={item.name}
                      onClick={() => onSelectKecamatanFilter && onSelectKecamatanFilter(item.name)}
                      className="group p-1.5 sm:p-2 rounded-xl bg-slate-50/70 hover:bg-blue-50/80 border border-slate-100 hover:border-blue-200 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                          <span className="w-4 h-4 rounded text-[10px] font-bold bg-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-slate-800 group-hover:text-blue-700 truncate">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 shrink-0">
                          <strong className="text-blue-600 font-bold">{item.value}</strong>
                          <span className="text-slate-400 ml-1">({item.percentage?.toFixed(1)}%)</span>
                        </div>
                      </div>

                      {/* Ultra-sleek Thin Bar */}
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 group-hover:bg-blue-700 rounded-full transition-all duration-300"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* View 2: Gender Breakdown */}
          {activeTab === 'gender' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-1">
              {genderData.map((item) => {
                const theme = genderColors[item.name] || genderColors['Lainnya'];
                return (
                  <div
                    key={item.name}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-bold ${theme.text}`}>
                        {item.name}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {item.percentage?.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-xl font-extrabold text-slate-900">
                        {item.value} <span className="text-xs font-normal text-slate-400">Guru</span>
                      </span>
                    </div>

                    <div className={`h-1.5 w-full ${theme.barBg} rounded-full overflow-hidden`}>
                      <div
                        className={`h-full ${theme.fill} rounded-full transition-all duration-300`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* View 3: Observer Ranking (Observasi) */}
          {activeTab === 'observer' && isObservasi && (
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 px-0.5">
                <span>Daftar observer dengan jumlah aktivitas observasi</span>
                <span className="text-slate-500 font-medium hidden sm:inline">Top Observer</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 max-h-44 sm:max-h-48 overflow-y-auto pr-1 py-1">
                {observerData.map((item, index) => {
                  const widthPct = Math.max((item.value / maxObserverVal) * 100, 3);

                  return (
                    <div
                      key={item.name}
                      className="group p-1.5 sm:p-2 rounded-xl bg-slate-50/70 hover:bg-blue-50/80 border border-slate-100 hover:border-blue-200 transition-all"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                          <span className="w-4 h-4 rounded text-[10px] font-bold bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-slate-800 group-hover:text-blue-700 truncate">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 shrink-0">
                          <strong className="text-blue-600 font-bold">{item.value}</strong>
                          <span className="text-slate-400 ml-1">Observasi ({item.percentage?.toFixed(1)}%)</span>
                        </div>
                      </div>

                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 group-hover:bg-blue-700 rounded-full transition-all duration-300"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* View 4: Posisi / Jabatan (Kompetensi) */}
          {activeTab === 'posisi' && !isSurlingjar && !isObservasi && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 max-h-44 sm:max-h-48 overflow-y-auto pr-1 py-1">
              {posisiData.map((item, index) => {
                const widthPct = Math.max((item.value / maxPosisiVal) * 100, 3);

                return (
                  <div
                    key={item.name}
                    className="p-1.5 sm:p-2 rounded-xl bg-slate-50/70 hover:bg-indigo-50/80 border border-slate-100 hover:border-indigo-200 transition-all"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                        <span className="w-4 h-4 rounded text-[10px] font-bold bg-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <span className="font-semibold text-slate-800 truncate">
                          {item.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 shrink-0">
                        <strong className="text-indigo-600 font-bold">{item.value}</strong>
                        <span className="text-slate-400 ml-1">({item.percentage?.toFixed(1)}%)</span>
                      </div>
                    </div>

                    {/* Ultra-sleek Thin Bar */}
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* View 5: Top Sekolah / Madrasah (Surlingjar & Observasi) */}
          {activeTab === 'sekolah' && (isSurlingjar || isObservasi) && (
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 px-0.5">
                <span>Klik nama sekolah/madrasah untuk memfilter tabel langsung</span>
                <span className="text-slate-500 font-medium hidden sm:inline">Top Satuan Pendidikan</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 max-h-44 sm:max-h-48 overflow-y-auto pr-1 py-1">
                {sekolahData.map((item, index) => {
                  const widthPct = Math.max((item.value / maxSekolahVal) * 100, 3);

                  return (
                    <div
                      key={item.name}
                      onClick={() => onSelectSekolahFilter && onSelectSekolahFilter(item.name)}
                      className="group p-1.5 sm:p-2 rounded-xl bg-slate-50/70 hover:bg-emerald-50/80 border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                          <span className="w-4 h-4 rounded text-[10px] font-bold bg-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-slate-800 group-hover:text-emerald-700 truncate">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 shrink-0">
                          <strong className="text-emerald-600 font-bold">{item.value}</strong>
                          <span className="text-slate-400 ml-1">({item.percentage?.toFixed(1)}%)</span>
                        </div>
                      </div>

                      {/* Ultra-sleek Thin Bar */}
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 group-hover:bg-emerald-700 rounded-full transition-all duration-300"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

