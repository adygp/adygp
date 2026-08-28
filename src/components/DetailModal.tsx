import React from 'react';
import { X, User, MapPin, School, Award, Briefcase, Hash, CheckCircle2, BookOpen } from 'lucide-react';
import { Respondent } from '../types';

interface DetailModalProps {
  respondent: Respondent | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ respondent, onClose }) => {
  if (!respondent) return null;

  const isFemale = respondent.jenisKelamin?.toLowerCase().includes('perempuan');
  const isMale = respondent.jenisKelamin?.toLowerCase().includes('laki');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 text-white">
              <User className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-blue-200 font-bold">
                Detail Responden Asesmen Literasi
              </span>
              <h3 className="text-lg font-black text-white leading-tight">
                {respondent.nama}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Key Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kecamatan */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/90">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold mb-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Kecamatan & Kabupaten</span>
              </div>
              <p className="font-black text-slate-900 text-sm">
                {respondent.kecamatan}
              </p>
              <p className="text-xs text-slate-500">{respondent.kabupaten || 'Lombok Tengah'}</p>
            </div>

            {/* Satuan Pendidikan */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/90">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold mb-1">
                <School className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sekolah / Madrasah (Unit Kerja)</span>
              </div>
              <p className="font-black text-slate-900 text-sm">
                {respondent.sekolah}
              </p>
            </div>

            {/* Posisi / Jabatan */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/90">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold mb-1">
                <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                <span>Posisi / Jabatan</span>
              </div>
              <p className="font-black text-slate-900 text-sm">
                {respondent.posisiJabatan}
              </p>
            </div>

            {/* Gugus / KKMI */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/90">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold mb-1">
                <Hash className="w-3.5 h-3.5 text-amber-600" />
                <span>Gugus / KKMI</span>
              </div>
              <p className="font-black text-slate-900 text-sm">
                {respondent.gugus}
              </p>
            </div>

            {/* Jenis Kelamin */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/90">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold mb-1">
                <User className="w-3.5 h-3.5 text-purple-600" />
                <span>Jenis Kelamin</span>
              </div>
              <span
                className={`
                  inline-block px-3 py-1 rounded-full text-xs font-bold border mt-0.5
                  ${isFemale ? 'bg-pink-50 text-pink-700 border-pink-200' : isMale ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-slate-700'}
                `}
              >
                {respondent.jenisKelamin}
              </span>
            </div>

            {/* Skor Asesmen */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/90">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold mb-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Skor Literasi</span>
              </div>
              <p className="font-black text-blue-700 text-lg">
                {respondent.score}
              </p>
            </div>
          </div>

          {/* Raw Responses Preview (if available) */}
          {respondent.rawAnswers && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Tanggapan Instrumen & Asesmen
              </h4>
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {Object.entries(respondent.rawAnswers)
                  .filter(([key]) => !['Score', 'Nama', 'Jenis Kelamin', 'Posisi/Jabatan', 'Sekolah/Madrasah? (Unit Kerja)', 'Gugus/KKMI?', 'Kabupaten', 'Kecamatan'].includes(key))
                  .map(([question, answer], idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                      <p className="font-bold text-slate-800 mb-1 leading-snug">{question}</p>
                      <p className="text-slate-600 font-medium bg-white p-2 rounded-lg border border-gray-200/80">
                        {String(answer) || '-'}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-slate-800 text-xs font-bold rounded-xl border border-gray-300 transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
