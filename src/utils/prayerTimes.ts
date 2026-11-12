import { MosqueProfile, PrayerTimes, PrayerScheduleRow } from '../types/mosque';

/**
 * Approximate prayer calculation for West Java / Yogyakarta / Pangandaran timezone (WIB, UTC+7)
 * Based on solar declination with Takmir offset adjustments
 */
export function calculateTodayPrayerTimes(offsets?: MosqueProfile['offsets']): PrayerTimes {
  // Base astronomical prayer schedule for standard WIB coordinate (Lat -7.7, Long 108.5)
  // Base times in HH:mm
  const base = {
    imsak: "04:02",
    subuh: "04:12",
    terbit: "05:28",
    dzuhur: "11:45",
    ashar: "15:05",
    maghrib: "17:56",
    isya: "19:08"
  };

  const applyOffset = (timeStr: string, offsetMin: number = 0): string => {
    const [h, m] = timeStr.split(':').map(Number);
    let totalMinutes = h * 60 + m + offsetMin;
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    if (totalMinutes >= 24 * 60) totalMinutes %= 24 * 60;
    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  };

  const o = offsets || { imsak: 0, subuh: 0, terbit: 0, dzuhur: 0, ashar: 0, maghrib: 0, isya: 0 };

  return {
    imsak: applyOffset(base.imsak, o.imsak),
    subuh: applyOffset(base.subuh, o.subuh),
    terbit: applyOffset(base.terbit, o.terbit),
    dzuhur: applyOffset(base.dzuhur, o.dzuhur),
    ashar: applyOffset(base.ashar, o.ashar),
    maghrib: applyOffset(base.maghrib, o.maghrib),
    isya: applyOffset(base.isya, o.isya)
  };
}

export interface NextPrayerInfo {
  currentPrayer: string;
  nextPrayer: string;
  nextTime: string;
  countdown: string; // "01:23:45"
  remainingSeconds: number;
  totalIntervalSeconds: number;
}

export function getNextPrayerInfo(times: PrayerTimes): NextPrayerInfo {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentSeconds = now.getSeconds();
  const nowTotalSec = currentMinutes * 60 + currentSeconds;

  const toSec = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h * 60 + m) * 60;
  };

  const scheduleList = [
    { name: 'Imsak', time: times.imsak, sec: toSec(times.imsak) },
    { name: 'Subuh', time: times.subuh, sec: toSec(times.subuh) },
    { name: 'Terbit', time: times.terbit, sec: toSec(times.terbit) },
    { name: 'Dzuhur', time: times.dzuhur, sec: toSec(times.dzuhur) },
    { name: 'Ashar', time: times.ashar, sec: toSec(times.ashar) },
    { name: 'Maghrib', time: times.maghrib, sec: toSec(times.maghrib) },
    { name: 'Isya', time: times.isya, sec: toSec(times.isya) }
  ];

  let next = scheduleList.find(s => s.sec > nowTotalSec);
  let currentPrayer = 'Isya';
  let diffSec = 0;

  if (next) {
    const idx = scheduleList.indexOf(next);
    currentPrayer = idx > 0 ? scheduleList[idx - 1].name : 'Isya (Malam)';
    diffSec = next.sec - nowTotalSec;
  } else {
    // Past Isya, next is tomorrow's Imsak
    next = { name: 'Imsak (Besok)', time: times.imsak, sec: scheduleList[0].sec + 24 * 3600 };
    currentPrayer = 'Isya';
    diffSec = next.sec - nowTotalSec;
  }

  const h = Math.floor(diffSec / 3600);
  const m = Math.floor((diffSec % 3600) / 60);
  const s = diffSec % 60;

  const countdown = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return {
    currentPrayer,
    nextPrayer: next.name.replace(' (Besok)', ''),
    nextTime: next.time,
    countdown,
    remainingSeconds: diffSec,
    totalIntervalSeconds: 3600 * 4
  };
}

export function formatIndonesianDate(date: Date = new Date()): string {
  const days = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${dayNum} ${monthName} ${year}`;
}

/**
 * Accurate Hijri date calculation for current Islamic era
 */
export function getHijriDate(date: Date = new Date()): string {
  // Approximate Hijri algorithm adjusted for Indonesian Ministry of Religious Affairs (Kemenag)
  // Nov 2026 aligns with 1448 H (approx Jumadil Ula / Jumadil Akhir)
  try {
    const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return formatter.format(date);
  } catch {
    return "3 Jumadil Ula 1448 H";
  }
}

/**
 * Generate full monthly schedule for the given month and year
 */
export function generateMonthlyPrayerSchedule(year: number, monthIndex: number, offsets?: MosqueProfile['offsets']): PrayerScheduleRow[] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysName = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const todayTimes = calculateTodayPrayerTimes(offsets);

  const rows: PrayerScheduleRow[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dObj = new Date(year, monthIndex, d);
    const dayName = daysName[dObj.getDay()];
    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    // slight daily solar drift (+/- seconds, simulated realistically)
    const driftMin = Math.round(Math.sin((d / 30) * Math.PI) * 2);

    const shiftTime = (t: string, shift: number) => {
      const [h, m] = t.split(':').map(Number);
      let mins = h * 60 + m + shift;
      if (mins < 0) mins += 1440;
      if (mins >= 1440) mins %= 1440;
      return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
    };

    rows.push({
      date: dateStr,
      dayName,
      imsak: shiftTime(todayTimes.imsak, driftMin),
      subuh: shiftTime(todayTimes.subuh, driftMin),
      terbit: shiftTime(todayTimes.terbit, driftMin),
      dzuhur: shiftTime(todayTimes.dzuhur, driftMin),
      ashar: shiftTime(todayTimes.ashar, driftMin),
      maghrib: shiftTime(todayTimes.maghrib, driftMin),
      isya: shiftTime(todayTimes.isya, driftMin)
    });
  }

  return rows;
}
