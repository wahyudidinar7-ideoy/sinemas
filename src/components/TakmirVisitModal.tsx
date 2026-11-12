import React, { useState, useEffect } from 'react';
import { CongregationMember, TakmirVisitRecord, MosqueProfile } from '../types/mosque';
import { X, Calendar, UserCheck, Heart, Save } from 'lucide-react';

interface TakmirVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: CongregationMember[];
  selectedMember: CongregationMember | null;
  profile: MosqueProfile;
  onSaveVisit: (visit: TakmirVisitRecord) => void;
}

export const TakmirVisitModal: React.FC<TakmirVisitModalProps> = ({
  isOpen,
  onClose,
  members,
  selectedMember,
  profile,
  onSaveVisit
}) => {
  const [memberId, setMemberId] = useState<string>('');
  const [visitDate, setVisitDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [takmirOfficer, setTakmirOfficer] = useState<string>(profile.takmirLeader);
  const [visitNotes, setVisitNotes] = useState<string>('');
  const [aidGiven, setAidGiven] = useState<'Sembako' | 'Uang' | 'Doa' | 'Lainnya'>('Sembako');

  useEffect(() => {
    if (selectedMember) {
      setMemberId(selectedMember.id);
    } else if (members.length > 0 && !memberId) {
      setMemberId(members[0].id);
    }
  }, [selectedMember, members]);

  if (!isOpen) return null;

  const currentMemberObj = members.find(m => m.id === memberId) || selectedMember || members[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMemberObj) {
      alert('Pilih jamaah terlebih dahulu!');
      return;
    }
    if (!visitNotes.trim()) {
      alert('Tuliskan catatan hasil kunjungan takmir!');
      return;
    }

    const payload: TakmirVisitRecord = {
      id: `vis-${Date.now()}`,
      memberId: currentMemberObj.memberId || currentMemberObj.id,
      memberName: currentMemberObj.name,
      visitDate: visitDate || new Date().toISOString().split('T')[0],
      takmirOfficer: takmirOfficer.trim() || profile.takmirLeader,
      visitNotes: visitNotes.trim(),
      aidGiven
    };

    onSaveVisit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shadow">
              <Heart className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Catat Kunjungan Takmir (Home Visit)
              </h3>
              <p className="text-xs text-emerald-200">
                Layanan silaturahmi & bantuan ke rumah jamaah Jogokariyan
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">
              Pilih Jamaah yang Dikunjungi
            </label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold text-emerald-950 text-sm bg-stone-50"
              required
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.memberId || 'JM'} - {m.name} ({m.address})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">
                Tanggal Kunjungan
              </label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">
                Bantuan yang Diberikan
              </label>
              <select
                value={aidGiven}
                onChange={(e) => setAidGiven(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold text-xs"
              >
                <option value="Sembako">Paket Sembako / Beras</option>
                <option value="Uang">Santunan Uang Tunai</option>
                <option value="Doa">Doa & Motivasi Kesembuhan</option>
                <option value="Lainnya">Lainnya (Kursi Roda / Obat)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">
              Petugas Takmir yang Berkunjung
            </label>
            <input
              type="text"
              placeholder="Contoh: Ustadz Muhammad Ridwan & Ir. Bambang"
              value={takmirOfficer}
              onChange={(e) => setTakmirOfficer(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase mb-1">
              Catatan & Hasil Kunjungan
            </label>
            <textarea
              rows={3}
              placeholder="Tuliskan kondisi jamaah saat dikunjungi, hasil obrolan, atau kebutuhan tindak lanjut takmir..."
              value={visitNotes}
              onChange={(e) => setVisitNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              required
            />
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 leading-relaxed">
            💡 <b>Efek Otomatis:</b> Menyimpan kunjungan ini akan otomatis memperbarui status jamaah menjadi <span className="font-bold text-emerald-800">"Sudah Dikunjungi"</span> dan mencatat tanggal kunjungan terakhir di profil jamaah.
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>Simpan Kunjungan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
