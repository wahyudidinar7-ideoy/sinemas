import React, { useState } from 'react';
import { 
  MosqueProfile, 
  PrayerTimes, 
  OfficerSchedule, 
  FridayOfficer 
} from '../types/mosque';
import { 
  generateMonthlyPrayerSchedule 
} from '../utils/prayerTimes';
import { 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  Printer, 
  Sliders, 
  Calendar, 
  Award, 
  Check, 
  X, 
  Search,
  Sparkles
} from 'lucide-react';

interface PrayerScheduleViewProps {
  profile: MosqueProfile;
  prayerTimes: PrayerTimes;
  officers: OfficerSchedule[];
  fridayOfficers: FridayOfficer[];
  isTakmir: boolean;
  onRequireTakmir: () => void;
  onOpenSettingsModal: () => void;
  onSaveOfficer: (officer: OfficerSchedule) => void;
  onDeleteOfficer: (id: string) => void;
  onSaveFridayOfficer: (friday: FridayOfficer) => void;
  onDeleteFridayOfficer: (id: string) => void;
}

export const PrayerScheduleView: React.FC<PrayerScheduleViewProps> = ({
  profile,
  prayerTimes,
  officers,
  fridayOfficers,
  isTakmir,
  onRequireTakmir,
  onOpenSettingsModal,
  onSaveOfficer,
  onDeleteOfficer,
  onSaveFridayOfficer,
  onDeleteFridayOfficer
}) => {
  const [activeTab, setActiveTab] = useState<'petugas' | 'bulanan' | 'jumat'>('petugas');
  
  // Officer Modal State
  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<OfficerSchedule | null>(null);
  const [officerForm, setOfficerForm] = useState<Partial<OfficerSchedule>>({
    date: new Date().toISOString().split('T')[0],
    prayer: 'Subuh',
    imam: '',
    muadzin: '',
    bilal: '',
    notes: ''
  });

  // Friday Khatib Modal State
  const [isFridayModalOpen, setIsFridayModalOpen] = useState(false);
  const [editingFriday, setEditingFriday] = useState<FridayOfficer | null>(null);
  const [fridayForm, setFridayForm] = useState<Partial<FridayOfficer>>({
    date: '',
    khatib: '',
    imam: '',
    muadzin: '',
    khutbahTheme: ''
  });

  // Monthly Table Data
  const now = new Date();
  const currentMonthIdx = now.getMonth();
  const currentYear = now.getFullYear();
  const monthlyRows = generateMonthlyPrayerSchedule(currentYear, currentMonthIdx, profile.offsets);
  const todayDateStr = now.toISOString().split('T')[0];

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Officer Form Handlers
  const openNewOfficerModal = () => {
    if (!isTakmir) {
      onRequireTakmir();
      return;
    }
    setEditingOfficer(null);
    setOfficerForm({
      date: new Date().toISOString().split('T')[0],
      prayer: 'Subuh',
      imam: '',
      muadzin: '',
      bilal: '',
      notes: ''
    });
    setIsOfficerModalOpen(true);
  };

  const openEditOfficerModal = (item: OfficerSchedule) => {
    if (!isTakmir) {
      onRequireTakmir();
      return;
    }
    setEditingOfficer(item);
    setOfficerForm({ ...item });
    setIsOfficerModalOpen(true);
  };

  const handleOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerForm.prayer || !officerForm.imam || !officerForm.muadzin) {
      alert('Lengkapi Sholat, Imam, dan Muadzin!');
      return;
    }

    const payload: OfficerSchedule = {
      id: editingOfficer?.id || `off-${Date.now()}`,
      date: officerForm.date || todayDateStr,
      prayer: officerForm.prayer as any,
      imam: officerForm.imam || '',
      muadzin: officerForm.muadzin || '',
      bilal: officerForm.bilal || '',
      notes: officerForm.notes || ''
    };

    onSaveOfficer(payload);
    setIsOfficerModalOpen(false);
  };

  // Friday Khatib Handlers
  const openNewFridayModal = () => {
    if (!isTakmir) {
      onRequireTakmir();
      return;
    }
    setEditingFriday(null);
    setFridayForm({
      date: todayDateStr,
      khatib: '',
      imam: '',
      muadzin: '',
      khutbahTheme: ''
    });
    setIsFridayModalOpen(true);
  };

  const openEditFridayModal = (item: FridayOfficer) => {
    if (!isTakmir) {
      onRequireTakmir();
      return;
    }
    setEditingFriday(item);
    setFridayForm({ ...item });
    setIsFridayModalOpen(true);
  };

  const handleFridaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fridayForm.khatib || !fridayForm.khutbahTheme || !fridayForm.date) {
      alert('Lengkapi Tanggal, Nama Khatib, dan Tema Khutbah!');
      return;
    }

    const payload: FridayOfficer = {
      id: editingFriday?.id || `fri-${Date.now()}`,
      date: fridayForm.date || todayDateStr,
      khatib: fridayForm.khatib || '',
      imam: fridayForm.imam || fridayForm.khatib || '',
      muadzin: fridayForm.muadzin || 'Kang Asep',
      khutbahTheme: fridayForm.khutbahTheme || ''
    };

    onSaveFridayOfficer(payload);
    setIsFridayModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Printable Sheet Header (Only visible on window.print()) */}
      <div className="hidden print-only mb-6 text-center border-b-2 border-stone-800 pb-4">
        <h1 className="text-2xl font-black uppercase text-stone-900 tracking-tight">
          {profile.name}
        </h1>
        <p className="text-sm text-stone-600 font-medium">
          {profile.address} • Hotline: {profile.takmirPhone.replace('62', '0')}
        </p>
        <h2 className="text-lg font-bold text-emerald-900 mt-2 uppercase">
          Jadwal Sholat & Petugas Imam, Muadzin, Khatib Jumat
        </h2>
        <p className="text-xs text-stone-500 font-mono">
          Bulan: {monthNames[currentMonthIdx]} {currentYear} • Waktu Setempat (WIB)
        </p>
      </div>

      {/* Page Header & Actions */}
      <div className="no-print bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Manajemen Waktu Sholat & Pelayanan Ibadah</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Jadwal Sholat & Petugas Rawatib
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Jadwal muadzin, imam lima waktu, khatib jumat, dan kalender waktu sholat bulanan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-xs"
          >
            <Printer className="w-4 h-4 text-emerald-700" />
            <span>🖨️ Print Jadwal & Petugas</span>
          </button>

          <button
            onClick={onOpenSettingsModal}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 transition"
          >
            <Sliders className="w-4 h-4 text-emerald-700" />
            <span>✏️ Sesuaikan Waktu Sholat</span>
          </button>

          <button
            onClick={openNewOfficerModal}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat Jadwal Petugas</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="no-print flex border-b border-stone-200 bg-white px-4 rounded-2xl shadow-xs gap-3">
        <button
          onClick={() => setActiveTab('petugas')}
          className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'petugas'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Petugas Rawatib (Imam & Muadzin)</span>
        </button>

        <button
          onClick={() => setActiveTab('jumat')}
          className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'jumat'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Khatib Sholat Jumat</span>
        </button>

        <button
          onClick={() => setActiveTab('bulanan')}
          className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'bulanan'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Tabel Jadwal 1 Bulan Penuh</span>
        </button>
      </div>

      {/* TAB 1: PETUGAS SHOLAT RAWATIB */}
      {(activeTab === 'petugas' || true) && (
        <div className={activeTab === 'petugas' ? 'space-y-4' : 'hidden print-only space-y-4'}>
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-stone-900">
                  Daftar Petugas Sholat Rawatib
                </h3>
                <p className="text-xs text-stone-500">
                  Petugas bertugas untuk Subuh, Dzuhur, Ashar, Maghrib, dan Isya
                </p>
              </div>
              <button
                onClick={openNewOfficerModal}
                className="no-print px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Petugas</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Waktu Sholat</th>
                    <th className="py-3 px-4">Nama Imam</th>
                    <th className="py-3 px-4">Nama Muadzin</th>
                    <th className="py-3 px-4">Bilal / Pendamping</th>
                    <th className="py-3 px-4">Catatan</th>
                    <th className="no-print py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {officers.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/80 transition">
                      <td className="py-3 px-4 font-mono font-medium text-stone-800 whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs">
                          {item.prayer}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900 whitespace-nowrap">
                        {item.imam}
                      </td>
                      <td className="py-3 px-4 text-stone-700 whitespace-nowrap">
                        {item.muadzin}
                      </td>
                      <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                        {item.bilal || '-'}
                      </td>
                      <td className="py-3 px-4 text-stone-500 italic max-w-xs truncate">
                        {item.notes || '-'}
                      </td>
                      <td className="no-print py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEditOfficerModal(item)}
                            title="Edit Petugas"
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (!isTakmir) {
                                onRequireTakmir();
                                return;
                              }
                              if (confirm(`Hapus jadwal petugas ${item.prayer}?`)) {
                                onDeleteOfficer(item.id);
                              }
                            }}
                            title="Hapus Petugas"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KHATIB SHOLAT JUMAT */}
      {(activeTab === 'jumat' || true) && (
        <div className={activeTab === 'jumat' ? 'space-y-4' : 'hidden print-only space-y-4 mt-6'}>
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-stone-900">
                  Jadwal Khutbah Sholat Jumat (4 Pekan ke Depan)
                </h3>
                <p className="text-xs text-stone-500">
                  Daftar khatib tamu & tema khutbah Jumatan Masjid Al Hidayah
                </p>
              </div>
              <button
                onClick={openNewFridayModal}
                className="no-print px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Khatib Jumat</span>
              </button>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {fridayOfficers.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-amber-200/80 bg-amber-50/40 hover:bg-amber-50 transition space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-900 bg-amber-200/70 px-2.5 py-0.5 rounded-md">
                      🗓️ Jumat, {item.date}
                    </span>
                    <div className="no-print flex items-center gap-1">
                      <button
                        onClick={() => openEditFridayModal(item)}
                        className="p-1 rounded bg-white hover:bg-amber-100 text-amber-800 transition"
                        title="Edit Khatib"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (!isTakmir) {
                            onRequireTakmir();
                            return;
                          }
                          if (confirm(`Hapus jadwal khatib ${item.khatib}?`)) {
                            onDeleteFridayOfficer(item.id);
                          }
                        }}
                        className="p-1 rounded bg-white hover:bg-rose-100 text-rose-700 transition"
                        title="Hapus Khatib"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-sm sm:text-base font-extrabold text-stone-900">
                    Khatib: {item.khatib}
                  </div>

                  <div className="text-xs text-stone-700 italic bg-white/70 p-2.5 rounded-xl border border-amber-100">
                    "{item.khutbahTheme}"
                  </div>

                  <div className="pt-1 flex items-center justify-between text-xs text-stone-600">
                    <span>Imam: <b>{item.imam}</b></span>
                    <span>Muadzin: <b>{item.muadzin}</b></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TABEL 1 BULAN PENUH */}
      {(activeTab === 'bulanan' || true) && (
        <div className={activeTab === 'bulanan' ? 'space-y-4' : 'hidden print-only space-y-4 mt-6'}>
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-stone-900">
                  Kalender Jadwal Waktu Sholat — {monthNames[currentMonthIdx]} {currentYear}
                </h3>
                <p className="text-xs text-stone-500">
                  Perhitungan waktu sholat berdasarkan titik koordinat lokal dengan koreksi takmir
                </p>
              </div>
              <button
                onClick={onOpenSettingsModal}
                className="no-print px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Atur Koreksi Menit</span>
              </button>
            </div>

            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-emerald-950 text-white font-bold uppercase tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Hari</th>
                    <th className="py-2.5 px-3">Imsak</th>
                    <th className="py-2.5 px-3 text-amber-300">Subuh</th>
                    <th className="py-2.5 px-3">Terbit</th>
                    <th className="py-2.5 px-3 text-amber-300">Dzuhur</th>
                    <th className="py-2.5 px-3 text-amber-300">Ashar</th>
                    <th className="py-2.5 px-3 text-amber-300">Maghrib</th>
                    <th className="py-2.5 px-3 text-amber-300">Isya</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {monthlyRows.map((row) => {
                    const isToday = row.date === todayDateStr;
                    return (
                      <tr
                        key={row.date}
                        className={`transition ${
                          isToday
                            ? 'bg-amber-100/90 font-bold text-stone-950 ring-1 ring-amber-400'
                            : 'hover:bg-stone-50 text-stone-800'
                        }`}
                      >
                        <td className="py-2 px-3 font-mono">
                          {row.date.split('-')[2]} {monthNames[currentMonthIdx].slice(0, 3)}
                          {isToday && (
                            <span className="ml-1 text-[9px] bg-stone-950 text-amber-300 px-1 py-0.5 rounded font-sans uppercase">
                              Hari Ini
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-medium">{row.dayName}</td>
                        <td className="py-2 px-3 font-mono text-stone-600">{row.imsak}</td>
                        <td className="py-2 px-3 font-mono font-bold text-emerald-900">{row.subuh}</td>
                        <td className="py-2 px-3 font-mono text-stone-600">{row.terbit}</td>
                        <td className="py-2 px-3 font-mono font-bold text-emerald-900">{row.dzuhur}</td>
                        <td className="py-2 px-3 font-mono font-bold text-emerald-900">{row.ashar}</td>
                        <td className="py-2 px-3 font-mono font-bold text-emerald-900">{row.maghrib}</td>
                        <td className="py-2 px-3 font-mono font-bold text-emerald-900">{row.isya}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INPUT / EDIT JADWAL PETUGAS */}
      {isOfficerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingOfficer ? '✏️ Edit Jadwal Petugas' : '+ Buat Jadwal Petugas Baru'}
              </h3>
              <button
                onClick={() => setIsOfficerModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOfficerSubmit} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tanggal</label>
                <input
                  type="date"
                  value={officerForm.date}
                  onChange={(e) => setOfficerForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Waktu Sholat</label>
                <select
                  value={officerForm.prayer}
                  onChange={(e) => setOfficerForm(prev => ({ ...prev, prayer: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold text-emerald-900"
                  required
                >
                  <option value="Subuh">Subuh</option>
                  <option value="Dzuhur">Dzuhur</option>
                  <option value="Ashar">Ashar</option>
                  <option value="Maghrib">Maghrib</option>
                  <option value="Isya">Isya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nama Imam</label>
                <input
                  type="text"
                  placeholder="Contoh: Ustadz Muhammad Ridwan, M.Ag"
                  value={officerForm.imam}
                  onChange={(e) => setOfficerForm(prev => ({ ...prev, imam: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nama Muadzin</label>
                <input
                  type="text"
                  placeholder="Contoh: Kang Asep"
                  value={officerForm.muadzin}
                  onChange={(e) => setOfficerForm(prev => ({ ...prev, muadzin: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Bilal / Pendamping (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Pak Solihin"
                  value={officerForm.bilal}
                  onChange={(e) => setOfficerForm(prev => ({ ...prev, bilal: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Catatan Khusus</label>
                <input
                  type="text"
                  placeholder="Contoh: Kultum Subuh 10 Menit"
                  value={officerForm.notes}
                  onChange={(e) => setOfficerForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOfficerModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md transition"
                >
                  Simpan Petugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INPUT / EDIT KHATIB JUMAT */}
      {isFridayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-amber-500 text-stone-950 p-4 flex items-center justify-between">
              <h3 className="font-extrabold text-sm">
                {editingFriday ? '✏️ Edit Jadwal Khatib Jumat' : '+ Buat Jadwal Khatib Jumat Baru'}
              </h3>
              <button
                onClick={() => setIsFridayModalOpen(false)}
                className="p-1 rounded text-stone-800 hover:text-stone-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFridaySubmit} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tanggal Sholat Jumat</label>
                <input
                  type="date"
                  value={fridayForm.date}
                  onChange={(e) => setFridayForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nama Khatib</label>
                <input
                  type="text"
                  placeholder="Contoh: KH. Syamsul Ma'arif, M.A."
                  value={fridayForm.khatib}
                  onChange={(e) => setFridayForm(prev => ({ ...prev, khatib: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tema Khutbah</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Meneladani Masjid Nabawi: Menjadikan Rumah Allah Pusat Peradaban Umat"
                  value={fridayForm.khutbahTheme}
                  onChange={(e) => setFridayForm(prev => ({ ...prev, khutbahTheme: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Imam Jumat</label>
                  <input
                    type="text"
                    value={fridayForm.imam}
                    onChange={(e) => setFridayForm(prev => ({ ...prev, imam: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    placeholder="Nama Imam"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Muadzin / Bilal</label>
                  <input
                    type="text"
                    value={fridayForm.muadzin}
                    onChange={(e) => setFridayForm(prev => ({ ...prev, muadzin: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    placeholder="Nama Muadzin"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFridayModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-extrabold shadow-md transition"
                >
                  Simpan Khatib
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
