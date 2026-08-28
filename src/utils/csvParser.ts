import Papa from 'papaparse';
import { Respondent } from '../types';
import initialDataJson from '../data/initialData.json';

export const GOOGLE_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGGnQtDjDxSG3Sl2xS0JNcysnk6Tguh6qtWqcQzpuSS2cTgfEG7DUe-XleP7ctbdROx6zJEPecmQeT/pub?gid=582620741&single=true&output=csv';

export async function fetchSpreadsheetData(customUrl?: string): Promise<Respondent[]> {
  const targetUrl = customUrl || GOOGLE_SHEET_CSV_URL;
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

    const cleanData: Respondent[] = parsed.data.map((row, index) => {
      const scoreStr = String(row['Score'] || '').trim();
      let numScore = 0;
      const match = scoreStr.match(/^(\d+)/);
      if (match) {
        numScore = parseInt(match[1], 10);
      }

      // Flexible column key searching
      const findVal = (possibleKeys: string[]): string => {
        for (const key of possibleKeys) {
          if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
            return String(row[key]).trim();
          }
          // check case-insensitive match
          const foundKey = Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase());
          if (foundKey && row[foundKey]) {
            return String(row[foundKey]).trim();
          }
        }
        return '';
      };

      const sekolahVal = findVal([
        'Sekolah/Madrasah? (Unit Kerja)',
        'Sekolah/Madrasah?(Unit Kerja)',
        'Sekolah/Madrasah',
        'Unit Kerja',
        'Sekolah'
      ]) || '-';

      const gugusVal = findVal(['Gugus/KKMI?', 'Gugus/KKMI', 'Gugus', 'KKMI']) || '-';
      const kecamatanVal = findVal(['Kecamatan', 'Kec']) || 'Tidak Tercantum';
      const kabupatenVal = findVal(['Kabupaten', 'Kab']) || 'Lombok Tengah';
      const posisiVal = findVal(['Posisi/Jabatan', 'Posisi', 'Jabatan']) || '-';
      const jkVal = findVal(['Jenis Kelamin', 'Gender']) || '-';
      const namaVal = findVal(['Nama', 'Nama Guru', 'Nama Lengkap']) || '-';

      return {
        id: index + 1,
        score: scoreStr || '-',
        numericScore: numScore,
        nama: namaVal,
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
    console.warn('Menggunakan data backup lokal karena koneksi spreadsheet:', error);
    // Fallback to pre-bundled initial snapshot data
    return (initialDataJson as Respondent[]).map((item, idx) => ({
      ...item,
      id: idx + 1
    }));
  }
}
