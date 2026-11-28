import assert from 'node:assert/strict';
import {
  advanceJobLossStage,
  applyJobLossChoice,
  createInitialJobLossState,
  startJobLossGame,
} from '../data/jobLossGame';
import {
  loadJobLossState,
  resetJobLossState,
  saveJobLossState,
} from './jobLossStorageService';

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
console.log('🧪 RUNNING MẤT VIỆC BẤT NGỜ STORAGE & ISOLATION TESTS');
console.log('==================================================================');

localStorage.setItem('moneycare:game:sticky-rice:uid-1', JSON.stringify({ sentinel: 'xoi-ok' }));
localStorage.setItem('moneycare_academy_progress_uid-1', JSON.stringify({ totalXP: 170 }));

const s0 = startJobLossGame(createInitialJobLossState('2026-11-28T07:00:00Z', 'job-u1'));
const s1 = advanceJobLossStage(applyJobLossChoice(s0, 1, 'A').state).state;
assert.equal(saveJobLossState(s1, 'uid-1').saved, true);

const reloaded = loadJobLossState('uid-1');
assert.ok(reloaded);
assert.equal(reloaded.currentStage, 2);
assert.equal(reloaded.cash, 5_500_000);
console.log('✓ Test 1 passed: Mid-game save & reload verified.');

const stale = saveJobLossState(s0, 'uid-1');
assert.equal(stale.saved, false);
assert.equal(stale.reason, 'stale-overwrite-blocked');
console.log('✓ Test 2 passed: Stale overwrite blocked.');

assert.equal(loadJobLossState('uid-2'), null);
localStorage.setItem('moneycare:game:job-loss:bad', '{not-json');
assert.equal(loadJobLossState('bad'), null);
console.log('✓ Test 3 passed: UID isolation & corrupt JSON resilience verified.');

const fresh = resetJobLossState('uid-1');
assert.equal(fresh.status, 'intro');
assert.equal(JSON.parse(localStorage.getItem('moneycare:game:sticky-rice:uid-1')!).sentinel, 'xoi-ok');
assert.equal(JSON.parse(localStorage.getItem('moneycare_academy_progress_uid-1')!).totalXP, 170);
console.log('✓ Test 4 passed: Reset isolated from Gánh xôi and 170 XP.');

console.log('==================================================================');
console.log('🎉 ALL MẤT VIỆC BẤT NGỜ STORAGE TESTS PASSED!');
console.log('==================================================================');
