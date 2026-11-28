import {
  doc,
  getDoc,
  runTransaction,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { getCurrentUserProfile } from './authService';

export interface AcademyProgress {
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  updatedAt: string;
}

export interface AcademyDailyRecord {
  dateKey: string;
  questionId: string;
  selectedAnswerId: 'A' | 'B' | 'C';
  isCorrect: boolean;
  completed: boolean;
  earnedXP: number;
  completedAt: string;
}

export interface LevelInfo {
  level: number;
  totalXP: number;
  xpInCurrentLevel: number;
  xpToNextLevel: number;
  progressPercent: number;
}

const DEFAULT_PROGRESS: AcademyProgress = {
  totalXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  updatedAt: new Date().toISOString(),
};

/**
 * Calculate level, current level XP and progress percentage
 */
export function calculateLevelInfo(totalXP: number): LevelInfo {
  const safeXP = Math.max(0, totalXP);
  const level = Math.floor(safeXP / 100) + 1;
  const xpInCurrentLevel = safeXP % 100;
  const progressPercent = Math.min(100, Math.floor((xpInCurrentLevel / 100) * 100));

  return {
    level,
    totalXP: safeXP,
    xpInCurrentLevel,
    xpToNextLevel: 100,
    progressPercent,
  };
}

/**
 * Get YYYY-MM-DD date key in Asia/Ho_Chi_Minh local timezone
 */
export function getVietnamDateKey(dateObj: Date = new Date()): string {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get yesterday's YYYY-MM-DD date key
 */
export function getYesterdayDateKey(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  return getVietnamDateKey(dt);
}

/**
 * Calculate new streak based on last completed date and current date
 */
export function calculateNewStreak(
  lastCompletedDate: string | null,
  todayDateKey: string,
  currentStreak: number
): number {
  if (!lastCompletedDate) {
    return 1;
  }

  if (lastCompletedDate === todayDateKey) {
    return Math.max(1, currentStreak);
  }

  const yesterday = getYesterdayDateKey(todayDateKey);
  if (lastCompletedDate === yesterday) {
    return currentStreak + 1;
  }

  return 1; // Broken streak reset to 1
}

const getProgressKey = (uid: string) => `moneycare_academy_progress_${uid}`;
const getDailyKey = (uid: string, dateKey: string) => `moneycare_academy_daily_${uid}_${dateKey}`;

function getLocalProgress(uid: string): AcademyProgress {
  if (typeof localStorage === 'undefined') return DEFAULT_PROGRESS;
  const saved = localStorage.getItem(getProgressKey(uid));
  if (!saved) return DEFAULT_PROGRESS;
  try {
    return JSON.parse(saved);
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function saveLocalProgress(uid: string, prog: AcademyProgress): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(getProgressKey(uid), JSON.stringify(prog));
}

function getLocalDailyRecord(uid: string, dateKey: string): AcademyDailyRecord | null {
  if (typeof localStorage === 'undefined') return null;
  const saved = localStorage.getItem(getDailyKey(uid, dateKey));
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function saveLocalDailyRecord(uid: string, dateKey: string, rec: AcademyDailyRecord): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(getDailyKey(uid, dateKey), JSON.stringify(rec));
}

/**
 * Fetch user's Academy progress
 */
export async function fetchAcademyProgress(): Promise<AcademyProgress> {
  const user = getCurrentUserProfile();
  const uid = user ? user.uid : 'guest';

  if (isFirebaseConfigured && db && user) {
    try {
      const docRef = doc(db, 'users', user.uid, 'academy', 'progress');
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as AcademyProgress;
        saveLocalProgress(uid, data);
        return data;
      }
    } catch (err) {
      console.warn('Firestore fetch academy progress failed, using local cache:', err);
    }
  }

  return getLocalProgress(uid);
}

/**
 * Fetch daily quiz completion record
 */
export async function fetchDailyRecord(dateKey: string): Promise<AcademyDailyRecord | null> {
  const user = getCurrentUserProfile();
  const uid = user ? user.uid : 'guest';

  if (isFirebaseConfigured && db && user) {
    try {
      const docRef = doc(db, 'users', user.uid, 'academyDaily', dateKey);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as AcademyDailyRecord;
        saveLocalDailyRecord(uid, dateKey, data);
        return data;
      }
    } catch (err) {
      console.warn('Firestore fetch daily record failed, using local cache:', err);
    }
  }

  return getLocalDailyRecord(uid, dateKey);
}

export interface SubmitQuizResult {
  isFirstSubmission: boolean;
  earnedXP: number;
  progress: AcademyProgress;
  dailyRecord: AcademyDailyRecord;
}

/**
 * Atomic submission of daily quiz answer with double-XP protection
 */
export async function submitDailyQuiz(
  dateKey: string,
  questionId: string,
  selectedAnswerId: 'A' | 'B' | 'C',
  isCorrect: boolean
): Promise<SubmitQuizResult> {
  const user = getCurrentUserProfile();
  const uid = user ? user.uid : 'guest';
  const now = new Date().toISOString();

  // 1. Check if user already submitted for today
  const existingRecord = await fetchDailyRecord(dateKey);
  if (existingRecord && existingRecord.completed) {
    const currentProg = await fetchAcademyProgress();
    return {
      isFirstSubmission: false,
      earnedXP: 0,
      progress: currentProg,
      dailyRecord: existingRecord,
    };
  }

  const earnedXP = 20; // 20 XP awarded for completing daily quiz

  if (isFirebaseConfigured && db && user) {
    try {
      const firestoreDb = db;
      let finalProg: AcademyProgress = DEFAULT_PROGRESS;
      let finalDaily: AcademyDailyRecord = {
        dateKey,
        questionId,
        selectedAnswerId,
        isCorrect,
        completed: true,
        earnedXP,
        completedAt: now,
      };

      await runTransaction(firestoreDb, async (transaction) => {
        const dailyDocRef = doc(firestoreDb, 'users', user.uid, 'academyDaily', dateKey);
        const dailySnap = await transaction.get(dailyDocRef);

        if (dailySnap.exists() && dailySnap.data()?.completed) {
          // Already completed in Firestore concurrently
          finalDaily = dailySnap.data() as AcademyDailyRecord;
          const progRef = doc(firestoreDb, 'users', user.uid, 'academy', 'progress');
          const progSnap = await transaction.get(progRef);
          finalProg = progSnap.exists() ? (progSnap.data() as AcademyProgress) : DEFAULT_PROGRESS;
          return;
        }

        const progDocRef = doc(firestoreDb, 'users', user.uid, 'academy', 'progress');
        const progSnap = await transaction.get(progDocRef);
        const currentProg = progSnap.exists()
          ? (progSnap.data() as AcademyProgress)
          : DEFAULT_PROGRESS;

        const newStreak = calculateNewStreak(
          currentProg.lastCompletedDate,
          dateKey,
          currentProg.currentStreak
        );
        const newLongest = Math.max(currentProg.longestStreak, newStreak);
        const newTotalXP = currentProg.totalXP + earnedXP;

        finalProg = {
          totalXP: newTotalXP,
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastCompletedDate: dateKey,
          updatedAt: now,
        };

        transaction.set(dailyDocRef, finalDaily);
        transaction.set(progDocRef, finalProg);
      });

      saveLocalDailyRecord(uid, dateKey, finalDaily);
      saveLocalProgress(uid, finalProg);

      return {
        isFirstSubmission: true,
        earnedXP,
        progress: finalProg,
        dailyRecord: finalDaily,
      };
    } catch (err) {
      console.warn('Firestore transaction failed, falling back to local mode:', err);
    }
  }

  // Local fallback persistence
  const currentProg = getLocalProgress(uid);
  const newStreak = calculateNewStreak(currentProg.lastCompletedDate, dateKey, currentProg.currentStreak);
  const newLongest = Math.max(currentProg.longestStreak, newStreak);
  const newTotalXP = currentProg.totalXP + earnedXP;

  const newProg: AcademyProgress = {
    totalXP: newTotalXP,
    currentStreak: newStreak,
    longestStreak: newLongest,
    lastCompletedDate: dateKey,
    updatedAt: now,
  };

  const newDaily: AcademyDailyRecord = {
    dateKey,
    questionId,
    selectedAnswerId,
    isCorrect,
    completed: true,
    earnedXP,
    completedAt: now,
  };

  saveLocalDailyRecord(uid, dateKey, newDaily);
  saveLocalProgress(uid, newProg);

  return {
    isFirstSubmission: true,
    earnedXP,
    progress: newProg,
    dailyRecord: newDaily,
  };
}
