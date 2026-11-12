import { CongregationMember } from '../types/mosque';

/**
 * Calculate age from YYYY-MM-DD birthdate
 */
export function calculateAge(birthDateStr?: string): number {
  if (!birthDateStr) return 0;
  const birth = new Date(birthDateStr);
  if (isNaN(birth.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

/**
 * Categorize into age brackets:
 * Anak (<13), Remaja (13-21), Dewasa (22-59), Lansia (>=60)
 */
export function getAgeCategory(age: number): 'Anak' | 'Remaja' | 'Dewasa' | 'Lansia' {
  if (age >= 60) return 'Lansia';
  if (age >= 22) return 'Dewasa';
  if (age >= 13) return 'Remaja';
  return 'Anak';
}

/**
 * Check if member has a birthday today or within this week
 */
export function checkBirthdayStatus(birthDateStr?: string): {
  isToday: boolean;
  isThisWeek: boolean;
  daysRemaining: number;
  formatted: string;
} {
  if (!birthDateStr) {
    return { isToday: false, isThisWeek: false, daysRemaining: 999, formatted: '-' };
  }

  const birth = new Date(birthDateStr);
  if (isNaN(birth.getTime())) {
    return { isToday: false, isThisWeek: false, daysRemaining: 999, formatted: '-' };
  }

  const today = new Date();
  const currentYear = today.getFullYear();

  // Create birthday date for this year
  const thisYearBday = new Date(currentYear, birth.getMonth(), birth.getDate());
  
  // If already passed earlier this year by more than 7 days, consider next year
  const diffTime = thisYearBday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isToday = today.getMonth() === birth.getMonth() && today.getDate() === birth.getDate();
  const isThisWeek = isToday || (diffDays >= 0 && diffDays <= 7);

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return {
    isToday,
    isThisWeek,
    daysRemaining: diffDays,
    formatted: `${birth.getDate()} ${months[birth.getMonth()]}`
  };
}

/**
 * Check whether member requires immediate Takmir Home Visit
 * Jogokariyan criteria:
 * - Sakit Kronis / Sakit Ringan but needs visit
 * - Visit status set to 'Perlu Dikunjungi Segera'
 * - Needs visit flagged 'Ya'
 * - Lansia alone / menumpang
 * - Absen sholat > 3 days
 */
export function isUrgentVisitRequired(member: CongregationMember): boolean {
  if (member.visitStatus === 'Perlu Dikunjungi Segera') return true;
  if (member.needsVisit === 'Ya') return true;
  if (member.healthCondition === 'Sakit Kronis') return true;

  const age = calculateAge(member.birthDate);
  if (age >= 65 && (member.residenceStatus === 'Menumpang' || member.residenceStatus === 'Kos')) {
    return true;
  }

  if (member.lastCongregationalPrayerDate) {
    const lastPrayer = new Date(member.lastCongregationalPrayerDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastPrayer.getTime()) / (1000 * 3600 * 24));
    if (diffDays >= 4 && member.congregationalPrayerFrequency === 'Rutin 5 Waktu di Masjid') {
      return true;
    }
  }

  return false;
}

/**
 * Generate next sequential Member ID: JM-001, JM-002, etc.
 */
export function generateNextMemberId(existingMembers: CongregationMember[]): string {
  let maxNum = 0;
  existingMembers.forEach(m => {
    const code = m.memberId || '';
    const match = code.match(/JM-(\d+)/);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });
  const nextNum = maxNum + 1;
  return `JM-${String(nextNum).padStart(3, '0')}`;
}

/**
 * Export Congregation to CSV
 */
export function exportCongregationToCsv(members: CongregationMember[], mosqueName: string): void {
  const headers = [
    'No ID',
    'Nama Lengkap',
    'Nama Panggilan',
    'NIK',
    'Jenis Kelamin',
    'Tanggal Lahir',
    'Usia',
    'Alamat',
    'RT',
    'RW',
    'No WhatsApp',
    'Pendidikan',
    'Pekerjaan',
    'Status Jamaah',
    'Kondisi Kesehatan',
    'Status Keluarga',
    'Tingkat Baca Quran',
    'Status Kunjungan',
    'Rating Keaktifan'
  ];

  const rows = members.map(m => [
    m.memberId || m.id,
    `"${(m.name || '').replace(/"/g, '""')}"`,
    `"${(m.nickname || '').replace(/"/g, '""')}"`,
    `'${m.nik || '-'}`,
    m.gender || 'Laki-laki',
    m.birthDate || '-',
    calculateAge(m.birthDate),
    `"${(m.address || '').replace(/"/g, '""')}"`,
    m.rt || '-',
    m.rw || '-',
    `'${m.phone || '-'}`,
    m.education || '-',
    m.occupation || '-',
    m.type || '-',
    m.healthCondition || 'Sehat',
    m.familyStatus || 'Keluarga Mampu',
    m.quranReadingLevel || 'Al-Qur\'an Lancar',
    m.visitStatus || 'Belum Dikunjungi',
    m.activityRating || 'Aktif'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `DATA_JAMAAH_${mosqueName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
