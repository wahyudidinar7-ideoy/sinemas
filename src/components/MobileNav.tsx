import React, { useState } from 'react';
import { MenuKey, MosqueProfile } from '../types/mosque';
import { 
  Home, 
  Clock, 
  BookOpen, 
  QrCode, 
  Wallet, 
  Menu as MenuIcon, 
  X, 
  Users, 
  Bell, 
  Settings, 
  ShieldCheck, 
  Lock, 
  MessageCircle,
  Printer
} from 'lucide-react';

interface MobileNavProps {
  currentMenu: MenuKey;
  onSelectMenu: (menu: MenuKey) => void;
  isTakmir: boolean;
  onOpenTakmirModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenQrisModal: () => void;
  profile: MosqueProfile;
  pendingInfaqCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentMenu,
  onSelectMenu,
  isTakmir,
  onOpenTakmirModal,
  onOpenSettingsModal,
  onOpenQrisModal,
  profile,
  pendingInfaqCount
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs: { key: MenuKey; label: string; icon: React.ElementType }[] = [
    { key: 'dashboard', label: 'Beranda', icon: Home },
    { key: 'prayer', label: 'Jadwal', icon: Clock },
    { key: 'study', label: 'Kajian', icon: BookOpen },
    { key: 'infaq_online', label: 'Infaq', icon: QrCode },
    { key: 'finance', label: 'Laporan', icon: Wallet },
  ];

  const handleSelect = (key: MenuKey) => {
    onSelectMenu(key);
    setIsMoreOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav className="no-print lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-900 border-t border-stone-800 text-stone-200 px-1 py-1 shadow-2xl safe-area-pb">
        <div className="grid grid-cols-6 items-center">
          {mainTabs.map((tab) => {
            const isActive = currentMenu === tab.key;
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                onClick={() => handleSelect(tab.key)}
                className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-lg transition relative ${
                  isActive
                    ? 'text-amber-400 font-bold bg-emerald-950/80'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] leading-tight truncate">{tab.label}</span>
                {tab.key === 'finance' && pendingInfaqCount > 0 && (
                  <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>
            );
          })}

          {/* More Drawer Button */}
          <button
            onClick={() => setIsMoreOpen(true)}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-lg transition ${
              isMoreOpen || currentMenu === 'congregation' || currentMenu === 'announcements'
                ? 'text-amber-400 font-bold bg-emerald-950/80'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <MenuIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Lainnya</span>
          </button>
        </div>
      </nav>

      {/* Slide-over Drawer for extra menus on mobile */}
      {isMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-xs h-full bg-stone-900 text-stone-100 p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="font-bold text-sm text-white">Menu Lengkap</span>
                </div>
                <button
                  onClick={() => setIsMoreOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-2">
                <button
                  onClick={() => handleSelect('congregation')}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-3 min-h-[44px] ${
                    currentMenu === 'congregation' ? 'bg-emerald-800 text-white font-semibold' : 'hover:bg-stone-800 text-stone-300'
                  }`}
                >
                  <Users className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-sm font-semibold">Data Jamaah & Pengurus</div>
                    <div className="text-xs text-stone-400">Database Jamaah, Donatur, DKM</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelect('announcements')}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-3 min-h-[44px] ${
                    currentMenu === 'announcements' ? 'bg-emerald-800 text-white font-semibold' : 'hover:bg-stone-800 text-stone-300'
                  }`}
                >
                  <Bell className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-sm font-semibold">Pengumuman & Saran</div>
                    <div className="text-xs text-stone-400">Warta Duka & Kotak Aspirasi</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsMoreOpen(false);
                    onOpenQrisModal();
                  }}
                  className="w-full text-left p-3 rounded-xl flex items-center gap-3 min-h-[44px] hover:bg-stone-800 text-stone-300"
                >
                  <QrCode className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-sm font-semibold">Tampilkan QRIS Masjid</div>
                    <div className="text-xs text-stone-400">Simulasi QRIS & Cetak Stand</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsMoreOpen(false);
                    window.print();
                  }}
                  className="w-full text-left p-3 rounded-xl flex items-center gap-3 min-h-[44px] hover:bg-stone-800 text-stone-300"
                >
                  <Printer className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-sm font-semibold">Cetak Halaman (Print)</div>
                    <div className="text-xs text-stone-400">Format A4 Bersih</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Actions inside drawer */}
            <div className="pt-4 border-t border-stone-800 space-y-2.5">
              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  onOpenSettingsModal();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Settings className="w-4 h-4 text-amber-400" />
                <span>Pengaturan Identitas</span>
              </button>

              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  onOpenTakmirModal();
                }}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 min-h-[44px] ${
                  isTakmir
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                }`}
              >
                {isTakmir ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Mode Takmir Aktif (Keluar)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Masuk Mode Takmir</span>
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/${profile.takmirPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-emerald-950 text-emerald-300 text-xs flex items-center justify-center gap-2 min-h-[40px] text-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hubungi Takmir via WA</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
