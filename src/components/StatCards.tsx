import React from 'react';
import { Users, School, MapPin, Award, UserCheck, BookOpen } from 'lucide-react';
import { SummaryStats } from '../types';

interface StatCardsProps {
  stats: SummaryStats;
  totalUnfiltered: number;
  submenuType?: 'kompetensi' | 'surlingjar' | 'observasi';
}

export const StatCards: React.FC<StatCardsProps> = ({ stats, totalUnfiltered, submenuType = 'kompetensi' }) => {
  const isFiltered = stats.total !== totalUnfiltered;
  const isSurlingjar = submenuType === 'surlingjar';
  const isObservasi = submenuType === 'observasi';

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-2 sm:p-2.5 mb-2.5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-0 lg:divide-x lg:divide-slate-200/70">
        {/* 1. Total Responden / Sesi Observasi */}
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
            {isObservasi ? <BookOpen className="w-4 h-4" /> : <Users className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
                {stats.total.toLocaleString('id-ID')}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {isObservasi ? 'Sesi' : 'Guru'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium truncate">
              {isFiltered ? `Filter (${stats.total}/${totalUnfiltered})` : (isObservasi ? 'Total Sesi Observasi' : 'Total Responden')}
            </p>
          </div>
        </div>

        {/* 2. Kecamatan */}
        <div className="flex items-center gap-2.5 px-2 py-1 lg:pl-4">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
                {stats.totalKecamatan}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">Kecamatan</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium truncate">
              Wilayah Terdata
            </p>
          </div>
        </div>

        {/* 3. Sekolah */}
        <div className="flex items-center gap-2.5 px-2 py-1 lg:pl-4">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
            <School className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
                {stats.totalSekolah}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">Unit</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium truncate">
              {isSurlingjar || isObservasi ? 'Satuan SD / MI' : 'SD, MI & KKMI'}
            </p>
          </div>
        </div>

        {/* 4. Observer/Murid / Skor / Gender Distribution */}
        <div className="flex items-center gap-2.5 px-2 py-1 lg:pl-4">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 shrink-0">
            {isObservasi ? <UserCheck className="w-4 h-4" /> : <Award className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            {isObservasi ? (
              <>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm sm:text-base font-extrabold text-blue-700">
                    {stats.totalObserver || 0} <span className="text-[10px] text-slate-400 font-normal">Observer</span>
                  </span>
                  {stats.totalMurid ? (
                    <>
                      <span className="text-[11px] text-slate-300">·</span>
                      <span className="text-sm sm:text-base font-extrabold text-emerald-600">
                        {stats.totalMurid} <span className="text-[10px] text-slate-400 font-normal">Murid</span>
                      </span>
                    </>
                  ) : null}
                </div>
                <p className="text-[10px] text-slate-500 font-medium truncate">
                  Observer & Murid Terdampak
                </p>
              </>
            ) : isSurlingjar ? (
              <>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm sm:text-base font-extrabold text-pink-600">
                    {stats.totalPerempuan} <span className="text-[10px] text-slate-400 font-normal">P</span>
                  </span>
                  <span className="text-[11px] text-slate-300">·</span>
                  <span className="text-sm sm:text-base font-extrabold text-blue-600">
                    {stats.totalLakiLaki} <span className="text-[10px] text-slate-400 font-normal">L</span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium truncate">
                  Distribusi Gender
                </p>
              </>
            ) : (
              <>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
                    {stats.avgScore.toFixed(1)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">/100</span>
                  <span className="text-[10px] font-bold text-pink-600 ml-1">{stats.totalPerempuan}P</span>
                  <span className="text-[10px] text-slate-300">·</span>
                  <span className="text-[10px] font-bold text-blue-600">{stats.totalLakiLaki}L</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium truncate">
                  Rata-rata Skor Asesmen
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


