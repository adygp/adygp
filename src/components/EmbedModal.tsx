import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Code2, Globe, HelpCircle } from 'lucide-react';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href;

  const iframeSnippet = `<iframe 
  src="${currentUrl}" 
  width="100%" 
  height="900" 
  frameborder="0" 
  style="border:0; width:100%; height:900px; min-height:800px;" 
  allowfullscreen>
</iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#0284c7] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-5 h-5" />
            <h3 className="font-bold text-base">Kode Sematkan (Embed) Google Sites</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs sm:text-sm text-slate-700">
          <p className="text-slate-600 leading-relaxed">
            Tempelkan kode di bawah ini pada halaman <strong>Google Sites</strong> Anda untuk menampilkan dashboard satu halaman penuh persis seperti preview:
          </p>

          <div className="relative">
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
              {iframeSnippet}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2.5 right-2.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Kode</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl space-y-1.5 text-xs text-sky-900">
            <p className="font-bold flex items-center gap-1.5 text-sky-800">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              Cara Memasang di Google Sites:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sky-800 ml-1">
              <li>Buka editor Google Sites Anda.</li>
              <li>Pilih menu <strong>Sisipkan (Insert) &gt; Sematkan (Embed)</strong>.</li>
              <li>Pilih tab <strong>Sematkan Kode (Embed code)</strong>.</li>
              <li>Tempel (Paste) kode HTML di atas, lalu klik <strong>Berikutnya &gt; Sisipkan</strong>.</li>
              <li>Tarik tepi kotak di Google Sites hingga memenuhi lebar halaman penuh.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
