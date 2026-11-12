export type MenuKey = 
  | 'dashboard' 
  | 'prayer' 
  | 'study' 
  | 'finance' 
  | 'congregation' 
  | 'map'
  | 'infaq_online' 
  | 'announcements';

export interface MosqueProfile {
  name: string;
  tagline: string;
  address: string;
  takmirLeader: string; // Ketua DKM
  takmirSecretary: string;
  treasurer: string; // Bendahara
  takmirPhone: string; // WA
  bsiAccount: string;
  bsiAccountName: string;
  bcaAccount: string;
  bcaAccountName: string;
  qrisMerchantName: string;
  qrisNmid: string;
  takmirPassword: string;
  // Prayer time adjustments in minutes (-30 to +30)
  offsets: {
    imsak: number;
    subuh: number;
    terbit: number;
    dzuhur: number;
    ashar: number;
    maghrib: number;
    isya: number;
  };
}

export interface PrayerTimes {
  imsak: string;
  subuh: string;
  terbit: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface PrayerScheduleRow {
  date: string; // YYYY-MM-DD
  dayName: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface OfficerSchedule {
  id: string;
  date: string;
  prayer: 'Subuh' | 'Dzuhur' | 'Ashar' | 'Maghrib' | 'Isya';
  imam: string;
  muadzin: string;
  bilal?: string;
  notes?: string;
}

export interface FridayOfficer {
  id: string;
  date: string;
  khatib: string;
  imam: string;
  muadzin: string;
  khutbahTheme: string;
}

export interface StudySession {
  id: string;
  title: string;
  day: string; // e.g. "Ahad", "Rabu", "Kamis"
  time: string; // e.g. "05:30 - 06:45 WIB (Ba'da Subuh)"
  speaker: string; // e.g. "Ustadz H. Ahmad Fauzi, M.Ag"
  theme: string;
  location: string;
  quota: number;
  description: string;
  category: 'rutin' | 'ibu' | 'remaja' | 'tpa' | 'tematik';
  attendeesCount: number;
}

export interface StudyAttendance {
  id: string;
  studyId: string;
  studyTitle: string;
  name: string;
  phone: string;
  date: string;
  timestamp: string;
}

export interface SpecialProgram {
  id: string;
  category: 'buka_puasa' | 'sahur' | 'pasar_ramadhan' | 'qurban' | 'santunan' | 'tabligh';
  title: string;
  dateOrSchedule: string;
  targetBudget: number;
  realizedBudget: number;
  details: string; // e.g., Menu, Porsi, Paket Sembako
  donorsInfo: string;
  status: 'Rencana' | 'Berjalan' | 'Selesai';
}

export type TransactionType = 'infaq' | 'pengeluaran';

export type InfaqCategory = 
  | 'Kotak Jumat'
  | 'Kotak Harian'
  | 'Transfer BSI'
  | 'Transfer BCA'
  | 'QRIS'
  | 'Infaq Pembangunan'
  | 'Zakat Fitrah & Mal'
  | 'Sedekah Subuh'
  | 'Wakaf Tunai'
  | 'Donasi Buka Puasa'
  | 'Santunan Anak Yatim';

export type ExpenseCategory = 
  | 'Listrik & Air PLN/PDAM'
  | 'Gaji / Bisaroh Marbot & Imam'
  | 'Buka Puasa Senin-Kamis'
  | 'Santunan Anak Yatim & Dhuafa'
  | 'Beras Berkah Kaum Dhuafa'
  | 'Perbaikan Fasilitas & Sound System'
  | 'Operasional Kebersihan'
  | 'Konsumsi Kajian Rutin'
  | 'Pemberdayaan Umat Jogokariyan';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  partyName: string; // Donatur name (or Hamba Allah) OR Receiver/Vendor
  amount: number;
  description: string;
  method: string;
  pic?: string; // Penanggung Jawab
  status: 'lunas' | 'menunggu_verifikasi';
  receiptNo?: string;
  donorPhone?: string;
}

// ==================== SUPER LENGKAP JOGOKARIYAN CONGREGATION ====================
export type CongregationType = 
  | 'jamaah_tetap' 
  | 'jamaah_musiman' 
  | 'jamaah_pendatang' 
  | 'donatur' 
  | 'pengurus' 
  | 'remaja_masjid' 
  | 'anak_tpa';

export type MaritalStatus = 'Belum Menikah' | 'Menikah' | 'Duda' | 'Janda';
export type EducationLevel = 'SD' | 'SMP' | 'SMA' | 'D3' | 'S1' | 'S2' | 'Pesantren';
export type OccupationType = 'PNS' | 'Wiraswasta' | 'Buruh' | 'Petani' | 'Pelajar' | 'Mahasiswa' | 'Ibu Rumah Tangga' | 'Pensiunan' | 'Lainnya';
export type IncomeRange = '<1 Juta' | '1-3 Juta' | '3-5 Juta' | '>5 Juta' | 'Rahasia';
export type HomeDistance = 'Dekat Masjid <100m' | '100-500m' | '>500m' | 'Luar Desa';
export type ResidenceStatus = 'Rumah Sendiri' | 'Kontrak' | 'Kos' | 'Menumpang';
export type FamilyStatus = 'Keluarga Mampu' | 'Keluarga Kurang Mampu' | 'Keluarga Dhuafa' | 'Yatim' | 'Piatu';
export type QuranReadingLevel = 'Belum Bisa' | 'Iqra 1-6' | 'Al-Qur\'an Lancar' | 'Tahfidz';
export type PrayerFrequency = 'Rutin 5 Waktu di Masjid' | 'Sering (3-4 waktu)' | 'Jarang (1-2 waktu)' | 'Hanya Jumat' | 'Belum Rutin';
export type SunnahFasting = 'Senin-Kamis Rutin' | 'Kadang' | 'Tidak Pernah';
export type HealthCondition = 'Sehat' | 'Sakit Ringan' | 'Sakit Kronis' | 'Disabilitas' | 'Lansia';
export type SocioEconomicStatus = 'Mampu Berinfaq' | 'Cukup' | 'Perlu Dibantu';
export type VisitStatus = 'Sudah Dikunjungi' | 'Belum Dikunjungi' | 'Perlu Dikunjungi Segera';
export type ActivityRating = 'Sangat Aktif' | 'Aktif' | 'Kurang Aktif' | 'Tidak Aktif';

export interface ChildInfo {
  name: string;
  age: number;
}

export interface CongregationMember {
  id: string; // Unique ID (e.g. c-1, c-2)
  memberId: string; // Formal code (e.g. JM-001, JM-002)

