import {
  MosqueProfile,
  DkmBoardMember,
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
  TakmirVisitRecord,
  MosquePointOfInterest
} from '../types/mosque';

import {
  DEFAULT_MOSQUE_PROFILE,
  DEFAULT_DKM_BOARD,
  DEFAULT_OFFICERS,
  DEFAULT_FRIDAY_OFFICERS,
  DEFAULT_STUDY_SESSIONS,
  DEFAULT_SPECIAL_PROGRAMS,
  DEFAULT_TRANSACTIONS,
  DEFAULT_CONGREGATION,
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_SUGGESTIONS,
  DEFAULT_PRAYER_REQUESTS,
  DEFAULT_TAKMIR_VISITS,
  DEFAULT_MAP_POIS
} from '../data/defaultData';

const KEYS = {
  PROFILE: 'mosque_app_profile',
  DKM: 'mosque_app_dkm',
  OFFICERS: 'mosque_app_officers',
  FRIDAYS: 'mosque_app_fridays',
  STUDIES: 'mosque_app_studies',
  ATTENDANCE: 'mosque_app_attendance',
  PROGRAMS: 'mosque_app_programs',
  TRANSACTIONS: 'mosque_app_transactions',
  CONGREGATION: 'mosque_app_congregation',
  ANNOUNCEMENTS: 'mosque_app_announcements',
  SUGGESTIONS: 'mosque_app_suggestions',
  PRAYER_REQUESTS: 'mosque_app_prayer_requests',
  VISITS: 'mosque_app_visits',
  MAP_POIS: 'mosque_app_map_pois',
  AUTH: 'mosque_app_auth_takmir'
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error loading localStorage key ${key}`, e);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving localStorage key ${key}`, e);
  }
}

export const Storage = {
  getProfile: (): MosqueProfile => getItem(KEYS.PROFILE, DEFAULT_MOSQUE_PROFILE),
  setProfile: (data: MosqueProfile) => setItem(KEYS.PROFILE, data),

  getDkm: (): DkmBoardMember[] => getItem(KEYS.DKM, DEFAULT_DKM_BOARD),
  setDkm: (data: DkmBoardMember[]) => setItem(KEYS.DKM, data),

  getOfficers: (): OfficerSchedule[] => getItem(KEYS.OFFICERS, DEFAULT_OFFICERS),
  setOfficers: (data: OfficerSchedule[]) => setItem(KEYS.OFFICERS, data),

  getFridayOfficers: (): FridayOfficer[] => getItem(KEYS.FRIDAYS, DEFAULT_FRIDAY_OFFICERS),
  setFridayOfficers: (data: FridayOfficer[]) => setItem(KEYS.FRIDAYS, data),

  getStudies: (): StudySession[] => getItem(KEYS.STUDIES, DEFAULT_STUDY_SESSIONS),
  setStudies: (data: StudySession[]) => setItem(KEYS.STUDIES, data),

  getAttendance: (): StudyAttendance[] => getItem(KEYS.ATTENDANCE, []),
  setAttendance: (data: StudyAttendance[]) => setItem(KEYS.ATTENDANCE, data),

  getPrograms: (): SpecialProgram[] => getItem(KEYS.PROGRAMS, DEFAULT_SPECIAL_PROGRAMS),
  setPrograms: (data: SpecialProgram[]) => setItem(KEYS.PROGRAMS, data),

  getTransactions: (): Transaction[] => getItem(KEYS.TRANSACTIONS, DEFAULT_TRANSACTIONS),
  setTransactions: (data: Transaction[]) => setItem(KEYS.TRANSACTIONS, data),

  getCongregation: (): CongregationMember[] => {
    const raw = getItem<CongregationMember[]>(KEYS.CONGREGATION, DEFAULT_CONGREGATION);
    // If stored items are from previous minimal schema (missing memberId), upgrade them with defaults
    if (raw && raw.length > 0 && !raw[0].memberId) {
      return DEFAULT_CONGREGATION;
    }
    return raw;
  },
  setCongregation: (data: CongregationMember[]) => setItem(KEYS.CONGREGATION, data),

  getVisits: (): TakmirVisitRecord[] => getItem(KEYS.VISITS, DEFAULT_TAKMIR_VISITS),
  setVisits: (data: TakmirVisitRecord[]) => setItem(KEYS.VISITS, data),

  getAnnouncements: (): Announcement[] => getItem(KEYS.ANNOUNCEMENTS, DEFAULT_ANNOUNCEMENTS),
  setAnnouncements: (data: Announcement[]) => setItem(KEYS.ANNOUNCEMENTS, data),

  getSuggestions: (): Suggestion[] => getItem(KEYS.SUGGESTIONS, DEFAULT_SUGGESTIONS),
  setSuggestions: (data: Suggestion[]) => setItem(KEYS.SUGGESTIONS, data),

  getPrayerRequests: (): PrayerRequest[] => getItem(KEYS.PRAYER_REQUESTS, DEFAULT_PRAYER_REQUESTS),
  setPrayerRequests: (data: PrayerRequest[]) => setItem(KEYS.PRAYER_REQUESTS, data),

  isTakmirAuth: (): boolean => {
    return localStorage.getItem(KEYS.AUTH) === 'true';
  },
  setTakmirAuth: (status: boolean) => {
    localStorage.setItem(KEYS.AUTH, status ? 'true' : 'false');
  },

  resetAllData: () => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },

  exportAllData: (): string => {
    const backup: Record<string, any> = {};
    Object.entries(KEYS).forEach(([name, key]) => {
      backup[name] = localStorage.getItem(key);
    });
    return JSON.stringify(backup, null, 2);
  },

  importAllData: (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      Object.entries(KEYS).forEach(([name, key]) => {
        if (parsed[name]) {
          localStorage.setItem(key, parsed[name]);
        }
      });
      return true;
    } catch (e) {
      console.error("Failed to restore data:", e);
      return false;
    }
  }
};
