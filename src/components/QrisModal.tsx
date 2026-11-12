import React, { useState } from 'react';
import { MosqueProfile } from '../types/mosque';
import { X, Printer, Copy, Check, QrCode, Sparkles, Building2 } from 'lucide-react';

interface QrisModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: MosqueProfile;
  nominal?: number;
  purpose?: string;
}

export const QrisModal: React.FC<QrisModalProps> = ({
  isOpen,
  onClose,
  profile,
  nominal,
  purpose
}) => {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(type);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Modal Top Bar */}
        <div className="no-print bg-emerald-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">QRIS & Rekening Resmi Infaq</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Stand Banner</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-emerald-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Stand Banner QRIS Sheet */}
        <div className="p-6 bg-white printable-card text-center flex flex-col items-center">
          {/* QRIS Header */}
          <div className="w-full flex items-center justify-between border-b-2 border-stone-800 pb-3 mb-4">
            <div className="text-left">
              <span className="text-2xl font-black tracking-tight text-red-600 font-sans">
                QRIS
              </span>
              <span className="block text-[9px] font-bold tracking-wider text-stone-500 uppercase">
                QR Code Standar Pembayaran Nasional
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2 py-1 rounded border border-stone-300">
                GPN / ASPI
              </span>
            </div>
          </div>

          {/* Merchant Identity */}
          <div className="mb-3">
            <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 uppercase tracking-tight">
              {profile.qrisMerchantName}
            </h3>
            <p className="text-xs text-stone-500 font-mono">
              NMID : {profile.qrisNmid}
            </p>
            <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
              {profile.name} • {profile.address.split(',')[0]}
            </p>
          </div>

          {/* Optional Nominal / Peruntukan Highlight */}
          {nominal && (
            <div className="mb-3 px-4 py-1.5 bg-amber-50 border border-amber-300 rounded-xl inline-block">
              <span className="text-xs text-amber-900 font-bold">
                Nominal Infaq: Rp {nominal.toLocaleString('id-ID')}
              </span>
              {purpose && (
                <span className="block text-[11px] text-amber-700">Peruntukan: {purpose}</span>
              )}
            </div>
          )}

          {/* Simulated High-Res QR Code Graphic */}
          <div className="p-4 bg-white border-4 border-stone-900 rounded-2xl shadow-md my-2 inline-block">
            <svg
              className="w-52 h-52 sm:w-60 sm:h-60"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background */}
              <rect width="200" height="200" fill="white" />
              {/* Corner 1 (Top-Left) */}
              <rect x="15" y="15" width="45" height="45" rx="6" fill="#1c1917" />
              <rect x="23" y="23" width="29" height="29" rx="3" fill="white" />
              <rect x="29" y="29" width="17" height="17" rx="2" fill="#14532d" />
              {/* Corner 2 (Top-Right) */}
              <rect x="140" y="15" width="45" height="45" rx="6" fill="#1c1917" />
              <rect x="148" y="23" width="29" height="29" rx="3" fill="white" />
              <rect x="154" y="29" width="17" height="17" rx="2" fill="#14532d" />
              {/* Corner 3 (Bottom-Left) */}
              <rect x="15" y="140" width="45" height="45" rx="6" fill="#1c1917" />
              <rect x="23" y="148" width="29" height="29" rx="3" fill="white" />
              <rect x="29" y="154" width="17" height="17" rx="2" fill="#14532d" />
              
              {/* Timing Patterns */}
              <line x1="68" y1="37" x2="132" y2="37" stroke="#1c1917" strokeWidth="4" strokeDasharray="6 6" />
              <line x1="37" y1="68" x2="37" y2="132" stroke="#1c1917" strokeWidth="4" strokeDasharray="6 6" />

              {/* Data Matrix Dots Pattern */}
              <g fill="#1c1917">
                {/* Simulated data clusters */}
                <rect x="75" y="20" width="8" height="8" />
                <rect x="90" y="20" width="8" height="8" />
                <rect x="110" y="20" width="8" height="8" />
                
                <rect x="70" y="55" width="8" height="8" />
                <rect x="85" y="55" width="16" height="8" />
                <rect x="110" y="55" width="8" height="8" />
                <rect x="130" y="55" width="8" height="8" />

                <rect x="20" y="75" width="8" height="8" />
                <rect x="35" y="75" width="8" height="8" />
                <rect x="50" y="75" width="8" height="8" />
                <rect x="70" y="75" width="16" height="8" />
                <rect x="95" y="70" width="8" height="16" />
                <rect x="120" y="75" width="8" height="8" />
                <rect x="145" y="75" width="16" height="8" />
                <rect x="175" y="75" width="8" height="8" />

                <rect x="20" y="95" width="8" height="8" />
                <rect x="45" y="95" width="8" height="8" />
                <rect x="65" y="95" width="8" height="8" />
                <rect x="130" y="95" width="16" height="8" />
                <rect x="160" y="95" width="8" height="8" />

                <rect x="20" y="115" width="8" height="8" />
                <rect x="50" y="115" width="8" height="8" />
                <rect x="75" y="115" width="16" height="8" />
                <rect x="105" y="115" width="8" height="8" />
                <rect x="125" y="115" width="16" height="8" />
                <rect x="155" y="115" width="8" height="8" />
                <rect x="175" y="115" width="8" height="8" />

                <rect x="70" y="140" width="8" height="8" />
                <rect x="85" y="140" width="8" height="8" />
                <rect x="110" y="140" width="16" height="8" />
                <rect x="135" y="140" width="8" height="8" />
                <rect x="155" y="140" width="8" height="8" />
                <rect x="175" y="140" width="8" height="8" />

                <rect x="75" y="160" width="16" height="8" />
                <rect x="105" y="160" width="8" height="8" />
                <rect x="125" y="160" width="8" height="8" />
                <rect x="145" y="160" width="16" height="8" />
                <rect x="170" y="160" width="8" height="8" />

                <rect x="70" y="175" width="8" height="8" />
                <rect x="90" y="175" width="16" height="8" />
                <rect x="120" y="175" width="8" height="8" />
                <rect x="150" y="175" width="8" height="8" />
              </g>

              {/* Center Islamic Badge Emblem */}
              <circle cx="100" cy="100" r="16" fill="#14532d" />
              <circle cx="100" cy="100" r="14" fill="#facc15" />
              <circle cx="100" cy="100" r="12" fill="#14532d" />
              <path d="M96 95c0 3 2.5 5 5 5s5-2 5-5c0-1-1-2-2-2 1-1 1-2 0-3-1-1-2-1-3 0-1-1-2-1-3 0-1 1-1 2 0 3-1 0-2 1-2 2z" fill="#facc15" />
            </svg>
          </div>

          <p className="text-[11px] text-stone-600 font-semibold mt-1">
            Menerima pembayaran dari seluruh e-wallet & Mobile Banking:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 mt-1.5 text-[10px] text-stone-500 font-bold uppercase">
            <span>BSI Mobile</span> • <span>BCA Mobile</span> • <span>GoPay</span> • <span>OVO</span> • <span>DANA</span> • <span>ShopeePay</span> • <span>LinkAja</span>
          </div>

          <div className="w-full border-t border-dashed border-stone-300 my-4 pt-3 text-left space-y-2">
            <div className="text-xs font-bold text-stone-700 flex items-center justify-between">
              <span>Atau Transfer Rekening Resmi DKM:</span>
            </div>

            {/* Rekening BSI */}
            <div className="flex items-center justify-between bg-stone-50 border border-stone-200 p-2.5 rounded-xl text-xs">
              <div>
                <span className="font-bold text-emerald-800">Bank Syariah Indonesia (BSI)</span>
                <div className="font-mono font-bold text-stone-900 text-sm">{profile.bsiAccount}</div>
                <div className="text-[10px] text-stone-500">a.n. {profile.bsiAccountName}</div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(profile.bsiAccount, 'bsi')}
                className="no-print px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition"
              >
                {copiedAccount === 'bsi' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAccount === 'bsi' ? 'Disalin!' : 'Salin'}</span>
              </button>
            </div>

            {/* Rekening BCA */}
            <div className="flex items-center justify-between bg-stone-50 border border-stone-200 p-2.5 rounded-xl text-xs">
              <div>
                <span className="font-bold text-blue-800">Bank Central Asia (BCA)</span>
                <div className="font-mono font-bold text-stone-900 text-sm">{profile.bcaAccount}</div>
                <div className="text-[10px] text-stone-500">a.n. {profile.bcaAccountName}</div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(profile.bcaAccount, 'bca')}
                className="no-print px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition"
              >
                {copiedAccount === 'bca' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAccount === 'bca' ? 'Disalin!' : 'Salin'}</span>
              </button>
            </div>
          </div>

          <div className="text-[10px] text-stone-400 italic">
            "Sedekah tidak akan mengurangi harta, melainkan menambah keberkahan dan ketenteraman jiwa." (HR. Muslim)
          </div>
        </div>

        {/* Modal Footer */}
        <div className="no-print p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center">
          <span className="text-xs text-stone-500">Siap cetak & tempel di pilar masjid</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
