/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SubmenuNav } from './components/SubmenuNav';
import { StatCards } from './components/StatCards';
import { ChartsSection } from './components/ChartsSection';
import { FilterBar } from './components/FilterBar';
import { DataTable } from './components/DataTable';
import { DetailModal } from './components/DetailModal';
import { PlaceholderView } from './components/PlaceholderView';
import { fetchSpreadsheetData } from './utils/csvParser';
import { exportToExcel, exportToPDF } from './utils/exportUtils';
import { 
  MainMenuKey, 
  LombokSubmenuKey, 
  Respondent, 
  FilterState, 
  SummaryStats 
} from './types';
import initialDataJson from './data/initialData.json';

export default function App() {
  // Navigation States
  const [activeMenu, setActiveMenu] = useState<MainMenuKey>('lombok');
  const [activeSubmenu, setActiveSubmenu] = useState<LombokSubmenuKey>('kompetensi');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isCollapsedDesktop, setIsCollapsedDesktop] = useState<boolean>(false);

  // Data States
  const [respondents, setRespondents] = useState<Respondent[]>(() => {
    return (initialDataJson as Respondent[]).map((r, idx) => ({ ...r, id: idx + 1 }));
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  const [selectedRespondent, setSelectedRespondent] = useState<Respondent | null>(null);

  // Filter States
  const [filters, setFilters] = useState<FilterState>({
    kabupaten: '',
    kecamatan: '',
    sekolah: '',
    search: '',
    jenisKelamin: '',
    posisi: ''
  });

  // Load Data function
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchSpreadsheetData();
      if (data && data.length > 0) {
        setRespondents(data);
        setIsUsingFallback(false);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Error fetching live data:', err);
      setIsUsingFallback(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Extract distinct Kabupaten list
  const kabupatenList = useMemo(() => {
    const set = new Set<string>();
    respondents.forEach((item) => {
      if (item.kabupaten && item.kabupaten.trim() && item.kabupaten !== '-') {
        set.add(item.kabupaten.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'id'));
  }, [respondents]);

  // Extract distinct Kecamatan list (dependent on selected Kabupaten if any)
  const kecamatanList = useMemo(() => {
    const set = new Set<string>();
    respondents.forEach((item) => {
      if (filters.kabupaten && item.kabupaten !== filters.kabupaten) {
        return;
      }
      if (item.kecamatan && item.kecamatan.trim() && item.kecamatan !== 'Tidak Tercantum') {
        set.add(item.kecamatan.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'id'));
  }, [respondents, filters.kabupaten]);

  // Extract distinct Sekolah list (dependent on selected Kabupaten & Kecamatan if any)
  const sekolahList = useMemo(() => {
    const set = new Set<string>();
    respondents.forEach((item) => {
      if (filters.kabupaten && item.kabupaten !== filters.kabupaten) {
        return;
      }
      if (filters.kecamatan && item.kecamatan !== filters.kecamatan) {
        return;
      }
      if (item.sekolah && item.sekolah.trim() && item.sekolah !== '-') {
        set.add(item.sekolah.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'id'));
  }, [respondents, filters.kabupaten, filters.kecamatan]);

  // Filter respondents
  const filteredData = useMemo(() => {
    return respondents.filter((item) => {
      // 0. Filter Kabupaten
      if (filters.kabupaten && item.kabupaten !== filters.kabupaten) {
        return false;
      }

      // 1. Filter Kecamatan
      if (filters.kecamatan && item.kecamatan !== filters.kecamatan) {
        return false;
      }

      // 2. Filter Sekolah
      if (filters.sekolah && item.sekolah !== filters.sekolah) {
        return false;
      }

      // 3. Filter Jenis Kelamin
      if (filters.jenisKelamin && item.jenisKelamin !== filters.jenisKelamin) {
        return false;
      }

      // 4. Filter Posisi
      if (filters.posisi && item.posisiJabatan !== filters.posisi) {
        return false;
      }

      // 5. Search Text
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const matchNama = item.nama?.toLowerCase().includes(query);
        const matchSekolah = item.sekolah?.toLowerCase().includes(query);
        const matchKab = item.kabupaten?.toLowerCase().includes(query);
        const matchKec = item.kecamatan?.toLowerCase().includes(query);
        const matchGugus = item.gugus?.toLowerCase().includes(query);
        const matchPosisi = item.posisiJabatan?.toLowerCase().includes(query);
        const matchScore = item.score?.toLowerCase().includes(query);

        if (!matchNama && !matchSekolah && !matchKab && !matchKec && !matchGugus && !matchPosisi && !matchScore) {
          return false;
        }
      }

      return true;
    });
  }, [respondents, filters]);

  // Compute Summary Statistics
  const summaryStats: SummaryStats = useMemo(() => {
    const total = filteredData.length;
    const kecSet = new Set<string>();
    const schSet = new Set<string>();
    let totalL = 0;
    let totalP = 0;
    let scoreSum = 0;
    let scoreCount = 0;
    let high = 0;
    let low = total > 0 ? 100 : 0;

    filteredData.forEach((item) => {
      if (item.kecamatan && item.kecamatan !== 'Tidak Tercantum') {
        kecSet.add(item.kecamatan);
      }
      if (item.sekolah && item.sekolah !== '-') {
        schSet.add(item.sekolah);
      }
      if (item.jenisKelamin?.toLowerCase().includes('laki')) {
        totalL++;
      } else if (item.jenisKelamin?.toLowerCase().includes('perempuan')) {
        totalP++;
      }

      if (item.numericScore > 0) {
        scoreSum += item.numericScore;
        scoreCount++;
        if (item.numericScore > high) high = item.numericScore;
        if (item.numericScore < low) low = item.numericScore;
      }
    });

    return {
      total,
      totalKecamatan: kecSet.size,
      totalSekolah: schSet.size,
      totalLakiLaki: totalL,
      totalPerempuan: totalP,
      avgScore: scoreCount > 0 ? scoreSum / scoreCount : 0,
      highScore: high,
      lowScore: total > 0 ? low : 0
    };
  }, [filteredData]);

  // Filter Handlers
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      kabupaten: '',
      kecamatan: '',
      sekolah: '',
      search: '',
      jenisKelamin: '',
      posisi: ''
    });
  };

  // Export Handlers
  const handleExportExcel = () => {
    exportToExcel(filteredData, 'Data_Survei_Kompetensi_Literasi_Lombok');
  };

  const handleExportPDF = () => {
    exportToPDF(filteredData, filters, 'Laporan_Survei_Kompetensi_Literasi_Lombok');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* 1. Collapsible Responsive Sidebar */}
      <Sidebar
        activeMenu={activeMenu}
        onSelectMenu={(menu) => setActiveMenu(menu)}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        isCollapsedDesktop={isCollapsedDesktop}
        onToggleDesktop={() => setIsCollapsedDesktop((prev) => !prev)}
      />

      {/* 2. Main Content Area (Right of Sidebar) */}
      <div
        className={`
          flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out
          ${isCollapsedDesktop ? 'lg:pl-20' : 'lg:pl-72'}
        `}
      >
        {/* Top Sticky Header */}
        <Header
          activeMenu={activeMenu}
          activeSubmenu={activeSubmenu}
          onOpenMobileSidebar={() => setIsOpenMobile(true)}
          onRefreshData={loadData}
          isLoading={isLoading}
          lastUpdated={lastUpdated}
          totalRecords={respondents.length}
          isUsingFallback={isUsingFallback}
        />

        {/* Dynamic Main View */}
        <main className="flex-1 p-2.5 sm:p-4 max-w-7xl w-full mx-auto">
          {activeMenu === 'lombok' ? (
            <div>
              {/* Submenu Tabs (Placed in Content on the Right of Sidebar) */}
              <SubmenuNav
                activeSubmenu={activeSubmenu}
                onSelectSubmenu={(sub) => setActiveSubmenu(sub)}
                totalRespondents={respondents.length}
              />

              {/* Submenu 1: Survei Kompetensi Pembelajaran Literasi (Sheet ArrayKom) */}
              {activeSubmenu === 'kompetensi' && (
                <div className="space-y-2 sm:space-y-2.5">
                  {/* Compact Metrics Strip */}
                  <StatCards stats={summaryStats} totalUnfiltered={respondents.length} />

                  {/* Minimalist Visual Charts Section */}
                  <ChartsSection 
                    data={filteredData} 
                    onSelectKecamatanFilter={(kec) => handleFilterChange({ kecamatan: kec, sekolah: '' })}
                  />

                  {/* Filter & Export Bar */}
                  <FilterBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onResetFilters={handleResetFilters}
                    kabupatenList={kabupatenList}
                    kecamatanList={kecamatanList}
                    sekolahList={sekolahList}
                    onExportExcel={handleExportExcel}
                    onExportPDF={handleExportPDF}
                    filteredCount={filteredData.length}
                    totalCount={respondents.length}
                  />

                  {/* High Performance Table */}
                  <DataTable
                    data={filteredData}
                    onSelectRow={(item) => setSelectedRespondent(item)}
                  />
                </div>
              )}

              {/* Submenu 2: Surlingjar (Placeholder) */}
              {activeSubmenu === 'surlingjar' && (
                <PlaceholderView
                  type="submenu"
                  submenuKey="surlingjar"
                  onBackToLombok={() => setActiveSubmenu('kompetensi')}
                />
              )}

              {/* Submenu 3: Observasi Pembelajaran Literasi (Placeholder) */}
              {activeSubmenu === 'observasi' && (
                <PlaceholderView
                  type="submenu"
                  submenuKey="observasi"
                  onBackToLombok={() => setActiveSubmenu('kompetensi')}
                />
              )}
            </div>
          ) : (
            /* Other Main Menus (Dompu, Bima, Numerasi, Nonprioritas) */
            <PlaceholderView
              type="menu"
              menuKey={activeMenu}
              onBackToLombok={() => setActiveMenu('lombok')}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-slate-200 text-center text-xs text-slate-500 bg-white/70">
          <p>
            Dashboard Baseline Literasi dan Numerasi &bull; Sumber Data:{' '}
            <a 
              href="https://docs.google.com/spreadsheets/d/e/2PACX-1vRGGnQtDjDxSG3Sl2xS0JNcysnk6Tguh6qtWqcQzpuSS2cTgfEG7DUe-XleP7ctbdROx6zJEPecmQeT/pub?gid=582620741&single=true&output=csv" 
              target="_blank" 
              rel="noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              Google Spreadsheet (ArrayKom)
            </a>
          </p>
        </footer>
      </div>

      {/* Detail Modal */}
      <DetailModal
        respondent={selectedRespondent}
        onClose={() => setSelectedRespondent(null)}
      />
    </div>
  );
}
