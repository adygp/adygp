import Papa from 'papaparse';
import { Respondent } from '../types';
import initialDataJson from '../data/initialData';
import initialSurlingjarJson from '../data/initialSurlingjarData';
import initialObservasiJson from '../data/initialObservasiData';

export const GOOGLE_SHEET_ARRAY_KOM_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGGnQtDjDxSG3Sl2xS0JNcysnk6Tguh6qtWqcQzpuSS2cTgfEG7DUe-XleP7ctbdROx6zJEPecmQeT/pub?gid=582620741&single=true&output=csv';

export const GOOGLE_SHEET_ARRAY_SURLING_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTbYDrDFgK9g7IJ59cBrrrKtVAIwkv-aRDl3MteGRTTqU8mpvkizmMCGWdzO0mkfzhhPBAwwIZG717m/pub?gid=870626270&single=true&output=csv';

export const GOOGLE_SHEET_ARRAY_OBSER_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSGsF62AYuzJlniMqugXiXFS5XBQ-98m1P64ZOwEm9HtMn-5DOVbw_wIIM4AtxvfgqOVuHEUpPv0J2d/pub?gid=117049116&single=true&output=csv';

// Backward compatibility default
export const GOOGLE_SHEET_CSV_URL = GOOGLE_SHEET_ARRAY_KOM_URL;

