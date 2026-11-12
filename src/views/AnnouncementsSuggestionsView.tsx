import React, { useState } from 'react';
import { 
  Announcement, 
  Suggestion, 
  PrayerRequest, 
  MosqueProfile 
} from '../types/mosque';
import { 
  Bell, 
  Plus, 
  MessageSquare, 
  HeartHandshake, 
  Printer, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  X, 
  Sparkles, 
  AlertCircle,
  Check
} from 'lucide-react';

interface AnnouncementsSuggestionsViewProps {
  profile: MosqueProfile;
  announcements: Announcement[];
  suggestions: Suggestion[];
  prayerRequests: PrayerRequest[];
  isTakmir: boolean;
  onRequireTakmir: () => void;
  onSaveAnnouncement: (anc: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
  onSaveSuggestion: (sug: Suggestion) => void;
  onMarkSuggestionFollowedUp: (id: string, notes: string) => void;
  onSavePrayerRequest: (pr: PrayerRequest) => void;
  onDeletePrayerRequest: (id: string) => void;
}

export const AnnouncementsSuggestionsView: React.FC<AnnouncementsSuggestionsViewProps> = ({
  profile,
  announcements,
  suggestions,
  prayerRequests,
  isTakmir,
  onRequireTakmir,
  onSaveAnnouncement,
  onDeleteAnnouncement,
  onSaveSuggestion,
  onMarkSuggestionFollowedUp,
  onSavePrayerRequest,
  onDeletePrayerRequest
}) => {
  const [activeTab, setActiveTab] = useState<'pengumuman' | 'saran' | 'doa'>('pengumuman');

  // Announcement Modal State
  const [isAncModalOpen, setIsAncModalOpen] = useState(false);
  const [editingAnc, setEditingAnc] = useState<Announcement | null>(null);
  const [ancForm, setAncForm] = useState<Partial<Announcement>>({
    title: '',
    content: '',
    validUntil: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    category: 'Kajian',
    isPriority: false
  });

  // Suggestion Modal State
  const [isSugModalOpen, setIsSugModalOpen] = useState(false);
  const [sugName, setSugName] = useState('');
  const [sugPhone, setSugPhone] = useState('');
  const [sugCategory, setSugCategory] = useState('Fasilitas & Kebersihan');
  const [sugContent, setSugContent] = useState('');
  const [sugToast, setSugToast] = useState('');

  // Follow-up notes modal
  const [followUpId, setFollowUpId] = useState<string | null>(null);
  const [followUpText, setFollowUpText] = useState('');

  // Prayer Request Modal State
  const [isPrModalOpen, setIsPrModalOpen] = useState(false);
  const [prForm, setPrForm] = useState<Partial<PrayerRequest>>({
    name: '',
    type: 'sakit',
    description: '',
    date: new Date().toISOString().split('T')[0],
    address: 'Dusun Legokjawa',
    funeralInfo: ''
  });

  // Announcement Handlers
  const openNewAnc = () => {
    if (!isTakmir) {
      onRequireTakmir();
      return;
    }
    setEditingAnc(null);
    setAncForm({
      title: '',
      content: '',
      validUntil: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      category: 'Kajian',
      isPriority: false
    });
    setIsAncModalOpen(true);
  };

  const openEditAnc = (anc: Announcement) => {
    if (!isTakmir) {
      onRequireTakmir();
      return;
    }
    setEditingAnc(anc);
    setAncForm({ ...anc });
    setIsAncModalOpen(true);
  };

  const handleAncSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ancForm.title || !ancForm.content) {
      alert('Judul dan Isi Pengumuman harus diisi!');
      return;
    }

    const payload: Announcement = {
      id: editingAnc?.id || `anc-${Date.now()}`,
      title: ancForm.title || '',
      content: ancForm.content || '',
      validUntil: ancForm.validUntil || new Date().toISOString().split('T')[0],
      category: (ancForm.category as any) || 'Kajian',
      isPriority: Boolean(ancForm.isPriority),
      createdAt: editingAnc?.createdAt || new Date().toISOString().split('T')[0]
    };

