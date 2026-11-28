import {
  collection,
  doc,
  getDocs,
  runTransaction,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { getCurrentUserProfile } from './authService';
import { canAccessLesson, getLessonById } from '../data/academyRoadmap';

export interface RoadmapLessonCompletion {
  lessonId: string;
  dayNumber: number;
  stageId: 1 | 2 | 3 | 4;
  completed: true;
  completedAt: string;
}

export type RoadmapProgressMap = Record<string, RoadmapLessonCompletion>;

export interface FetchRoadmapProgressResult {
  completedLessons: RoadmapProgressMap;
  source: 'cloud' | 'local' | 'error';
  errorCode: string | null;
  errorMessage: string | null;
}

export interface CompleteRoadmapLessonResult {
  success: boolean;
  savedToCloud: boolean;
  alreadyCompleted: boolean;
  completion: RoadmapLessonCompletion | null;
  errorCode: string | null;
  errorMessage: string | null;
}

const getLocalRoadmapKey = (uid: string) => `moneycare_academy_roadmap_${uid}`;

function sanitizeRoadmapProgressMap(raw: unknown): RoadmapProgressMap {
  if (!raw || typeof raw !== 'object') return {};
  const map: RoadmapProgressMap = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!value || typeof value !== 'object') continue;
    const data = value as Partial<RoadmapLessonCompletion>;
    if (
      data.completed === true &&
      typeof data.lessonId === 'string' &&
      data.lessonId === key &&
      typeof data.dayNumber === 'number' &&
      typeof data.stageId === 'number' &&
      typeof data.completedAt === 'string' &&
      data.completedAt.length > 0
    ) {
      const lesson = getLessonById(data.lessonId);
      if (lesson && lesson.dayNumber === data.dayNumber && lesson.stageId === data.stageId) {
        map[lesson.lessonId] = {
          lessonId: lesson.lessonId,
          dayNumber: lesson.dayNumber,
          stageId: lesson.stageId,
          completed: true,
          completedAt: data.completedAt,
        };
      }
    }
  }
  return map;
}

function readLocalRoadmapProgress(uid: string): RoadmapProgressMap {
  if (typeof localStorage === 'undefined') return {};
  const raw = localStorage.getItem(getLocalRoadmapKey(uid));
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    return sanitizeRoadmapProgressMap(parsed);
  } catch {
    return {};
  }
}

function writeLocalRoadmapProgress(uid: string, map: RoadmapProgressMap): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(getLocalRoadmapKey(uid), JSON.stringify(map));
}

function extractErrorCode(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err && typeof err.code === 'string') {
    return err.code;
  }
  return 'unknown';
}

function mapRoadmapFirestoreError(code: string): string {
  if (code === 'permission-denied') {
    return 'Không có quyền đọc/ghi tiến độ Lộ trình trên Cloud Firestore. Vui lòng kiểm tra phiên đăng nhập hoặc Firestore Rules.';
  }
  if (code === 'unavailable' || code === 'network-request-failed') {
    return 'Không thể kết nối Cloud Firestore. Vui lòng kiểm tra mạng và thử lại.';
  }
  return 'Không thể đồng bộ tiến độ bài học với Cloud Firestore. Vui lòng thử lại sau.';
}

/**
 * Fetch completed Roadmap lessons for the current user.
 * Completely isolated from users/{uid}/academy/progress (XP & Streak).
 * Counts ONLY valid lessonId records belonging to the 90-lesson roadmap.
 * Never fabricates completed lessons or unlocks chapters if Cloud Firestore read fails.
 */
export async function fetchRoadmapProgress(): Promise<FetchRoadmapProgressResult> {
  const user = getCurrentUserProfile();
  const uid = user ? user.uid : 'guest';

  if (isFirebaseConfigured && db && user) {
    try {
      const colRef = collection(db, 'users', user.uid, 'academyRoadmap');
      const snapshot = await getDocs(colRef);
      const map: RoadmapProgressMap = {};

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Partial<RoadmapLessonCompletion>;
        if (
          data &&
          data.completed === true &&
          typeof data.lessonId === 'string' &&
          data.lessonId === docSnap.id &&
          typeof data.dayNumber === 'number' &&
          typeof data.stageId === 'number' &&
          typeof data.completedAt === 'string' &&
          data.completedAt.length > 0
        ) {
          const lesson = getLessonById(data.lessonId);
          if (lesson && lesson.dayNumber === data.dayNumber && lesson.stageId === data.stageId) {
            map[lesson.lessonId] = {
              lessonId: lesson.lessonId,
              dayNumber: lesson.dayNumber,
              stageId: lesson.stageId,
              completed: true,
              completedAt: data.completedAt,
            };
          }
        }
      });

      writeLocalRoadmapProgress(uid, map);
      return {
        completedLessons: map,
        source: 'cloud',
        errorCode: null,
        errorMessage: null,
      };
    } catch (err) {
      const code = extractErrorCode(err);
      return {
        completedLessons: {},
        source: 'error',
        errorCode: code,
        errorMessage: mapRoadmapFirestoreError(code),
      };
    }
  }

  return {
    completedLessons: readLocalRoadmapProgress(uid),
    source: 'local',
    errorCode: null,
    errorMessage: null,
  };
}

