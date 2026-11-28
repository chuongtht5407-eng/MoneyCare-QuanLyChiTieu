import {
  fetchRoadmapProgress,
  completeRoadmapLesson,
} from './academyRoadmapService';
import { fetchAcademyProgress } from './academyService';
import { isStageUnlocked, getStageProgress } from '../data/academyRoadmap';

// Polyfill localStorage for Node mock unit test environment
if (typeof localStorage === 'undefined') {
  const store: Record<string, string> = {};
  (global as unknown as { localStorage: Storage }).localStorage = {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, val: string) => {
      store[key] = val;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((k) => delete store[k]);
    },
    key: (i: number) => Object.keys(store)[i] || null,
    get length() {
      return Object.keys(store).length;
    },
  };
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

async function runAcademyRoadmapServiceTests() {
  console.log('==================================================================');
  console.log('🧪 RUNNING ACADEMY SELF-PACED ROADMAP SERVICE TESTS (LOCAL/MOCK)');
  console.log('==================================================================');

  localStorage.clear();

  // Baseline Academy XP & Streak (must remain completely untouched!)
  const xpBefore = await fetchAcademyProgress();

  // Test 1: Preserve pre-existing Phase 2 progress (day-1..day-3) + ignore invalid/fake keys
  localStorage.setItem(
    'moneycare_academy_roadmap_guest',
    JSON.stringify({
      'day-1': {
        lessonId: 'day-1',
        dayNumber: 1,
        stageId: 1,
        completed: true,
        completedAt: '2026-11-20T08:00:00.000Z',
      },
      'day-2': {
        lessonId: 'day-2',
        dayNumber: 2,
        stageId: 1,
        completed: true,
        completedAt: '2026-11-20T08:10:00.000Z',
      },
      'day-3': {
        lessonId: 'day-3',
        dayNumber: 3,
        stageId: 1,
        completed: true,
        completedAt: '2026-11-20T08:20:00.000Z',
      },
      'fake-lesson-999': {
        lessonId: 'fake-lesson-999',
        dayNumber: 999,
        stageId: 1,
        completed: true,
        completedAt: '2026-11-20T08:25:00.000Z',
      },
    })
  );

  const initFetch = await fetchRoadmapProgress();
  assert(initFetch.source === 'local', 'Expected local source in Node test env');
  assert(
    Object.keys(initFetch.completedLessons).length === 3 &&
      Boolean(initFetch.completedLessons['day-1']) &&
      Boolean(initFetch.completedLessons['day-2']) &&
      Boolean(initFetch.completedLessons['day-3']) &&
      !initFetch.completedLessons['fake-lesson-999'],
    'Pre-existing day-1..day-3 must be preserved and invalid lessonIds must be ignored'
  );
  console.log('✓ Test 1 passed: Existing day-1..day-3 progress preserved & invalid records filtered.');

  // Test 2: Out-of-order & multiple lessons in the same day (complete day-5 before day-4, then day-4 immediately)
  const res5 = await completeRoadmapLesson('day-5');
  assert(res5.success === true && !res5.alreadyCompleted, 'Completing day-5 out of order must succeed');
  assert(res5.savedToCloud === false, 'Local mock mode must NOT claim savedToCloud=true');
  assert(
    res5.completion?.lessonId === 'day-5' &&
      res5.completion.dayNumber === 5 &&
      res5.completion.stageId === 1,
    'day-5 completion payload must keep exact Firestore-compatible fields'
  );
  const day5CompletedAt = res5.completion?.completedAt;

  const res4 = await completeRoadmapLesson('day-4');
  assert(res4.success === true && !res4.alreadyCompleted, 'Completing day-4 immediately after day-5 in same day must succeed');
  console.log('✓ Test 2 passed: Out-of-order & multiple same-day completions work without cooldown.');

  // Test 3: Idempotency — re-completing day-5 does NOT inflate count or overwrite completedAt
  const res5Repeat = await completeRoadmapLesson('day-5');
  assert(res5Repeat.success === true && res5Repeat.alreadyCompleted === true, 'Repeat completion must flag alreadyCompleted=true');
  assert(res5Repeat.completion?.completedAt === day5CompletedAt, 'Repeat completion must preserve original timestamp');
  const after5 = await fetchRoadmapProgress();
  assert(Object.keys(after5.completedLessons).length === 5, 'Total completed count must remain 5 (no inflation)');
  console.log('✓ Test 3 passed: Reviewing/re-completing a lesson is idempotent and never inflates progress.');

  // Test 4: Complete remaining lessons of Chapter 1 up to 14/15 -> Chapter 2 STILL locked; then 15/15 -> Chapter 2 UNLOCKED
  for (let i = 6; i <= 14; i++) {
    const r = await completeRoadmapLesson(`day-${i}`);
    assert(r.success === true, `Expected day-${i} completion to succeed`);
  }
  const at14 = await fetchRoadmapProgress();
  assert(getStageProgress(1, at14.completedLessons).completedCount === 14, 'Expected 14/15 in Chapter 1');
  assert(isStageUnlocked(2, at14.completedLessons) === false, 'Chapter 2 must remain locked at 14/15');

  const res15 = await completeRoadmapLesson('day-15');
  assert(res15.success === true, 'Expected day-15 completion to succeed');
  const at15 = await fetchRoadmapProgress();
  assert(getStageProgress(1, at15.completedLessons).completedCount === 15, 'Expected 15/15 in Chapter 1');
  assert(getStageProgress(1, at15.completedLessons).isCompleted === true, 'Chapter 1 must be marked completed');
  assert(isStageUnlocked(2, at15.completedLessons) === true, 'Chapter 2 must unlock automatically at 15/15');
  console.log('✓ Test 4 passed: 14/15 keeps Chapter 2 locked; 15/15 immediately unlocks Chapter 2 and persists across reload.');

  // Test 5: Reject lessons still in development or invalid even after Chapter 2 unlocks
  const blocked16 = await completeRoadmapLesson('day-16', at15.completedLessons);
  const blocked31 = await completeRoadmapLesson('day-31', at15.completedLessons);
  const blockedInvalid = await completeRoadmapLesson('day-999', at15.completedLessons);
  assert(!blocked16.success && blocked16.errorCode === 'lesson-unavailable', 'day-16 (in development) must be rejected');
  assert(!blocked31.success && blocked31.errorCode === 'lesson-unavailable', 'day-31 (locked Ch.3) must be rejected');
  assert(!blockedInvalid.success && blockedInvalid.errorCode === 'lesson-unavailable', 'Invalid lesson must be rejected');
  console.log('✓ Test 5 passed: In-development, locked, and invalid lessons are strictly rejected.');

  // Test 6: Academy XP, Level, and Streak MUST NOT change after completing 15 roadmap lessons
  const xpAfter = await fetchAcademyProgress();
  assert(
    xpAfter.totalXP === xpBefore.totalXP &&
      xpAfter.currentStreak === xpBefore.currentStreak &&
      xpAfter.longestStreak === xpBefore.longestStreak &&
      xpAfter.lastCompletedDate === xpBefore.lastCompletedDate,
    'Roadmap lesson completion must NEVER mutate Academy XP or Streak!'
  );
  console.log('✓ Test 6 passed: Academy XP, Level, and Streak remained 100% untouched.');

  console.log('==================================================================');
  console.log('🎉 ALL ACADEMY SELF-PACED ROADMAP SERVICE TESTS PASSED!');
  console.log('==================================================================');
}

runAcademyRoadmapServiceTests().catch((err) => {
  console.error('Academy Roadmap Service Test Failed:', err);
  process.exit(1);
});
