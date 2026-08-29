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
import { EmbedModal } from './components/EmbedModal';
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
import initialSurlingjarDataJson from './data/initialSurlingjarData.json';
import initialObservasiDataJson from './data/initialObservasiData.json';

export default function App() {
  // Navigation & Layout States
  const [activeMenu, setActiveMenu] = useState<MainMenuKey>('lombok');
  const [activeSubmenu, setActiveSubmenu] = useState<LombokSubmenuKey>('kompetensi');
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState<boolean>(false);
  const [isSidebarDesktopCollapsed, setIsSidebarDesktopCollapsed] = useState<boolean>(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState<boolean>(false);

  // Cached Datasets
  const [kompetensiList, setKompetensiList] = useState<Respondent[]>(() => {
    return (initialDataJson as unknown as Respondent[]).map((r, idx) => ({ ...r, id: idx + 1 }));
  });
  const [surlingjarList, setSurlingjarList] = useState<Respondent[]>(() => {
    return (initialSurlingjarDataJson as unknown as Respondent[]).map((r, idx) => ({ ...r, id: idx + 1 }));
  });
  const [observasiList, setObservasiList] = useState<Respondent[]>(() => {
    return (initialObservasiDataJson as unknown as Respondent[]).map((r, idx) => ({ ...r, id: idx + 1 }));
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  const [selectedRespondent, setSelectedRespondent] = useState<Respondent | null>(null);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    kabupaten: '',
    kecamatan: '',
    sekolah: '',
    search: '',
    jenisKelamin: '',
    posisi: ''
  });

  // Current active raw dataset
  const currentRespondents = useMemo(() => {
    if (activeSubmenu === 'observasi') {
      return observasiList;
    }
    if (activeSubmenu === 'surlingjar') {
      return surlingjarList;
    }
    return kompetensiList;
  }, [activeSubmenu, observasiList, surlingjarList, kompetensiList]);

  // Load Data function for specific submenu
  const loadData = useCallback(async (type?: LombokSubmenuKey) => {
    const targetType = type || activeSubmenu;
    setIsLoading(true);
    try {
      const data = await fetchSpreadsheetData(targetType);
      if (data && data.length > 0) {
        if (targetType === 'observasi') {
          setObservasiList(data);
        } else if (targetType === 'surlingjar') {
          setSurlingjarList(data);
        } else {
          setKompetensiList(data);
        }
        setIsUsingFallback(false);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error(`Error fetching live data for ${targetType}:`, err);
      setIsUsingFallback(true);
    } finally {
      setIsLoading(false);
    }
  }, [activeSubmenu]);

  // Initial fetch on mount / submenu change
  useEffect(() => {
    loadData(activeSubmenu);
  }, [activeSubmenu, loadData]);

  // Submenu Switch Handler
  const handleSelectSubmenu = (sub: LombokSubmenuKey) => {
    setActiveSubmenu(sub);
    setFilters({
      kabupaten: '',
      kecamatan: '',
      sekolah: '',
      search: '',
      jenisKelamin: '',
      posisi: ''
    });
  };

  // Distinct Kabupaten list
  const kabupatenList = useMemo(() => {
    const set = new Set<string>();
    currentRespondents.forEach((item) => {
      if (item.kabupaten && item.kabupaten.trim() && item.kabupaten !== '-') {
        set.add(item.kabupaten.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'id'));
  }, [currentRespondents]);

  // Distinct Kecamatan list
  const kecamatanList = useMemo(() => {
    const set = new Set<string>();
    currentRespondents.forEach((item) => {
      if (filters.kabupaten && item.kabupaten !== filters.kabupaten) {
        return;
      }
      if (item.kecamatan && item.kecamatan.trim() && item.kecamatan !== 'Tidak Terdata') {
        set.add(item.kecamatan.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'id'));
  }, [currentRespondents, filters.kabupaten]);

  // Distinct Sekolah list
  const sekolahList = useMemo(() => {
    const set = new Set<string>();
    currentRespondents.forEach((item) => {
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
  }, [currentRespondents, filters.kabupaten, filters.kecamatan]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return currentRespondents.filter((item) => {
      if (filters.kabupaten && item.kabupaten !== filters.kabupaten) {
        return false;
      }
      if (filters.kecamatan && item.kecamatan !== filters.kecamatan) {
        return false;
      }
      if (filters.sekolah && item.sekolah !== filters.sekolah) {
        return false;
      }
      if (filters.jenisKelamin && item.jenisKelamin !== filters.jenisKelamin) {
        return false;
      }
      if (filters.posisi && item.posisiJabatan && item.posisiJabatan !== filters.posisi) {
        return false;
      }
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const matchNama = item.nama?.toLowerCase().includes(query);
        const matchNamaGuru = item.namaGuru?.toLowerCase().includes(query);
        const matchObserver = item.namaObserver?.toLowerCase().includes(query);
        const matchSekolah = item.sekolah?.toLowerCase().includes(query);
        const matchKab = item.kabupaten?.toLowerCase().includes(query);
        const matchKec = item.kecamatan?.toLowerCase().includes(query);
        const matchGugus = item.gugus?.toLowerCase().includes(query);
        const matchPosisi = item.posisiJabatan?.toLowerCase().includes(query);
        const matchScore = item.score?.toLowerCase().includes(query);
        const matchHari = item.hariTanggal?.toLowerCase().includes(query);
        const matchWaktu = item.waktu?.toLowerCase().includes(query);

        if (!matchNama && !matchNamaGuru && !matchObserver && !matchSekolah && !matchKab && !matchKec && !matchGugus && !matchPosisi && !matchScore && !matchHari && !matchWaktu) {
          return false;
        }
      }
      return true;
    });
  }, [currentRespondents, filters]);

  // Summary statistics for StatCards
  const summaryStats: SummaryStats = useMemo(() => {
    const total = filteredData.length;
    const kecSet = new Set<string>();
    const sekSet = new Set<string>();
    const observerSet = new Set<string>();
    let totalScoreSum = 0;
    let scoreCount = 0;
    let highScore = 0;
    let lowScore = 100;
    let laki = 0;
    let perempuan = 0;
    let totalMurid = 0;

    filteredData.forEach((item) => {
      if (item.kecamatan && item.kecamatan !== '-') kecSet.add(item.kecamatan);
      if (item.sekolah && item.sekolah !== '-') sekSet.add(item.sekolah);
      if (item.namaObserver && item.namaObserver !== '-') observerSet.add(item.namaObserver);
      
      if (item.numericScore > 0) {
        totalScoreSum += item.numericScore;
        scoreCount++;
        if (item.numericScore > highScore) highScore = item.numericScore;
        if (item.numericScore < lowScore) lowScore = item.numericScore;
      }
      if (item.jenisKelamin === 'Laki-laki') laki++;
      if (item.jenisKelamin === 'Perempuan') perempuan++;

      if (item.jumlahMurid) {
        const num = parseInt(item.jumlahMurid.replace(/\D/g, ''), 10);
        if (!isNaN(num)) totalMurid += num;
      }
    });

    return {
      total,
      totalKecamatan: kecSet.size,
      totalSekolah: sekSet.size,
      avgScore: scoreCount > 0 ? totalScoreSum / scoreCount : 0,
      highScore: scoreCount > 0 ? highScore : 0,
      lowScore: scoreCount > 0 ? lowScore : 0,
      totalLakiLaki: laki,
      totalPerempuan: perempuan,
      totalObserver: observerSet.size,
      totalMurid: totalMurid > 0 ? totalMurid : undefined
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

  // Quick chart filter handlers
  const handleSelectKecamatanFromChart = (kec: string) => {
    setFilters((prev) => ({
      ...prev,
      kecamatan: prev.kecamatan === kec ? '' : kec,
      sekolah: ''
    }));
  };

  const handleSelectSekolahFromChart = (sekolah: string) => {
    setFilters((prev) => ({
      ...prev,
      sekolah: prev.sekolah === sekolah ? '' : sekolah
    }));
  };

  // Export Handlers
  const handleExportExcel = () => {
    const prefix = activeSubmenu === 'observasi'
      ? 'Data_Observasi_Pembelajaran_Literasi_Lombok'
      : activeSubmenu === 'surlingjar' 
      ? 'Data_Surlingjar_Lombok' 
      : 'Data_Survei_Kompetensi_Literasi_Lombok';
    exportToExcel(filteredData, prefix, activeSubmenu);
  };

  const handleExportPDF = () => {
    const prefix = activeSubmenu === 'observasi'
      ? 'Laporan_Observasi_Pembelajaran_Literasi_Lombok'
      : activeSubmenu === 'surlingjar' 
      ? 'Laporan_Surlingjar_Lombok' 
      : 'Laporan_Survei_Kompetensi_Literasi_Lombok';
    exportToPDF(filteredData, filters, prefix, activeSubmenu);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex font-sans antialiased">
      {/* 1. Sidebar Navigation */}
      <Sidebar
        activeMenu={activeMenu}
        onSelectMenu={(menu) => setActiveMenu(menu)}
        isOpenMobile={isSidebarMobileOpen}
        onCloseMobile={() => setIsSidebarMobileOpen(false)}
        isCollapsedDesktop={isSidebarDesktopCollapsed}
        onToggleDesktop={() => setIsSidebarDesktopCollapsed(!isSidebarDesktopCollapsed)}
      />

      {/* 2. Main Body Container */}
      <div 
        className={`
          flex-1 flex flex-col min-w-0 transition-all duration-300
          ${isSidebarDesktopCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
        `}
      >
        {/* Top Header */}
        <Header
          activeMenu={activeMenu}
          activeSubmenu={activeSubmenu}
          onSelectMenu={(menu) => setActiveMenu(menu)}
          onSelectSubmenu={handleSelectSubmenu}
          onRefreshData={() => loadData()}
          onExportExcel={handleExportExcel}
          onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
          isLoading={isLoading}
          isUsingFallback={isUsingFallback}
          lastUpdated={lastUpdated}
          onToggleMobileSidebar={() => setIsSidebarMobileOpen(true)}
          totalRecords={currentRespondents.length}
        />

        {activeMenu === 'lombok' ? (
          <div className="flex-1 flex flex-col">
            {/* Submenu Tabs (Kompetensi, Surlingjar, Observasi) */}
            <SubmenuNav
              activeSubmenu={activeSubmenu}
              onSelectSubmenu={handleSelectSubmenu}
              totalRespondents={currentRespondents.length}
              kompetensiCount={kompetensiList.length}
              surlingjarCount={surlingjarList.length}
              observasiCount={observasiList.length}
            />

            {/* Main Content Area */}
            <main className="flex-1 p-3 sm:p-4 md:p-6 space-y-4">
              {/* Stat Cards */}
              <StatCards
                stats={summaryStats}
                totalUnfiltered={currentRespondents.length}
                submenuType={activeSubmenu}
              />

              {/* Charts Section */}
              <ChartsSection
                data={filteredData}
                submenuType={activeSubmenu}
                onSelectKecamatanFilter={handleSelectKecamatanFromChart}
                onSelectSekolahFilter={handleSelectSekolahFromChart}
              />

              {/* Filter Bar & Main Data Table */}
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
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
                  totalCount={currentRespondents.length}
                  submenuType={activeSubmenu}
                />

                <DataTable
                  data={filteredData}
                  submenuType={activeSubmenu}
                  onSelectRow={(item) => setSelectedRespondent(item)}
                />
              </div>
            </main>
          </div>
        ) : (
          /* Placeholder View for other menus (Dompu, Bima, etc.) */
          <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
            <PlaceholderView
              type="menu"
              menuKey={activeMenu}
              onBackToLombok={() => setActiveMenu('lombok')}
            />
          </main>
        )}
      </div>

      {/* Detail Modal */}
      <DetailModal
        respondent={selectedRespondent}
        submenuType={activeSubmenu}
        onClose={() => setSelectedRespondent(null)}
      />

      {/* Google Sites Embed Modal */}
      <EmbedModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
      />
    </div>
  );
}