    onSaveAnnouncement(payload);
    setIsAncModalOpen(false);
  };

  // Suggestion Submit
  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sugContent.trim()) {
      alert('Silakan tulis saran atau masukan Anda!');
      return;
    }

    const payload: Suggestion = {
      id: `sug-${Date.now()}`,
      name: sugName.trim() || 'Jamaah Anonim',
      phone: sugPhone.trim() || '-',
      category: sugCategory,
      content: sugContent.trim(),
      status: 'menunggu',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onSaveSuggestion(payload);
    setSugName('');
    setSugPhone('');
    setSugContent('');
    setIsSugModalOpen(false);
    setSugToast('Terima kasih! Masukan Anda telah masuk ke kotak saran takmir.');
    setTimeout(() => setSugToast(''), 4000);
  };

  // Follow up submit
  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpId) return;
    onMarkSuggestionFollowedUp(followUpId, followUpText);
    setFollowUpId(null);
    setFollowUpText('');
  };

  // Prayer Request Submit
  const handlePrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prForm.name || !prForm.description) {
      alert('Nama dan Deskripsi wajib diisi!');
      return;
    }

    const payload: PrayerRequest = {
      id: `pr-${Date.now()}`,
      name: prForm.name || '',
      type: (prForm.type as any) || 'sakit',
      description: prForm.description || '',
      date: prForm.date || new Date().toISOString().split('T')[0],
      address: prForm.address || '-',
      funeralInfo: prForm.funeralInfo || ''
    };

    onSavePrayerRequest(payload);
    setIsPrModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Print Sheet Header */}
      <div className="hidden print-only mb-6 text-center border-b-2 border-stone-800 pb-4">
        <h1 className="text-2xl font-black uppercase text-stone-900 tracking-tight">
          {profile.name}
        </h1>
        <p className="text-sm text-stone-600">
          {profile.address} • Kontak DKM: {profile.takmirPhone.replace('62', '0')}
        </p>
        <h2 className="text-lg font-bold text-emerald-900 mt-2 uppercase">
          Warta & Pengumuman Resmi Masjid
        </h2>
      </div>

      {/* View Header */}
      <div className="no-print bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full mb-1">
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span>Pusat Informasi & Suara Jamaah</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Pengumuman, Kotak Saran & Warta Doa
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Papan mading digital masjid, aspirasi jamaah, warta duka, dan doa kesembuhan sesama muslim
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4 text-emerald-700" />
            <span>🖨️ Cetak Pengumuman Mading</span>
          </button>

          {activeTab === 'pengumuman' && (
            <button
              onClick={openNewAnc}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Pengumuman Baru</span>
            </button>
          )}

          {activeTab === 'saran' && (
            <button
              onClick={() => setIsSugModalOpen(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>+ Tulis Saran Jamaah</span>
            </button>
          )}

          {activeTab === 'doa' && (
            <button
              onClick={() => {
                if (!isTakmir) {
                  onRequireTakmir();
                  return;
                }
                setIsPrModalOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Warta Doa / Lelayu</span>
            </button>
          )}
        </div>
      </div>

      {sugToast && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-xs text-emerald-900 flex items-center gap-2 shadow-sm animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{sugToast}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="no-print flex border-b border-stone-200 bg-white px-4 rounded-2xl shadow-xs gap-3">
        <button
          onClick={() => setActiveTab('pengumuman')}
          className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'pengumuman'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Pengumuman Masjid ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saran')}
          className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'saran'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Kotak Saran & Aspirasi ({suggestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('doa')}
          className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'doa'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Warta Doa & Lelayu ({prayerRequests.length})</span>
        </button>
      </div>

      {/* TAB 1: PENGUMUMAN MASJID */}
      {(activeTab === 'pengumuman' || true) && (
        <div className={activeTab === 'pengumuman' ? 'space-y-4' : 'hidden print-only space-y-4'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((anc) => (
              <div
                key={anc.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border shadow-xs hover:border-emerald-300 transition flex flex-col justify-between space-y-3 ${
                  anc.isPriority ? 'border-amber-400 bg-amber-50/20' : 'border-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                        {anc.category}
                      </span>
                      {anc.isPriority && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-200 text-amber-900">
                          ⭐ Prioritas
                        </span>
                      )}
                    </div>

                    <div className="no-print flex items-center gap-1">
                      <button
                        onClick={() => openEditAnc(anc)}
                        className="p-1 rounded bg-stone-100 hover:bg-amber-100 text-amber-800 transition"
                        title="Edit Pengumuman"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (!isTakmir) {
                            onRequireTakmir();
                            return;
                          }
                          if (confirm(`Hapus pengumuman "${anc.title}"?`)) {
                            onDeleteAnnouncement(anc.id);
                          }
                        }}
                        className="p-1 rounded bg-stone-100 hover:bg-rose-100 text-rose-700 transition"
                        title="Hapus Pengumuman"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base sm:text-lg text-stone-900 mt-2">
                    {anc.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                    {anc.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span>Diumumkan: {anc.createdAt}</span>
                  <span className="font-mono text-emerald-800 font-medium">
                    Berlaku s/d: {anc.validUntil}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: KOTAK SARAN & ASPIRASI */}
      {(activeTab === 'saran' || true) && (
        <div className={activeTab === 'saran' ? 'space-y-4' : 'hidden print-only space-y-4 mt-6'}>
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-stone-900">
                  Aspirasi & Masukan Jamaah untuk Takmir
                </h3>
                <p className="text-xs text-stone-500">
                  Semua saran dibaca takmir demi peningkatan kenyamanan ibadah di rumah Allah
                </p>
              </div>
              <button
                onClick={() => setIsSugModalOpen(true)}
                className="no-print px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Isi Kotak Saran</span>
              </button>
            </div>

            <div className="space-y-3">
              {suggestions.map((sug) => (
                <div
                  key={sug.id}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-200 transition space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">
                        {sug.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                        {sug.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sug.status === 'ditindaklanjuti'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sug.status === 'ditindaklanjuti' ? 'Sudah Ditindaklanjuti' : 'Menunggu Tindak Lanjut'}
                      </span>

                      {sug.status === 'menunggu' && (
                        <button
                          onClick={() => {
                            if (!isTakmir) {
                              onRequireTakmir();
                              return;
                            }
                            setFollowUpId(sug.id);
                            setFollowUpText('Sudah dikoordinasikan dan diselesaikan oleh pengurus takmir.');
                          }}
                          className="no-print px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Tandai Selesai</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-stone-700 leading-relaxed italic">
                    "{sug.content}"
                  </p>

                  {sug.followUpNotes && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] space-y-0.5">
                      <div className="font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tanggapan & Tindak Lanjut Takmir:</span>
                      </div>
                      <div>{sug.followUpNotes}</div>
                    </div>
                  )}

                  <div className="text-[10px] text-stone-400 font-mono pt-1">
                    Dikirim pada: {sug.createdAt} {sug.phone !== '-' ? `• Kontak: ${sug.phone}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WARTA DOA & LELAYU */}
      {(activeTab === 'doa' || true) && (
        <div className={activeTab === 'doa' ? 'space-y-4' : 'hidden print-only space-y-4 mt-6'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prayerRequests.map((pr) => (
              <div
                key={pr.id}
                className={`p-5 rounded-3xl border shadow-xs transition space-y-3 ${
                  pr.type === 'meninggal'
                    ? 'bg-stone-100/70 border-stone-300'
                    : 'bg-amber-50/50 border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    pr.type === 'meninggal' ? 'bg-stone-800 text-white' : 'bg-amber-200 text-amber-950'
                  }`}>
                    {pr.type === 'meninggal' ? 'Kabar Lelayu / Duka Cita' : 'Mohon Doa Kesembuhan'}
                  </span>

                  <div className="no-print flex items-center gap-1">
                    <button
                      onClick={() => {
                        if (!isTakmir) {
                          onRequireTakmir();
                          return;
                        }
                        if (confirm(`Hapus warta doa ${pr.name}?`)) {
                          onDeletePrayerRequest(pr.id);
                        }
                      }}
                      className="p-1 rounded bg-stone-200 hover:bg-rose-100 text-rose-700 transition"
                      title="Hapus Warta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-base text-stone-900">
                    {pr.name}
                  </h4>
                  <div className="text-xs text-stone-500">
                    Alamat: {pr.address}
                  </div>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">
                  {pr.description}
                </p>

                {pr.funeralInfo && (
                  <div className="p-2 rounded-xl bg-stone-200/60 text-[11px] text-stone-800 font-medium">
                    📌 {pr.funeralInfo}
                  </div>
                )}

                <div className="text-[10px] text-stone-400 font-mono pt-1">
                  Tanggal Warta: {pr.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: INPUT / EDIT PENGUMUMAN */}
      {isAncModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingAnc ? '✏️ Edit Pengumuman' : '+ Buat Pengumuman Baru'}
              </h3>
              <button
                onClick={() => setIsAncModalOpen(false)}
                className="p-1 rounded text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAncSubmit} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Judul Pengumuman</label>
                <input
                  type="text"
                  placeholder="Contoh: Buka Puasa Senin-Kamis 150 Porsi"
                  value={ancForm.title}
                  onChange={(e) => setAncForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Kategori</label>
                  <select
                    value={ancForm.category}
                    onChange={(e) => setAncForm(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold"
                  >
                    <option value="Kajian">Kajian</option>
                    <option value="Keuangan">Keuangan</option>
                    <option value="Pembangunan">Pembangunan</option>
                    <option value="Duka Cita">Duka Cita</option>
                    <option value="Lomba">Lomba / Remaja</option>
                    <option value="Layanan Umat">Layanan Umat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Berlaku Sampai</label>
                  <input
                    type="date"
                    value={ancForm.validUntil}
                    onChange={(e) => setAncForm(prev => ({ ...prev, validUntil: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Isi Lengkap Pengumuman</label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan detail pengumuman yang jelas untuk jamaah..."
                  value={ancForm.content}
                  onChange={(e) => setAncForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={ancForm.isPriority}
                  onChange={(e) => setAncForm(prev => ({ ...prev, isPriority: e.target.checked }))}
                  className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                />
                <span>Jadikan Pengumuman Penting / Prioritas di Ticker</span>
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAncModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md transition"
                >
                  Simpan Pengumuman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INPUT SARAN JAMAAH */}
      {isSugModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-amber-500 text-stone-950 p-4 flex items-center justify-between">
              <h3 className="font-extrabold text-sm">Kotak Saran & Aspirasi Jamaah</h3>
              <button
                onClick={() => setIsSugModalOpen(false)}
                className="p-1 rounded text-stone-800 hover:text-stone-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSuggestionSubmit} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nama Anda (Boleh Kosongkan jika ingin Anonim)
                </label>
                <input
                  type="text"
                  placeholder="Nama Lengkap / Jamaah Masjid"
                  value={sugName}
                  onChange={(e) => setSugName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nomor WhatsApp (Opsional, jika ingin dihubungi takmir)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 08123456789"
                  value={sugPhone}
                  onChange={(e) => setSugPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Kategori Masukan</label>
                <select
                  value={sugCategory}
                  onChange={(e) => setSugCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold text-stone-800"
                >
                  <option value="Fasilitas & Kebersihan">Fasilitas & Kebersihan</option>
                  <option value="Sound System & Audio">Sound System & Audio</option>
                  <option value="Kajian & Majelis">Kajian & Majelis Ta'lim</option>
                  <option value="Parkir & Keamanan">Parkir & Keamanan</option>
                  <option value="Pelayanan Umat">Pelayanan Umat & Sosial</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Saran / Kritik Membangun</label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan masukan atau kritik konstruktif Anda dengan santun..."
                  value={sugContent}
                  onChange={(e) => setSugContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSugModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-extrabold shadow-md transition"
                >
                  Kirim Masukan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TINDAK LANJUT SARAN (TAKMIR) */}
      {followUpId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Catatan Tindak Lanjut Takmir</h3>
              <button
                onClick={() => setFollowUpId(null)}
                className="p-1 rounded text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFollowUpSubmit} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Tindakan yang Telah Dilakukan:
                </label>
                <textarea
                  rows={3}
                  value={followUpText}
                  onChange={(e) => setFollowUpText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFollowUpId(null)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md transition"
                >
                  Tandai Selesai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INPUT WARTA DOA / LELAYU */}
      {isPrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">+ Tambah Warta Doa & Lelayu</h3>
              <button
                onClick={() => setIsPrModalOpen(false)}
                className="p-1 rounded text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePrSubmit} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Jenis Warta</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPrForm(prev => ({ ...prev, type: 'sakit' }))}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      prForm.type === 'sakit'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    🤲 Jamaah Sakit
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrForm(prev => ({ ...prev, type: 'meninggal' }))}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      prForm.type === 'meninggal'
                        ? 'bg-stone-800 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    🕊️ Kabar Lelayu / Wafat
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nama Jamaah</label>
                <input
                  type="text"
                  placeholder="Contoh: Bapak H. Darsum / Almarhumah Ibu Aminah"
                  value={prForm.name}
                  onChange={(e) => setPrForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Alamat Domisili</label>
                <input
                  type="text"
                  placeholder="Contoh: RT 01 / RW 01 Dusun Legokjawa"
                  value={prForm.address}
                  onChange={(e) => setPrForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Keterangan / Mohon Doa</label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan kondisi sakit atau kabar duka cita..."
                  value={prForm.description}
                  onChange={(e) => setPrForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  required
                />
              </div>

              {prForm.type === 'meninggal' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Informasi Sholat Jenazah & Pemakaman
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Sholat jenazah ba'da Dzuhur di Masjid Al Hidayah, pemakaman TPU Muslim"
                    value={prForm.funeralInfo}
                    onChange={(e) => setPrForm(prev => ({ ...prev, funeralInfo: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md transition"
                >
                  Simpan Warta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
