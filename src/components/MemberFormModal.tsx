import React, { useState, useEffect } from 'react';
import { 
  CongregationMember, 
  CongregationType, 
  MaritalStatus, 
  EducationLevel, 
  OccupationType, 
  IncomeRange, 
  HomeDistance, 
  ResidenceStatus, 
  FamilyStatus, 
  QuranReadingLevel, 
  PrayerFrequency, 
  SunnahFasting, 
  HealthCondition, 
  SocioEconomicStatus, 
  VisitStatus, 
  ActivityRating, 
  ChildInfo 
} from '../types/mosque';
import { calculateAge, generateNextMemberId } from '../utils/congregationHelpers';
import { 
  X, 
  Save, 
  User, 
  MapPin, 
  Users, 
  BookOpen, 
  Heart, 
  Wallet, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTakmir: boolean;
  existingMember: CongregationMember | null;
  allMembers: CongregationMember[];
  onSaveMember: (member: CongregationMember) => void;
}

export const MemberFormModal: React.FC<MemberFormModalProps> = ({
  isOpen,
  onClose,
  isTakmir,
  existingMember,
  allMembers,
  onSaveMember
}) => {
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'>('A');

  // Form State initialized with defaults
  const [formData, setFormData] = useState<Partial<CongregationMember>>({
    memberId: '',
    name: '',
    nickname: '',
    nik: '',
    birthPlace: 'Pangandaran',
    birthDate: '1990-01-01',
    gender: 'Laki-laki',
    bloodType: 'O',
    maritalStatus: 'Menikah',
    education: 'SMA',
    occupation: 'Wiraswasta',
    monthlyIncome: '1-3 Juta',
    address: 'RT 01 / RW 01 Dusun Legokjawa',
    rt: '01',
    rw: '01',
    subdistrict: 'Cimerak',
    district: 'Pangandaran',
    postalCode: '46395',
    phone: '',
    backupPhone: '',
    emergencyPhone: '',
    email: '',
    homeDistance: 'Dekat Masjid <100m',
    residenceStatus: 'Rumah Sendiri',
    fatherName: '',
    motherName: '',
    spouseName: '',
    childrenCount: 0,
    childrenList: [],
    allFamilyCongregation: 'Ya',
    familyNotYetNotes: '',
    familyStatus: 'Keluarga Mampu',
    type: 'jamaah_tetap',
    joinDate: new Date().toISOString().split('T')[0],
    quranReadingLevel: 'Al-Qur\'an Lancar',
    memorizedJuzCount: 0,
    lastMemorizedSurah: '',
    congregationalPrayerFrequency: 'Rutin 5 Waktu di Masjid',
    sunnahFasting: 'Senin-Kamis Rutin',
    routineStudies: ['Kajian Subuh Ahad'],
    officerCapabilities: [],
    healthCondition: 'Sehat',
    diseaseName: '',
    sickSince: '',
    needsVisit: 'Tidak',
    lastVisitedDate: '',
    specialNeeds: ['Tidak Ada'],
    socioEconomicStatus: 'Cukup',
    donorHistory: ['Buka Puasa'],
    committeeHistory: [],
    skillsForMosque: [],
    takmirNotes: '',
    lastCongregationalPrayerDate: new Date().toISOString().split('T')[0],
    visitStatus: 'Sudah Dikunjungi',
    activityRating: 'Aktif'
  });

  // Load existing or initialize new
  useEffect(() => {
    if (existingMember) {
      setFormData({ ...existingMember });
    } else {
      const nextId = generateNextMemberId(allMembers);
      setFormData({
        memberId: nextId,
        name: '',
        nickname: '',
        nik: '',
        birthPlace: 'Pangandaran',
        birthDate: '1990-01-01',
        gender: 'Laki-laki',
        bloodType: 'O',
        maritalStatus: 'Menikah',
        education: 'SMA',
        occupation: 'Wiraswasta',
        monthlyIncome: '1-3 Juta',
        address: 'RT 01 / RW 01 Dusun Legokjawa',
        rt: '01',
        rw: '01',
        subdistrict: 'Cimerak',
        district: 'Pangandaran',
        postalCode: '46395',
        phone: '',
        backupPhone: '',
        emergencyPhone: '',
        email: '',
        homeDistance: 'Dekat Masjid <100m',
        residenceStatus: 'Rumah Sendiri',
        fatherName: '',
        motherName: '',
        spouseName: '',
        childrenCount: 0,
        childrenList: [],
        allFamilyCongregation: 'Ya',
        familyNotYetNotes: '',
        familyStatus: 'Keluarga Mampu',
        type: 'jamaah_tetap',
        joinDate: new Date().toISOString().split('T')[0],
        quranReadingLevel: 'Al-Qur\'an Lancar',
        memorizedJuzCount: 0,
        lastMemorizedSurah: '',
        congregationalPrayerFrequency: 'Rutin 5 Waktu di Masjid',
        sunnahFasting: 'Senin-Kamis Rutin',
        routineStudies: ['Kajian Subuh Ahad'],
        officerCapabilities: [],
        healthCondition: 'Sehat',
        diseaseName: '',
        sickSince: '',
        needsVisit: 'Tidak',
        lastVisitedDate: '',
        specialNeeds: ['Tidak Ada'],
        socioEconomicStatus: 'Cukup',
        donorHistory: [],
        committeeHistory: [],
        skillsForMosque: [],
        takmirNotes: '',
        lastCongregationalPrayerDate: new Date().toISOString().split('T')[0],
        visitStatus: 'Sudah Dikunjungi',
        activityRating: 'Aktif'
      });
    }
  }, [existingMember, allMembers, isOpen]);

  if (!isOpen) return null;

  const currentAge = calculateAge(formData.birthDate);

  const handleChange = (field: keyof CongregationMember, val: any) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleToggleArrayItem = (field: 'routineStudies' | 'officerCapabilities' | 'specialNeeds' | 'donorHistory' | 'committeeHistory' | 'skillsForMosque', item: string) => {
    setFormData(prev => {
      const arr = prev[field] || [];
      if (arr.includes(item)) {
        return { ...prev, [field]: arr.filter(x => x !== item) };
      } else {
        return { ...prev, [field]: [...arr, item] };
      }
    });
  };

  // Child dynamic handlers
  const handleAddChild = () => {
    const list = formData.childrenList || [];
    setFormData(prev => ({
      ...prev,
      childrenList: [...list, { name: '', age: 5 }],
      childrenCount: (prev.childrenCount || 0) + 1
    }));
  };

  const handleUpdateChild = (index: number, name: string, age: number) => {
    const list = [...(formData.childrenList || [])];
    list[index] = { name, age };
    setFormData(prev => ({ ...prev, childrenList: list }));
  };

  const handleRemoveChild = (index: number) => {
    const list = [...(formData.childrenList || [])];
    list.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      childrenList: list,
      childrenCount: Math.max(0, list.length)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('Nama Lengkap jamaah wajib diisi!');
      setActiveTab('A');
      return;
    }
    if (!formData.phone?.trim()) {
      alert('Nomor WhatsApp utama wajib diisi!');
      setActiveTab('B');
      return;
    }

    const payload: CongregationMember = {
      id: existingMember?.id || `c-${Date.now()}`,
      memberId: formData.memberId || generateNextMemberId(allMembers),
      name: formData.name.trim(),
      nickname: formData.nickname?.trim() || '',
      nik: formData.nik?.trim() || '',
      birthPlace: formData.birthPlace || 'Pangandaran',
      birthDate: formData.birthDate || '1990-01-01',
      gender: formData.gender || 'Laki-laki',
      bloodType: formData.bloodType || 'Tidak Tahu',
      avatarInitials: (formData.name || 'JM').slice(0, 2).toUpperCase(),
      maritalStatus: formData.maritalStatus || 'Menikah',
      education: formData.education || 'SMA',
      occupation: formData.occupation || 'Wiraswasta',
      monthlyIncome: formData.monthlyIncome || '1-3 Juta',
      address: formData.address || 'Legokjawa',
      rt: formData.rt || '01',
      rw: formData.rw || '01',
      subdistrict: formData.subdistrict || 'Cimerak',
      district: formData.district || 'Pangandaran',
      postalCode: formData.postalCode || '46395',
      phone: formData.phone.trim(),
      backupPhone: formData.backupPhone || '',
      emergencyPhone: formData.emergencyPhone || '',
      email: formData.email || '',
      homeDistance: formData.homeDistance || 'Dekat Masjid <100m',
      residenceStatus: formData.residenceStatus || 'Rumah Sendiri',
      fatherName: formData.fatherName || '',
      motherName: formData.motherName || '',
      spouseName: formData.spouseName || '',
      childrenCount: Number(formData.childrenCount) || 0,
      childrenList: formData.childrenList || [],
      allFamilyCongregation: formData.allFamilyCongregation || 'Ya',
      familyNotYetNotes: formData.familyNotYetNotes || '',
      familyStatus: formData.familyStatus || 'Keluarga Mampu',
      type: formData.type || 'jamaah_tetap',
      joinDate: formData.joinDate || new Date().toISOString().split('T')[0],
      quranReadingLevel: formData.quranReadingLevel || 'Al-Qur\'an Lancar',
      memorizedJuzCount: Number(formData.memorizedJuzCount) || 0,
      lastMemorizedSurah: formData.lastMemorizedSurah || '',
      congregationalPrayerFrequency: formData.congregationalPrayerFrequency || 'Rutin 5 Waktu di Masjid',
      sunnahFasting: formData.sunnahFasting || 'Senin-Kamis Rutin',
      routineStudies: formData.routineStudies || [],
      officerCapabilities: formData.officerCapabilities || [],
      healthCondition: formData.healthCondition || 'Sehat',
      diseaseName: formData.diseaseName || '',
      sickSince: formData.sickSince || '',
      needsVisit: formData.needsVisit || 'Tidak',
      lastVisitedDate: formData.lastVisitedDate || '',
      specialNeeds: formData.specialNeeds || ['Tidak Ada'],
      socioEconomicStatus: formData.socioEconomicStatus || 'Cukup',
      donorHistory: formData.donorHistory || [],
      committeeHistory: formData.committeeHistory || [],
      skillsForMosque: formData.skillsForMosque || [],
      takmirNotes: formData.takmirNotes || '',
      lastCongregationalPrayerDate: formData.lastCongregationalPrayerDate || new Date().toISOString().split('T')[0],
      visitStatus: formData.visitStatus || 'Sudah Dikunjungi',
      activityRating: formData.activityRating || 'Aktif',
      notes: formData.takmirNotes || ''
    };

    onSaveMember(payload);
    onClose();
  };

  const tabsList: { key: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'; label: string; icon: any }[] = [
    { key: 'A', label: 'Data Pribadi', icon: User },
    { key: 'B', label: 'Alamat & Kontak', icon: MapPin },
    { key: 'C', label: 'Data Keluarga', icon: Users },
    { key: 'D', label: 'Ibadah & Quran', icon: BookOpen },
    { key: 'E', label: 'Sosial & Sehat', icon: Heart },
    { key: 'F', label: 'Infaq & Skill', icon: Wallet },
    { key: 'G', label: 'Catatan Takmir', icon: ShieldAlert },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shadow">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700">
                  {formData.memberId || 'JM-000'}
                </span>
                <span className="text-xs text-emerald-200">
                  {existingMember ? 'Edit Data Jamaah' : 'Pendaftaran Jamaah Baru'}
                </span>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                {formData.name || 'Input Jamaah Baru Super Lengkap'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7 Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-3 sm:px-5 pt-2 overflow-x-auto gap-1.5 shrink-0">
          {tabsList.map((t) => {
            const isActive = activeTab === t.key;
            const Icon = t.icon;
            return (
              <button
                type="button"
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`py-2 px-2.5 rounded-t-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition border-b-2 ${
                  isActive
                    ? 'border-emerald-700 text-emerald-900 bg-white shadow-xs'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                <span>{t.key}. {t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* TAB A: DATA PRIBADI */}
          {activeTab === 'A' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Nama Lengkap <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: H. Supriyadi"
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Nama Panggilan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pak Haji Pri"
                    value={formData.nickname || ''}
                    onChange={(e) => handleChange('nickname', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    NIK (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="16 Digit NIK"
                    value={formData.nik || ''}
                    onChange={(e) => handleChange('nik', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pangandaran"
                    value={formData.birthPlace || ''}
                    onChange={(e) => handleChange('birthPlace', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Tanggal Lahir <span className="text-emerald-700 font-mono">(Usia: {currentAge} Th)</span>
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate || '1990-01-01'}
                    onChange={(e) => handleChange('birthDate', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formData.gender || 'Laki-laki'}
                    onChange={(e) => handleChange('gender', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Golongan Darah
                  </label>
                  <select
                    value={formData.bloodType || 'Tidak Tahu'}
                    onChange={(e) => handleChange('bloodType', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                    <option value="Tidak Tahu">Tidak Tahu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Status Pernikahan
                  </label>
                  <select
                    value={formData.maritalStatus || 'Menikah'}
                    onChange={(e) => handleChange('maritalStatus', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  >
                    <option value="Belum Menikah">Belum Menikah</option>
                    <option value="Menikah">Menikah</option>
                    <option value="Duda">Duda</option>
                    <option value="Janda">Janda</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Pendidikan
                  </label>
                  <select
                    value={formData.education || 'SMA'}
                    onChange={(e) => handleChange('education', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  >
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="Pesantren">Pesantren</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Pekerjaan
                  </label>
                  <select
                    value={formData.occupation || 'Wiraswasta'}
                    onChange={(e) => handleChange('occupation', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  >
                    <option value="PNS">PNS / ASN</option>
                    <option value="Wiraswasta">Wiraswasta / Pedagang</option>
                    <option value="Buruh">Buruh</option>
                    <option value="Petani">Petani / Nelayan</option>
                    <option value="Pelajar">Pelajar</option>
                    <option value="Mahasiswa">Mahasiswa</option>
                    <option value="Ibu Rumah Tangga">Ibu Rumah Tangga</option>
                    <option value="Pensiunan">Pensiunan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Penghasilan Per Bulan <span className="text-amber-700">(Data Santunan Takmir)</span>
                  </label>
                  <select
                    value={formData.monthlyIncome || '1-3 Juta'}
                    onChange={(e) => handleChange('monthlyIncome', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold"
                  >
                    <option value="<1 Juta">&lt; 1 Juta (Prioritas Santunan)</option>
                    <option value="1-3 Juta">1 - 3 Juta</option>
                    <option value="3-5 Juta">3 - 5 Juta</option>
                    <option value=">5 Juta">&gt; 5 Juta</option>
                    <option value="Rahasia">Rahasia</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB B: ALAMAT & KONTAK */}
          {activeTab === 'B' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Alamat Lengkap (Dusun / Jalan / Desa)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dusun Legokjawa RT 02 / RW 01"
                  value={formData.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">RT</label>
                  <input
                    type="text"
                    placeholder="02"
                    value={formData.rt || '01'}
                    onChange={(e) => handleChange('rt', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">RW</label>
                  <input
                    type="text"
                    placeholder="01"
                    value={formData.rw || '01'}
                    onChange={(e) => handleChange('rw', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Kecamatan</label>
                  <input
                    type="text"
                    value={formData.subdistrict || 'Cimerak'}
                    onChange={(e) => handleChange('subdistrict', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Kabupaten</label>
                  <input
                    type="text"
                    value={formData.district || 'Pangandaran'}
                    onChange={(e) => handleChange('district', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    No WhatsApp Utama <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="6281234567890"
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    No WA Cadangan
                  </label>
                  <input
                    type="text"
                    placeholder="081234..."
                    value={formData.backupPhone || ''}
                    onChange={(e) => handleChange('backupPhone', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    No Kontak Darurat Keluarga
                  </label>
                  <input
                    type="text"
                    placeholder="081399..."
                    value={formData.emergencyPhone || ''}
                    onChange={(e) => handleChange('emergencyPhone', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Titik Jarak Rumah dari Masjid
                  </label>
                  <select
                    value={formData.homeDistance || 'Dekat Masjid <100m'}
                    onChange={(e) => handleChange('homeDistance', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold"
                  >
                    <option value="Dekat Masjid <100m">Dekat Masjid &lt;100m</option>
                    <option value="100-500m">100 - 500m</option>
                    <option value=">500m">&gt; 500m</option>
                    <option value="Luar Desa">Luar Desa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Status Tempat Tinggal
                  </label>
                  <select
                    value={formData.residenceStatus || 'Rumah Sendiri'}
                    onChange={(e) => handleChange('residenceStatus', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  >
                    <option value="Rumah Sendiri">Rumah Sendiri</option>
                    <option value="Kontrak">Kontrak</option>
                    <option value="Kos">Kos</option>
                    <option value="Menumpang">Menumpang / Numpang Tinggal</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB C: DATA KELUARGA */}
          {activeTab === 'C' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Nama Ayah</label>
                  <input
                    type="text"
                    value={formData.fatherName || ''}
                    onChange={(e) => handleChange('fatherName', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Nama Ibu</label>
                  <input
                    type="text"
                    value={formData.motherName || ''}
                    onChange={(e) => handleChange('motherName', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Nama Suami / Istri</label>
                  <input
                    type="text"
                    value={formData.spouseName || ''}
                    onChange={(e) => handleChange('spouseName', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>

              {/* Dynamic Child List */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-800 uppercase tracking-wider">
                    Daftar Anak ({formData.childrenList?.length || 0} Anak)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddChild}
                    className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Anak</span>
                  </button>
                </div>

                {formData.childrenList && formData.childrenList.length > 0 ? (
                  <div className="space-y-2">
                    {formData.childrenList.map((ch, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-500 w-14 shrink-0">Anak #{idx + 1}</span>
                        <input
                          type="text"
                          placeholder="Nama Anak"
                          value={ch.name}
                          onChange={(e) => handleUpdateChild(idx, e.target.value, ch.age)}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                        />
                        <div className="flex items-center gap-1 w-28 shrink-0">
                          <input
                            type="number"
                            min="0"
                            max="80"
                            placeholder="Umur"
                            value={ch.age}
                            onChange={(e) => handleUpdateChild(idx, ch.name, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1.5 rounded-lg border border-stone-300 text-xs text-center font-mono"
                          />
                          <span className="text-xs text-stone-500">Th</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveChild(idx)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 italic">Belum ada anak ditambahkan. Klik tombol di atas jika memiliki anak.</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Apakah 1 Keluarga Sudah Semua Jadi Jamaah?
                  </label>
                  <select
                    value={formData.allFamilyCongregation || 'Ya'}
                    onChange={(e) => handleChange('allFamilyCongregation', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold"
                  >
                    <option value="Ya">Ya, Semua Sudah Jadi Jamaah</option>
                    <option value="Belum">Belum Semua (Perlu Pendekatan)</option>
                  </select>
                  {formData.allFamilyCongregation === 'Belum' && (
                    <input
                      type="text"
                      placeholder="Tuliskan siapa yang belum dan alasannya..."
                      value={formData.familyNotYetNotes || ''}
                      onChange={(e) => handleChange('familyNotYetNotes', e.target.value)}
                      className="w-full mt-2 px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Status Ekonomi Keluarga (Kriteria Santunan)
                  </label>
                  <select
                    value={formData.familyStatus || 'Keluarga Mampu'}
                    onChange={(e) => handleChange('familyStatus', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold text-emerald-900"
                  >
                    <option value="Keluarga Mampu">Keluarga Mampu</option>
                    <option value="Keluarga Kurang Mampu">Keluarga Kurang Mampu</option>
                    <option value="Keluarga Dhuafa">Keluarga Dhuafa (Penerima Beras/Santunan)</option>
                    <option value="Yatim">Yatim (Anak Binaan Masjid)</option>
                    <option value="Piatu">Piatu</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB D: KEAGAMAAN & IBADAH */}
          {activeTab === 'D' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Status Jamaah</label>
                  <select
                    value={formData.type || 'jamaah_tetap'}
                    onChange={(e) => handleChange('type', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold capitalize"
                  >
                    <option value="jamaah_tetap">Jamaah Tetap</option>
                    <option value="jamaah_musiman">Jamaah Musiman</option>
                    <option value="jamaah_pendatang">Jamaah Pendatang</option>
                    <option value="donatur">Donatur Rutin</option>
                    <option value="pengurus">Pengurus DKM</option>
                    <option value="remaja_masjid">Remaja Masjid</option>
                    <option value="anak_tpa">Anak TPA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Kemampuan Baca Al-Qur'an</label>
                  <select
                    value={formData.quranReadingLevel || 'Al-Qur\'an Lancar'}
                    onChange={(e) => handleChange('quranReadingLevel', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold"
                  >
                    <option value="Belum Bisa">Belum Bisa (Perlu Dibimbing)</option>
                    <option value="Iqra 1-6">Iqra 1 - 6</option>
                    <option value="Al-Qur'an Lancar">Al-Qur'an Lancar</option>
                    <option value="Tahfidz">Tahfidz / Penghafal Quran</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Hafalan Juz & Surah</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      placeholder="Juz"
                      value={formData.memorizedJuzCount || 0}
                      onChange={(e) => handleChange('memorizedJuzCount', parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-2 rounded-xl border border-stone-300 text-sm font-mono text-center"
                    />
                    <input
                      type="text"
                      placeholder="Surah Terakhir"
                      value={formData.lastMemorizedSurah || ''}
                      onChange={(e) => handleChange('lastMemorizedSurah', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Sholat Berjamaah di Masjid</label>
                  <select
                    value={formData.congregationalPrayerFrequency || 'Rutin 5 Waktu di Masjid'}
                    onChange={(e) => handleChange('congregationalPrayerFrequency', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold"
                  >
                    <option value="Rutin 5 Waktu di Masjid">Rutin 5 Waktu di Masjid</option>
                    <option value="Sering (3-4 waktu)">Sering (3-4 waktu)</option>
                    <option value="Jarang (1-2 waktu)">Jarang (1-2 waktu)</option>
                    <option value="Hanya Jumat">Hanya Jumat</option>
                    <option value="Belum Rutin">Belum Rutin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Puasa Sunnah</label>
                  <select
                    value={formData.sunnahFasting || 'Senin-Kamis Rutin'}
                    onChange={(e) => handleChange('sunnahFasting', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  >
                    <option value="Senin-Kamis Rutin">Senin-Kamis Rutin</option>
                    <option value="Kadang">Kadang-kadang</option>
                    <option value="Tidak Pernah">Tidak Pernah</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes: Ikut Kajian Apa Saja */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                  Ikut Kajian & Majelis Apa Saja? (Centang yang sesuai):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    'Kajian Subuh Ahad',
                    'Kajian Maghrib Rabu',
                    'Kajian Ibu-Ibu',
                    'TPA',
                    'Remaja Masjid',
                    'Lainnya'
                  ].map((kj) => (
                    <label key={kj} className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                      <input
                        type="checkbox"
                        checked={formData.routineStudies?.includes(kj) || false}
                        onChange={() => handleToggleArrayItem('routineStudies', kj)}
                        className="rounded text-emerald-700 focus:ring-emerald-600"
                      />
                      <span>{kj}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Checkboxes: Bisa Jadi Petugas Ibadah? */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">
                  Bisa Jadi Petugas Sholat & Masjid? (Bank Petugas):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    'Bisa Jadi Imam',
                    'Bisa Jadi Muadzin',
                    'Bisa Jadi Khatib',
                    'Bisa Jadi Bilal',
                    'Bisa Jadi Marbot',
                    'Tidak Bisa'
                  ].map((cap) => (
                    <label key={cap} className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                      <input
                        type="checkbox"
                        checked={formData.officerCapabilities?.includes(cap) || false}
                        onChange={() => handleToggleArrayItem('officerCapabilities', cap)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span>{cap}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB E: DATA SOSIAL & KESEHATAN */}
          {activeTab === 'E' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Kondisi Kesehatan Saat Ini
                  </label>
                  <select
                    value={formData.healthCondition || (currentAge >= 60 ? 'Lansia' : 'Sehat')}
                    onChange={(e) => handleChange('healthCondition', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold text-emerald-900"
                  >
                    <option value="Sehat">Sehat Wal'afiat</option>
                    <option value="Sakit Ringan">Sakit Ringan (Flu/Demam)</option>
                    <option value="Sakit Kronis">Sakit Kronis (Perlu Perhatian Takmir)</option>
                    <option value="Disabilitas">Disabilitas</option>
                    <option value="Lansia">Lansia (Usia &gt; 60 Tahun)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Perlu Dikunjungi Takmir?
                  </label>
                  <select
                    value={formData.needsVisit || 'Tidak'}
                    onChange={(e) => handleChange('needsVisit', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold"
                  >
                    <option value="Tidak">Tidak Perlu</option>
                    <option value="Ya">Ya, Perlu Dikunjungi Segera</option>
                  </select>
                </div>
              </div>

              {formData.healthCondition === 'Sakit Kronis' || formData.healthCondition === 'Sakit Ringan' ? (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-rose-900 uppercase mb-1">Nama Penyakit / Keluhan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Stroke ringan, Asam Urat, Diabetes"
                      value={formData.diseaseName || ''}
                      onChange={(e) => handleChange('diseaseName', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-rose-300 text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-rose-900 uppercase mb-1">Sejak Kapan Sakit</label>
                    <input
                      type="text"
                      placeholder="Contoh: Sejak 1 Minggu lalu / Oktober 2026"
                      value={formData.sickSince || ''}
                      onChange={(e) => handleChange('sickSince', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-rose-300 text-sm bg-white"
                    />
                  </div>
                </div>
              ) : null}

              {/* Kebutuhan Khusus */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                  Kebutuhan Bantuan Khusus dari Masjid:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    'Butuh Kursi Roda',
                    'Butuh Antar Jemput ke Masjid',
                    'Butuh Bantuan Sembako',
                    'Butuh Bantuan Biaya Sekolah',
                    'Butuh Bantuan Modal Usaha',
                    'Tidak Ada'
                  ].map((need) => (
                    <label key={need} className="flex items-center gap-2 cursor-pointer text-stone-800">
                      <input
                        type="checkbox"
                        checked={formData.specialNeeds?.includes(need) || false}
                        onChange={() => handleToggleArrayItem('specialNeeds', need)}
                        className="rounded text-rose-600 focus:ring-rose-500"
                      />
                      <span>{need}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB F: INFAQ & KONTRIBUSI */}
          {activeTab === 'F' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                <b>Total Infaq Seumur Hidup:</b> Terhitung otomatis dari database keuangan masjid saat donatur bertransaksi.
              </div>

              {/* Pernah Jadi Donatur Apa */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                  Pernah Berpartisipasi Jadi Donatur:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    'Buka Puasa',
                    'Santunan Yatim',
                    'Pembangunan',
                    'Qurban',
                    'Wakaf',
                    'Belum Pernah'
                  ].map((don) => (
                    <label key={don} className="flex items-center gap-2 cursor-pointer text-stone-800">
                      <input
                        type="checkbox"
                        checked={formData.donorHistory?.includes(don) || false}
                        onChange={() => handleToggleArrayItem('donorHistory', don)}
                        className="rounded text-emerald-700"
                      />
                      <span>{don}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pernah Jadi Panitia */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                  Pernah Jadi Panitia Masjid:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    'Panitia Ramadhan',
                    'Panitia Qurban',
                    'Panitia Kajian',
                    'Panitia Pembangunan',
                    'Belum Pernah'
                  ].map((pan) => (
                    <label key={pan} className="flex items-center gap-2 cursor-pointer text-stone-800">
                      <input
                        type="checkbox"
                        checked={formData.committeeHistory?.includes(pan) || false}
                        onChange={() => handleToggleArrayItem('committeeHistory', pan)}
                        className="rounded text-emerald-700"
                      />
                      <span>{pan}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Keahlian yang Bisa Disumbangkan */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                  Keahlian yang Bisa Disumbangkan untuk Kemakmuran Masjid:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    'Tukang Bangunan',
                    'Tukang Listrik',
                    'Tukang Masak',
                    'Sopir',
                    'IT',
                    'Desain',
                    'Mengajar Ngaji',
                    'Lainnya'
                  ].map((skill) => (
                    <label key={skill} className="flex items-center gap-2 cursor-pointer text-stone-800">
                      <input
                        type="checkbox"
                        checked={formData.skillsForMosque?.includes(skill) || false}
                        onChange={() => handleToggleArrayItem('skillsForMosque', skill)}
                        className="rounded text-amber-600"
                      />
                      <span>{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB G: CATATAN TAKMIR */}
          {activeTab === 'G' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Status Kunjungan</label>
                  <select
                    value={formData.visitStatus || 'Sudah Dikunjungi'}
                    onChange={(e) => handleChange('visitStatus', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold text-emerald-900"
                  >
                    <option value="Sudah Dikunjungi">Sudah Dikunjungi</option>
                    <option value="Belum Dikunjungi">Belum Dikunjungi</option>
                    <option value="Perlu Dikunjungi Segera">Perlu Dikunjungi Segera (Merah)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Rating Keaktifan</label>
                  <select
                    value={formData.activityRating || 'Aktif'}
                    onChange={(e) => handleChange('activityRating', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold"
                  >
                    <option value="Sangat Aktif">Sangat Aktif (Shaf Pertama)</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Kurang Aktif">Kurang Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Terakhir Sholat Berjamaah</label>
                  <input
                    type="date"
                    value={formData.lastCongregationalPrayerDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleChange('lastCongregationalPrayerDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Catatan Khusus Takmir (Rahasia / Internal DKM)
                </label>
                <textarea
                  rows={3}
                  placeholder="Misal: 'Pak Budi belum sholat berjamaah 3 hari, perlu dikunjungi takmir', atau 'Keluarga baru pindah dari Bandung, perlu disambut hangat'."
                  value={formData.takmirNotes || ''}
                  onChange={(e) => handleChange('takmirNotes', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {activeTab !== 'A' && (
                <button
                  type="button"
                  onClick={() => {
                    const idx = tabsList.findIndex(t => t.key === activeTab);
                    if (idx > 0) setActiveTab(tabsList[idx - 1].key);
                  }}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Sebelumnya</span>
                </button>
              )}
              {activeTab !== 'G' && (
                <button
                  type="button"
                  onClick={() => {
                    const idx = tabsList.findIndex(t => t.key === activeTab);
                    if (idx < tabsList.length - 1) setActiveTab(tabsList[idx + 1].key);
                  }}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>Simpan Data Jamaah</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
