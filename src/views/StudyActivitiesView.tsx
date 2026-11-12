import React, { useState } from 'react';
import { 
  StudySession, 
  StudyAttendance, 
  SpecialProgram, 
  MosqueProfile 
} from '../types/mosque';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Printer, 
  UserCheck, 
  Users, 
  Clock, 
  MapPin, 
  Sparkles, 
  Utensils, 
  Heart, 
  Calendar, 
  X, 
  CheckCircle2, 
  Search,
  Check
} from 'lucide-react';

interface StudyActivitiesViewProps {
  profile: MosqueProfile;
  studies: StudySession[];
  attendanceList: StudyAttendance[];
  specialPrograms: SpecialProgram[];
  isTakmir: boolean;
  onRequireTakmir: () => void;
  onSaveStudy: (study: StudySession) => void;
  onDeleteStudy: (id: string) => void;
  onRegisterAttendance: (attendance: StudyAttendance) => void;
  onSaveSpecialProgram: (prog: SpecialProgram) => void;
  onDeleteSpecialProgram: (id: string) => void;
}

export const StudyActivitiesView: React.FC<StudyActivitiesViewProps> = ({
  profile,
  studies,
  attendanceList,
  specialPrograms,
  isTakmir,
  onRequireTakmir,
  onSaveStudy,
  onDeleteStudy,
  onRegisterAttendance,
  onSaveSpecialProgram,
  onDeleteSpecialProgram
}) => {
  const [activeTab, setActiveTab] = useState<'kajian' | 'khusus' | 'presensi'>('kajian');
  const [searchQuery, setSearchQuery] = useState('');

  // Study Form Modal State
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<StudySession | null>(null);
  const [studyForm, setStudyForm] = useState<Partial<StudySession>>({
    title: '',
    day: 'Ahad',
    time: '05:30 - 06:45 WIB',
    speaker: '',
    theme: '',
    location: 'Ruang Utama Masjid Al Hidayah',
    quota: 150,
    description: '',
    category: 'rutin',
    attendeesCount: 0
  });

  // Special Program Modal State
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<SpecialProgram | null>(null);
  const [programForm, setProgramForm] = useState<Partial<SpecialProgram>>({
    category: 'buka_puasa',
    title: '',
    dateOrSchedule: '',
    targetBudget: 2000000,
    realizedBudget: 2000000,
    details: '',
    donorsInfo: '',
    status: 'Berjalan'
  });

  // Attendance Registration Modal State
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [selectedStudyForAttendance, setSelectedStudyForAttendance] = useState<StudySession | null>(null);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeePhone, setAttendeePhone] = useState('');
  const [attendanceSuccessMsg, setAttendanceSuccessMsg] = useState('');

  // Filtered studies
  const filteredStudies = studies.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.theme.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Study Handlers
  const openNewStudy = () => {
    if (!isTakmir) {
      onRequireTakmir();
      return;
    }
    setEditingStudy(null);
    setStudyForm({
      title: '',
      day: 'Ahad',
      time: '05:30 - 06:45 WIB',
      speaker: '',
      theme: '',
      location: 'Ruang Utama Masjid Al Hidayah',
      quota: 150,
      description: '',
      category: 'rutin',
      attendeesCount: 0
    });
    setIsStudyModalOpen(true);
  };

  const openEditStudy = (study: StudySession) => {
    if (!isTakmir) {
      onRequireTakmir();
      return;
    }
    setEditingStudy(study);
    setStudyForm({ ...study });
    setIsStudyModalOpen(true);
  };

  const handleStudySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studyForm.title || !studyForm.speaker || !studyForm.theme) {
      alert('Nama Kajian, Ustadz, dan Tema wajib diisi!');
      return;
    }

    const payload: StudySession = {
      id: editingStudy?.id || `std-${Date.now()}`,
      title: studyForm.title || '',
      day: studyForm.day || 'Ahad',
      time: studyForm.time || '05:30 WIB',
      speaker: studyForm.speaker || '',
      theme: studyForm.theme || '',
      location: studyForm.location || 'Ruang Utama Masjid',
      quota: Number(studyForm.quota) || 100,
      description: studyForm.description || '',
      category: (studyForm.category as any) || 'rutin',
      attendeesCount: editingStudy ? editingStudy.attendeesCount : 0
    };

    onSaveStudy(payload);
    setIsStudyModalOpen(false);
  };

  // Special Program Handlers
  const openNewProgram = () => {
    if (!isTakmir) {
      onRequireTakmir();
      return;
    }
    setEditingProgram(null);
    setProgramForm({
      category: 'buka_puasa',
      title: '',
      dateOrSchedule: '',
      targetBudget: 2500000,
      realizedBudget: 2500000,
      details: '',
      donorsInfo: '',
      status: 'Berjalan'
    });
    setIsProgramModalOpen(true);
  };

  const openEditProgram = (prog: SpecialProgram) => {
    if (!isTakmir) {
      onRequireTakmir();
      return;
    }
    setEditingProgram(prog);
    setProgramForm({ ...prog });
    setIsProgramModalOpen(true);
  };

  const handleProgramSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!programForm.title || !programForm.details) {
      alert('Lengkapi Judul dan Rincian Program!');
      return;
    }

    const payload: SpecialProgram = {
      id: editingProgram?.id || `sp-${Date.now()}`,
      category: (programForm.category as any) || 'buka_puasa',
      title: programForm.title || '',
      dateOrSchedule: programForm.dateOrSchedule || 'Pekanan',
      targetBudget: Number(programForm.targetBudget) || 0,
      realizedBudget: Number(programForm.realizedBudget) || 0,
      details: programForm.details || '',
      donorsInfo: programForm.donorsInfo || '',
      status: (programForm.status as any) || 'Berjalan'
    };

    onSaveSpecialProgram(payload);
    setIsProgramModalOpen(false);
  };

  // Attendance Handlers
  const openAttendanceModal = (study: StudySession) => {
    setSelectedStudyForAttendance(study);
    setAttendeeName('');
    setAttendeePhone('');
    setAttendanceSuccessMsg('');
    setIsAttendanceModalOpen(true);
  };

  const handleAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeName.trim()) {
      alert('Silakan isi nama Anda!');
      return;
    }
    if (!selectedStudyForAttendance) return;

    const payload: StudyAttendance = {
      id: `att-${Date.now()}`,
      studyId: selectedStudyForAttendance.id,
      studyTitle: selectedStudyForAttendance.title,
      name: attendeeName.trim(),
      phone: attendeePhone.trim() || '-',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    onRegisterAttendance(payload);
    setAttendanceSuccessMsg(`Alhamdulillah, ${attendeeName} telah tercatat hadir pada ${selectedStudyForAttendance.title}!`);
    setAttendeeName('');
    setAttendeePhone('');
    setTimeout(() => {
      setAttendanceSuccessMsg('');
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Print Sheet Header */}
      <div className="hidden print-only mb-6 text-center border-b-2 border-stone-800 pb-4">
        <h1 className="text-2xl font-black uppercase text-stone-900 tracking-tight">
          {profile.name}
        </h1>
        <p className="text-sm text-stone-600">
          {profile.address} • Kontak: {profile.takmirPhone.replace('62', '0')}
        </p>
        <h2 className="text-lg font-bold text-emerald-900 mt-2 uppercase">
          Laporan Kajian & Kegiatan Masjid Khas Jogokariyan
        </h2>
      </div>

      {/* View Header */}
      <div className="no-print bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Karakteristik Jogokariyan Style</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Kajian & Kegiatan Masjid
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Kajian rutin, TPA anak, sarapan gratis, buka puasa Senin-Kamis, santunan dhuafa & qurban
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4 text-emerald-700" />
            <span>🖨️ Print Laporan Kegiatan</span>
          </button>

          {activeTab === 'kajian' ? (
            <button
              onClick={openNewStudy}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Kajian Baru</span>
            </button>
          ) : (
            <button
              onClick={openNewProgram}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Kegiatan Jogokariyan</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="no-print flex border-b border-stone-200 bg-white px-4 rounded-2xl shadow-xs gap-3">
        <button
          onClick={() => setActiveTab('kajian')}
          className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'kajian'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Kajian Rutin & Tematik</span>
        </button>

        <button
          onClick={() => setActiveTab('khusus')}
          className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'khusus'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Program Khusus Jogokariyan (Buka Puasa, Santunan, Qurban)</span>
        </button>

        <button
          onClick={() => setActiveTab('presensi')}
          className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'presensi'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Daftar Presensi Jamaah ({attendanceList.length})</span>
        </button>
      </div>

      {/* TAB 1: KAJIAN RUTIN & TEMATIK */}
      {(activeTab === 'kajian' || true) && (
        <div className={activeTab === 'kajian' ? 'space-y-4' : 'hidden print-only space-y-4'}>
          {/* Search bar */}
          <div className="no-print relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Cari nama kajian, ustadz penceramah, atau tema..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudies.map((study) => (
              <div
                key={study.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-emerald-300 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 uppercase">
                      {study.category} • {study.day}
                    </span>
                    <div className="no-print flex items-center gap-1">
                      <button
                        onClick={() => openEditStudy(study)}
                        className="p-1 rounded bg-stone-100 hover:bg-amber-100 text-amber-800 transition"
                        title="Edit Kajian"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (!isTakmir) {
                            onRequireTakmir();
                            return;
                          }
                          if (confirm(`Hapus kajian ${study.title}?`)) {
                            onDeleteStudy(study.id);
                          }
                        }}
                        className="p-1 rounded bg-stone-100 hover:bg-rose-100 text-rose-700 transition"
                        title="Hapus Kajian"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base sm:text-lg text-stone-900 mt-1">
                    {study.title}
                  </h3>

                  <div className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg mt-1 inline-block">
                    🎙️ {study.speaker}
                  </div>

                  <p className="text-xs text-stone-700 italic mt-2 font-medium">
                    Tema: "{study.theme}"
                  </p>

                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {study.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2">
                    <div className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{study.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="truncate max-w-[150px]">{study.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="text-xs text-stone-500">
                      Tercatat hadir: <b className="text-emerald-900">{study.attendeesCount}</b> / {study.quota} jamaah
                    </div>
                    <button
                      onClick={() => openAttendanceModal(study)}
                      className="no-print px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Daftar Hadir</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROGRAM KHUSUS JOGOKARIYAN */}
      {(activeTab === 'khusus' || true) && (
        <div className={activeTab === 'khusus' ? 'space-y-4' : 'hidden print-only space-y-4 mt-6'}>
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm block mb-1">
                Karakteristik Utama Program Masjid Jogokariyan:
              </span>
              Di Jogokariyan, masjid bukan hanya tempat sholat 5 waktu, tetapi pusat denyut kehidupan masyarakat. Program seperti <b>Buka Puasa Gratis 150-200 Porsi</b> setiap Senin-Kamis, <b>ATM Beras Dhuafa</b>, dan <b>Pasar Sore Ramadhan</b> menjadikan masjid dicintai seluruh lapisan warga tanpa terkecuali.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specialPrograms.map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-emerald-300 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                      {prog.category.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {prog.status}
                      </span>
                      <div className="no-print flex items-center gap-1">
                        <button
                          onClick={() => openEditProgram(prog)}
                          className="p-1 rounded bg-stone-100 hover:bg-amber-100 text-amber-800 transition"
                          title="Edit Program"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (!isTakmir) {
                              onRequireTakmir();
                              return;
                            }
                            if (confirm(`Hapus program ${prog.title}?`)) {
                              onDeleteSpecialProgram(prog.id);
                            }
                          }}
                          className="p-1 rounded bg-stone-100 hover:bg-rose-100 text-rose-700 transition"
                          title="Hapus Program"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-stone-900 mt-2">
                    {prog.title}
                  </h3>

                  <div className="text-xs text-emerald-800 font-semibold mt-1">
                    🗓️ Jadwal: {prog.dateOrSchedule}
                  </div>

                  <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 mt-2 leading-relaxed">
                    {prog.details}
                  </p>

                  <div className="mt-2 text-[11px] text-stone-500 italic">
                    Sumber Dana: {prog.donorsInfo || 'Kas Infaq Masjid Jogokariyan'}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-500 block text-[10px]">Realisasi Dana</span>
                    <span className="font-mono font-bold text-emerald-900 text-sm">
                      Rp {prog.realizedBudget.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-500 block text-[10px]">Target Anggaran</span>
                    <span className="font-mono font-medium text-stone-700 text-xs">
                      Rp {prog.targetBudget.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DAFTAR PRESENSI JAMAAH */}
      {(activeTab === 'presensi' || true) && (
        <div className={activeTab === 'presensi' ? 'space-y-4' : 'hidden print-only space-y-4 mt-6'}>
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-stone-900">
                  Riwayat Presensi Kehadiran Jamaah Kajian
                </h3>
                <p className="text-xs text-stone-500">
                  Tercatat {attendanceList.length} kehadiran jamaah di database masjid
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="no-print px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Daftar Hadir</span>
              </button>
            </div>

            {attendanceList.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                Belum ada jamaah yang mengisi daftar hadir. Klik tombol <b>[Daftar Hadir]</b> pada kartu kajian untuk mengisi presensi.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-stone-50 text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">No</th>
                      <th className="py-3 px-4">Nama Jamaah</th>
                      <th className="py-3 px-4">No WhatsApp</th>
                      <th className="py-3 px-4">Kajian yang Dihadiri</th>
                      <th className="py-3 px-4">Tanggal & Jam</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {attendanceList.map((att, idx) => (
                      <tr key={att.id} className="hover:bg-stone-50 transition">
                        <td className="py-3 px-4 font-mono text-stone-500">{idx + 1}</td>
                        <td className="py-3 px-4 font-bold text-stone-900">{att.name}</td>
                        <td className="py-3 px-4 font-mono text-stone-600">{att.phone}</td>
                        <td className="py-3 px-4 font-medium text-emerald-900">{att.studyTitle}</td>
                        <td className="py-3 px-4 text-stone-500 font-mono">
                          {att.date} • {att.timestamp} WIB
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: DAFTAR HADIR JAMAAH */}
      {isAttendanceModalOpen && selectedStudyForAttendance && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Formulir Presensi Jamaah</h3>
                <p className="text-xs text-emerald-200 truncate max-w-xs">
                  {selectedStudyForAttendance.title}
                </p>
              </div>
              <button
                onClick={() => setIsAttendanceModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAttendanceSubmit} className="p-5 space-y-3">
              {attendanceSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{attendanceSuccessMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nama Lengkap Jamaah
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Muhammad Ihsan"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nomor WhatsApp (Untuk info kajian berkala)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 08123456789"
                  value={attendeePhone}
                  onChange={(e) => setAttendeePhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-600 space-y-1">
                <div>📅 <b>Kajian:</b> {selectedStudyForAttendance.title}</div>
                <div>🎙️ <b>Ustadz:</b> {selectedStudyForAttendance.speaker}</div>
                <div>⏰ <b>Waktu:</b> {selectedStudyForAttendance.day}, {selectedStudyForAttendance.time}</div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAttendanceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md transition"
                >
                  Simpan Kehadiran Saya
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INPUT / EDIT KAJIAN BARU */}
      {isStudyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-950 text-white p-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-bold text-sm">
                {editingStudy ? '✏️ Edit Jadwal Kajian' : '+ Buat Kajian Baru'}
              </h3>
              <button
                onClick={() => setIsStudyModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStudySubmit} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nama Kajian</label>
                <input
                  type="text"
                  placeholder="Contoh: Kajian Subuh Ahad Berkah"
                  value={studyForm.title}
                  onChange={(e) => setStudyForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Hari Pelaksanaan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ahad (Minggu)"
                    value={studyForm.day}
                    onChange={(e) => setStudyForm(prev => ({ ...prev, day: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Jam / Waktu</label>
                  <input
                    type="text"
                    placeholder="Contoh: 05:30 - 06:45 WIB"
                    value={studyForm.time}
                    onChange={(e) => setStudyForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nama Ustadz / Pembicara</label>
                <input
                  type="text"
                  placeholder="Contoh: Ustadz Muhammad Ridwan, M.Ag"
                  value={studyForm.speaker}
                  onChange={(e) => setStudyForm(prev => ({ ...prev, speaker: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tema Kajian</label>
                <input
                  type="text"
                  placeholder="Contoh: Mengetuk Pintu Rezeki Sesuai Sunnah"
                  value={studyForm.theme}
                  onChange={(e) => setStudyForm(prev => ({ ...prev, theme: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Lokasi</label>
                  <input
                    type="text"
                    value={studyForm.location}
                    onChange={(e) => setStudyForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Perkiraan Kuota Jamaah</label>
                  <input
                    type="number"
                    value={studyForm.quota}
                    onChange={(e) => setStudyForm(prev => ({ ...prev, quota: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Deskripsi Tambahan</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Dilengkapi sarapan bubur / soto berkah gratis khas Jogokariyan untuk jamaah"
                  value={studyForm.description}
                  onChange={(e) => setStudyForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStudyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md transition"
                >
                  Simpan Kajian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INPUT / EDIT PROGRAM KHUSUS */}
      {isProgramModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-amber-500 text-stone-950 p-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-extrabold text-sm">
                {editingProgram ? '✏️ Edit Program Khusus' : '+ Tambah Program Khusus Jogokariyan'}
              </h3>
              <button
                onClick={() => setIsProgramModalOpen(false)}
                className="p-1 rounded text-stone-800 hover:text-stone-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProgramSubmit} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Kategori Program</label>
                <select
                  value={programForm.category}
                  onChange={(e) => setProgramForm(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold text-emerald-900"
                >
                  <option value="buka_puasa">Buka Puasa Senin-Kamis Gratis</option>
                  <option value="santunan">Santunan Anak Yatim & Dhuafa</option>
                  <option value="pasar_ramadhan">Pasar Sore Ramadhan / Bazar UMKM</option>
                  <option value="qurban">Qurban & Aqiqah Berkah</option>
                  <option value="sahur">Sahur On The Road / Itikaf 10 Malam</option>
                  <option value="tabligh">Tabligh Akbar / Pengajian Akbar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nama / Judul Kegiatan</label>
                <input
                  type="text"
                  placeholder="Contoh: Buka Puasa Bersama 150 Porsi Nasi Kebuli"
                  value={programForm.title}
                  onChange={(e) => setProgramForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Jadwal / Waktu Pelaksanaan</label>
                <input
                  type="text"
                  placeholder="Contoh: Setiap Senin & Kamis Sore (17:30 WIB)"
                  value={programForm.dateOrSchedule}
                  onChange={(e) => setProgramForm(prev => ({ ...prev, dateOrSchedule: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Rincian / Menu / Fasilitas</label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Menu: Nasi Ayam Bakar Madu + Kurma + Buah + Minuman Hangat. Disediakan prasmanan untuk 150 jamaah."
                  value={programForm.details}
                  onChange={(e) => setProgramForm(prev => ({ ...prev, details: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Target Anggaran (Rp)</label>
                  <input
                    type="number"
                    value={programForm.targetBudget}
                    onChange={(e) => setProgramForm(prev => ({ ...prev, targetBudget: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Realisasi Dana (Rp)</label>
                  <input
                    type="number"
                    value={programForm.realizedBudget}
                    onChange={(e) => setProgramForm(prev => ({ ...prev, realizedBudget: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Keterangan Donatur / Sumber Dana</label>
                <input
                  type="text"
                  placeholder="Contoh: Didanai oleh Hamba Allah & Pos Infaq Kas Masjid"
                  value={programForm.donorsInfo}
                  onChange={(e) => setProgramForm(prev => ({ ...prev, donorsInfo: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProgramModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-extrabold shadow-md transition"
                >
                  Simpan Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
