import React, { useState } from 'react';
import { ShieldCheck, Lock, X, AlertCircle, KeyRound } from 'lucide-react';

interface TakmirLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTakmir: boolean;
  correctPassword: string;
  onLoginSuccess: () => void;
  onLogout: () => void;
}

export const TakmirLoginModal: React.FC<TakmirLoginModalProps> = ({
  isOpen,
  onClose,
  isTakmir,
  correctPassword,
  onLoginSuccess,
  onLogout
}) => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword || password === 'takmir123') {
      setErrorMsg('');
      setPassword('');
      onLoginSuccess();
      onClose();
    } else {
      setErrorMsg('Password salah! Silakan coba lagi (Default: takmir123)');
    }
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow">
              {isTakmir ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                {isTakmir ? 'Status Mode Takmir' : 'Autentikasi Takmir DKM'}
              </h3>
              <p className="text-xs text-emerald-200">
                {isTakmir ? 'Anda memiliki hak akses penuh pengurus' : 'Masukkan password untuk mengelola data'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isTakmir ? (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-9 h-9" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-base">Mode Takmir Sedang Aktif</h4>
                <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto">
                  Anda dapat menambah, mengubah, memverifikasi infaq, dan menghapus seluruh data masjid.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 text-sm font-semibold transition"
                >
                  Lanjut Kelola
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition"
                >
                  Keluar ke Mode Jamaah
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                <KeyRound className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Informasi:</span> Mode Takmir memungkinkan Anda mengedit jadwal sholat, input infaq, mengelola jamaah, dan mengubah identitas masjid.
                  <div className="mt-1 font-mono text-[11px] text-amber-700">Password bawaan: <b>takmir123</b></div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Password Takmir
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Ketik password..."
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm"
                />
              </div>

              {errorMsg && (
                <div className="text-xs text-rose-600 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 text-sm font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold shadow-md transition"
                >
                  Masuk Mode Takmir
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
