import React, { useState, useEffect, useMemo } from 'react';
import { 
  MenuKey, 
  MosqueProfile, 
  OfficerSchedule, 
  FridayOfficer, 
  StudySession, 
  StudyAttendance, 
  SpecialProgram, 
  Transaction, 
  CongregationMember, 
  Announcement, 
  Suggestion, 
  PrayerRequest,
  TakmirVisitRecord
} from './types/mosque';
import { calculateTodayPrayerTimes } from './utils/prayerTimes';
import { Storage } from './utils/storage';

// Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { TakmirLoginModal } from './components/TakmirLoginModal';
import { MosqueProfileModal } from './components/MosqueProfileModal';
import { QrisModal } from './components/QrisModal';

// Views
import { DashboardView } from './views/DashboardView';
import { PrayerScheduleView } from './views/PrayerScheduleView';
import { StudyActivitiesView } from './views/StudyActivitiesView';
import { FinanceView } from './views/FinanceView';
import { CongregationView } from './views/CongregationView';
import { OnlineInfaqView } from './views/OnlineInfaqView';
import { AnnouncementsSuggestionsView } from './views/AnnouncementsSuggestionsView';

export default function App() {
  // 1. Core Profile & App State
  const [profile, setProfile] = useState<MosqueProfile>(() => Storage.getProfile());
  const [currentMenu, setCurrentMenu] = useState<MenuKey>('dashboard');
  const [isTakmir, setIsTakmir] = useState<boolean>(() => Storage.isTakmirAuth());

  // 2. Data Collections
  const [officers, setOfficers] = useState<OfficerSchedule[]>(() => Storage.getOfficers());
  const [fridayOfficers, setFridayOfficers] = useState<FridayOfficer[]>(() => Storage.getFridayOfficers());
  const [studies, setStudies] = useState<StudySession[]>(() => Storage.getStudies());
  const [attendanceList, setAttendanceList] = useState<StudyAttendance[]>(() => Storage.getAttendance());
  const [specialPrograms, setSpecialPrograms] = useState<SpecialProgram[]>(() => Storage.getPrograms());
  const [transactions, setTransactions] = useState<Transaction[]>(() => Storage.getTransactions());
  const [congregation, setCongregation] = useState<CongregationMember[]>(() => Storage.getCongregation());
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => Storage.getAnnouncements());
  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => Storage.getSuggestions());
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(() => Storage.getPrayerRequests());
  const [dkmBoard, setDkmBoard] = useState(() => Storage.getDkm());
  const [visitRecords, setVisitRecords] = useState<TakmirVisitRecord[]>(() => Storage.getVisits());

  // 3. Modals State
  const [isTakmirModalOpen, setIsTakmirModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);
  const [qrisParamNominal, setQrisParamNominal] = useState<number | undefined>();
  const [qrisParamPurpose, setQrisParamPurpose] = useState<string | undefined>();

  // Calculated Prayer Times with takmir offsets
  const prayerTimes = useMemo(() => {
    return calculateTodayPrayerTimes(profile.offsets);
  }, [profile.offsets]);

  // Sync title with Mosque Name
  useEffect(() => {
    document.title = `${profile.name} - Jogokariyan Style`;
  }, [profile.name]);

  // Counts for badges
  const pendingInfaqCount = useMemo(() => {
    return transactions.filter(t => t.status === 'menunggu_verifikasi').length;
  }, [transactions]);

  const unreadSuggestionsCount = useMemo(() => {
    return suggestions.filter(s => s.status === 'menunggu').length;
  }, [suggestions]);

  // Handlers for Profile & Auth
  const handleSaveProfile = (newProfile: MosqueProfile) => {
    setProfile(newProfile);
    Storage.setProfile(newProfile);
  };

  const handleLoginSuccess = () => {
    setIsTakmir(true);
    Storage.setTakmirAuth(true);
  };

  const handleLogout = () => {
    setIsTakmir(false);
    Storage.setTakmirAuth(false);
  };

  const handleRequireTakmir = () => {
    setIsTakmirModalOpen(true);
  };

  const handleResetData = () => {
    Storage.resetAllData();
  };

  // Handlers for Officers
  const handleSaveOfficer = (officer: OfficerSchedule) => {
    const existingIdx = officers.findIndex(o => o.id === officer.id);
    let updated: OfficerSchedule[];
    if (existingIdx >= 0) {
      updated = [...officers];
      updated[existingIdx] = officer;
    } else {
      updated = [officer, ...officers];
    }
    setOfficers(updated);
    Storage.setOfficers(updated);
  };

  const handleDeleteOfficer = (id: string) => {
    const updated = officers.filter(o => o.id !== id);
    setOfficers(updated);
    Storage.setOfficers(updated);
  };

  const handleSaveFridayOfficer = (friday: FridayOfficer) => {
    const existingIdx = fridayOfficers.findIndex(f => f.id === friday.id);
    let updated: FridayOfficer[];
    if (existingIdx >= 0) {
      updated = [...fridayOfficers];
      updated[existingIdx] = friday;
    } else {
      updated = [friday, ...fridayOfficers];
    }
    setFridayOfficers(updated);
    Storage.setFridayOfficers(updated);
  };

  const handleDeleteFridayOfficer = (id: string) => {
    const updated = fridayOfficers.filter(f => f.id !== id);
    setFridayOfficers(updated);
    Storage.setFridayOfficers(updated);
  };

  // Handlers for Study
  const handleSaveStudy = (study: StudySession) => {
    const existingIdx = studies.findIndex(s => s.id === study.id);
    let updated: StudySession[];
    if (existingIdx >= 0) {
      updated = [...studies];
      updated[existingIdx] = study;
    } else {
      updated = [study, ...studies];
    }
    setStudies(updated);
    Storage.setStudies(updated);
  };

  const handleDeleteStudy = (id: string) => {
    const updated = studies.filter(s => s.id !== id);
    setStudies(updated);
    Storage.setStudies(updated);
  };

  const handleRegisterAttendance = (attendance: StudyAttendance) => {
    const updatedAttendance = [attendance, ...attendanceList];
    setAttendanceList(updatedAttendance);
    Storage.setAttendance(updatedAttendance);

    // Increment count on study session
    const updatedStudies = studies.map(s => {
      if (s.id === attendance.studyId) {
        return { ...s, attendeesCount: (s.attendeesCount || 0) + 1 };
      }
      return s;
    });
    setStudies(updatedStudies);
    Storage.setStudies(updatedStudies);
  };

  // Handlers for Special Programs
  const handleSaveSpecialProgram = (prog: SpecialProgram) => {
    const existingIdx = specialPrograms.findIndex(p => p.id === prog.id);
    let updated: SpecialProgram[];
    if (existingIdx >= 0) {
      updated = [...specialPrograms];
      updated[existingIdx] = prog;
    } else {
      updated = [prog, ...specialPrograms];
    }
    setSpecialPrograms(updated);
    Storage.setPrograms(updated);
  };

  const handleDeleteSpecialProgram = (id: string) => {
    const updated = specialPrograms.filter(p => p.id !== id);
    setSpecialPrograms(updated);
    Storage.setPrograms(updated);
  };

  // Handlers for Transactions
  const handleSaveTransaction = (tx: Transaction) => {
    const existingIdx = transactions.findIndex(t => t.id === tx.id);
    let updated: Transaction[];
    if (existingIdx >= 0) {
      updated = [...transactions];
      updated[existingIdx] = tx;
    } else {
      updated = [tx, ...transactions];
    }
    setTransactions(updated);
    Storage.setTransactions(updated);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    Storage.setTransactions(updated);
  };

  const handleVerifyTransaction = (id: string) => {
    const updated = transactions.map(t => {
      if (t.id === id) {
        return { ...t, status: 'lunas' as const };
      }
      return t;
    });
    setTransactions(updated);
    Storage.setTransactions(updated);
  };

  // Handlers for Congregation
  const handleSaveMember = (member: CongregationMember) => {
    const existingIdx = congregation.findIndex(c => c.id === member.id);
    let updated: CongregationMember[];
    if (existingIdx >= 0) {
      updated = [...congregation];
      updated[existingIdx] = member;
    } else {
      updated = [member, ...congregation];
    }
    setCongregation(updated);
    Storage.setCongregation(updated);
  };

  const handleDeleteMember = (id: string) => {
    const updated = congregation.filter(c => c.id !== id);
    setCongregation(updated);
    Storage.setCongregation(updated);
  };

  const handleBulkImportMembers = (newMembers: CongregationMember[]) => {
    const updated = [...newMembers, ...congregation];
    setCongregation(updated);
    Storage.setCongregation(updated);
  };

  const handleSaveVisit = (visit: TakmirVisitRecord) => {
    const updated = [visit, ...visitRecords];
    setVisitRecords(updated);
    Storage.setVisits(updated);
  };

  // Handlers for Announcements
  const handleSaveAnnouncement = (anc: Announcement) => {
    const existingIdx = announcements.findIndex(a => a.id === anc.id);
    let updated: Announcement[];
    if (existingIdx >= 0) {
      updated = [...announcements];
      updated[existingIdx] = anc;
    } else {
      updated = [anc, ...announcements];
    }
    setAnnouncements(updated);
    Storage.setAnnouncements(updated);
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    Storage.setAnnouncements(updated);
  };

  // Handlers for Suggestions
  const handleSaveSuggestion = (sug: Suggestion) => {
    const updated = [sug, ...suggestions];
    setSuggestions(updated);
    Storage.setSuggestions(updated);
  };

  const handleMarkSuggestionFollowedUp = (id: string, notes: string) => {
    const updated = suggestions.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: 'ditindaklanjuti' as const,
          followUpNotes: notes
        };
      }
      return s;
    });
    setSuggestions(updated);
    Storage.setSuggestions(updated);
  };

  // Handlers for Prayer Requests
  const handleSavePrayerRequest = (pr: PrayerRequest) => {
    const existingIdx = prayerRequests.findIndex(p => p.id === pr.id);
    let updated: PrayerRequest[];
    if (existingIdx >= 0) {
      updated = [...prayerRequests];
      updated[existingIdx] = pr;
    } else {
      updated = [pr, ...prayerRequests];
    }
    setPrayerRequests(updated);
    Storage.setPrayerRequests(updated);
  };

  const handleDeletePrayerRequest = (id: string) => {
    const updated = prayerRequests.filter(p => p.id !== id);
    setPrayerRequests(updated);
    Storage.setPrayerRequests(updated);
  };

  // QRIS Open helper
  const handleOpenQrisModal = (nominal?: number, purpose?: string) => {
    setQrisParamNominal(nominal);
    setQrisParamPurpose(purpose);
    setIsQrisModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-900 font-sans">
      {/* 1. Global Header */}
      <Header
        profile={profile}
        prayerTimes={prayerTimes}
        isTakmir={isTakmir}
        onOpenTakmirModal={() => setIsTakmirModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenQrisModal={() => handleOpenQrisModal()}
      />

      {/* 2. Main Responsive Layout: Laptop 2 Kolom (Sidebar 28% / Konten 72%), Mobile Portrait */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Desktop Sidebar (28% on laptop > 1024px) */}
        <div className="hidden lg:block w-[28%] shrink-0">
          <div className="sticky top-[86px] h-[calc(100vh-86px)]">
            <Sidebar
              currentMenu={currentMenu}
              onSelectMenu={(menu) => setCurrentMenu(menu)}
              isTakmir={isTakmir}
              pendingInfaqCount={pendingInfaqCount}
              unreadSuggestionsCount={unreadSuggestionsCount}
              profile={profile}
              onOpenQrisModal={() => handleOpenQrisModal()}
            />
          </div>
        </div>

        {/* Content Area (72% on laptop, full width on mobile) */}
        <main className="flex-1 w-full lg:w-[72%] p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {currentMenu === 'dashboard' && (
            <DashboardView
              profile={profile}
              prayerTimes={prayerTimes}
              officers={officers}
              fridayOfficers={fridayOfficers}
              transactions={transactions}
              congregation={congregation}
              announcements={announcements}
              specialPrograms={specialPrograms}
              prayerRequests={prayerRequests}
              onNavigate={(menu) => setCurrentMenu(menu)}
              onOpenInfaqModal={() => setCurrentMenu('infaq_online')}
              onOpenQrisModal={() => handleOpenQrisModal()}
            />
          )}

          {currentMenu === 'prayer' && (
            <PrayerScheduleView
              profile={profile}
              prayerTimes={prayerTimes}
              officers={officers}
              fridayOfficers={fridayOfficers}
              isTakmir={isTakmir}
              onRequireTakmir={handleRequireTakmir}
              onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
              onSaveOfficer={handleSaveOfficer}
              onDeleteOfficer={handleDeleteOfficer}
              onSaveFridayOfficer={handleSaveFridayOfficer}
              onDeleteFridayOfficer={handleDeleteFridayOfficer}
            />
          )}

          {currentMenu === 'study' && (
            <StudyActivitiesView
              profile={profile}
              studies={studies}
              attendanceList={attendanceList}
              specialPrograms={specialPrograms}
              isTakmir={isTakmir}
              onRequireTakmir={handleRequireTakmir}
              onSaveStudy={handleSaveStudy}
              onDeleteStudy={handleDeleteStudy}
              onRegisterAttendance={handleRegisterAttendance}
              onSaveSpecialProgram={handleSaveSpecialProgram}
              onDeleteSpecialProgram={handleDeleteSpecialProgram}
            />
          )}

          {currentMenu === 'finance' && (
            <FinanceView
              profile={profile}
              transactions={transactions}
              isTakmir={isTakmir}
              onRequireTakmir={handleRequireTakmir}
              onSaveTransaction={handleSaveTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onVerifyTransaction={handleVerifyTransaction}
            />
          )}

          {currentMenu === 'congregation' && (
            <CongregationView
              profile={profile}
              congregation={congregation}
              dkmBoard={dkmBoard}
              transactions={transactions}
              attendanceList={attendanceList}
              visitRecords={visitRecords}
              isTakmir={isTakmir}
              onRequireTakmir={handleRequireTakmir}
              onSaveMember={handleSaveMember}
              onDeleteMember={handleDeleteMember}
              onBulkImportMembers={handleBulkImportMembers}
              onSaveVisit={handleSaveVisit}
            />
          )}

          {currentMenu === 'infaq_online' && (
            <OnlineInfaqView
              profile={profile}
              onOpenQrisModal={handleOpenQrisModal}
              onSaveTransaction={handleSaveTransaction}
              transactions={transactions}
              isTakmir={isTakmir}
              onRequireTakmir={handleRequireTakmir}
              onVerifyTransaction={handleVerifyTransaction}
            />
          )}

          {currentMenu === 'announcements' && (
            <AnnouncementsSuggestionsView
              profile={profile}
              announcements={announcements}
              suggestions={suggestions}
              prayerRequests={prayerRequests}
              isTakmir={isTakmir}
              onRequireTakmir={handleRequireTakmir}
              onSaveAnnouncement={handleSaveAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
              onSaveSuggestion={handleSaveSuggestion}
              onMarkSuggestionFollowedUp={handleMarkSuggestionFollowedUp}
              onSavePrayerRequest={handleSavePrayerRequest}
              onDeletePrayerRequest={handleDeletePrayerRequest}
            />
          )}
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation (only on mobile screens < 1024px) */}
      <MobileNav
        currentMenu={currentMenu}
        onSelectMenu={(menu) => setCurrentMenu(menu)}
        isTakmir={isTakmir}
        onOpenTakmirModal={() => setIsTakmirModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenQrisModal={() => handleOpenQrisModal()}
        profile={profile}
        pendingInfaqCount={pendingInfaqCount}
      />

      {/* 4. Global Modals */}
      <TakmirLoginModal
        isOpen={isTakmirModalOpen}
        onClose={() => setIsTakmirModalOpen(false)}
        isTakmir={isTakmir}
        correctPassword={profile.takmirPassword}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      <MosqueProfileModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        profile={profile}
        isTakmir={isTakmir}
        onSaveProfile={handleSaveProfile}
        onRequireTakmir={handleRequireTakmir}
        onResetData={handleResetData}
      />

      <QrisModal
        isOpen={isQrisModalOpen}
        onClose={() => setIsQrisModalOpen(false)}
        profile={profile}
        nominal={qrisParamNominal}
        purpose={qrisParamPurpose}
      />
    </div>
  );
}
