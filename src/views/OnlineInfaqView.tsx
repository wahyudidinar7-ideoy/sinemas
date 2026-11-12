import React, { useState } from 'react';
import { MosqueProfile, Transaction } from '../types/mosque';
import { 
  QrCode, 
  Copy, 
  Check, 
  MessageCircle, 
  Printer, 
  CheckCircle2, 
  Sparkles, 
  CreditCard, 
  Heart, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

interface OnlineInfaqViewProps {
  profile: MosqueProfile;
  onOpenQrisModal: (nominal?: number, purpose?: string) => void;
  onSaveTransaction: (tx: Transaction) => void;
  transactions: Transaction[];
  isTakmir: boolean;
  onRequireTakmir: () => void;
  onVerifyTransaction: (id: string) => void;
}

export const OnlineInfaqView: React.FC<OnlineInfaqViewProps> = ({
  profile,
  onOpenQrisModal,
  onSaveTransaction,
  transactions,
  isTakmir,
  onRequireTakmir,
  onVerifyTransaction
}) => {
  const [selectedNominal, setSelectedNominal] = useState<number>(50000);
  const [customNominal, setCustomNominal] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [purpose, setPurpose] = useState<string>('Operasional Masjid & Jamaah');
  const [donorName, setDonorName] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [prayerWish, setPrayerWish] = useState<string>('');
  const [method, setMethod] = useState<'qris' | 'bsi' | 'bca'>('qris');

  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string>('');

  const presetNominals = [10000, 25000, 50000, 100000, 250000, 500000];
  const purposes = [
    'Operasional Masjid & Jamaah',
    'Buka Puasa Senin-Kamis Gratis',
    'Santunan Anak Yatim & Dhuafa',
    'ATM Beras Kaum Dhuafa',
    'Infaq Pembangunan & Sarana',
    'Wakaf Al-Qur\'an & Karpet'
  ];

  const currentAmount = isCustom ? Number(customNominal) || 0 : selectedNominal;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(type);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  const getEffectiveDonorName = () => {
    if (isAnonymous) return 'Hamba Allah';
    return donorName.trim() || 'Hamba Allah';
  };

  // WhatsApp Infaq Message
  const handleInfaqViaWhatsApp = () => {
    if (currentAmount <= 0) {
      alert('Silakan pilih atau masukkan nominal infaq yang valid!');
      return;
    }

    const name = getEffectiveDonorName();
    const text = `Assalamu'alaikum Warahmatullahi Wabarakatuh,
Bendahara Takmir ${profile.name},

Saya bermaksud menunaikan infaq/sedekah:
• *Nama Donatur:* ${name}
• *Nominal:* Rp ${currentAmount.toLocaleString('id-ID')}
• *Peruntukan:* ${purpose}
• *Metode:* ${method === 'qris' ? 'QRIS Nasional' : method === 'bsi' ? 'Transfer Bank BSI' : 'Transfer Bank BCA'}
${prayerWish ? `• *Doa/Hajat:* _${prayerWish}_\n` : ''}
Mohon dicatat dan didoakan semoga Allah berkahi. Terima kasih. Wassalam.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${profile.takmirPhone}?text=${encoded}`, '_blank');
  };

  // Confirmation submission to Mosque Ledger (status: menunggu_verifikasi)
  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmount <= 0) {
      alert('Silakan masukkan nominal infaq yang valid!');
      return;
    }

    const effectiveName = getEffectiveDonorName();
    const newTx: Transaction = {
      id: `infaq-online-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'infaq',
      category: method === 'qris' ? 'QRIS' : method === 'bsi' ? 'Transfer BSI' : 'Transfer BCA',
      partyName: effectiveName,
      amount: currentAmount,
      description: `${purpose}${prayerWish ? ` (Doa: ${prayerWish})` : ''}`,
      method: method === 'qris' ? 'QRIS' : method === 'bsi' ? 'Transfer BSI' : 'Transfer BCA',
      status: 'menunggu_verifikasi',
      receiptNo: `ONL-${Date.now().toString().slice(-6)}`,
      donorPhone: donorPhone.trim() || '-'
    };

    onSaveTransaction(newTx);
    setSuccessToast(
      `Alhamdulillah, konfirmasi infaq Rp ${currentAmount.toLocaleString('id-ID')} atas nama ${effectiveName} telah kami terima dan masuk ke antrean verifikasi Bendahara!`
    );

    // Reset optional form
    setDonorName('');
    setDonorPhone('');
    setPrayerWish('');
    setIsAnonymous(false);

    setTimeout(() => {
      setSuccessToast('');
    }, 6000);
  };

  // Recent Infaq Transactions
  const recentInfaqs = transactions
    .filter(t => t.type === 'infaq')
    .slice(0, 8);

  return (
    <div className="space-y-6 pb-12">
      {/* View Header */}
      <div className="no-print bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full mb-1">
            <QrCode className="w-3.5 h-3.5 text-amber-500" />
            <span>Infaq Online & Rekening DKM</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Layanan Infaq & Sedekah Online
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Kemudahan berinfaq via QRIS seluruh bank/e-wallet & rekening resmi tanpa ribet
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenQrisModal(currentAmount, purpose)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>🖨️ Cetak Stand Banner QRIS</span>
          </button>
        </div>
      </div>

      {successToast && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 text-xs text-emerald-950 flex items-start gap-3 shadow-md animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-sm">Jazakumullahu Khairan Katsiran!</div>
            <div>{successToast}</div>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Infaq (Left Column: 7 Cols) */}
        <form
          onSubmit={handleConfirmTransfer}
          className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs space-y-5"
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <span className="font-extrabold text-base text-stone-900 flex items-center gap-2">
              <span>1. Tentukan Nominal Infaq</span>
            </span>
            <span className="text-xs text-emerald-800 font-semibold font-mono">
              Rp {currentAmount.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Preset Nominal Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {presetNominals.map((nom) => {
              const isSelected = !isCustom && selectedNominal === nom;

              return (
                <button
                  type="button"
                  key={nom}
                  onClick={() => {
                    setIsCustom(false);
                    setSelectedNominal(nom);
                  }}
                  className={`py-3 px-3 rounded-2xl border text-center transition font-bold text-sm ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-600/40'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                  }`}
                >
                  Rp {nom.toLocaleString('id-ID')}
                </button>
              );
            })}
          </div>

          {/* Nominal Lain / Custom */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-stone-700 mb-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isCustom}
                onChange={(e) => setIsCustom(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
              />
              <span>Atau Masukkan Nominal Sendiri (Rp):</span>
            </label>
            {isCustom && (
              <input
                type="number"
                min="1000"
                step="1000"
                placeholder="Contoh: 75000"
                value={customNominal}
                onChange={(e) => setCustomNominal(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-base font-bold font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                autoFocus
              />
            )}
          </div>

          {/* Peruntukan Infaq */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              2. Pilih Peruntukan Infaq
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {purposes.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPurpose(p)}
                  className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition ${
                    purpose === p
                      ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold ring-1 ring-amber-300'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Identitas Donatur */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                3. Data Donatur & Doa
              </label>
              <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-600"
                />
                <span className="font-semibold text-emerald-900">Infaq sebagai Hamba Allah</span>
              </label>
            </div>

            {!isAnonymous && (
              <div>
                <input
                  type="text"
                  placeholder="Nama Lengkap Donatur"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            )}

            <div>
              <input
                type="text"
                placeholder="Nomor WhatsApp (Opsional, untuk kirim tanda terima)"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <textarea
                rows={2}
                placeholder="Doa, hajat, atau titipan pesan (Opsional)"
                value={prayerWish}
                onChange={(e) => setPrayerWish(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Metode Pembayaran */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              4. Metode Penyaluran Infaq
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('qris')}
                className={`p-3 rounded-2xl border text-center text-xs font-bold transition ${
                  method === 'qris'
                    ? 'bg-emerald-900 text-white border-emerald-950 shadow-sm'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <div className="text-sm mb-0.5">📱 QRIS</div>
                <div className="text-[10px] font-normal text-emerald-200">Semua Bank / E-Wallet</div>
              </button>

              <button
                type="button"
                onClick={() => setMethod('bsi')}
                className={`p-3 rounded-2xl border text-center text-xs font-bold transition ${
                  method === 'bsi'
                    ? 'bg-emerald-900 text-white border-emerald-950 shadow-sm'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <div className="text-sm mb-0.5">🏦 BSI</div>
                <div className="text-[10px] font-normal text-emerald-200">Bank Syariah Indonesia</div>
              </button>

              <button
                type="button"
                onClick={() => setMethod('bca')}
                className={`p-3 rounded-2xl border text-center text-xs font-bold transition ${
                  method === 'bca'
                    ? 'bg-emerald-900 text-white border-emerald-950 shadow-sm'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <div className="text-sm mb-0.5">💳 BCA</div>
                <div className="text-[10px] font-normal text-emerald-200">Bank Central Asia</div>
              </button>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleInfaqViaWhatsApp}
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-200" />
              <span>💚 INFAQ VIA WA TAKMIR</span>
            </button>

            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-emerald-900 hover:bg-emerald-950 text-amber-300 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition"
            >
              <Check className="w-4 h-4 text-amber-400" />
              <span>KONFIRMASI SUDAH TRANSFER</span>
            </button>
          </div>
        </form>

        {/* Right Column: Rekening & Quick QRIS Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick QRIS Card */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs text-center space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Pindai QRIS Resmi Masjid
              </span>
              <button
                onClick={() => onOpenQrisModal(currentAmount, purpose)}
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                Perbesar
              </button>
            </div>

            <div
              onClick={() => onOpenQrisModal(currentAmount, purpose)}
              className="p-3 bg-stone-50 border-2 border-stone-900 rounded-2xl inline-block cursor-pointer hover:shadow-md transition"
            >
              {/* Mini SVG QR Code */}
              <svg className="w-40 h-40 mx-auto" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="white" />
                <rect x="8" y="8" width="24" height="24" rx="3" fill="#1c1917" />
                <rect x="12" y="12" width="16" height="16" rx="1.5" fill="white" />
                <rect x="16" y="16" width="8" height="8" fill="#14532d" />

                <rect x="68" y="8" width="24" height="24" rx="3" fill="#1c1917" />
                <rect x="72" y="12" width="16" height="16" rx="1.5" fill="white" />
                <rect x="76" y="16" width="8" height="8" fill="#14532d" />

                <rect x="8" y="68" width="24" height="24" rx="3" fill="#1c1917" />
                <rect x="12" y="72" width="16" height="16" rx="1.5" fill="white" />
                <rect x="16" y="76" width="8" height="8" fill="#14532d" />

                <g fill="#1c1917">
                  <rect x="38" y="12" width="5" height="5" />
                  <rect x="48" y="12" width="10" height="5" />
                  <rect x="38" y="24" width="8" height="5" />
                  <rect x="52" y="24" width="8" height="5" />
                  <rect x="12" y="38" width="5" height="8" />
                  <rect x="24" y="38" width="8" height="5" />
                  <rect x="38" y="38" width="24" height="24" rx="4" fill="#14532d" />
                  <rect x="68" y="38" width="8" height="5" />
                  <rect x="82" y="38" width="6" height="10" />
                  <rect x="38" y="68" width="10" height="5" />
                  <rect x="54" y="68" width="6" height="8" />
                  <rect x="68" y="68" width="8" height="8" />
                  <rect x="82" y="68" width="10" height="5" />
                  <rect x="38" y="82" width="12" height="6" />
                  <rect x="58" y="82" width="8" height="6" />
                  <rect x="72" y="82" width="16" height="6" />
                </g>
              </svg>
            </div>

            <div className="text-xs font-bold text-stone-900">
              {profile.qrisMerchantName}
            </div>
            <div className="text-[11px] text-stone-500 font-mono">
              NMID: {profile.qrisNmid}
            </div>

            <button
              type="button"
              onClick={() => onOpenQrisModal(currentAmount, purpose)}
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Tampilkan QRIS Penuh</span>
            </button>
          </div>

          {/* Rekening BSI Box */}
          <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-emerald-900">Bank Syariah Indonesia (BSI)</span>
              <button
                type="button"
                onClick={() => handleCopy(profile.bsiAccount, 'bsi')}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs flex items-center gap-1 transition"
              >
                {copiedBank === 'bsi' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedBank === 'bsi' ? 'Disalin' : 'Salin Rek'}</span>
              </button>
            </div>
            <div className="font-mono text-base font-black text-stone-900">
              {profile.bsiAccount}
            </div>
            <div className="text-[11px] text-stone-500">
              Atas Nama: <b className="text-stone-800">{profile.bsiAccountName}</b>
            </div>
          </div>

          {/* Rekening BCA Box */}
          <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-blue-900">Bank Central Asia (BCA)</span>
              <button
                type="button"
                onClick={() => handleCopy(profile.bcaAccount, 'bca')}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg font-bold text-xs flex items-center gap-1 transition"
              >
                {copiedBank === 'bca' ? <Check className="w-3 h-3 text-blue-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedBank === 'bca' ? 'Disalin' : 'Salin Rek'}</span>
              </button>
            </div>
            <div className="font-mono text-base font-black text-stone-900">
              {profile.bcaAccount}
            </div>
            <div className="text-[11px] text-stone-500">
              Atas Nama: <b className="text-stone-800">{profile.bcaAccountName}</b>
            </div>
          </div>
        </div>
      </div>

      {/* Daftar Infaq Terbaru & Status Verifikasi */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-stone-900">
              Riwayat Infaq Masuk Terbaru
            </h3>
            <p className="text-xs text-stone-500">
              Transparansi catatan infaq donatur di Masjid Al Hidayah
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {recentInfaqs.map((tx) => (
            <div
              key={tx.id}
              className="p-3 rounded-2xl bg-stone-50 border border-stone-100 hover:border-emerald-200 transition flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                  💚
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-sm">
                    {tx.partyName}
                  </div>
                  <div className="text-stone-500 text-[11px]">
                    {tx.date} • {tx.category} • {tx.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-900 text-sm">
                    + Rp {tx.amount.toLocaleString('id-ID')}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                    tx.status === 'lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {tx.status === 'lunas' ? 'Lunas' : 'Menunggu Verifikasi'}
                  </span>
                </div>

                {tx.status === 'menunggu_verifikasi' && (
                  <button
                    onClick={() => {
                      if (!isTakmir) {
                        onRequireTakmir();
                        return;
                      }
                      onVerifyTransaction(tx.id);
                    }}
                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Verifikasi</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
