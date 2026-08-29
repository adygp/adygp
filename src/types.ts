export interface Respondent {
  id: number;
  score: string;
  numericScore: number;
  nama: string;
  jenisKelamin: string;
  posisiJabatan: string;
  sekolah: string;
  gugus: string;
  kabupaten: string;
  kecamatan: string;
  namaObserver?: string;
  namaGuru?: string;
  jumlahMurid?: string;
  hariTanggal?: string;
  waktu?: string;
  rawAnswers?: Record<string, string>;
}

export type MainMenuKey = 'lombok' | 'dompu' | 'bima' | 'numerasi' | 'nonprioritas';

export type LombokSubmenuKey = 'kompetensi' | 'surlingjar' | 'observasi';

export interface FilterState {
  kabupaten: string;
  kecamatan: string;
  sekolah: string;
  search: string;
  jenisKelamin: string;
  posisi: string;
}

export interface SummaryStats {
  total: number;
  totalKecamatan: number;
  totalSekolah: number;
  totalLakiLaki: number;
  totalPerempuan: number;
  avgScore: number;
  highScore: number;
  lowScore: number;
  totalObserver?: number;
  totalMurid?: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  percentage?: number;
  color?: string;
}
