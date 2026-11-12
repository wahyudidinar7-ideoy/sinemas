import React, { useState, useEffect } from 'react';
import { 
  MosqueProfile, 
  PrayerTimes 
} from '../types/mosque';
import { 
  getNextPrayerInfo, 
  formatIndonesianDate, 
  getHijriDate, 
  NextPrayerInfo 
} from '../utils/prayerTimes';
import { 
  Clock, 
  Moon, 
  ShieldCheck, 
  Lock, 
  Settings, 
  Printer, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface HeaderProps {
  profile: MosqueProfile;
  prayerTimes: PrayerTimes;
  isTakmir: boolean;
  onOpenTakmirModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenQrisModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  prayerTimes,
  isTakmir,
  onOpenTakmirModal,
  onOpenSettingsModal,
  onOpenQrisModal
}) => {
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [nextPrayerInfo, setNextPrayerInfo] = useState<NextPrayerInfo>(() => getNextPrayerInfo(prayerTimes));

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'
      );
      setNextPrayerInfo(getNextPrayerInfo(prayerTimes));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const todayGregorian = formatIndonesianDate();
  const todayHijri = getHijriDate();

  return (
    <header className="no-print bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white border-b-2 border-amber-500/40 shadow-lg sticky top-0 z-30">
      {/* Top Banner Ribbon */}
      <div className="bg-emerald-950/90 text-emerald-200/90 text-xs px-4 py-1 flex items-center justify-between border-b border-emerald-800/60 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-medium text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Jogokariyan Style System
          </span>
          <span className="hidden sm:inline text-emerald-400/50">•</span>
          <span className="hidden sm:inline text-emerald-100/90 italic font-medium">
            "{profile.tagline}"
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs ml-auto">
          <div className="flex items-center gap-1.5 font-medium text-stone-200">
            <Moon className="w-3.5 h-3.5 text-amber-400" />
            <span>{todayHijri}</span>
            <span className="text-emerald-500">•</span>
            <span>{todayGregorian}</span>
          </div>
          <span className="hidden md:inline font-mono font-bold bg-emerald-800/80 px-2 py-0.5 rounded text-amber-300 border border-emerald-700">
            {currentTimeStr}
          </span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-4">
        {/* Brand & Mosque Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center border border-amber-300/40">
              {/* Islamic Dome / Minaret Emblem SVG */}
              <svg className="w-7 h-7 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2C8.5 6 4 9 4 14a8 8 0 0 0 16 0c0-5-4.5-8-8-12z" fill="currentColor" fillOpacity="0.15" />
                <path d="M12 2v20M7 22v-6a5 5 0 0 1 10 0v6M12 2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              </svg>
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 truncate">
              {profile.name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 truncate flex items-center gap-1.5">
              <span>{profile.address.split(',')[0]}</span>
              <span className="text-emerald-400">•</span>
              <span className="text-amber-300 font-medium">DKM: {profile.takmirLeader}</span>
            </p>
          </div>
        </div>

        {/* Next Prayer Countdown Widget & Takmir Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Realtime Next Prayer Countdown Box */}
          <div className="hidden md:flex items-center gap-3 bg-emerald-800/70 hover:bg-emerald-800 border border-emerald-700/80 px-3.5 py-1.5 rounded-xl shadow-inner transition-colors">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <Clock className="w-4 h-4 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="text-[11px] text-emerald-200 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <span>Sholat Berikutnya:</span>
                <span className="text-amber-300 font-bold">{nextPrayerInfo.nextPrayer} ({nextPrayerInfo.nextTime})</span>
              </div>
              <div className="text-sm font-mono font-extrabold text-white flex items-center gap-1">
                <span className="text-amber-400">{nextPrayerInfo.countdown}</span>
                <span className="text-[10px] text-emerald-300 font-sans font-normal">lagi</span>
              </div>
            </div>
          </div>

          {/* Quick Print Button */}
          <button
            onClick={() => window.print()}
            title="Cetak Halaman Ini (A4)"
            className="p-2 sm:px-3 sm:py-2 text-xs font-medium rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white border border-emerald-700 transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-emerald-300" />
            <span className="hidden lg:inline">Cetak</span>
          </button>

          {/* Settings / Customize Identity */}
          <button
            onClick={onOpenSettingsModal}
            title="Sesuaikan Identitas Masjid & Waktu Sholat"
            className="p-2 sm:px-3 sm:py-2 text-xs font-medium rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white border border-emerald-700 transition flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4 text-amber-300" />
            <span className="hidden lg:inline">Identitas</span>
          </button>

          {/* Mode Switcher: Takmir vs Jamaah */}
          <button
            onClick={onOpenTakmirModal}
            className={`px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-lg shadow-sm border transition flex items-center gap-1.5 ${
              isTakmir
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 border-amber-300 font-bold'
                : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border-emerald-700'
            }`}
          >
            {isTakmir ? (
              <>
                <ShieldCheck className="w-4 h-4 text-stone-950" />
                <span>Mode Takmir (Aktif)</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Mode Jamaah</span>
                <span className="sm:hidden">Login</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