  // TAB A - DATA PRIBADI
  name: string;
  nickname?: string;
  nik?: string; // Optional NIK
  birthPlace?: string;
  birthDate: string; // YYYY-MM-DD
  gender: 'Laki-laki' | 'Perempuan';
  bloodType?: 'A' | 'B' | 'AB' | 'O' | 'Tidak Tahu';
  avatarInitials?: string;
  maritalStatus?: MaritalStatus;
  education?: EducationLevel;
  occupation?: OccupationType;
  monthlyIncome?: IncomeRange; // Takmir only

  // TAB B - ALAMAT & KONTAK
  address: string; // Text address (e.g. RT 02/RW 01 Dusun Legokjawa)
  rt?: string; // e.g. "02"
  rw?: string; // e.g. "01"
  subdistrict?: string; // e.g. "Cimerak"
  district?: string; // e.g. "Pangandaran"
  postalCode?: string;
  phone: string; // No WA Utama (wajib)
  backupPhone?: string;
  emergencyPhone?: string;
  email?: string;
  homeDistance?: HomeDistance;
  residenceStatus?: ResidenceStatus;

  // TAB C - DATA KELUARGA
  fatherName?: string;
  motherName?: string;
  spouseName?: string;
  childrenCount?: number;
  childrenList?: ChildInfo[];
  allFamilyCongregation?: 'Ya' | 'Belum';
  familyNotYetNotes?: string;
  familyStatus?: FamilyStatus;

  // TAB D - DATA KEAGAMAAN & IBADAH (Khas Jogokariyan)
  type: CongregationType;
  joinDate: string; // YYYY-MM-DD
  quranReadingLevel?: QuranReadingLevel;
  memorizedJuzCount?: number;
  lastMemorizedSurah?: string;
  congregationalPrayerFrequency?: PrayerFrequency;
  sunnahFasting?: SunnahFasting;
  routineStudies?: string[]; // e.g. ['Kajian Subuh Ahad', 'TPA']
  officerCapabilities?: string[]; // e.g. ['Bisa Jadi Imam', 'Bisa Jadi Muadzin']

  // TAB E - DATA SOSIAL & KESEHATAN (Untuk Takmir Mengunjungi)
  healthCondition?: HealthCondition;
  diseaseName?: string;
  sickSince?: string;
  needsVisit?: 'Ya' | 'Tidak';
  lastVisitedDate?: string;
  specialNeeds?: string[]; // e.g. ['Butuh Kursi Roda', 'Butuh Bantuan Sembako']
  socioEconomicStatus?: SocioEconomicStatus;

  // TAB F - DATA INFAQ & KONTRIBUSI
  donorHistory?: string[]; // e.g. ['Buka Puasa', 'Santunan Yatim']
  committeeHistory?: string[]; // e.g. ['Panitia Ramadhan']
  skillsForMosque?: string[]; // e.g. ['Tukang Listrik', 'Mengajar Ngaji']

  // TAB G - CATATAN TAKMIR (Mode Takmir Only)
  takmirNotes?: string;
  lastCongregationalPrayerDate?: string; // YYYY-MM-DD
  visitStatus?: VisitStatus;
  activityRating?: ActivityRating;

  // GIS Koordinat Rumah
  lat?: number;
  lng?: number;

  // Backward compatibility legacy note
  notes?: string;
}

export type PoiCategory = 
  | 'masjid' 
  | 'rumah_dkm' 
  | 'tpa' 
  | 'posko_beras' 
  | 'warung_jamaah' 
  | 'fasilitas_umum' 
  | 'lainnya';

export interface MosquePointOfInterest {
  id: string;
  name: string;
  category: PoiCategory;
  lat: number;
  lng: number;
  address?: string;
  pic?: string;
  phone?: string;
  notes?: string;
}

export interface TakmirVisitRecord {
  id: string;
  memberId: string;
  memberName: string;
  visitDate: string;
  takmirOfficer: string;
  visitNotes: string;
  aidGiven: 'Sembako' | 'Uang' | 'Doa' | 'Lainnya';
}

export interface DkmBoardMember {
  id: string;
  role: string;
  name: string;
  phone: string;
  initials: string;
  department: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  validUntil: string;
  category: 'Kajian' | 'Keuangan' | 'Pembangunan' | 'Duka Cita' | 'Lomba' | 'Layanan Umat';
  isPriority: boolean;
  createdAt: string;
}

export interface Suggestion {
  id: string;
  name: string;
  phone: string;
  category: string;
  content: string;
  status: 'menunggu' | 'ditindaklanjuti';
  followUpNotes?: string;
  createdAt: string;
}

export interface PrayerRequest {
  id: string;
  name: string;
  type: 'sakit' | 'meninggal';
  description: string;
  date: string;
  address: string;
  funeralInfo?: string;
}
