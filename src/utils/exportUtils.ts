import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Respondent, FilterState } from '../types';

export function exportToExcel(
  data: Respondent[], 
  filenamePrefix: string = 'Data_Export',
  submenuType: 'kompetensi' | 'surlingjar' | 'observasi' = 'kompetensi'
): void {
  let excelRows: Record<string, any>[] = [];
  let colWidths: { wch: number }[] = [];
  let sheetName = 'Data Export';

  if (submenuType === 'observasi') {
    sheetName = 'Observasi Pembelajaran';
    excelRows = data.map((item, index) => ({
      'No': index + 1,
      'Kabupaten': item.kabupaten || 'Lombok Tengah',
      'Kecamatan': item.kecamatan || '-',
      'Nama Sekolah / Madrasah': item.sekolah || '-',
      'Nama Observer': item.namaObserver || '-',
      'Nama Guru': item.namaGuru || item.nama || '-',
      'Jumlah Murid': item.jumlahMurid || '-',
      'Hari & Tanggal': item.hariTanggal || '-',
      'Waktu / Durasi': item.waktu || '-'
    }));

    colWidths = [
      { wch: 6 },  // No
      { wch: 18 }, // Kabupaten
      { wch: 18 }, // Kecamatan
      { wch: 32 }, // Nama Sekolah / Madrasah
      { wch: 28 }, // Nama Observer
      { wch: 28 }, // Nama Guru
      { wch: 15 }, // Jumlah Murid
      { wch: 22 }, // Hari & Tanggal
      { wch: 20 }  // Waktu / Durasi
    ];
  } else if (submenuType === 'surlingjar') {
    sheetName = 'Surlingjar';
    excelRows = data.map((item, index) => ({
      'No': index + 1,
      'Kabupaten': item.kabupaten || 'Lombok Tengah',
      'Kecamatan': item.kecamatan || '-',
      'Nama Sekolah/Madrasah': item.sekolah || '-',
      'Nama Guru': item.nama || '-',
      'Jenis Kelamin': item.jenisKelamin || '-'
    }));

    colWidths = [
      { wch: 6 },  // No
      { wch: 18 }, // Kabupaten
      { wch: 18 }, // Kecamatan
      { wch: 36 }, // Nama Sekolah/Madrasah
      { wch: 30 }, // Nama Guru
      { wch: 16 }  // Jenis Kelamin
    ];
  } else {
    sheetName = 'Survei Kompetensi Literasi';
    excelRows = data.map((item, index) => ({
      'No': index + 1,
      'Kabupaten': item.kabupaten || 'Lombok Tengah',
      'Kecamatan': item.kecamatan || '-',
      'Nama Sekolah (Unit Kerja)': item.sekolah || '-',
      'Nama Guru': item.nama || '-',
      'Jenis Kelamin': item.jenisKelamin || '-',
      'Posisi / Jabatan': item.posisiJabatan || '-',
      'Gugus / KKMI': item.gugus || '-',
      'Skor Literasi': item.score || '-'
    }));

    colWidths = [
      { wch: 6 },  // No
      { wch: 18 }, // Kabupaten
      { wch: 18 }, // Kecamatan
      { wch: 32 }, // Nama Sekolah
      { wch: 28 }, // Nama Guru
      { wch: 15 }, // Jenis Kelamin
      { wch: 22 }, // Posisi / Jabatan
      { wch: 16 }, // Gugus / KKMI
      { wch: 14 }  // Skor Literasi
    ];
  }

  const worksheet = XLSX.utils.json_to_sheet(excelRows);
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const timestamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `${filenamePrefix}_${timestamp}.xlsx`);
}

