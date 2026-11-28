import {
  loadBossBattleState,
  saveBossBattleState,
  resetBossBattleState,
  hasInProgressBossBattle,
} from './bossBattleStorageService';
import {
  advanceBossBattleDay,
  applyBossBattleChoice,
  createInitialBossBattleState,
  startBossBattle,
} from '../data/bossBattle200k';
import { fetchAcademyProgress } from './academyService';
import { fetchRoadmapProgress } from './academyRoadmapService';
import { fetchTransactions } from './transactionService';

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

async function runBossBattleStorageTests() {
  console.log('==================================================================');
  console.log('🧪 RUNNING BOSS BATTLE STORAGE & ISOLATION TESTS (DEVICE-LOCAL)');
  console.log('==================================================================');

  localStorage.clear();

  // Capture real MoneyCare data baselines (MUST remain 100% unchanged!)
  const txBefore = await fetchTransactions();
  const xpBefore = await fetchAcademyProgress();
  const roadmapBefore = await fetchRoadmapProgress();

  // Test 1: Save & reload in-progress game on same UID
  let state = startBossBattle(createInitialBossBattleState('2026-11-28T09:00:00.000Z'));
  state = applyBossBattleChoice(state, 1, 'B').state;
  state = advanceBossBattleDay(state).state;
  state = applyBossBattleChoice(state, 2, 'B').state;
  state = advanceBossBattleDay(state).state;

  const saveRes = saveBossBattleState(state, 'uid-student-1');
  assert(saveRes.saved === true, 'Expected valid game state to save');

  const reloaded = loadBossBattleState('uid-student-1');
  assert(reloaded !== null, 'Reloaded state must exist');
  assert(reloaded!.runId === state.runId, 'Reloaded runId must match');
  assert(reloaded!.currentDay === 3 && reloaded!.budget === 145_000, 'Expected Day 3 with 145,000đ after reload');
  assert(hasInProgressBossBattle(reloaded) === true, 'Expected hasInProgressBossBattle=true');
  console.log('✓ Test 1 passed: In-progress game (Day 3/7, 145,000đ) saved and reloaded cleanly.');

  // Test 2: UID isolation
  const otherUserState = loadBossBattleState('uid-student-2');
  assert(otherUserState === null, 'Different UID must NOT see uid-student-1 saved run');
  console.log('✓ Test 2 passed: UID-scoped localStorage isolation verified.');

  // Test 3: Anti-stale-overwrite guard for same runId
  const staleState = { ...state, currentDay: 2, history: state.history.slice(0, 1) };
  const staleRes = saveBossBattleState(staleState, 'uid-student-1');
  assert(
    staleRes.saved === false && staleRes.reason === 'stale-overwrite-blocked',
    'Must block stale overwrite with shorter history on same runId'
  );
  const stillIntact = loadBossBattleState('uid-student-1');
  assert(stillIntact?.history.length === 2, 'Existing progress must remain intact after stale overwrite attempt');
  console.log('✓ Test 3 passed: Anti-stale-overwrite guard prevented accidental regression.');

  // Test 4: Corrupted JSON in localStorage safely returns null
  localStorage.setItem('moneycare_academy_boss_battle_200k_v1_uid-corrupt', '{bad-json');
  assert(loadBossBattleState('uid-corrupt') === null, 'Corrupted JSON must safely return null');
  console.log('✓ Test 4 passed: Corrupted localStorage entry handled safely.');

  // Test 5: Explicit replay creates a brand-new runId starting at Day 1 with 200,000đ
  const fresh = resetBossBattleState('uid-student-1');
  assert(fresh.runId !== state.runId, 'Replay must generate a brand-new runId');
  assert(
    fresh.status === 'intro' && fresh.currentDay === 1 && fresh.budget === 200_000 && fresh.debt === 0 && fresh.history.length === 0,
    'Fresh replay state must reset to Day 1, 200,000đ, 0đ debt'
  );
  const reloadedFresh = loadBossBattleState('uid-student-1');
  assert(reloadedFresh?.runId === fresh.runId, 'Fresh run must be persisted cleanly');
  console.log('✓ Test 5 passed: Explicit replay creates a clean new run.');

  // Test 6: Strict isolation — real Transactions, Academy XP/Streak, and Roadmap MUST NOT change
  const txAfter = await fetchTransactions();
  const xpAfter = await fetchAcademyProgress();
  const roadmapAfter = await fetchRoadmapProgress();

  assert(JSON.stringify(txAfter) === JSON.stringify(txBefore), 'Real MoneyCare transactions must NEVER change!');
  assert(
    xpAfter.totalXP === xpBefore.totalXP &&
      xpAfter.currentStreak === xpBefore.currentStreak &&
      xpAfter.longestStreak === xpBefore.longestStreak &&
      xpAfter.lastCompletedDate === xpBefore.lastCompletedDate,
    'Academy XP, Level, and Streak must NEVER change during Boss Battle!'
  );
  assert(
    JSON.stringify(roadmapAfter.completedLessons) === JSON.stringify(roadmapBefore.completedLessons),
    'Roadmap progress must NEVER change during Boss Battle!'
  );
  console.log('✓ Test 6 passed: Real Transactions, Academy XP/Streak, and Roadmap remained 100% untouched.');

  console.log('==================================================================');
  console.log('🎉 ALL BOSS BATTLE STORAGE & ISOLATION TESTS PASSED!');
  console.log('==================================================================');
}

runBossBattleStorageTests().catch((err) => {
  console.error('Boss Battle Storage Test Failed:', err);
  process.exit(1);
});