/**
 * Persist completion of a Roadmap lesson once per UID.
 * - Keeps Firestore doc ID 'day-1'..'day-90' and exact 5 fields for Block 6 Rules compatibility.
 * - Strictly isolated from Academy XP / Level / Streak (does NOT touch academy/progress).
 * - Uses Firestore Transaction to guarantee idempotent single create (never updates/deletes).
 * - Never fakes completion or claims Cloud save if Firestore write fails.
 */
export async function completeRoadmapLesson(
  lessonId: string,
  completedLessons?: RoadmapProgressMap
): Promise<CompleteRoadmapLessonResult> {
  const user = getCurrentUserProfile();
  const uid = user ? user.uid : 'guest';
  const progressForAccess = completedLessons ?? readLocalRoadmapProgress(uid);

  const lesson = getLessonById(lessonId);
  if (!lesson || !canAccessLesson(lessonId, progressForAccess)) {
    return {
      success: false,
      savedToCloud: false,
      alreadyCompleted: false,
      completion: null,
      errorCode: 'lesson-unavailable',
      errorMessage: 'Bài học này đang phát triển nội dung hoặc chương chưa được mở khóa.',
    };
  }

  const now = new Date().toISOString();

  if (isFirebaseConfigured && db && user) {
    try {
      const firestoreDb = db;
      let alreadyCompleted = false;
      let savedRecord: RoadmapLessonCompletion = {
        lessonId: lesson.lessonId,
        dayNumber: lesson.dayNumber,
        stageId: lesson.stageId,
        completed: true,
        completedAt: now,
      };

      await runTransaction(firestoreDb, async (transaction) => {
        const docRef = doc(firestoreDb, 'users', user.uid, 'academyRoadmap', lesson.lessonId);
        const snap = await transaction.get(docRef);

        if (snap.exists() && snap.data()?.completed === true) {
          alreadyCompleted = true;
          const existing = snap.data() as RoadmapLessonCompletion;
          savedRecord = {
            lessonId: existing.lessonId || lesson.lessonId,
            dayNumber: existing.dayNumber || lesson.dayNumber,
            stageId: (existing.stageId || lesson.stageId) as 1 | 2 | 3 | 4,
            completed: true,
            completedAt: existing.completedAt || now,
          };
          return;
        }

        transaction.set(docRef, savedRecord);
      });

      const localMap = readLocalRoadmapProgress(uid);
      localMap[lesson.lessonId] = savedRecord;
      writeLocalRoadmapProgress(uid, localMap);

      return {
        success: true,
        savedToCloud: true,
        alreadyCompleted,
        completion: savedRecord,
        errorCode: null,
        errorMessage: null,
      };
    } catch (err) {
      const code = extractErrorCode(err);
      return {
        success: false,
        savedToCloud: false,
        alreadyCompleted: false,
        completion: null,
        errorCode: code,
        errorMessage: mapRoadmapFirestoreError(code),
      };
    }
  }

  // Non-Firebase local/test mode (never claims savedToCloud)
  const localMap = readLocalRoadmapProgress(uid);
  if (localMap[lesson.lessonId]?.completed) {
    return {
      success: true,
      savedToCloud: false,
      alreadyCompleted: true,
      completion: localMap[lesson.lessonId],
      errorCode: null,
      errorMessage: null,
    };
  }

  const record: RoadmapLessonCompletion = {
    lessonId: lesson.lessonId,
    dayNumber: lesson.dayNumber,
    stageId: lesson.stageId,
    completed: true,
    completedAt: now,
  };
  localMap[lesson.lessonId] = record;
  writeLocalRoadmapProgress(uid, localMap);

  return {
    success: true,
    savedToCloud: false,
    alreadyCompleted: false,
    completion: record,
    errorCode: null,
    errorMessage: null,
  };
}
