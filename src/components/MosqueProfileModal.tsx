import React, { useState } from 'react';
import { MosqueProfile } from '../types/mosque';
import { 
  X, 
  Save, 
  Settings, 
  Clock, 
  Building2, 
  CreditCard, 
  KeyRound, 
  Download, 
  Upload, 
  RotateCcw,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { Storage } from '../utils/storage';

interface MosqueProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: MosqueProfile;
  isTakmir: boolean;
  onSaveProfile: (newProfile: MosqueProfile) => void;
  onRequireTakmir: () => void;
  onResetData: () => void;
}

export const MosqueProfileModal: React.FC<MosqueProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  isTakmir,
  onSaveProfile,
  onRequireTakmir,
  onResetData
}) => {
  const [formData, setFormData] = useState<MosqueProfile>({ ...profile });
  const [activeTab, setActiveTab] = useState<'identitas' | 'rekening' | 'sholat' | 'keamanan' | 'backup'>('identitas');
  const [toastMsg, setToastMsg] = useState('');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleChange = (field: keyof MosqueProfile, val: any) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleOffsetChange = (prayer: keyof MosqueProfile['offsets'], val: number) => {
    setFormData(prev => ({
      ...prev,
      offsets: {
        ...prev.offsets,
        [prayer]: val
      }
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTakmir) {
      onRequireTakmir();
      return;
    }
    onSaveProfile(formData);
    showToast('Identitas masjid berhasil disimpan!');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleExport = () => {
    const jsonStr = Storage.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_masjid_jogokariyan_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('File backup data masjid berhasil diunduh!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content && Storage.importAllData(content)) {
        showToast('Data berhasil dipulihkan dari file backup!');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        alert('Format file backup tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh data kembali ke kondisi default awal? Semua input perubahan akan dihapus.')) {
      onResetData();
      showToast('Data berhasil direset ke setelan awal.');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                Sesuaikan Identitas & Konfigurasi Masjid
              </h3>
              <p className="text-xs text-emerald-200">
                Ubah nama masjid, rekening infaq, penyesuaian waktu sholat, dan backup
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

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 pt-2 overflow-x-auto gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('identitas')}
            className={`pb-2.5 px-3 text-xs font-bold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'identitas'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Identitas DKM</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rekening')}
            className={`pb-2.5 px-3 text-xs font-bold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'rekening'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Rekening & QRIS</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sholat')}
            className={`pb-2.5 px-3 text-xs font-bold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'sholat'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Koreksi Waktu Sholat</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('keamanan')}
            className={`pb-2.5 px-3 text-xs font-bold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'keamanan'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Password Takmir</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`pb-2.5 px-3 text-xs font-bold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'backup'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Backup & Reset</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {!isTakmir && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  Anda berada dalam <b>Mode Jamaah</b>. Untuk menyimpan perubahan konfigurasi, login ke Mode Takmir terlebih dahulu.
                </span>
              </div>
              <button
                type="button"
                onClick={onRequireTakmir}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg shrink-0 shadow-sm transition"
              >
                Login Takmir
              </button>
            </div>
          )}

          {toastMsg && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* TAB 1: IDENTITAS */}
          {activeTab === 'identitas' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Nama Masjid
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  placeholder="Contoh: Masjid Al Hidayah - Legokjawa"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Tagline / Visi Masjid
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  placeholder="Contoh: Masjid Memakmurkan Umat, Umat Memakmurkan Masjid - Saldo Kas 0 untuk Umat"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Alamat Lengkap Masjid
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  placeholder="Alamat jalan, dusun, kelurahan, kecamatan, kabupaten"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Ketua DKM / Takmir
                  </label>
                  <input
                    type="text"
                    value={formData.takmirLeader}
                    onChange={(e) => handleChange('takmirLeader', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Sekretaris DKM
                  </label>
                  <input
                    type="text"
                    value={formData.takmirSecretary}
                    onChange={(e) => handleChange('takmirSecretary', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Bendahara Kas
                  </label>
                  <input
                    type="text"
                    value={formData.treasurer}
                    onChange={(e) => handleChange('treasurer', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    No WhatsApp Takmir (Format 62xxx)
                  </label>
                  <input
                    type="text"
                    value={formData.takmirPhone}
                    onChange={(e) => handleChange('takmirPhone', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                    placeholder="Contoh: 6281234567890"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REKENING & QRIS */}
          {activeTab === 'rekening' && (
            <div className="space-y-4">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-600">
                Informasi rekening ini akan tampil otomatis pada formulir infaq jamaah, kartu transfer, tombol salin rekening, dan lembar print.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                  <div className="font-bold text-xs text-emerald-900">Rekening Bank Syariah Indonesia (BSI)</div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700">Nomor Rekening BSI</label>
                    <input
                      type="text"
                      value={formData.bsiAccount}
                      onChange={(e) => handleChange('bsiAccount', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700">Atas Nama (A.N.)</label>
                    <input
                      type="text"
                      value={formData.bsiAccountName}
                      onChange={(e) => handleChange('bsiAccountName', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
                  <div className="font-bold text-xs text-blue-900">Rekening Bank BCA</div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700">Nomor Rekening BCA</label>
                    <input
                      type="text"
                      value={formData.bcaAccount}
                      onChange={(e) => handleChange('bcaAccount', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700">Atas Nama (A.N.)</label>
                    <input
                      type="text"
                      value={formData.bcaAccountName}
                      onChange={(e) => handleChange('bcaAccountName', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                <div className="font-bold text-xs text-amber-900">Konfigurasi QRIS Masjid (Simulasi)</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700">Nama Merchant QRIS</label>
                    <input
                      type="text"
                      value={formData.qrisMerchantName}
                      onChange={(e) => handleChange('qrisMerchantName', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700">NMID QRIS</label>
                    <input
                      type="text"
                      value={formData.qrisNmid}
                      onChange={(e) => handleChange('qrisNmid', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KOREKSI WAKTU SHOLAT */}
          {activeTab === 'sholat' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
                <span className="font-bold">Penyesuaian Waktu Sholat Takmir:</span> Gunakan angka positif (+) untuk memajukan menit, atau angka negatif (-) untuk memundurkan menit jadwal sholat sesuai kesepakatan rukyah/ikhtiyat masjid setempat.
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['imsak', 'subuh', 'terbit', 'dzuhur', 'ashar', 'maghrib', 'isya'] as const).map((p) => (
                  <div key={p} className="p-3 rounded-xl border border-stone-200 bg-stone-50">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      {p}
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="-60"
                        max="60"
                        value={formData.offsets[p] || 0}
                        onChange={(e) => handleOffsetChange(p, parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 rounded-lg border border-stone-300 text-center font-bold text-sm bg-white"
                      />
                      <span className="text-[11px] text-stone-500 font-medium">mnt</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: KEAMANAN & PASSWORD */}
          {activeTab === 'keamanan' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Password Mode Takmir
                </label>
                <input
                  type="text"
                  value={formData.takmirPassword}
                  onChange={(e) => handleChange('takmirPassword', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                  placeholder="takmir123"
                  required
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Password ini digunakan takmir untuk masuk ke mode admin pengeditan (default: <code>takmir123</code>).
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: BACKUP & RESET */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                <h4 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-700" />
                  <span>Cadangkan / Ekspor Data Masjid (JSON)</span>
                </h4>
                <p className="text-xs text-stone-600">
                  Simpan seluruh catatan kas, jadwal sholat, kajian, daftar hadir, dan jamaah ke dalam 1 file JSON di komputer atau HP Anda.
                </p>
                <button
                  type="button"
                  onClick={handleExport}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh File Backup JSON</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                <h4 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-amber-700" />
                  <span>Pulihkan / Impor Data dari Backup</span>
                </h4>
                <p className="text-xs text-stone-600">
                  Unggah file backup JSON sebelumnya untuk mengembalikan data masjid.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold cursor-pointer shadow-sm transition">
                  <Upload className="w-4 h-4" />
                  <span>Pilih File Backup JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
                <h4 className="text-sm font-bold text-rose-800 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-rose-600" />
                  <span>Reset Kembali ke Data Awal Bawaan</span>
                </h4>
                <p className="text-xs text-rose-700">
                  Kembalikan contoh transaksi kas, jadwal imam, kajian Jogokariyan, dan profil masjid ke kondisi awal.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset ke Data Default</span>
                </button>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
            >
              Tutup
            </button>
            <button
              type="submit"
              disabled={!isTakmir}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition ${
                isTakmir
                  ? 'bg-emerald-800 hover:bg-emerald-900 text-white'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
