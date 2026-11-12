import React, { useState } from 'react';
import { 
  Transaction, 
  MosqueProfile, 
  TransactionType, 
  InfaqCategory, 
  ExpenseCategory 
} from '../types/mosque';
import { 
  Wallet, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit3, 
  X, 
  Sparkles, 
  Filter, 
  Search,
  Check
} from 'lucide-react';

interface FinanceViewProps {
  profile: MosqueProfile;
  transactions: Transaction[];
  isTakmir: boolean;
  onRequireTakmir: () => void;
  onSaveTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onVerifyTransaction: (id: string) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  profile,
  transactions,
  isTakmir,
  onRequireTakmir,
  onSaveTransaction,
  onDeleteTransaction,
  onVerifyTransaction
}) => {
  const [activeTab, setActiveTab] = useState<'laporan' | 'infaq' | 'pengeluaran'>('laporan');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Transaction Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>('infaq');
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const [txForm, setTxForm] = useState<Partial<Transaction>>({
    date: new Date().toISOString().split('T')[0],
    category: 'Kotak Jumat',
    partyName: 'Hamba Allah',
    amount: 100000,
    description: '',
    method: 'Tunai',
    pic: profile.treasurer,
    status: 'lunas'
  });

  // Financial calculations
  const totalInfaq = transactions
    .filter(t => t.type === 'infaq' && t.status === 'lunas')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'pengeluaran' && t.status === 'lunas')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const initialBalance = 0; // Jogokariyan zero-based principle
  const currentBalance = initialBalance + totalInfaq - totalExpense;

  const pendingVerificationList = transactions.filter(t => t.status === 'menunggu_verifikasi');

  // Jogokariyan ethos badge
  const isJogokariyanZero = currentBalance < 1500000 && totalExpense > 1000000;

  // Filtered transactions
  const filteredList = transactions.filter(t => {
    if (activeTab === 'infaq' && t.type !== 'infaq') return false;
    if (activeTab === 'pengeluaran' && t.type !== 'pengeluaran') return false;
    if (filterType !== 'all' && t.category !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.partyName.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Modal Open Handlers
  const openNewInfaqModal = () => {
    if (!isTakmir) {
      onRequireTakmir();
      return;
    }
    setModalType('infaq');
    setEditingTx(null);
    setTxForm({
      date: new Date().toISOString().split('T')[0],
      type: 'infaq',
      category: 'Kotak Jumat',
      partyName: 'Hamba Allah',
      amount: 500000,
      description: 'Infaq kotak ibadah',
      method: 'Tunai',
      pic: profile.treasurer,
      status: 'lunas'
    });
    setIsModalOpen(true);
  };

  const openNewExpenseModal = () => {
    if (!isTakmir) {
      onRequireTakmir();
      return;
    }
    setModalType('pengeluaran');
    setEditingTx(null);
    setTxForm({
      date: new Date().toISOString().split('T')[0],
      type: 'pengeluaran',
      category: 'Buka Puasa Senin-Kamis',
      partyName: 'Katering Jamaah',
      amount: 1500000,
      description: 'Penyaluran dana konsumsi buka puasa',
      method: 'Tunai',
      pic: profile.treasurer,
      status: 'lunas'
    });
    setIsModalOpen(true);
  };

  const openEditTx = (tx: Transaction) => {
    if (!isTakmir) {
      onRequireTakmir();
      return;
    }
    setEditingTx(tx);
    setModalType(tx.type);
    setTxForm({ ...tx });
    setIsModalOpen(true);
  };

  const handleTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txForm.amount || txForm.amount <= 0) {
      alert('Nominal harus lebih dari 0!');
      return;
    }

    const payload: Transaction = {
      id: editingTx?.id || `tr-${modalType}-${Date.now()}`,
      date: txForm.date || new Date().toISOString().split('T')[0],
      type: modalType,
      category: txForm.category || (modalType === 'infaq' ? 'Kotak Jumat' : 'Operasional Kebersihan'),
      partyName: txForm.partyName || (modalType === 'infaq' ? 'Hamba Allah' : 'Pihak Terkait'),
      amount: Number(txForm.amount),
      description: txForm.description || '',
      method: txForm.method || 'Tunai',
      pic: txForm.pic || profile.treasurer,
      status: (txForm.status as any) || 'lunas',
      receiptNo: editingTx?.receiptNo || `${modalType === 'infaq' ? 'IN' : 'OUT'}-${Date.now().toString().slice(-6)}`
    };

    onSaveTransaction(payload);
    setIsModalOpen(false);
  };

  // WhatsApp share generator
  const handleShareWhatsApp = () => {
    const text = `*LAPORAN KAS TRANSPARAN SALDO 0*
*${profile.name.toUpperCase()}*
_Prinsip Jogokariyan: Saldo Kas Disalurkan Nyata untuk Umat_

📅 *Periode:* ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
-------------------------------------------
🟢 *Total Infaq Masuk:* Rp ${totalInfaq.toLocaleString('id-ID')}
🔴 *Total Penyaluran/Pengeluaran:* Rp ${totalExpense.toLocaleString('id-ID')}
💰 *Saldo Kas Saat Ini:* Rp ${currentBalance.toLocaleString('id-ID')}
-------------------------------------------
${isJogokariyanZero ? '✨ _Alhamdulillah, Kas Sudah Tersalurkan untuk Umat - Sesuai Prinsip Jogokariyan_' : '📌 _Kas siap disalurkan untuk fakir miskin, yatim, dan kemakmuran ibadah._'}

*Rekening Infaq Resmi DKM:*
• BSI: ${profile.bsiAccount} (a.n ${profile.bsiAccountName})
• BCA: ${profile.bcaAccount} (a.n ${profile.bcaAccountName})
Konfirmasi WA Bendahara: wa.me/${profile.takmirPhone}

_Jazakumullahu khairan katsiran kepada seluruh donatur._`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  // Categories list
  const infaqCategories: InfaqCategory[] = [
    'Kotak Jumat',
    'Kotak Harian',
    'Transfer BSI',
    'Transfer BCA',
    'QRIS',
    'Infaq Pembangunan',
    'Zakat Fitrah & Mal',
    'Sedekah Subuh',
    'Wakaf Tunai',
    'Donasi Buka Puasa',
    'Santunan Anak Yatim'
  ];

  const expenseCategories: ExpenseCategory[] = [
    'Listrik & Air PLN/PDAM',
    'Gaji / Bisaroh Marbot & Imam',
    'Buka Puasa Senin-Kamis',
    'Santunan Anak Yatim & Dhuafa',
    'Beras Berkah Kaum Dhuafa',
    'Perbaikan Fasilitas & Sound System',
    'Operasional Kebersihan',
    'Konsumsi Kajian Rutin',
    'Pemberdayaan Umat Jogokariyan'
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Print Sheet Header */}
      <div className="hidden print-only mb-6 text-center border-b-2 border-stone-800 pb-4">
        <h1 className="text-2xl font-black uppercase text-stone-900 tracking-tight">
          {profile.name}
        </h1>
        <p className="text-sm text-stone-600">
          {profile.address} • Hotline DKM: {profile.takmirPhone.replace('62', '0')}
        </p>
        <h2 className="text-lg font-bold text-emerald-900 mt-2 uppercase">
          Laporan Keuangan Kas Masjid Transparan Saldo 0 (Jogokariyan Style)
        </h2>
        <p className="text-xs text-stone-500 font-mono">
          Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
        </p>
      </div>

      {/* View Header */}
      <div className="no-print bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Filosofi Kas Saldo 0 Jogokariyan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Keuangan Kas Transparan
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Semua infaq jamaah segera disalurkan untuk memuliakan umat dan dhuafa
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4 text-emerald-700" />
            <span>🖨️ Print Laporan Kas</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
          >
            <Share2 className="w-4 h-4 text-amber-300" />
            <span>📱 Bagikan ke WA Jamaah</span>
          </button>

          <button
            onClick={openNewInfaqModal}
            className="px-4 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>+ Input Infaq</span>
          </button>

          <button
            onClick={openNewExpenseModal}
            className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Input Pengeluaran</span>
          </button>
        </div>
      </div>

      {/* Jogokariyan Zero Balance Philosophy Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white p-5 rounded-3xl shadow-md border border-emerald-700/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Prinsip Utama Jogokariyan: Saldo Kas Mendekati 0
          </span>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            "Infaq jamaah adalah amanah untuk segera dirupakan amal shalih, bukan ditimbun beratus-ratus juta di rekening bank. Kas yang sukses adalah kas yang mengalir membahagiakan anak yatim, dhuafa, dan memakmurkan kegiatan masjid."
          </p>
        </div>

        {isJogokariyanZero ? (
          <div className="bg-amber-400 text-stone-950 px-4 py-2.5 rounded-2xl font-extrabold text-xs shadow-md text-center shrink-0">
            🎉 Alhamdulillah, Kas Tersalurkan untuk Umat!
          </div>
        ) : (
          <div className="bg-emerald-950/90 border border-emerald-600 text-emerald-200 px-4 py-2 rounded-2xl text-xs text-center shrink-0">
            Saldo Tersedia: <b>Rp {currentBalance.toLocaleString('id-ID')}</b>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="no-print flex border-b border-stone-200 bg-white px-4 rounded-2xl shadow-xs gap-3">
        <button
          onClick={() => setActiveTab('laporan')}
          className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'laporan'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Laporan Transparan & Grafik</span>
        </button>

        <button
          onClick={() => setActiveTab('infaq')}
          className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'infaq'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-700" />
          <span>Infaq & Pemasukan</span>
        </button>

        <button
          onClick={() => setActiveTab('pengeluaran')}
          className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === 'pengeluaran'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <TrendingDown className="w-4 h-4 text-rose-700" />
          <span>Pengeluaran & Penyaluran</span>
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pemasukan */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            <span>Total Infaq Masuk</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-900 font-mono">
            Rp {totalInfaq.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Kotak Jumat, Harian, Transfer & QRIS</p>
        </div>

        {/* Pengeluaran */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            <span>Total Penyaluran</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-900 font-mono">
            Rp {totalExpense.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Santunan, Buka Puasa, Marbot & Ops</p>
        </div>

        {/* Saldo Kas */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            <span>Saldo Kas Hari Ini</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-black text-stone-900 font-mono">
            Rp {currentBalance.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] font-semibold text-emerald-700 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isJogokariyanZero ? 'Saldo Terkendali Saldo 0' : 'Amanah Siap Disalurkan'}</span>
          </div>
        </div>
      </div>

      {/* TAB 1: LAPORAN & GRAFIK VISUAL */}
      {activeTab === 'laporan' && (
        <div className="space-y-6">
          {/* CSS Bar Chart Perbandingan */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-stone-900">
              Grafik Komparasi: Infaq Masuk vs Penyaluran
            </h3>
            
            <div className="space-y-3">
              {/* Infaq Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-900">Total Pemasukan (Infaq Jamaah)</span>
                  <span className="font-mono text-emerald-800">Rp {totalInfaq.toLocaleString('id-ID')} (100%)</span>
                </div>
                <div className="w-full h-5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Expense Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-rose-900">Total Penyaluran (Untuk Umat & Masjid)</span>
                  <span className="font-mono text-rose-800">
                    Rp {totalExpense.toLocaleString('id-ID')} ({totalInfaq > 0 ? Math.round((totalExpense / totalInfaq) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full h-5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                  <div
                    className="h-full bg-rose-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${totalInfaq > 0 ? Math.min(100, Math.round((totalExpense / totalInfaq) * 100)) : 0}%`
                    }}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-500 italic pt-1">
              *Tingkat serapan infaq mencapai {totalInfaq > 0 ? Math.round((totalExpense / totalInfaq) * 100) : 0}%. Semakin mendekati 100%, semakin sesuai dengan prinsip Jogokariyan.
            </p>
          </div>

          {/* Pending Verification Table (If Any) */}
          {pendingVerificationList.length > 0 && (
            <div className="bg-amber-50 rounded-3xl border border-amber-300 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <h4 className="font-bold text-sm text-amber-950">
                    Menunggu Verifikasi Bendahara ({pendingVerificationList.length} transaksi)
                  </h4>
                </div>
                <span className="text-xs text-amber-800 font-medium">Infaq Online Mandiri Jamaah</span>
              </div>

              <div className="space-y-2">
                {pendingVerificationList.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-2xl bg-white border border-amber-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-stone-900">
                        {tx.partyName} • <span className="font-mono text-emerald-800">Rp {tx.amount.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="text-stone-500 text-[11px]">
                        {tx.date} • {tx.category} • {tx.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          if (!isTakmir) {
                            onRequireTakmir();
                            return;
                          }
                          onVerifyTransaction(tx.id);
                        }}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Verifikasi & Masukkan Kas</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TABEL TRANSAKSI (Shared for Infaq, Pengeluaran, & Laporan) */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        {/* Filter & Search Bar */}
        <div className="no-print p-4 border-b border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-stone-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 bg-white"
            >
              <option value="all">Semua Kategori</option>
              {activeTab !== 'pengeluaran' && infaqCategories.map(c => (
                <option key={c} value={c}>Infaq: {c}</option>
              ))}
              {activeTab !== 'infaq' && expenseCategories.map(c => (
                <option key={c} value={c}>Keluar: {c}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Cari donatur / keperluan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">No. Bukti</th>
                <th className="py-3 px-4">Donatur / Penerima</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Keterangan</th>
                <th className="py-3 px-4 text-right">Nominal</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="no-print py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredList.map((tx) => {
                const isIn = tx.type === 'infaq';

                return (
                  <tr key={tx.id} className="hover:bg-stone-50/80 transition">
                    <td className="py-3 px-4 font-mono font-medium text-stone-800 whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-400 whitespace-nowrap">
                      {tx.receiptNo || '-'}
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900 whitespace-nowrap">
                      {tx.partyName}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                        isIn ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600 max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className={`py-3 px-4 font-mono font-extrabold text-right whitespace-nowrap ${
                      isIn ? 'text-emerald-800' : 'text-rose-700'
                    }`}>
                      {isIn ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tx.status === 'lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tx.status === 'lunas' ? 'Lunas' : 'Menunggu'}
                      </span>
                    </td>
                    <td className="no-print py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditTx(tx)}
                          title="Edit Catatan"
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-800 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (!isTakmir) {
                              onRequireTakmir();
                              return;
                            }
                            if (confirm(`Hapus catatan transaksi ${tx.category} sebesar Rp ${tx.amount}?`)) {
                              onDeleteTransaction(tx.id);
                            }
                          }}
                          title="Hapus Catatan"
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-100 text-stone-600 hover:text-rose-700 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Signature Footers (For Bulletin Board) */}
      <div className="hidden print-only mt-10 pt-4 border-t border-stone-300 grid grid-cols-2 text-center text-xs">
        <div>
          <p className="text-stone-600">Mengetahui,</p>
          <p className="font-bold text-stone-900 mt-0.5">Ketua DKM {profile.name}</p>
          <div className="h-16" />
          <p className="font-bold underline text-stone-900">({profile.takmirLeader})</p>
        </div>
        <div>
          <p className="text-stone-600">Penyusun Laporan,</p>
          <p className="font-bold text-stone-900 mt-0.5">Bendahara Kas Masjid</p>
          <div className="h-16" />
          <p className="font-bold underline text-stone-900">({profile.treasurer})</p>
        </div>
      </div>

      {/* MODAL: INPUT / EDIT TRANSAKSI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className={`p-4 text-white flex items-center justify-between ${
              modalType === 'infaq' ? 'bg-emerald-950' : 'bg-rose-950'
            }`}>
              <h3 className="font-bold text-sm">
                {editingTx
                  ? `✏️ Edit ${modalType === 'infaq' ? 'Infaq' : 'Pengeluaran'}`
                  : `+ Input ${modalType === 'infaq' ? 'Infaq Baru' : 'Pengeluaran Baru'}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTxSubmit} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tanggal</label>
                <input
                  type="date"
                  value={txForm.date}
                  onChange={(e) => setTxForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {modalType === 'infaq' ? 'Nama Donatur (Boleh "Hamba Allah")' : 'Keperluan / Penerima Dana'}
                </label>
                <input
                  type="text"
                  placeholder={modalType === 'infaq' ? 'Contoh: Hamba Allah / dr. Hendra' : 'Contoh: Santunan Yatim / PLN'}
                  value={txForm.partyName}
                  onChange={(e) => setTxForm(prev => ({ ...prev, partyName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Kategori</label>
                <select
                  value={txForm.category}
                  onChange={(e) => setTxForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold text-stone-800"
                >
                  {modalType === 'infaq'
                    ? infaqCategories.map(c => <option key={c} value={c}>{c}</option>)
                    : expenseCategories.map(c => <option key={c} value={c}>{c}</option>)
                  }
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={txForm.amount}
                  onChange={(e) => setTxForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-base font-bold font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Metode Transaksi</label>
                <select
                  value={txForm.method}
                  onChange={(e) => setTxForm(prev => ({ ...prev, method: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                >
                  <option value="Tunai">Tunai / Cash</option>
                  <option value="Transfer BSI">Transfer Bank BSI</option>
                  <option value="Transfer BCA">Transfer Bank BCA</option>
                  <option value="QRIS">QRIS / E-Wallet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Keterangan / Catatan Bukti</label>
                <textarea
                  rows={2}
                  placeholder="Catatan tambahan atau nomor kwitansi"
                  value={txForm.description}
                  onChange={(e) => setTxForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition ${
                    modalType === 'infaq' ? 'bg-emerald-800 hover:bg-emerald-900' : 'bg-rose-700 hover:bg-rose-800'
                  }`}
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
