import React from 'react';
import { 
  MosqueProfile, 
  PrayerTimes, 
  OfficerSchedule, 
  FridayOfficer, 
  Transaction, 
  CongregationMember, 
  Announcement,
  SpecialProgram,
  PrayerRequest,
  MenuKey
} from '../types/mosque';
import { 
  getNextPrayerInfo, 
  formatIndonesianDate, 
  getHijriDate 
} from '../utils/prayerTimes';
import { 
  Clock, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Heart, 
  CheckCircle2, 
  Volume2, 
  Award, 
  Coffee, 
  Utensils, 
  Share2, 
  ChevronRight,
  ShieldAlert,
  Megaphone
} from 'lucide-react';

interface DashboardViewProps {
  profile: MosqueProfile;
  prayerTimes: PrayerTimes;
  officers: OfficerSchedule[];
  fridayOfficers: FridayOfficer[];
  transactions: Transaction[];
  congregation: CongregationMember[];
  announcements: Announcement[];
  specialPrograms: SpecialProgram[];
  prayerRequests: PrayerRequest[];
  onNavigate: (menu: MenuKey) => void;
  onOpenInfaqModal: () => void;
  onOpenQrisModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  prayerTimes,
  officers,
  fridayOfficers,
  transactions,
  congregation,
  announcements,
  specialPrograms,
  prayerRequests,
  onNavigate,
  onOpenInfaqModal,
  onOpenQrisModal
}) => {
  const nextInfo = getNextPrayerInfo(prayerTimes);
  const todayGregorian = formatIndonesianDate();
  const todayHijri = getHijriDate();

  // Financial calculations
  const totalInfaq = transactions
    .filter(t => t.type === 'infaq' && t.status === 'lunas')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'pengeluaran' && t.status === 'lunas')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const cashBalance = totalInfaq - totalExpense;

  // Active Jogokariyan status: if balance is small & expenditure is high, celebrate it!
  const isJogokariyanZeroBalance = cashBalance < 1500000;

  // Upcoming Friday
  const upcomingFriday = fridayOfficers[0];

  const prayerCards = [
    { name: 'Imsak', time: prayerTimes.imsak, icon: '🌙' },
    { name: 'Subuh', time: prayerTimes.subuh, icon: '🌅' },
    { name: 'Terbit', time: prayerTimes.terbit, icon: '☀️' },
    { name: 'Dzuhur', time: prayerTimes.dzuhur, icon: '☀️' },
    { name: 'Ashar', time: prayerTimes.ashar, icon: '🌤️' },
    { name: 'Maghrib', time: prayerTimes.maghrib, icon: '🌇' },
    { name: 'Isya', time: prayerTimes.isya, icon: '🌌' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Pengumuman Berjalan (Marquee) */}
      <div className="no-print bg-amber-500 text-stone-950 px-4 py-2 rounded-2xl shadow-sm flex items-center gap-3 overflow-hidden border border-amber-400">
        <div className="flex items-center gap-1.5 shrink-0 font-extrabold text-xs bg-stone-950 text-amber-300 px-2.5 py-1 rounded-lg">
          <Megaphone className="w-3.5 h-3.5" />
          <span>WARTA MASJID</span>
        </div>
        <div className="relative overflow-hidden w-full whitespace-nowrap text-xs font-semibold">
          <div className="animate-marquee-smooth flex items-center gap-8">
            <span>✨ Selamat Datang di {profile.name} — Memakmurkan Umat, Umat Memakmurkan Masjid</span>
            <span>•</span>
            <span>🍛 Buka Puasa Senin-Kamis Gratis 150 Porsi Ba'da Maghrib</span>
            <span>•</span>
            <span>🕌 Kajian Subuh Ahad Berkah dilanjutkan Sarapan Soto Hangat Bersama</span>
            <span>•</span>
            <span>💰 Transparansi Kas Saldo 0: Seluruh Amanah Donatur Langsung Tersalurkan Nyata</span>
            <span>•</span>
            <span>🌾 Beras Berkah ATM Dhuafa Tersedia untuk Warga yang Membutuhkan</span>
          </div>
        </div>
      </div>

      {/* 2. Banner Sambutan & Filosofi Saldo 0 Jogokariyan */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-emerald-700/60 relative overflow-hidden">
        {/* Decorative Background Ornaments */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-300/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistem Manajemen Masjid ala Jogokariyan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {profile.name}
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              "{profile.tagline}"
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-emerald-200">
              <span className="bg-emerald-950/70 px-3 py-1 rounded-lg border border-emerald-700/80">
                📍 {profile.address}
              </span>
              <span className="bg-emerald-950/70 px-3 py-1 rounded-lg border border-emerald-700/80 text-amber-300 font-medium">
                👳 Ketua DKM: {profile.takmirLeader}
              </span>
            </div>
          </div>

          {/* Countdown & Quick Action Hero Card */}
          <div className="w-full lg:w-auto shrink-0 bg-emerald-950/80 border border-emerald-700/80 p-4 sm:p-5 rounded-2xl shadow-lg backdrop-blur-xs flex flex-col items-center text-center">
            <div className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Hitung Mundur Sholat</span>
            </div>
            <div className="text-lg font-bold text-white">
              Menuju <span className="text-amber-400">{nextInfo.nextPrayer}</span> ({nextInfo.nextTime} WIB)
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-black text-amber-300 tracking-wider my-1">
              {nextInfo.countdown}
            </div>
            <div className="text-[11px] text-emerald-300 font-medium">
              Waktu setempat (WIB) • {todayGregorian}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Kartu Besar: Jadwal Sholat Hari Ini */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-600" />
            <h3 className="font-bold text-base sm:text-lg text-stone-900">
              Jadwal Sholat Hari Ini
            </h3>
            <span className="text-xs text-stone-500 hidden sm:inline">({todayHijri})</span>
          </div>
          <button
            onClick={() => onNavigate('prayer')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition"
          >
            <span>Lihat 1 Bulan Penuh</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {prayerCards.map((p) => {
            const isNext = nextInfo.nextPrayer.toLowerCase() === p.name.toLowerCase();

            return (
              <div
                key={p.name}
                className={`p-3.5 rounded-2xl border transition-all duration-200 text-center relative overflow-hidden ${
                  isNext
                    ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-stone-950 border-amber-300 shadow-md ring-2 ring-amber-400/50 scale-[1.02]'
                    : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200 shadow-xs'
                }`}
              >
                {isNext && (
                  <div className="absolute top-1 right-2 text-[9px] font-extrabold uppercase tracking-wide bg-stone-950 text-amber-300 px-1.5 py-0.5 rounded">
                    Berikutnya
                  </div>
                )}
                <div className="text-xl mb-1">{p.icon}</div>
                <div className={`text-xs font-bold uppercase tracking-wider ${isNext ? 'text-stone-950' : 'text-stone-500'}`}>
                  {p.name}
                </div>
                <div className={`text-lg sm:text-xl font-mono font-extrabold mt-0.5 ${isNext ? 'text-stone-950' : 'text-emerald-900'}`}>
                  {p.time}
                </div>
                <div className={`text-[10px] mt-0.5 ${isNext ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
                  WIB
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Tiga Tombol Cepat Jogokariyan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={onOpenInfaqModal}
          className="group p-4 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-2xl shadow-md border border-emerald-700 flex items-center justify-between transition min-h-[56px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-lg shadow-sm">
              🕌
            </div>
            <div className="text-left">
              <div className="font-extrabold text-sm text-white group-hover:text-amber-300 transition">
                INFAQ SEKARANG
              </div>
              <div className="text-[11px] text-emerald-200">
                Transfer BSI, BCA & Scan QRIS
              </div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={() => onNavigate('study')}
          className="group p-4 bg-white hover:bg-stone-50 text-stone-900 rounded-2xl shadow-sm border border-stone-200 flex items-center justify-between transition min-h-[56px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
              📅
            </div>
            <div className="text-left">
              <div className="font-extrabold text-sm text-stone-900 group-hover:text-emerald-800 transition">
                LIHAT KAJIAN
              </div>
              <div className="text-[11px] text-stone-500">
                Kajian Subuh, TPA & Buka Puasa
              </div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-stone-400 group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={() => onNavigate('finance')}
          className="group p-4 bg-white hover:bg-stone-50 text-stone-900 rounded-2xl shadow-sm border border-stone-200 flex items-center justify-between transition min-h-[56px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
              📊
            </div>
            <div className="text-left">
              <div className="font-extrabold text-sm text-stone-900 group-hover:text-amber-800 transition">
                LAPORAN KEUANGAN
              </div>
              <div className="text-[11px] text-stone-500">
                Transparan Saldo 0 untuk Umat
              </div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-stone-400 group-hover:translate-x-1 transition" />
        </button>
      </div>

      {/* 5. Empat Kartu Metrik Keuangan Khas Jogokariyan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Saldo Kas Hari Ini */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Saldo Kas Hari Ini
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono">
              Rp {cashBalance.toLocaleString('id-ID')}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Transparan & Siap Disalurkan</span>
            </div>
          </div>
          {isJogokariyanZeroBalance && (
            <div className="mt-2 pt-2 border-t border-stone-100 text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
              🎯 Saldo Efisien ala Jogokariyan
            </div>
          )}
        </div>

        {/* Total Infaq Masuk */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Infaq Masuk Bulan Ini
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-teal-800 font-mono">
              Rp {totalInfaq.toLocaleString('id-ID')}
            </div>
            <div className="mt-1 text-[11px] text-stone-500">
              Dari Kotak Jumat, QRIS & Transfer
            </div>
          </div>
        </div>

        {/* Total Pengeluaran / Penyaluran */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Penyaluran / Pengeluaran
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-rose-800 font-mono">
              Rp {totalExpense.toLocaleString('id-ID')}
            </div>
            <div className="mt-1 text-[11px] text-stone-500">
              Yatim, Beras Dhuafa & Marbot
            </div>
          </div>
        </div>

        {/* Jumlah Jamaah Terdaftar */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Jamaah Terdaftar
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-indigo-900 font-mono">
              {congregation.length} Kepala/Warga
            </div>
            <div className="mt-1 text-[11px] text-stone-500">
              Jamaah Tetap, Donatur & Remaja
            </div>
          </div>
        </div>
      </div>

      {/* 6. Dua Kolom: Petugas Sholat Hari Ini & Khatib Jumat vs Program Khusus Jogokariyan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom Kiri: Jadwal Petugas Hari Ini & Khutbah Jumat */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-base text-stone-900">
                Petugas Sholat Rawatib Hari Ini
              </h3>
            </div>
            <button
              onClick={() => onNavigate('prayer')}
              className="text-xs font-bold text-emerald-800 hover:underline"
            >
              Kelola Petugas
            </button>
          </div>

          <div className="space-y-2">
            {officers.slice(0, 5).map((off) => (
              <div
                key={off.id}
                className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100 hover:border-emerald-200 transition text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-16 font-bold text-emerald-900 bg-emerald-100/70 px-2 py-1 rounded text-center">
                    {off.prayer}
                  </span>
                  <div>
                    <div className="font-bold text-stone-900 text-sm">
                      Imam: {off.imam}
                    </div>
                    <div className="text-stone-500 text-[11px]">
                      Muadzin: {off.muadzin} {off.bilal ? `• Bilal: ${off.bilal}` : ''}
                    </div>
                  </div>
                </div>
                {off.notes && (
                  <span className="hidden sm:inline-block text-[11px] text-stone-400 italic">
                    {off.notes}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Kotak Khotbah Jumat Terdekat */}
          {upcomingFriday && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  Khatib Sholat Jumat Terdekat
                </span>
                <span className="text-xs font-mono font-bold text-amber-900">
                  {upcomingFriday.date}
                </span>
              </div>
              <div className="font-extrabold text-sm sm:text-base text-stone-900">
                {upcomingFriday.khatib}
              </div>
              <p className="text-xs text-stone-700 italic">
                "{upcomingFriday.khutbahTheme}"
              </p>
              <div className="text-[11px] text-amber-800 pt-1 border-t border-amber-200/60 flex items-center justify-between">
                <span>Imam: {upcomingFriday.imam}</span>
                <span>Muadzin: {upcomingFriday.muadzin}</span>
              </div>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Program Layanan Umat Khas Jogokariyan */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-base text-stone-900">
                Layanan Umat Khas Jogokariyan
              </h3>
            </div>
            <button
              onClick={() => onNavigate('study')}
              className="text-xs font-bold text-emerald-800 hover:underline"
            >
              Semua Kegiatan
            </button>
          </div>

          <div className="space-y-3">
            {specialPrograms.slice(0, 3).map((prog) => (
              <div
                key={prog.id}
                className="p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-300 transition space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-stone-900">
                    {prog.title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {prog.status}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {prog.details}
                </p>
                <div className="flex items-center justify-between text-[11px] pt-1 text-stone-500">
                  <span className="font-medium text-emerald-700">🗓️ {prog.dateOrSchedule}</span>
                  <span className="font-mono font-bold text-stone-700">
                    Rp {prog.realizedBudget.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Kotak Warta Doa & Lelayu */}
          {prayerRequests.length > 0 && (
            <div className="mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>🤲 Warta Doa Jamaah Sakit & Lelayu</span>
              </div>
              {prayerRequests.slice(0, 2).map((pr) => (
                <div key={pr.id} className="text-xs text-stone-700 border-b border-stone-200 pb-2 last:border-b-0 last:pb-0">
                  <div className="font-bold text-stone-900 flex items-center justify-between">
                    <span>{pr.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${pr.type === 'sakit' ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-800'}`}>
                      {pr.type === 'sakit' ? 'Mohon Doa' : 'Kabar Duka'}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-600 mt-0.5">{pr.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
