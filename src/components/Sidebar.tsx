import React from 'react';
import { MenuKey, MosqueProfile } from '../types/mosque';
import { 
  Home, 
  Clock, 
  BookOpen, 
  Wallet, 
  Users, 
  QrCode, 
  Bell, 
  ShieldCheck, 
  Lock, 
  HeartHandshake,
  MessageCircle,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  currentMenu: MenuKey;
  onSelectMenu: (menu: MenuKey) => void;
  isTakmir: boolean;
  pendingInfaqCount: number;
  unreadSuggestionsCount: number;
  profile: MosqueProfile;
  onOpenQrisModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentMenu,
  onSelectMenu,
  isTakmir,
  pendingInfaqCount,
  unreadSuggestionsCount,
  profile,
  onOpenQrisModal
}) => {
  const menuItems = [
    {
      key: 'dashboard' as MenuKey,
      label: 'Dashboard Utama',
      subtitle: 'Beranda Jamaah & Jadwal Hari Ini',
      icon: Home,
      badge: null
    },
    {
      key: 'prayer' as MenuKey,
      label: 'Jadwal Sholat & Petugas',
      subtitle: 'Imam, Muadzin & Khatib Jumat',
      icon: Clock,
      badge: null
    },
    {
      key: 'study' as MenuKey,
      label: 'Kajian & Kegiatan',
      subtitle: 'Kajian Rutin & Buka Puasa',
      icon: BookOpen,
      badge: 'Jogokariyan'
    },
    {
      key: 'finance' as MenuKey,
      label: 'Keuangan Kas Saldo 0',
      subtitle: 'Transparan Disalurkan untuk Umat',
      icon: Wallet,
      badge: pendingInfaqCount > 0 ? `${pendingInfaqCount} Pending` : null,
      badgeColor: 'bg-amber-500 text-stone-950 font-bold'
    },
    {
      key: 'congregation' as MenuKey,
      label: 'Data Jamaah & Pengurus',
      subtitle: 'Database Jamaah, Donatur & DKM',
      icon: Users,
      badge: null
    },
    {
      key: 'infaq_online' as MenuKey,
      label: 'Infaq Online & QRIS',
      subtitle: 'Simulasi Transfer Bank & Stand QRIS',
      icon: QrCode,
      badge: 'QRIS'
    },
    {
      key: 'announcements' as MenuKey,
      label: 'Pengumuman & Saran',
      subtitle: 'Warta Duka & Kotak Aspirasi',
      icon: Bell,
      badge: unreadSuggestionsCount > 0 ? `${unreadSuggestionsCount} Baru` : null,
      badgeColor: 'bg-rose-500 text-white'
    }
  ];

  return (
    <aside className="no-print w-full flex flex-col bg-stone-900 text-stone-200 border-r border-stone-800 shadow-xl h-full">
      {/* Mosque Banner in Sidebar */}
      <div className="p-4 bg-gradient-to-b from-emerald-950 to-stone-900 border-b border-stone-800">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Sistem Manajemen Masjid
          </span>
        </div>
        <h2 className="text-base font-bold text-white leading-snug">
          {profile.name}
        </h2>
        <div className="mt-2.5 pt-2.5 border-t border-emerald-900/60 flex items-center justify-between text-xs text-stone-400">
          <span className="flex items-center gap-1.5">
            {isTakmir ? (
              <span className="inline-flex items-center gap-1 text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                <ShieldCheck className="w-3.5 h-3.5" /> Takmir Mode
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-300 font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                <Lock className="w-3.5 h-3.5" /> Mode Jamaah
              </span>
            )}
          </span>
          <span className="text-[11px] text-stone-400 font-mono">v2.5 Stable</span>
        </div>
      </div>

      {/* 7 Menu Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-3 py-1">
          7 Menu Pokok Jogokariyan
        </div>

        {menuItems.map((item) => {
          const isActive = currentMenu === item.key;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              onClick={() => onSelectMenu(item.key)}
              className={`w-full group text-left px-3.5 py-3 rounded-xl transition-all duration-150 flex items-center justify-between gap-3 ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-md font-semibold ring-1 ring-emerald-500'
                  : 'hover:bg-stone-800/80 text-stone-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition ${
                    isActive
                      ? 'bg-amber-400 text-stone-950 shadow-sm'
                      : 'bg-stone-800 text-stone-400 group-hover:text-emerald-300 group-hover:bg-stone-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate leading-snug">
                    {item.label}
                  </div>
                  <div
                    className={`text-[11px] truncate leading-tight ${
                      isActive ? 'text-emerald-100 font-normal' : 'text-stone-400'
                    }`}
                  >
                    {item.subtitle}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                    item.badgeColor || 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Action: Infaq & Hotline Box */}
      <div className="p-3 border-t border-stone-800 space-y-2 bg-stone-950/70">
        <button
          onClick={onOpenQrisModal}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-3 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 text-xs transition"
        >
          <QrCode className="w-4 h-4" />
          <span>Buka QRIS & Rekening Infaq</span>
        </button>

        <a
          href={`https://wa.me/${profile.takmirPhone}?text=Assalamu%27alaikum%20Takmir%20${encodeURIComponent(profile.name)}%2C%20saya%20ingin%20bertanya`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 hover:text-white px-3 py-2 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Hotline WA Takmir: {profile.takmirPhone.replace('62', '0')}</span>
        </a>

        {/* Jogokariyan Philosophy Badge */}
        <div className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-[10px] text-stone-400 leading-relaxed italic text-center">
          "Kas masjid yang sukses bukan yang tersimpan ratusan juta di bank, melainkan yang segera tersalurkan membahagiakan umat."
        </div>
      </div>
    </aside>
  );
};
