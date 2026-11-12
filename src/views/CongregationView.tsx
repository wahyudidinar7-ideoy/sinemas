import React, { useState, useMemo } from 'react';
import { 
  CongregationMember, 
  DkmBoardMember, 
  MosqueProfile, 
  Transaction, 
  StudyAttendance, 
  TakmirVisitRecord 
} from '../types/mosque';
import { 
  calculateAge, 
  getAgeCategory, 
  checkBirthdayStatus, 
  isUrgentVisitRequired, 
  exportCongregationToCsv 
} from '../utils/congregationHelpers';
import { 
  MemberProfileModal 
} from '../components/MemberProfileModal';
import { 
  MemberFormModal 
} from '../components/MemberFormModal';
import { 
  TakmirVisitModal 
} from '../components/TakmirVisitModal';
import { 
  Users, 
  Plus, 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  MessageCircle, 
  Heart, 
  AlertTriangle, 
  Calendar, 
  Cake, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  X,
  PhoneCall,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface CongregationViewProps {
  profile: MosqueProfile;
  congregation: CongregationMember[];
  dkmBoard: DkmBoardMember[];
  transactions: Transaction[];
  attendanceList?: StudyAttendance[];
  visitRecords?: TakmirVisitRecord[];
  isTakmir: boolean;
  onRequireTakmir: () => void;
  onSaveMember: (member: CongregationMember) => void;
  onDeleteMember: (id: string) => void;
  onBulkImportMembers: (members: CongregationMember[]) => void;
  onSaveVisit?: (visit: TakmirVisitRecord) => void;
}

export const CongregationView: React.FC<CongregationViewProps> = ({
  profile,
  congregation,
  dkmBoard,
  transactions,
  attendanceList = [],
  visitRecords = [],
  isTakmir,
  onRequireTakmir,
  onSaveMember,
  onDeleteMember,
  onBulkImportMembers,
  onSaveVisit = () => {}
}) => {
  // Main Sub-tabs
  const [activeMainTab, setActiveMainTab] = useState<'kartu' | 'kunjungan' | 'ultah' | 'dkm'>('kartu');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [filterAgeCategory, setFilterAgeCategory] = useState<string>('all');
  const [filterRt, setFilterRt] = useState<string>('all');
  const [filterActivity, setFilterActivity] = useState<string>('all');
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [filterOfficerSkill, setFilterOfficerSkill] = useState<string>('all');

  // Modals state
  const [selectedMemberForProfile, setSelectedMemberForProfile] = useState<CongregationMember | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<CongregationMember | null>(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [memberForVisit, setMemberForVisit] = useState<CongregationMember | null>(null);

  // Excel Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importRawText, setImportRawText] = useState(
`H. Hasan Bisri | 081234567881 | RT 01/RW 01 Dusun Legokjawa | Laki-laki | 1968-05-10
Ibu Nur Aini | 081234567882 | RT 02/RW 01 Dusun Legokjawa | Perempuan | 1978-11-14
Dimas Pratama | 081234567883 | RT 03/RW 02 Dusun Mulyasari | Laki-laki | 2005-08-22`
  );
  const [importParsedPreview, setImportParsedPreview] = useState<CongregationMember[]>([]);

  // ==================== 8 STATISTIK OTOMATIS ====================
  const stats = useMemo(() => {
    let total = congregation.length;
    let maleCount = 0;
    let femaleCount = 0;
    let anakCount = 0;
    let remajaCount = 0;
    let dewasaCount = 0;
    let lansiaCount = 0;
    let dhuafaCount = 0;
    let sakitCount = 0;
    let sangatAktifCount = 0;
    let urgentVisitCount = 0;

    const rtCountMap: Record<string, number> = {};

    congregation.forEach((m) => {
      // Gender
      if (m.gender === 'Perempuan') femaleCount++;
      else maleCount++;

      // Age
      const age = calculateAge(m.birthDate);
      const cat = getAgeCategory(age);
      if (cat === 'Anak') anakCount++;
      else if (cat === 'Remaja') remajaCount++;
      else if (cat === 'Dewasa') dewasaCount++;
      else lansiaCount++;

      // Conditions
      if (m.familyStatus === 'Keluarga Dhuafa' || m.familyStatus === 'Yatim' || m.familyStatus === 'Piatu') {
        dhuafaCount++;
      }
      if (m.healthCondition === 'Sakit Kronis' || m.healthCondition === 'Sakit Ringan') {
        sakitCount++;
      }
      if (m.activityRating === 'Sangat Aktif') {
        sangatAktifCount++;
      }
      if (isUrgentVisitRequired(m)) {
        urgentVisitCount++;
      }

      // RT grouping
      const rtKey = m.rt ? `RT ${m.rt}` : 'RT Lain';
      rtCountMap[rtKey] = (rtCountMap[rtKey] || 0) + 1;
    });

    return {
      total,
      maleCount,
      femaleCount,
      anakCount,
      remajaCount,
      dewasaCount,
      lansiaCount,
      dhuafaCount,
      sakitCount,
      sangatAktifCount,
      urgentVisitCount,
      rtCountMap
    };
  }, [congregation]);

  // ==================== FILTERING LOGIC ====================
  const filteredMembers = useMemo(() => {
    return congregation.filter((m) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = m.name.toLowerCase().includes(q) || (m.nickname && m.nickname.toLowerCase().includes(q));
        const matchAddr = m.address.toLowerCase().includes(q);
        const matchPhone = m.phone.includes(q);
        const matchId = (m.memberId || '').toLowerCase().includes(q);
        if (!matchName && !matchAddr && !matchPhone && !matchId) return false;
      }

      // 2. Status Jamaah
      if (filterType !== 'all' && m.type !== filterType) return false;

      // 3. Gender
      if (filterGender !== 'all' && m.gender !== filterGender) return false;

      // 4. Age Category
      if (filterAgeCategory !== 'all') {
        const age = calculateAge(m.birthDate);
        const cat = getAgeCategory(age);
        if (cat !== filterAgeCategory) return false;
      }

      // 5. RT / RW
      if (filterRt !== 'all' && m.rt !== filterRt) return false;

      // 6. Keaktifan
      if (filterActivity !== 'all' && m.activityRating !== filterActivity) return false;

      // 7. Kondisi Khusus
      if (filterCondition !== 'all') {
        if (filterCondition === 'urgent' && !isUrgentVisitRequired(m)) return false;
        if (filterCondition === 'sakit' && m.healthCondition !== 'Sakit Kronis' && m.healthCondition !== 'Sakit Ringan') return false;
        if (filterCondition === 'dhuafa' && m.familyStatus !== 'Keluarga Dhuafa') return false;
        if (filterCondition === 'yatim' && m.familyStatus !== 'Yatim') return false;
        if (filterCondition === 'lansia' && calculateAge(m.birthDate) < 60) return false;
      }

      // 8. Keahlian Ibadah
      if (filterOfficerSkill !== 'all') {
        if (!m.officerCapabilities?.includes(filterOfficerSkill)) return false;
      }

      return true;
    });
  }, [
    congregation,
    searchQuery,
    filterType,
    filterGender,
    filterAgeCategory,
    filterRt,
    filterActivity,
    filterCondition,
    filterOfficerSkill
  ]);

  // Fast shortcut filter: [🔍 CARI JAMAAH YANG PERLU DIKUNJUNGI]
  const handleQuickFilterUrgent = () => {
    setFilterCondition('urgent');
    setFilterType('all');
    setFilterGender('all');
    setFilterAgeCategory('all');
    setFilterRt('all');
    setFilterActivity('all');
    setFilterOfficerSkill('all');
    setSearchQuery('');
  };

  const handleResetFilters = () => {
    setFilterCondition('all');
    setFilterType('all');
    setFilterGender('all');
    setFilterAgeCategory('all');
    setFilterRt('all');
    setFilterActivity('all');
    setFilterOfficerSkill('all');
    setSearchQuery('');
  };

  // Birthday list for this week
  const upcomingBirthdays = useMemo(() => {
    return congregation
      .map(m => ({ member: m, bday: checkBirthdayStatus(m.birthDate) }))
      .filter(x => x.bday.isThisWeek)
      .sort((a, b) => a.bday.daysRemaining - b.bday.daysRemaining);
  }, [congregation]);

  // Open Form Handlers
  const handleOpenCreateMember = () => {
    if (!isTakmir) {
      onRequireTakmir();
      return;
    }
    setMemberToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditMember = (m: CongregationMember) => {
    if (!isTakmir) {
      onRequireTakmir();
      return;
    }
    setMemberToEdit(m);
    setIsFormModalOpen(true);
  };

  const handleOpenVisit = (m: CongregationMember) => {
    if (!isTakmir) {
      onRequireTakmir();
      return;
    }
    setMemberForVisit(m);
    setIsVisitModalOpen(true);
  };

  // WhatsApp Birthday Greeter
  const handleSendBirthdayGreeting = (m: CongregationMember) => {
    const text = `Assalamu'alaikum Warahmatullahi Wabarakatuh Bapak/Ibu/Kang *${m.name}*,

Kami segenap Pengurus Takmir & Keluarga Besar *${profile.name}* mengucapkan:
🎉 *Barakallah Fii Umrik!* 🎂

Semoga Allah SWT senantiasa menganugerahkan kesehatan, keberkahan umur, dilapangkan rezekinya, dan diberi keistiqamahan dalam beribadah di rumah Allah. Aamiin ya Rabbal 'Alamin.

_Salam Takzim dari Takmir ${profile.name}_`;
    window.open(`https://wa.me/${m.phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Excel Parser Simulation
  const handleParseExcelText = () => {
    const lines = importRawText.trim().split('\n');
    const parsed: CongregationMember[] = [];

    lines.forEach((line, idx) => {
      let parts = line.split('|').map(s => s.trim());
      if (parts.length < 2) parts = line.split('\t').map(s => s.trim());
      if (parts.length < 2) parts = line.split(',').map(s => s.trim());

      if (parts[0]) {
        parsed.push({
          id: `imp-${Date.now()}-${idx}`,
          memberId: `JM-${String(congregation.length + idx + 1).padStart(3, '0')}`,
          name: parts[0],
          nickname: parts[0].split(' ')[0],
          phone: parts[1] || '62812000000',
          address: parts[2] || 'Dusun Legokjawa',
          gender: (parts[3] as any) === 'Perempuan' ? 'Perempuan' : 'Laki-laki',
          birthDate: parts[4] || '1990-01-01',
          type: 'jamaah_tetap',
          joinDate: new Date().toISOString().split('T')[0],
          quranReadingLevel: 'Al-Qur\'an Lancar',
          congregationalPrayerFrequency: 'Rutin 5 Waktu di Masjid',
          healthCondition: 'Sehat',
          familyStatus: 'Keluarga Mampu',
          visitStatus: 'Sudah Dikunjungi',
          activityRating: 'Aktif'
        });
      }
    });

    setImportParsedPreview(parsed);
  };

  const handleExecuteImport = () => {
    if (importParsedPreview.length === 0) {
      handleParseExcelText();
    }
    if (importParsedPreview.length > 0) {
      onBulkImportMembers(importParsedPreview);
      setIsImportModalOpen(false);
      alert(`Alhamdulillah, berhasil mengimpor ${importParsedPreview.length} data jamaah baru ke sistem.`);
    }
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
          Buku Registrasi Induk Data Jamaah — Jogokariyan Style
        </h2>
        <p className="text-xs text-stone-500 font-mono">
          Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })} • Total: {congregation.length} Jiwa
        </p>
      </div>

      {/* Top Banner & Main Actions */}
      <div className="no-print bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sensus & Peta Basis Umat Jogokariyan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Data Jamaah Super Lengkap
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Sistem pendataan 7 tab, monitoring jamaah sakit, program kunjungan takmir, dan warta keumatan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download CSV */}
          <button
            onClick={() => exportCongregationToCsv(congregation, profile.name)}
            title="Download Spreadsheet CSV"
            className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>📥 Download CSV</span>
          </button>

          {/* Cetak Buku Data */}
          <button
            onClick={() => window.print()}
            title="Cetak Buku Data Jamaah Lengkap"
            className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4 text-emerald-700" />
            <span>🖨️ Cetak Buku Jamaah</span>
          </button>

          {/* Import Excel */}
          <button
            onClick={() => {
              if (!isTakmir) {
                onRequireTakmir();
                return;
              }
              handleParseExcelText();
              setIsImportModalOpen(true);
            }}
            className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>📤 Import dari Excel</span>
          </button>

          {/* Input Jamaah Baru */}
          <button
            onClick={handleOpenCreateMember}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>+ Input Jamaah Baru</span>
          </button>
        </div>
      </div>

      {/* ==================== 8 KARTU STATISTIK OTOMATIS ==================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs text-center">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">1. Total Jamaah</span>
          <div className="text-xl sm:text-2xl font-mono font-black text-emerald-900 mt-0.5">{stats.total}</div>
          <span className="text-[10px] text-stone-400">Jiwa Terdata</span>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs text-center">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">2. Gender</span>
          <div className="text-sm font-bold text-stone-900 mt-1 font-mono">
            👨 {stats.maleCount} • 🧕 {stats.femaleCount}
          </div>
          <span className="text-[10px] text-stone-400">L / P</span>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs text-center">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">3. Usia</span>
          <div className="text-[11px] font-bold text-stone-800 mt-1">
            {stats.anakCount} Anak / {stats.remajaCount} Rem
          </div>
          <span className="text-[10px] text-stone-400">{stats.dewasaCount} Dewasa / {stats.lansiaCount} Lansia</span>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs text-center">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">4. Dhuafa & Yatim</span>
          <div className="text-xl sm:text-2xl font-mono font-black text-rose-800 mt-0.5">{stats.dhuafaCount}</div>
          <span className="text-[10px] text-stone-400">Penerima Beras</span>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs text-center">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">5. Jamaah Sakit</span>
          <div className="text-xl sm:text-2xl font-mono font-black text-amber-800 mt-0.5">{stats.sakitCount}</div>
          <span className="text-[10px] text-stone-400">Perlu Dijenguk</span>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs text-center">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">6. Lansia (&gt;60)</span>
          <div className="text-xl sm:text-2xl font-mono font-black text-purple-900 mt-0.5">{stats.lansiaCount}</div>
          <span className="text-[10px] text-stone-400">Sesepuh Jamaah</span>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs text-center">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">7. Sangat Aktif</span>
          <div className="text-xl sm:text-2xl font-mono font-black text-teal-800 mt-0.5">{stats.sangatAktifCount}</div>
          <span className="text-[10px] text-stone-400">Shaf Pertama</span>
        </div>

        <div className={`p-3 rounded-2xl border shadow-xs text-center cursor-pointer transition ${
          stats.urgentVisitCount > 0 ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-300' : 'bg-white border-stone-200'
        }`} onClick={handleQuickFilterUrgent} title="Klik untuk tampilkan jamaah yang perlu dikunjungi">
          <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">8. Perlu Dikunjungi</span>
          <div className="text-xl sm:text-2xl font-mono font-black text-rose-700 mt-0.5">{stats.urgentVisitCount}</div>
          <span className="text-[9px] font-bold text-rose-600 underline">Kunjungi Segera</span>
        </div>
      </div>

      {/* ==================== 2 GRAFIK BAR CHART CSS ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chart 1: Sebaran Per RT */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs sm:text-sm text-stone-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>Peta Sebaran Jamaah per RT / Dusun</span>
            </h4>
            <span className="text-[11px] text-stone-500">Basis Lingkungan</span>
          </div>
          <div className="space-y-2">
            {Object.entries(stats.rtCountMap).map(([rtName, count]) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={rtName} className="text-xs">
                  <div className="flex justify-between font-semibold mb-0.5">
                    <span className="text-stone-700">{rtName}</span>
                    <span className="font-mono text-emerald-900">{count} Jiwa ({pct}%)</span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(8, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Distribusi Kelompok Usia */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs sm:text-sm text-stone-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-600" />
              <span>Distribusi Piramida Usia Jamaah</span>
            </h4>
            <span className="text-[11px] text-stone-500">Regenerasi Masjid</span>
          </div>
          <div className="space-y-2 text-xs">
            {[
              { label: 'Anak (<13 Th)', count: stats.anakCount, color: 'bg-indigo-500' },
              { label: 'Remaja (13-21 Th)', count: stats.remajaCount, color: 'bg-amber-500' },
              { label: 'Dewasa (22-59 Th)', count: stats.dewasaCount, color: 'bg-emerald-600' },
              { label: 'Lansia (≥60 Th)', count: stats.lansiaCount, color: 'bg-purple-600' }
            ].map((row) => {
              const pct = stats.total > 0 ? Math.round((row.count / stats.total) * 100) : 0;
              return (
                <div key={row.label}>
                  <div className="flex justify-between font-semibold mb-0.5">
                    <span className="text-stone-700">{row.label}</span>
                    <span className="font-mono text-stone-900">{row.count} Jiwa ({pct}%)</span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${row.color} rounded-full transition-all duration-300`}
                      style={{ width: `${Math.max(8, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="no-print flex border-b border-stone-200 bg-white px-4 rounded-2xl shadow-xs gap-3 overflow-x-auto">
        <button
          onClick={() => setActiveMainTab('kartu')}
          className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
            activeMainTab === 'kartu'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Kartu Jamaah ({filteredMembers.length})</span>
        </button>

        <button
          onClick={() => setActiveMainTab('kunjungan')}
          className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
            activeMainTab === 'kunjungan'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-600" />
          <span>Kunjungan Takmir (Home Visit)</span>
          {stats.urgentVisitCount > 0 && (
            <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full">
              {stats.urgentVisitCount} Perlu Dikunjungi
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveMainTab('ultah')}
          className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
            activeMainTab === 'ultah'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Cake className="w-4 h-4 text-amber-500" />
          <span>Ulang Tahun Pekan Ini</span>
          {upcomingBirthdays.length > 0 && (
            <span className="text-[10px] bg-amber-400 text-stone-950 font-extrabold px-2 py-0.5 rounded-full">
              {upcomingBirthdays.length} Jamaah
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveMainTab('dkm')}
          className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
            activeMainTab === 'dkm'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Pengurus DKM Masjid ({dkmBoard.length})</span>
        </button>
      </div>

      {/* ==================== SUB-TAB 1: KARTU JAMAAH SUPER LENGKAP ==================== */}
      {activeMainTab === 'kartu' && (
        <div className="space-y-4">
          
          {/* FILTER BAR SUPER LENGKAP */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="Cari nama, ID (JM-001), alamat, atau No WA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Fast Quick Filter Button */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleQuickFilterUrgent}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    filterCondition === 'urgent'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>🔍 Cari Jamaah yang Perlu Dikunjungi</span>
                </button>

                {(filterCondition !== 'all' || filterType !== 'all' || filterGender !== 'all' || filterAgeCategory !== 'all' || filterRt !== 'all' || filterActivity !== 'all' || filterOfficerSkill !== 'all' || searchQuery) && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="p-2 text-stone-500 hover:text-stone-800 text-xs font-semibold hover:bg-stone-100 rounded-xl"
                    title="Reset semua filter"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* 7 Dropdowns Filter Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Status Jamaah</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-stone-200 bg-stone-50 text-xs font-medium"
                >
                  <option value="all">Semua Status</option>
                  <option value="jamaah_tetap">Jamaah Tetap</option>
                  <option value="donatur">Donatur</option>
                  <option value="pengurus">Pengurus DKM</option>
                  <option value="remaja_masjid">Remaja Masjid</option>
                  <option value="anak_tpa">Anak TPA</option>
                  <option value="jamaah_pendatang">Pendatang</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Gender</label>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-stone-200 bg-stone-50 text-xs font-medium"
                >
                  <option value="all">Semua Gender</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Kelompok Usia</label>
                <select
                  value={filterAgeCategory}
                  onChange={(e) => setFilterAgeCategory(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-stone-200 bg-stone-50 text-xs font-medium"
                >
                  <option value="all">Semua Usia</option>
                  <option value="Anak">Anak (&lt;13)</option>
                  <option value="Remaja">Remaja (13-21)</option>
                  <option value="Dewasa">Dewasa (22-59)</option>
                  <option value="Lansia">Lansia (≥60)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Wilayah RT</label>
                <select
                  value={filterRt}
                  onChange={(e) => setFilterRt(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-stone-200 bg-stone-50 text-xs font-medium"
                >
                  <option value="all">Semua RT</option>
                  <option value="01">RT 01</option>
                  <option value="02">RT 02</option>
                  <option value="03">RT 03</option>
                  <option value="04">RT 04</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Keaktifan</label>
                <select
                  value={filterActivity}
                  onChange={(e) => setFilterActivity(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-stone-200 bg-stone-50 text-xs font-medium"
                >
                  <option value="all">Semua Rating</option>
                  <option value="Sangat Aktif">Sangat Aktif</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Kurang Aktif">Kurang Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Kondisi Khusus</label>
                <select
                  value={filterCondition}
                  onChange={(e) => setFilterCondition(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-stone-200 bg-stone-50 text-xs font-medium text-rose-800"
                >
                  <option value="all">Semua Kondisi</option>
                  <option value="urgent">Perlu Dikunjungi Segera</option>
                  <option value="sakit">Sedang Sakit</option>
                  <option value="dhuafa">Keluarga Dhuafa</option>
                  <option value="yatim">Yatim / Piatu</option>
                  <option value="lansia">Lansia Sepuh</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Petugas Ibadah</label>
                <select
                  value={filterOfficerSkill}
                  onChange={(e) => setFilterOfficerSkill(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-stone-200 bg-stone-50 text-xs font-medium"
                >
                  <option value="all">Semua Keahlian</option>
                  <option value="Bisa Jadi Imam">Bisa Jadi Imam</option>
                  <option value="Bisa Jadi Muadzin">Bisa Jadi Muadzin</option>
                  <option value="Bisa Jadi Khatib">Bisa Jadi Khatib</option>
                  <option value="Bisa Jadi Bilal">Bisa Jadi Bilal</option>
                </select>
              </div>
            </div>
          </div>

          {/* GRID KARTU JAMAAH */}
          {filteredMembers.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 text-stone-500 space-y-2">
              <Users className="w-12 h-12 mx-auto text-stone-300" />
              <div className="font-bold text-base text-stone-700">Tidak Ada Jamaah yang Cocok dengan Filter</div>
              <p className="text-xs max-w-sm mx-auto">
                Coba sesuaikan kata kunci pencarian atau reset filter untuk menampilkan kembali data jamaah.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((m) => {
                const age = calculateAge(m.birthDate);
                const isUrgent = isUrgentVisitRequired(m);
                const isElder = age >= 60;
                const isSick = m.healthCondition === 'Sakit Kronis' || m.healthCondition === 'Sakit Ringan';

                return (
                  <div
                    key={m.id}
                    className={`bg-white rounded-3xl p-5 border shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3.5 relative overflow-hidden ${
                      isUrgent ? 'border-rose-400 ring-2 ring-rose-300/60 bg-rose-50/20' : 'border-stone-200'
                    }`}
                  >
                    {/* Top Identity Row */}
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Initials Avatar */}
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm border ${
                            m.gender === 'Perempuan'
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-200'
                          }`}>
                            {m.avatarInitials || m.name.slice(0, 2).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                {m.memberId || 'JM-000'}
                              </span>
                              <span className="text-[11px] font-medium text-stone-500">
                                {age} Th ({m.gender === 'Laki-laki' ? 'L' : 'P'})
                              </span>
                            </div>
                            <h3 className="font-extrabold text-stone-900 text-sm sm:text-base leading-tight mt-0.5 truncate">
                              {m.name}
                            </h3>
                            {m.nickname && (
                              <span className="text-[11px] text-stone-500">"{m.nickname}"</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Address & WA info */}
                      <div className="mt-3 space-y-1 text-xs text-stone-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="truncate">{m.address}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{m.phone}</span>
                        </div>
                      </div>

                      {/* Multi-Badge Row */}
                      <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                        {/* Status Type Badge */}
                        <span className="px-2 py-0.5 rounded-md font-bold bg-stone-100 text-stone-800 capitalize">
                          {m.type.replace('_', ' ')}
                        </span>

                        {/* Rating Keaktifan */}
                        {m.activityRating === 'Sangat Aktif' && (
                          <span className="px-2 py-0.5 rounded-md font-bold bg-emerald-100 text-emerald-900 flex items-center gap-1">
                            🟢 Sangat Aktif
                          </span>
                        )}
                        {m.activityRating === 'Aktif' && (
                          <span className="px-2 py-0.5 rounded-md font-bold bg-yellow-100 text-yellow-900 flex items-center gap-1">
                            🟡 Aktif
                          </span>
                        )}

                        {/* Urgent Visit Badge */}
                        {isUrgent && (
                          <span className="px-2 py-0.5 rounded-md font-black bg-rose-600 text-white animate-pulse flex items-center gap-1">
                            🔴 Perlu Dikunjungi
                          </span>
                        )}

                        {/* Lansia Badge */}
                        {isElder && (
                          <span className="px-2 py-0.5 rounded-md font-bold bg-purple-100 text-purple-900 flex items-center gap-1">
                            🟣 Lansia
                          </span>
                        )}

                        {/* Yatim / Dhuafa */}
                        {m.familyStatus === 'Yatim' && (
                          <span className="px-2 py-0.5 rounded-md font-bold bg-blue-100 text-blue-900 flex items-center gap-1">
                            🔵 Yatim
                          </span>
                        )}
                        {m.familyStatus === 'Keluarga Dhuafa' && (
                          <span className="px-2 py-0.5 rounded-md font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                            🌾 Dhuafa
                          </span>
                        )}

                        {/* Sakit */}
                        {isSick && (
                          <span className="px-2 py-0.5 rounded-md font-bold bg-orange-100 text-orange-900 flex items-center gap-1">
                            🟠 Sakit
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Buttons Row */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-1.5">
                      <button
                        onClick={() => setSelectedMemberForProfile(m)}
                        className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Lihat Lengkap</span>
                      </button>

                      <a
                        href={`https://wa.me/${m.phone}?text=Assalamu%27alaikum%20${encodeURIComponent(m.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center"
                        title="Chat WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => handleOpenEditMember(m)}
                        className="p-1.5 bg-stone-100 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition"
                        title="Edit Data 7 Tab"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (!isTakmir) {
                            onRequireTakmir();
                            return;
                          }
                          if (confirm(`Apakah Anda yakin ingin menghapus data jamaah ${m.name}?`)) {
                            onDeleteMember(m.id);
                          }
                        }}
                        className="p-1.5 bg-stone-100 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition"
                        title="Hapus Jamaah"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================== SUB-TAB 2: KUNJUNGAN TAKMIR (HOME VISIT) ==================== */}
      {activeMainTab === 'kunjungan' && (
        <div className="space-y-6">
          {/* Header Action Banner */}
          <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white p-5 sm:p-6 rounded-3xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Heart className="w-4 h-4" />
                Layanan Home Visit Khas Jogokariyan
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                Program Sambang & Kunjungan Jamaah Sakit / Dhuafa
              </h3>
              <p className="text-xs text-rose-100 leading-relaxed">
                Takmir Jogokariyan tidak menunggu jamaah datang ke masjid, melainkan proaktif mendatangi rumah warga yang absen sholat, sedang sakit, atau kekurangan beras.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2.5 bg-rose-900/80 hover:bg-rose-800 text-white border border-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>🖨️ Cetak Jadwal Kunjungan</span>
              </button>
              <button
                onClick={() => handleOpenVisit(filteredMembers[0] || congregation[0])}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ Buat Jadwal Kunjungan Baru</span>
              </button>
            </div>
          </div>

          {/* Daftar Jamaah yang Perlu Dikunjungi Segera */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Daftar Jamaah Perlu Dikunjungi Minggu Ini ({stats.urgentVisitCount} Jamaah)</span>
                </h4>
                <p className="text-xs text-stone-500">
                  Otomatis terdeteksi dari data sakit kronis, absen sholat &gt; 3 hari, atau lansia dhuafa
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {congregation.filter(isUrgentVisitRequired).map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded">
                        {m.memberId}
                      </span>
                      <span className="font-extrabold text-stone-900 text-sm">{m.name}</span>
                    </div>
                    <div className="text-stone-600">Alamat: {m.address}</div>
                    <div className="text-rose-800 font-semibold text-[11px]">
                      Kondisi: {m.diseaseName || m.healthCondition || 'Perlu Dikunjungi Takmir'}
                    </div>
                    {m.specialNeeds && m.specialNeeds.length > 0 && (
                      <div className="text-[10px] text-stone-500">
                        Kebutuhan: <b>{m.specialNeeds.join(', ')}</b>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenVisit(m)}
                    className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shrink-0 transition"
                  >
                    Kunjungi
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Riwayat Kunjungan yang Sudah Dilakukan */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-5 space-y-3">
            <h4 className="font-extrabold text-sm sm:text-base text-stone-900">
              Riwayat Kunjungan Takmir yang Telah Terlaksana ({visitRecords.length} Kunjungan)
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Nama Jamaah</th>
                    <th className="py-3 px-4">Petugas Takmir</th>
                    <th className="py-3 px-4">Hasil & Catatan Kunjungan</th>
                    <th className="py-3 px-4">Bantuan Diberikan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {visitRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-stone-50/80 transition">
                      <td className="py-3 px-4 font-mono font-medium text-stone-800 whitespace-nowrap">
                        {rec.visitDate}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900 whitespace-nowrap">
                        {rec.memberName}
                      </td>
                      <td className="py-3 px-4 text-emerald-900 font-semibold whitespace-nowrap">
                        {rec.takmirOfficer}
                      </td>
                      <td className="py-3 px-4 text-stone-700 leading-relaxed">
                        {rec.visitNotes}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded-lg text-xs">
                          {rec.aidGiven}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUB-TAB 3: ULANG TAHUN & HARI BESAR ==================== */}
      {activeMainTab === 'ultah' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 p-5 sm:p-6 rounded-3xl shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                <Cake className="w-4 h-4 text-stone-950" />
                Perhatian Personal Takmir Jogokariyan
              </span>
              <h3 className="text-xl font-black text-stone-950 mt-1">
                Ulang Tahun & Hari Bahagia Jamaah
              </h3>
              <p className="text-xs text-stone-800 max-w-lg mt-0.5">
                Menyapa dan mendoakan jamaah di hari ulang tahunnya membangun ikatan batin yang sangat kuat antara masjid dan keluarga jamaah.
              </p>
            </div>
          </div>

          {/* Birthday List */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-5 space-y-3">
            <h4 className="font-extrabold text-sm sm:text-base text-stone-900">
              Jamaah yang Berulang Tahun Pekan Ini ({upcomingBirthdays.length} Jamaah):
            </h4>

            {upcomingBirthdays.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-4">
                Tidak ada jamaah yang berulang tahun dalam 7 hari ke depan.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {upcomingBirthdays.map(({ member, bday }) => (
                  <div
                    key={member.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs transition ${
                      bday.isToday ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400' : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold bg-stone-200 text-stone-800 px-1.5 py-0.5 rounded">
                          {member.memberId}
                        </span>
                        <span className="font-extrabold text-stone-900 text-sm">{member.name}</span>
                        {bday.isToday && (
                          <span className="px-2 py-0.5 bg-rose-600 text-white font-extrabold text-[10px] rounded-full animate-bounce">
                            Hari Ini! 🎂
                          </span>
                        )}
                      </div>
                      <div className="text-stone-500 text-[11px] mt-0.5">
                        Tanggal Lahir: <b>{bday.formatted}</b> • Usia Baru: <b>{calculateAge(member.birthDate)} Tahun</b>
                      </div>
                      <div className="text-stone-600 text-[11px]">
                        Alamat: {member.address}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSendBirthdayGreeting(member)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Kirim Ucapan WA</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== SUB-TAB 4: PENGURUS DKM MASJID ==================== */}
      {activeMainTab === 'dkm' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dkmBoard.map((officer) => (
              <div
                key={officer.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-emerald-300 transition flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-300 font-bold text-lg flex items-center justify-center shadow-md shrink-0 border-2 border-amber-400/40">
                  {officer.initials}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {officer.role}
                  </span>
                  <h4 className="font-extrabold text-stone-900 text-sm truncate">
                    {officer.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 truncate">
                    {officer.department}
                  </p>
                  <div className="pt-1">
                    <a
                      href={`https://wa.me/${officer.phone}?text=Assalamu%27alaikum%20${encodeURIComponent(officer.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat WA: {officer.phone.replace('62', '0')}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== MODALS ==================== */}

      {/* 1. Modal Profil Lengkap (Full Page) */}
      {selectedMemberForProfile && (
        <MemberProfileModal
          isOpen={Boolean(selectedMemberForProfile)}
          onClose={() => setSelectedMemberForProfile(null)}
          member={selectedMemberForProfile}
          profile={profile}
          isTakmir={isTakmir}
          transactions={transactions}
          attendanceList={attendanceList}
          visitRecords={visitRecords}
          onOpenEdit={(m) => {
            setSelectedMemberForProfile(null);
            handleOpenEditMember(m);
          }}
          onOpenNewVisit={(m) => {
            setSelectedMemberForProfile(null);
            handleOpenVisit(m);
          }}
        />
      )}

      {/* 2. Modal Form Input / Edit (7 TAB) */}
      <MemberFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        isTakmir={isTakmir}
        existingMember={memberToEdit}
        allMembers={congregation}
        onSaveMember={onSaveMember}
      />

      {/* 3. Modal Kunjungan Takmir */}
      <TakmirVisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        members={congregation}
        selectedMember={memberForVisit}
        profile={profile}
        onSaveVisit={(newVisit) => {
          onSaveVisit(newVisit);
          // Auto update member status to 'Sudah Dikunjungi' & set lastVisitedDate
          const target = congregation.find(m => m.memberId === newVisit.memberId || m.id === newVisit.memberId);
          if (target) {
            onSaveMember({
              ...target,
              visitStatus: 'Sudah Dikunjungi',
              needsVisit: 'Tidak',
              lastVisitedDate: newVisit.visitDate
            });
          }
        }}
      />

      {/* 4. Modal Simulasi Import Excel */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-950 text-white p-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Simulasi Import Excel Data Jamaah</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-emerald-900 leading-relaxed">
                <b>Petunjuk Format:</b> Tempel data baris per baris dengan pemisah tanda pipa (<code>|</code>) atau tab dari Excel:
                <div className="font-mono mt-1 text-[11px] text-emerald-950 bg-white/80 p-1.5 rounded">
                  Nama Lengkap | No WhatsApp | Alamat | Jenis Kelamin | Tanggal Lahir (YYYY-MM-DD)
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Tempel Teks Excel di Sini:
                </label>
                <textarea
                  rows={6}
                  value={importRawText}
                  onChange={(e) => {
                    setImportRawText(e.target.value);
                    handleParseExcelText();
                  }}
                  className="w-full p-3 rounded-xl border border-stone-300 font-mono text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Preview */}
              {importParsedPreview.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-bold text-stone-800">
                    Pratinjau Data Terdeteksi ({importParsedPreview.length} Calon Jamaah):
                  </span>
                  <div className="max-h-36 overflow-y-auto border border-stone-200 rounded-xl p-2 bg-stone-50 space-y-1">
                    {importParsedPreview.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1 border-b border-stone-200/60 last:border-b-0 text-[11px]">
                        <span className="font-bold text-stone-900">{p.name} ({p.gender === 'Perempuan' ? 'P' : 'L'})</span>
                        <span className="text-stone-500 font-mono">{p.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecuteImport}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md transition"
                >
                  Proses Import ({importParsedPreview.length} Data)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
