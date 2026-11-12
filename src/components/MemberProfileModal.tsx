import React, { useState } from 'react';
import { 
  CongregationMember, 
  MosqueProfile, 
  Transaction, 
  StudyAttendance, 
  TakmirVisitRecord 
} from '../types/mosque';
import { 
  calculateAge, 
  getAgeCategory, 
  checkBirthdayStatus, 
  isUrgentVisitRequired 
} from '../utils/congregationHelpers';
import { 
  X, 
  Printer, 
  Edit3, 
  MessageCircle, 
  Phone, 
  User, 
  MapPin, 
  Heart, 
  BookOpen, 
  ShieldAlert, 
  Wallet, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Award,
  Users
} from 'lucide-react';

interface MemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: CongregationMember;
  profile: MosqueProfile;
  isTakmir: boolean;
  transactions: Transaction[];
  attendanceList: StudyAttendance[];
  visitRecords: TakmirVisitRecord[];
  onOpenEdit: (member: CongregationMember) => void;
  onOpenNewVisit: (member: CongregationMember) => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  isOpen,
  onClose,
  member,
  profile,
  isTakmir,
  transactions,
  attendanceList,
  visitRecords,
  onOpenEdit,
  onOpenNewVisit
}) => {
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'>('A');

  if (!isOpen) return null;

  const age = calculateAge(member.birthDate);
  const ageCategory = getAgeCategory(age);
  const bdayStatus = checkBirthdayStatus(member.birthDate);
  const isUrgent = isUrgentVisitRequired(member);

  // Filter transactions for this member
  const memberDonations = transactions.filter(t => 
    t.type === 'infaq' && 
    (t.partyName.toLowerCase().includes(member.name.toLowerCase()) || 
     (member.phone && t.donorPhone && t.donorPhone.includes(member.phone)))
  );
  const totalInfaq = memberDonations.reduce((acc, curr) => acc + curr.amount, 0);

  // Filter attendances for this member
  const memberAttendances = attendanceList.filter(a => 
    a.name.toLowerCase().includes(member.name.toLowerCase()) ||
    (member.phone && a.phone && a.phone.includes(member.phone))
  );

  // Filter visits for this member
  const memberVisits = visitRecords.filter(v => 
    v.memberId === member.memberId || v.memberId === member.id || v.memberName.toLowerCase().includes(member.name.toLowerCase())
  );

  const tabs = [
    { key: 'A', label: 'Data Pribadi', icon: User },
    { key: 'B', label: 'Alamat & Kontak', icon: MapPin },
    { key: 'C', label: 'Data Keluarga', icon: Users },
    { key: 'D', label: 'Keagamaan & Ibadah', icon: BookOpen },
    { key: 'E', label: 'Sosial & Kesehatan', icon: Heart },
    { key: 'F', label: 'Infaq & Kontribusi', icon: Wallet },
    { key: 'G', label: 'Catatan Takmir', icon: ShieldAlert },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleOpenWhatsApp = () => {
    const text = `Assalamu'alaikum Warahmatullahi Wabarakatuh Bapak/Ibu/Kang ${member.name}, salam takzim dari Takmir ${profile.name}.`;
    window.open(`https://wa.me/${member.phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 font-black text-lg flex items-center justify-center shadow-md border-2 border-amber-300 shrink-0">
              {member.avatarInitials || member.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-amber-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700">
                  {member.memberId || 'JM-000'}
                </span>
                <span className="text-xs text-emerald-200">
                  {member.gender} • Usia {age} Th ({ageCategory})
                </span>
                {isUrgent && (
                  <span className="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Perlu Dikunjungi</span>
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white truncate">
                {member.name} {member.nickname ? `(${member.nickname})` : ''}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              title="Cetak Profil Jamaah (A4)"
              className="no-print p-2 sm:px-3 sm:py-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
            <button
              onClick={() => onOpenEdit(member)}
              title="Edit Data Jamaah"
              className="no-print p-2 sm:px-3 sm:py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={onClose}
              className="no-print p-1.5 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Buttons (Horizontal Scroll on Mobile) */}
        <div className="no-print flex border-b border-stone-200 bg-stone-50 px-3 sm:px-5 pt-2 overflow-x-auto gap-2 shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2.5 px-3 rounded-t-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition border-b-2 ${
                  isActive
                    ? 'border-emerald-700 text-emerald-900 bg-white shadow-xs'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                <span>Tab {tab.key}: {tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB A: DATA PRIBADI */}
          {activeTab === 'A' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] font-bold uppercase text-stone-500">Nomor Registrasi ID</div>
                  <div className="font-mono font-black text-emerald-900 text-base mt-0.5">{member.memberId || 'JM-000'}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] font-bold uppercase text-stone-500">NIK (KTP)</div>
                  <div className="font-mono font-bold text-stone-900 text-sm mt-0.5">{member.nik || 'Tidak Dicantumkan'}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] font-bold uppercase text-stone-500">Nama Panggilan</div>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">{member.nickname || '-'}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] font-bold uppercase text-stone-500">Tempat, Tanggal Lahir</div>
                  <div className="font-medium text-stone-900 text-sm mt-0.5">
                    {member.birthPlace || 'Pangandaran'}, {member.birthDate}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] font-bold uppercase text-stone-500">Usia & Kategori</div>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">
                    {age} Tahun <span className="text-xs text-emerald-700">({ageCategory})</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] font-bold uppercase text-stone-500">Golongan Darah</div>
                  <div className="font-bold text-rose-800 text-sm mt-0.5">{member.bloodType || 'Tidak Tahu'}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] font-bold uppercase text-stone-500">Status Pernikahan</div>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">{member.maritalStatus || 'Belum Menikah'}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] font-bold uppercase text-stone-500">Pendidikan Terakhir</div>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">{member.education || 'SMA'}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] font-bold uppercase text-stone-500">Pekerjaan</div>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">{member.occupation || 'Wiraswasta'}</div>
                </div>
              </div>

              {/* Penghasilan (Takmir only) */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-900">Perkiraan Penghasilan Per Bulan (Data Tertutup Santunan)</div>
                  <div className="text-sm font-mono font-extrabold text-stone-900 mt-0.5">
                    {isTakmir ? (member.monthlyIncome || '1-3 Juta') : '🔒 Data Pribadi - Hanya Takmir'}
                  </div>
                </div>
                {!isTakmir && (
                  <span className="text-[11px] text-amber-800 font-semibold bg-amber-200/60 px-2.5 py-1 rounded-lg">
                    Login Takmir untuk melihat
                  </span>
                )}
              </div>
            </div>
          )}

          {/* TAB B: ALAMAT & KONTAK */}
          {activeTab === 'B' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="text-[11px] font-bold uppercase text-stone-500">Alamat Domisili</div>
                  <div className="font-bold text-stone-900 text-sm">{member.address}</div>
                  <div className="text-xs text-stone-600">
                    RT: {member.rt || '01'} / RW: {member.rw || '01'} • Kec. {member.subdistrict || 'Cimerak'}, Kab. {member.district || 'Pangandaran'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="text-[11px] font-bold uppercase text-stone-500">Radius Jarak & Status Tempat Tinggal</div>
                  <div className="font-bold text-emerald-900 text-sm">{member.homeDistance || 'Dekat Masjid <100m'}</div>
                  <div className="text-xs text-stone-600">Status: <b>{member.residenceStatus || 'Rumah Sendiri'}</b></div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                <div className="font-bold text-xs text-emerald-900 flex items-center justify-between">
                  <span>Kontak Komunikasi:</span>
                  <button
                    onClick={handleOpenWhatsApp}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-200" />
                    <span>Hubungi WA Sekarang</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-stone-500 block">No WA Utama:</span>
                    <span className="font-mono font-bold text-stone-900 text-sm">{member.phone}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">No WA Cadangan:</span>
                    <span className="font-mono text-stone-700">{member.backupPhone || '-'}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">No Kontak Darurat Keluarga:</span>
                    <span className="font-mono text-rose-800 font-bold">{member.emergencyPhone || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB C: DATA KELUARGA */}
          {activeTab === 'C' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] font-bold uppercase text-stone-500">Nama Ayah</div>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">{member.fatherName || '-'}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] font-bold uppercase text-stone-500">Nama Ibu</div>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">{member.motherName || '-'}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] font-bold uppercase text-stone-500">Nama Suami / Istri</div>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">{member.spouseName || '-'}</div>
                </div>
              </div>

              {/* Rincian Anak */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-stone-800">
                    Jumlah Anak: {member.childrenCount || (member.childrenList ? member.childrenList.length : 0)} Anak
                  </div>
                  <span className="text-[11px] text-stone-500">Data Generasi Masjid</span>
                </div>
                {member.childrenList && member.childrenList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {member.childrenList.map((ch, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white border border-stone-200 text-xs">
                        <div className="font-bold text-stone-900">Anak #{idx + 1}: {ch.name}</div>
                        <div className="text-stone-500 text-[11px]">Usia: {ch.age} Tahun</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 italic">Belum ada anak tercatat.</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 block text-[11px] uppercase font-bold">Apakah 1 Keluarga Sudah Jamaah?</span>
                  <span className="font-bold text-emerald-900 text-sm mt-1 block">
                    {member.allFamilyCongregation === 'Ya' ? '✅ Ya, Seluruh Keluarga Jamaah Masjid' : '⚠️ Belum Semua'}
                  </span>
                  {member.familyNotYetNotes && (
                    <p className="text-[11px] text-stone-500 mt-1 italic">{member.familyNotYetNotes}</p>
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 block text-[11px] uppercase font-bold">Status Ekonomi Keluarga</span>
                  <span className={`font-bold text-sm mt-1 inline-block px-2.5 py-0.5 rounded-lg ${
                    member.familyStatus === 'Keluarga Dhuafa' || member.familyStatus === 'Yatim'
                      ? 'bg-rose-100 text-rose-900'
                      : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {member.familyStatus || 'Keluarga Mampu'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB D: KEAGAMAAN & IBADAH (JOGOKARIYAN STYLE) */}
          {activeTab === 'D' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] font-bold uppercase text-stone-500">Status Jamaah</div>
                  <div className="font-bold text-stone-900 text-sm mt-0.5 capitalize">{member.type.replace('_', ' ')}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] font-bold uppercase text-stone-500">Kemampuan Baca Al-Qur'an</div>
                  <div className="font-bold text-emerald-900 text-sm mt-0.5">{member.quranReadingLevel || 'Al-Qur\'an Lancar'}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] font-bold uppercase text-stone-500">Hafalan Al-Qur'an</div>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">
                    {member.memorizedJuzCount || 0} Juz {member.lastMemorizedSurah ? `(${member.lastMemorizedSurah})` : ''}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] font-bold uppercase text-stone-500">Sholat Berjamaah di Masjid</div>
                  <div className="font-bold text-emerald-900 text-sm mt-0.5">{member.congregationalPrayerFrequency || 'Rutin 5 Waktu di Masjid'}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] font-bold uppercase text-stone-500">Puasa Sunnah</div>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">{member.sunnahFasting || 'Senin-Kamis Rutin'}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] font-bold uppercase text-stone-500">Tanggal Bergabung</div>
                  <div className="font-mono text-stone-900 text-sm mt-0.5">{member.joinDate}</div>
                </div>
              </div>

              {/* Kajian Rutin yang Diikuti */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="font-bold text-xs text-stone-800">Kajian & Majelis yang Diikuti:</div>
                <div className="flex flex-wrap gap-2">
                  {member.routineStudies && member.routineStudies.length > 0 ? (
                    member.routineStudies.map((s, idx) => (
                      <span key={idx} className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-semibold">
                        📖 {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-stone-400 italic">Belum ada kajian rutin dipilih</span>
                  )}
                </div>
              </div>

              {/* Kemampuan Petugas Masjid */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="font-bold text-xs text-amber-950">Kemampuan Petugas Ibadah (Bank Petugas Takmir):</div>
                <div className="flex flex-wrap gap-2">
                  {member.officerCapabilities && member.officerCapabilities.length > 0 ? (
                    member.officerCapabilities.map((cap, idx) => (
                      <span key={idx} className="px-3 py-1 bg-amber-200/80 text-amber-950 font-bold rounded-lg text-xs flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>{cap}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-stone-500 italic">Tidak ditugaskan sebagai imam/muadzin</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB E: DATA SOSIAL & KESEHATAN */}
          {activeTab === 'E' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="text-[11px] font-bold uppercase text-stone-500">Kondisi Kesehatan Saat Ini</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      member.healthCondition === 'Sakit Kronis'
                        ? 'bg-rose-100 text-rose-800'
                        : member.healthCondition === 'Lansia'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {member.healthCondition || 'Sehat'}
                    </span>
                    {member.diseaseName && (
                      <span className="text-xs text-stone-700 italic">({member.diseaseName})</span>
                    )}
                  </div>
                  {member.sickSince && (
                    <div className="text-[11px] text-stone-500">Keterangan: Sakit sejak {member.sickSince}</div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="text-[11px] font-bold uppercase text-stone-500">Status Kunjungan & Kebutuhan Khusus</span>
                  <div className="text-xs text-stone-800">
                    Perlu Dikunjungi Takmir: <b>{member.needsVisit || 'Tidak'}</b>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Kunjungan Terakhir: <b>{member.lastVisitedDate || '-'}</b>
                  </div>
                </div>
              </div>

              {/* Kebutuhan Khusus Bantuan */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="font-bold text-xs text-stone-800">Kebutuhan Bantuan Khusus dari Masjid:</div>
                <div className="flex flex-wrap gap-2">
                  {member.specialNeeds && member.specialNeeds.length > 0 ? (
                    member.specialNeeds.map((need, idx) => (
                      <span key={idx} className="px-3 py-1 bg-rose-100 text-rose-900 font-bold rounded-lg text-xs">
                        🆘 {need}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-stone-400">Tidak ada kebutuhan khusus</span>
                  )}
                </div>
              </div>

              {/* Tombol Buat Jadwal Kunjungan */}
              <div className="no-print pt-2 flex justify-end">
                <button
                  onClick={() => onOpenNewVisit(member)}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition"
                >
                  <Calendar className="w-4 h-4 text-amber-300" />
                  <span>Jadwalkan Kunjungan Takmir ke Rumah Jamaah</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB F: INFAQ & KONTRIBUSI */}
          {activeTab === 'F' && (
            <div className="space-y-4">
              {/* Total Infaq Seumur Hidup Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-900 to-emerald-950 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-300 uppercase tracking-wider font-bold">Total Infaq Seumur Hidup</span>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-amber-300 mt-1">
                    Rp {totalInfaq.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[11px] text-emerald-200 mt-0.5 block">
                    Tercatat {memberDonations.length} transaksi di Buku Kas Masjid
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-xl shadow">
                  💰
                </div>
              </div>

              {/* Riwayat Donasi & Kepanitiaan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="font-bold text-stone-800">Pernah Menjadi Donatur:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.donorHistory && member.donorHistory.length > 0 ? (
                      member.donorHistory.map((d, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-amber-100 text-amber-900 font-semibold rounded-md text-[11px]">
                          {d}
                        </span>
                      ))
                    ) : (
                      <span className="text-stone-400">Belum pernah tercatat</span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="font-bold text-stone-800">Pernah Menjadi Panitia:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.committeeHistory && member.committeeHistory.length > 0 ? (
                      member.committeeHistory.map((c, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-semibold rounded-md text-[11px]">
                          {c}
                        </span>
                      ))
                    ) : (
                      <span className="text-stone-400">Belum pernah</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Keahlian yang Disumbangkan */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="font-bold text-xs text-stone-800">Keahlian yang Bisa Disumbangkan untuk Masjid:</div>
                <div className="flex flex-wrap gap-2">
                  {member.skillsForMosque && member.skillsForMosque.length > 0 ? (
                    member.skillsForMosque.map((sk, idx) => (
                      <span key={idx} className="px-3 py-1 bg-stone-200 text-stone-800 font-bold rounded-lg text-xs">
                        🛠️ {sk}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-stone-400">Belum diisi</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB G: CATATAN TAKMIR */}
          {activeTab === 'G' && (
            <div className="space-y-4">
              {!isTakmir ? (
                <div className="p-8 text-center bg-amber-50 rounded-3xl border border-amber-200 text-amber-900 space-y-2">
                  <ShieldAlert className="w-10 h-10 text-amber-600 mx-auto" />
                  <div className="font-bold text-base">Bagian Ini Terproteksi (Mode Takmir)</div>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    Catatan takmir, rating keaktifan, dan status kunjungan hanya dapat diakses oleh pengurus DKM resmi yang telah login.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                      <div className="text-[11px] font-bold uppercase text-stone-500">Status Kunjungan</div>
                      <div className={`font-bold text-sm mt-0.5 ${
                        member.visitStatus === 'Perlu Dikunjungi Segera' ? 'text-rose-700' : 'text-emerald-800'
                      }`}>
                        {member.visitStatus || 'Belum Dikunjungi'}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                      <div className="text-[11px] font-bold uppercase text-stone-500">Rating Keaktifan Jamaah</div>
                      <div className="font-bold text-emerald-900 text-sm mt-0.5">
                        {member.activityRating || 'Aktif'}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                      <div className="text-[11px] font-bold uppercase text-stone-500">Terakhir Sholat Berjamaah</div>
                      <div className="font-mono text-stone-900 text-sm mt-0.5">
                        {member.lastCongregationalPrayerDate || '-'}
                      </div>
                    </div>
                  </div>

                  {/* Catatan Bebas Takmir */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                    <div className="text-xs font-bold text-amber-950">Catatan Khusus Pengurus DKM:</div>
                    <p className="text-xs text-stone-800 leading-relaxed italic">
                      "{member.takmirNotes || 'Belum ada catatan khusus dari takmir untuk jamaah ini.'}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RIWAYAT KUNJUNGAN TAKMIR (Muncul di Bawah) */}
          {memberVisits.length > 0 && (
            <div className="pt-4 border-t border-stone-200 space-y-2">
              <div className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Riwayat Kunjungan Takmir ({memberVisits.length} Kali)</span>
              </div>
              <div className="space-y-2">
                {memberVisits.map((v) => (
                  <div key={v.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs flex justify-between gap-3">
                    <div>
                      <div className="font-bold text-stone-900">{v.visitDate} • Oleh: {v.takmirOfficer}</div>
                      <div className="text-stone-600 mt-0.5">{v.visitNotes}</div>
                    </div>
                    <span className="font-bold text-[10px] px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md shrink-0 h-fit">
                      Bantuan: {v.aidGiven}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="no-print p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            Terdaftar sejak: <span className="font-mono font-bold text-stone-800">{member.joinDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenWhatsApp}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Kirim Pesan WA</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
