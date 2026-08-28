import React from 'react';
import { 
  Building2, 
  Eye, 
  MapPin, 
  BarChart3, 
  Layers, 
  Compass, 
  Clock, 
  ArrowLeft,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { MainMenuKey, LombokSubmenuKey } from '../types';

interface PlaceholderViewProps {
  type: 'menu' | 'submenu';
  menuKey?: MainMenuKey;
  submenuKey?: LombokSubmenuKey;
  onBackToLombok: () => void;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
  type,
  menuKey,
  submenuKey,
  onBackToLombok
}) => {
  const getTitleAndDesc = () => {
    if (type === 'submenu') {
      if (submenuKey === 'surlingjar') {
        return {
          title: 'Submenu Surlingjar (Survei Lingkungan Belajar)',
          badge: 'Menyusul - Siap Diinput',
          desc: 'Modul pengumpulan dan visualisasi data Survei Lingkungan Belajar untuk Kabupaten Lombok sedang disiapkan dan akan dihubungkan pada tahap selanjutnya.',
          icon: Building2,
          color: 'from-amber-500 to-orange-600',
          features: [
            'Asesmen Iklim Keamanan & Kebhinekaan Satuan Pendidikan',
            'Evaluasi Kualitas Proses Pembelajaran Sekolah',
            'Integrasi Form & Rekapitulasi Rapor Satuan Pendidikan'
          ]
        };
      }
      return {
        title: 'Submenu Observasi Pembelajaran Literasi',
        badge: 'Menyusul - Siap Diinput',
        desc: 'Instrumen evaluasi kelas dan observasi praktik pembelajaran literasi guru sedang disiapkan dan akan ditampilkan segera.',
        icon: Eye,
        color: 'from-indigo-500 to-purple-600',
        features: [
          'Rubrik Pengamatan Praktik Membaca & Menulis',
          'Penilaian Strategi Probing & Pertanyaan Pemantik Guru',
          'Umpan Balik Asesmen Diagnostik ASI-ASLI di Kelas'
        ]
      };
    }

    // Main Menu Placeholders
    switch (menuKey) {
      case 'dompu':
        return {
          title: 'Wilayah Kabupaten Dompu',
          badge: 'Tahap Input Data',
          desc: 'Menu data baseline literasi dan numerasi untuk Kabupaten Dompu telah terdaftar di sistem dan siap menerima konfigurasi spreadsheet.',
          icon: Compass,
          color: 'from-blue-500 to-cyan-600',
          features: [
            'Dashboard Baseline Literasi Kabupaten Dompu',
            'Survei Kompetensi & Asesmen Guru Dompu',
            'Visualisasi Statistik dan Grafik Per Wilayah'
          ]
        };
      case 'bima':
        return {
          title: 'Wilayah Kabupaten Bima',
          badge: 'Tahap Input Data',
          desc: 'Menu data baseline literasi dan numerasi untuk Kabupaten Bima telah terdaftar di sistem dan siap menerima data survei.',
          icon: MapPin,
          color: 'from-teal-500 to-emerald-600',
          features: [
            'Dashboard Baseline Literasi Kabupaten Bima',
            'Pemetaan Satuan Pendidikan dan Gugus Bima',
            'Ekspor Laporan PDF & Excel Wilayah Bima'
          ]
        };
      case 'numerasi':
        return {
          title: 'Program Asesmen Numerasi',
          badge: 'Tahap Input Data',
          desc: 'Menu khusus evaluasi capaian numerasi jenjang pendidikan dasar sedang dalam antrian pengisian dataset.',
          icon: BarChart3,
          color: 'from-violet-500 to-purple-600',
          features: [
            'Asesmen Kompetensi Numerasi Guru dan Siswa',
            'Analisis Pola Berpikir Matematis & Kontekstual',
            'Rekapitulasi Capaian Numerasi per Gugus'
          ]
        };
      case 'nonprioritas':
        return {
          title: 'Wilayah Nonprioritas',
          badge: 'Tahap Input Data',
          desc: 'Menu monitoring untuk satuan pendidikan dan gugus di luar daerah sasaran prioritas utama.',
          icon: Layers,
          color: 'from-slate-600 to-slate-800',
          features: [
            'Data Agregat Wilayah Nonprioritas',
            'Komparasi Benchmark Terhadap Daerah Prioritas',
            'Monitoring Partisipasi Asesmen Mandiri'
          ]
        };
      default:
        return {
          title: 'Menu Pilihan',
          badge: 'Tahap Input Data',
          desc: 'Konten sedang disiapkan untuk menu ini.',
          icon: Clock,
          color: 'from-blue-600 to-indigo-600',
          features: []
        };
    }
  };

  const info = getTitleAndDesc();
  const Icon = info.icon;

  return (
    <div className="p-8 sm:p-12 bg-white rounded-3xl border border-gray-200/90 shadow-sm text-center max-w-3xl mx-auto my-8">
      {/* 3D Icon Badge */}
      <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr ${info.color} text-white flex items-center justify-center shadow-lg mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300`}>
        <Icon className="w-10 h-10" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-3">
        <Clock className="w-3.5 h-3.5" />
        <span>{info.badge}</span>
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 tracking-tight">
        {info.title}
      </h3>

      <p className="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto mb-8">
        {info.desc}
      </p>

      {/* Feature Preview Checklist */}
      {info.features.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 text-left max-w-lg mx-auto mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Fitur Yang Akan Diintegrasikan:
          </h4>
          <ul className="space-y-2.5">
            {info.features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 3D Back to Lombok button */}
      <button
        id="btn-back-to-lombok"
        onClick={onBackToLombok}
        className="px-6 py-3 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-[0_4px_0_0_#1D4ED8] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#1D4ED8] active:translate-y-[4px] active:shadow-none transition-all inline-flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Survei Kompetensi Literasi Lombok</span>
      </button>
    </div>
  );
};
