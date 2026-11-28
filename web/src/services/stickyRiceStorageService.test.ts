import assert from 'node:assert/strict';
import {
  advanceStickyRiceDay,
  confirmStickyRiceDay,
  createInitialStickyRiceState,
  startStickyRiceGame,
} from '../data/stickyRiceGame';
import {
  loadStickyRiceState,
  resetStickyRiceState,
  saveStickyRiceState,
} from './stickyRiceStorageService';

// Minimal in-memory localStorage mock
const store = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => store.set(k, String(v)),
    removeItem: (k: string) => store.delete(k),
    clear: () => store.clear(),
  },
  configurable: true,
});

console.log('==================================================================');
console.log('🧪 RUNNING GÁNH XÔI STORAGE & ISOLATION TESTS');
console.log('==================================================================');

// Seed other game + real Academy progress to verify zero cross-contamination
localStorage.setItem('moneycare_academy_boss_battle_200k_v1_user-a', JSON.stringify({ sentinel: 'boss-intact' }));
localStorage.setItem('moneycare_academy_progress_user-a', JSON.stringify({ totalXP: 170 }));

// Test 1: Save & reload Day 2
let s = startStickyRiceGame(createInitialStickyRiceState('2026-11-28T07:00:00Z', 'run-a'));
const d1 = confirmStickyRiceDay(s, { dayNumber: 1, basePortions: 40, unitPrice: 20_000, tacticId: 'A' });
assert.equal(d1.applied, true);
const adv = advanceStickyRiceDay(d1.state);
assert.equal(adv.advanced, true);
assert.equal(saveStickyRiceState(adv.state, 'user-a').saved, true);

const reloaded = loadStickyRiceState('user-a');
assert.ok(reloaded);
assert.equal(reloaded.currentDay, 2);
assert.equal(reloaded.history.length, 1);
console.log('✓ Test 1 passed: Save and reload mid-game state verified.');

// Test 2: Anti-stale-overwrite guard
const stale = saveStickyRiceState(s, 'user-a');
assert.equal(stale.saved, false);
assert.equal(stale.reason, 'stale-overwrite-blocked');
console.log('✓ Test 2 passed: Stale overwrite blocked cleanly.');

// Test 3: UID isolation
assert.equal(loadStickyRiceState('user-b'), null);
const sB = startStickyRiceGame(createInitialStickyRiceState('2026-11-28T07:00:00Z', 'run-b'));
assert.equal(saveStickyRiceState(sB, 'user-b').saved, true);
assert.equal(loadStickyRiceState('user-a')?.runId, 'run-a');
assert.equal(loadStickyRiceState('user-b')?.runId, 'run-b');
console.log('✓ Test 3 passed: UID isolation verified.');

// Test 4: Corrupted JSON handled safely
localStorage.setItem('moneycare:game:sticky-rice:corrupt-uid', '{bad-json');
assert.equal(loadStickyRiceState('corrupt-uid'), null);
console.log('✓ Test 4 passed: Corrupted JSON safely ignored.');

// Test 5: Reset affects ONLY sticky-rice for that UID (never Boss Battle or XP)
const fresh = resetStickyRiceState('user-a');
assert.equal(fresh.status, 'intro');
assert.equal(loadStickyRiceState('user-a')?.status, 'intro');
assert.equal(loadStickyRiceState('user-b')?.runId, 'run-b');
assert.equal(JSON.parse(localStorage.getItem('moneycare_academy_boss_battle_200k_v1_user-a')!).sentinel, 'boss-intact');
assert.equal(JSON.parse(localStorage.getItem('moneycare_academy_progress_user-a')!).totalXP, 170);
console.log('✓ Test 5 passed: Reset isolated from other users, Boss Battle, and 170 XP.');

console.log('==================================================================');
console.log('🎉 ALL GÁNH XÔI STORAGE TESTS PASSED!');
console.log('==================================================================');