export function exportToPDF(
  data: Respondent[], 
  filters: FilterState, 
  filenamePrefix: string = 'Laporan_Export',
  submenuType: 'kompetensi' | 'surlingjar' | 'observasi' = 'kompetensi'
): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const isObservasi = submenuType === 'observasi';
  const isSurlingjar = submenuType === 'surlingjar';

  const subTitle = isObservasi
    ? 'Lombok - Submenu: Observasi Pembelajaran Literasi (Sheet ArrayObser)'
    : isSurlingjar
    ? 'Lombok - Submenu: Surlingjar (Sheet ArraySurling)'
    : 'Lombok - Submenu: Survei Kompetensi Pembelajaran Literasi (Sheet ArrayKom)';

  // Primary Header Brand & Background
  doc.setFillColor(30, 64, 175); // Royal Blue
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DASHBOARD BASELINE LITERASI DAN NUMERASI', 14, 11);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(subTitle, 14, 18);

  // Meta Info / Filter Summary
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');

  const printDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  doc.text(`Waktu Cetak: ${printDate}`, 215, 30);
  doc.text(`Total Baris Data: ${data.length} ${isObservasi ? 'Sesi Observasi' : 'Responden'}`, 14, 30);

  let filterDesc = 'Semua Data';
  const activeFilters = [];
  if (filters.kabupaten) activeFilters.push(`Kabupaten: ${filters.kabupaten}`);
  if (filters.kecamatan) activeFilters.push(`Kecamatan: ${filters.kecamatan}`);
  if (filters.sekolah) activeFilters.push(`Sekolah: ${filters.sekolah}`);
  if (filters.jenisKelamin) activeFilters.push(`Jenis Kelamin: ${filters.jenisKelamin}`);
  if (filters.posisi) activeFilters.push(`Posisi: ${filters.posisi}`);
  if (filters.search) activeFilters.push(`Pencarian: "${filters.search}"`);

  if (activeFilters.length > 0) {
    filterDesc = activeFilters.join(' | ');
  }
  doc.text(`Filter Aktif: ${filterDesc}`, 14, 35);

  let tableHead: string[][] = [];
  let tableBody: string[][] = [];
  let columnStyles: Record<number, any> = {};

  if (isObservasi) {
    tableHead = [
      [
        'No',
        'Kabupaten',
        'Kecamatan',
        'Nama Sekolah / Madrasah',
        'Nama Observer',
        'Nama Guru',
        'Jml Murid',
        'Hari & Tanggal',
        'Waktu / Durasi'
      ]
    ];

    tableBody = data.map((item, index) => [
      (index + 1).toString(),
      item.kabupaten || 'Lombok Tengah',
      item.kecamatan || '-',
      item.sekolah || '-',
      item.namaObserver || '-',
      item.namaGuru || item.nama || '-',
      item.jumlahMurid ? `${item.jumlahMurid}` : '-',
      item.hariTanggal || '-',
      item.waktu || '-'
    ]);

    columnStyles = {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 26 },
      2: { cellWidth: 28 },
      3: { cellWidth: 48 },
      4: { cellWidth: 40 },
      5: { cellWidth: 40 },
      6: { halign: 'center', cellWidth: 20 },
      7: { cellWidth: 32 },
      8: { cellWidth: 25 }
    };
  } else if (isSurlingjar) {
    tableHead = [
      [
        'No',
        'Kabupaten',
        'Kecamatan',
        'Nama Sekolah / Madrasah',
        'Nama Guru',
        'Jenis Kelamin'
      ]
    ];

    tableBody = data.map((item, index) => [
      (index + 1).toString(),
      item.kabupaten || 'Lombok Tengah',
      item.kecamatan || '-',
      item.sekolah || '-',
      item.nama || '-',
      item.jenisKelamin || '-'
    ]);

    columnStyles = {
      0: { halign: 'center', cellWidth: 12 },
      1: { cellWidth: 35 },
      2: { cellWidth: 38 },
      3: { cellWidth: 80 },
      4: { cellWidth: 70 },
      5: { halign: 'center', cellWidth: 34 }
    };
  } else {
    tableHead = [
      [
        'No',
        'Kabupaten',
        'Kecamatan',
        'Nama Sekolah (Unit Kerja)',
        'Nama Guru',
        'Jenis Kelamin',
        'Posisi / Jabatan',
        'Gugus / KKMI',
        'Skor'
      ]
    ];

    tableBody = data.map((item, index) => [
      (index + 1).toString(),
      item.kabupaten || 'Lombok Tengah',
      item.kecamatan || '-',
      item.sekolah || '-',
      item.nama || '-',
      item.jenisKelamin || '-',
      item.posisiJabatan || '-',
      item.gugus || '-',
      item.score || '-'
    ]);

    columnStyles = {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 26 },
      2: { cellWidth: 28 },
      3: { cellWidth: 54 },
      4: { cellWidth: 46 },
      5: { halign: 'center', cellWidth: 24 },
      6: { cellWidth: 38 },
      7: { halign: 'center', cellWidth: 24 },
      8: { halign: 'center', cellWidth: 19 }
    };
  }

  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: 40,
    theme: 'grid',
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      valign: 'middle'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles,
    margin: { top: 40, left: 14, right: 14, bottom: 14 },
    didDrawPage: (data) => {
      // Footer page number
      const pageNumber = doc.getNumberOfPages();
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Halaman ${data.pageNumber} dari ${pageNumber} - Dashboard Baseline Literasi dan Numerasi`,
        14,
        doc.internal.pageSize.height - 8
      );
    }
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  doc.save(`${filenamePrefix}_${timestamp}.pdf`);
}

