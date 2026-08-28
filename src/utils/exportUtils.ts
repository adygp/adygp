import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Respondent, FilterState } from '../types';

export function exportToExcel(data: Respondent[], filenamePrefix: string = 'Data_Survei_Kompetensi_Literasi_Lombok'): void {
  // Map to clean tabular format conforming to user requirements
  const excelRows = data.map((item, index) => ({
    'No': index + 1,
    'Kabupaten': item.kabupaten || 'Lombok Tengah',
    'Kecamatan': item.kecamatan,
    'Nama Sekolah (Unit Kerja)': item.sekolah,
    'Nama Guru': item.nama,
    'Jenis Kelamin': item.jenisKelamin,
    'Posisi / Jabatan': item.posisiJabatan,
    'Gugus / KKMI': item.gugus,
    'Skor Literasi': item.score
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelRows);

  // Set column widths for clean readability
  worksheet['!cols'] = [
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

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Survei Kompetensi Literasi');

  const timestamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `${filenamePrefix}_${timestamp}.xlsx`);
}

export function exportToPDF(data: Respondent[], filters: FilterState, filenamePrefix: string = 'Laporan_Survei_Kompetensi_Literasi_Lombok'): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Primary Header Brand & Background
  doc.setFillColor(30, 64, 175); // Royal Blue
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DASHBOARD BASELINE LITERASI DAN NUMERASI', 14, 11);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Lombok - Submenu: Survei Kompetensi Pembelajaran Literasi (Sheet ArrayKom)', 14, 18);

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
  doc.text(`Total Baris Data: ${data.length} Responden`, 14, 30);

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

  // Build table data
  const tableHead = [
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

  const tableBody = data.map((item, index) => [
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
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 26 },
      2: { cellWidth: 28 },
      3: { cellWidth: 54 },
      4: { cellWidth: 46 },
      5: { halign: 'center', cellWidth: 24 },
      6: { cellWidth: 38 },
      7: { halign: 'center', cellWidth: 24 },
      8: { halign: 'center', cellWidth: 19 }
    },
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