export async function fetchSpreadsheetData(
  type: 'kompetensi' | 'surlingjar' | 'observasi' = 'kompetensi',
  customUrl?: string
): Promise<Respondent[]> {
  let targetUrl = customUrl;
  if (!targetUrl) {
    if (type === 'observasi') {
      targetUrl = GOOGLE_SHEET_ARRAY_OBSER_URL;
    } else if (type === 'surlingjar') {
      targetUrl = GOOGLE_SHEET_ARRAY_SURLING_URL;
    } else {
      targetUrl = GOOGLE_SHEET_ARRAY_KOM_URL;
    }
  }
  
  try {
    const urlWithTimestamp = `${targetUrl}&_t=${Date.now()}`;
    const response = await fetch(urlWithTimestamp, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv,text/plain,*/*'
      }
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data dari Google Sheets (Status: ${response.status})`);
    }

    const csvText = await response.text();
    const parsed = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim()
    });

    if (!parsed.data || parsed.data.length === 0) {
      throw new Error('Data spreadsheet kosong');
    }

    // Flexible column key searching helper
    const findVal = (row: Record<string, string>, possibleKeys: string[]): string => {
      for (const key of possibleKeys) {
        if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
          return String(row[key]).trim();
        }
        // check case-insensitive match
        const foundKey = Object.keys(row).find(k => k.trim().toLowerCase() === key.trim().toLowerCase());
        if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null && String(row[foundKey]).trim() !== '') {
          return String(row[foundKey]).trim();
        }
      }
      return '';
    };

    if (type === 'observasi') {
      const cleanObservasi: Respondent[] = parsed.data.map((row, index) => {
        const kabVal = findVal(row, ['Kabupaten', 'Kab']) || 'Lombok Tengah';
        const kecVal = findVal(row, ['Kecamatan', 'Kec']) || 'Tidak Tercantum';
        // Kolom Nama Sekolah/Madrasah dari kolom SD/MI
        const sekolahVal = findVal(row, ['SD/MI', 'Sekolah/Madrasah', 'Sekolah', 'Unit Kerja']) || '-';
        // Kolom Nama Observer diambil dari kolom Nama Observer
        const observerVal = findVal(row, ['Nama Observer', 'Observer', 'Observer Literasi']) || '-';
        // Kolom Nama Guru diambil dari kolom Nama Guru (or 'Namu guru')
        const guruVal = findVal(row, ['Namu guru', 'Nama Guru', 'Nama guru', 'Nama']) || '-';
        // Kolom Jumlah Murid diambil dari kolom Jumlah Murid
        const jmlMuridVal = findVal(row, ['Jumlah murid', 'Jumlah Murid', 'Jumlah siswa']) || '-';
        // Kolom Hari/ Tanggal diambil dari kolom Hari & tanggal observasi
        const hariTanggalVal = findVal(row, ['Hari & tanggal observasi', 'Hari & Tanggal Observasi', 'Hari / Tanggal Observasi', 'Hari/Tanggal', 'Tanggal']) || '-';
        // Kolom Waktu diambil dari kolom Durasi
        const waktuVal = findVal(row, ['Durasi (dari jam berapa sampai jam berapa)', 'Durasi', 'Waktu']) || '-';

        let jkVal = findVal(row, ['Jenis kelamin', 'Jenis Kelamin', 'Gender', 'JK']) || '-';
        if (jkVal.toLowerCase() === 'laki' || jkVal.toLowerCase() === 'laki-laki') jkVal = 'Laki-laki';
        if (jkVal.toLowerCase() === 'perempuan') jkVal = 'Perempuan';

        return {
          id: index + 1,
          score: '-',
          numericScore: 0,
          nama: guruVal,
          namaGuru: guruVal,
          namaObserver: observerVal,
          jumlahMurid: jmlMuridVal,
          hariTanggal: hariTanggalVal,
          waktu: waktuVal,
          jenisKelamin: jkVal,
          posisiJabatan: 'Guru yang Diobservasi',
          sekolah: sekolahVal,
          gugus: '-',
          kabupaten: kabVal,
          kecamatan: kecVal,
          rawAnswers: row
        };
      });

      return cleanObservasi;
    }

    if (type === 'surlingjar') {
      const cleanSurlingjar: Respondent[] = parsed.data.map((row, index) => {
        const kabVal = findVal(row, ['Kabupaten', 'Kab']) || 'Lombok Tengah';
        const kecVal = findVal(row, ['Kecamatan', 'Kec']) || 'Tidak Tercantum';
        // Kolom Nama Sekolah/Madrasah dari kolom SD/MI
        const sekolahVal = findVal(row, ['SD/MI', 'Sekolah/Madrasah', 'Sekolah', 'Unit Kerja']) || '-';
        // Kolom Nama Guru diambil dari kolom Nama Guru
        const namaVal = findVal(row, ['Nama Guru', 'Nama', 'Nama Lengkap']) || '-';
        // Kolom Jenis Kelamin diambil dari kolom Jenis Kelamin
        let jkVal = findVal(row, ['Jenis kelamin', 'Jenis Kelamin', 'Gender', 'JK']) || '-';
        if (jkVal.toLowerCase() === 'laki' || jkVal.toLowerCase() === 'laki-laki') jkVal = 'Laki-laki';
        if (jkVal.toLowerCase() === 'perempuan') jkVal = 'Perempuan';

        return {
          id: index + 1,
          score: '-',
          numericScore: 0,
          nama: namaVal,
          namaGuru: namaVal,
          jenisKelamin: jkVal,
          posisiJabatan: 'Guru',
          sekolah: sekolahVal,
          gugus: '-',
          kabupaten: kabVal,
          kecamatan: kecVal,
          rawAnswers: row
        };
      });

      return cleanSurlingjar;
    }

    // Default: 'kompetensi' (ArrayKom)
    const cleanData: Respondent[] = parsed.data.map((row, index) => {
      const scoreStr = String(row['Score'] || '').trim();
      let numScore = 0;
      const match = scoreStr.match(/^(\d+)/);
      if (match) {
        numScore = parseInt(match[1], 10);
      }

      const sekolahVal = findVal(row, [
        'Sekolah/Madrasah? (Unit Kerja)',
        'Sekolah/Madrasah?(Unit Kerja)',
        'Sekolah/Madrasah',
        'Unit Kerja',
        'Sekolah'
      ]) || '-';

      const gugusVal = findVal(row, ['Gugus/KKMI?', 'Gugus/KKMI', 'Gugus', 'KKMI']) || '-';
      const kecamatanVal = findVal(row, ['Kecamatan', 'Kec']) || 'Tidak Tercantum';
      const kabupatenVal = findVal(row, ['Kabupaten', 'Kab']) || 'Lombok Tengah';
      const posisiVal = findVal(row, ['Posisi/Jabatan', 'Posisi', 'Jabatan']) || '-';
      let jkVal = findVal(row, ['Jenis Kelamin', 'Jenis kelamin', 'Gender']) || '-';
      if (jkVal.toLowerCase() === 'laki' || jkVal.toLowerCase() === 'laki-laki') jkVal = 'Laki-laki';
      if (jkVal.toLowerCase() === 'perempuan') jkVal = 'Perempuan';
      const namaVal = findVal(row, ['Nama', 'Nama Guru', 'Nama Lengkap']) || '-';

      return {
        id: index + 1,
        score: scoreStr || '-',
        numericScore: numScore,
        nama: namaVal,
        namaGuru: namaVal,
        jenisKelamin: jkVal,
        posisiJabatan: posisiVal,
        sekolah: sekolahVal,
        gugus: gugusVal,
        kabupaten: kabupatenVal,
        kecamatan: kecamatanVal,
        rawAnswers: row
      };
    });

    return cleanData;
  } catch (error) {
    console.warn(`Menggunakan data backup lokal untuk ${type} karena kendala koneksi spreadsheet:`, error);
    if (type === 'observasi') {
      return (initialObservasiJson as Respondent[]).map((item, idx) => ({
        ...item,
        id: idx + 1
      }));
    }
    if (type === 'surlingjar') {
      return (initialSurlingjarJson as Respondent[]).map((item, idx) => ({
        ...item,
        id: idx + 1
      }));
    }
    return (initialDataJson as Respondent[]).map((item, idx) => ({
      ...item,
      id: idx + 1
    }));
  }
}
