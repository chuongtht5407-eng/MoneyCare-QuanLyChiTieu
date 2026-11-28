import assert from 'node:assert/strict';
import {
  advanceCreditCardCycle,
  confirmCreditCardCycle,
  createInitialCreditCardState,
  startCreditCardGame,
} from '../data/creditCardGame';
import {
  loadCreditCardState,
  resetCreditCardState,
  saveCreditCardState,
} from './creditCardStorageService';

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
console.log('🧪 RUNNING THẺ TÍN DỤNG STORAGE & ISOLATION TESTS');
console.log('==================================================================');

localStorage.setItem('moneycare:game:job-loss:uid-cc', JSON.stringify({ sentinel: 'job-ok' }));
localStorage.setItem('moneycare_academy_progress_uid-cc', JSON.stringify({ totalXP: 170 }));

const s0 = startCreditCardGame(createInitialCreditCardState('2026-11-28T07:00:00Z', 'cc-u1'));
const c1 = confirmCreditCardCycle(s0, {
  cycleNumber: 1,
  newPurchases: 2_000_000,
  purchaseSummary: 'Khóa học',
  paymentPlanId: 'full',
});
const s1 = advanceCreditCardCycle(c1.state).state;
assert.equal(saveCreditCardState(s1, 'uid-cc').saved, true);

const reloaded = loadCreditCardState('uid-cc');
assert.ok(reloaded);
assert.equal(reloaded.currentCycle, 2);
assert.equal(reloaded.totalPaid, 2_000_000);
console.log('✓ Test 1 passed: Mid-game Cycle 2 save & reload verified.');

const stale = saveCreditCardState(s0, 'uid-cc');
assert.equal(stale.saved, false);
assert.equal(stale.reason, 'stale-overwrite-blocked');
console.log('✓ Test 2 passed: Stale overwrite blocked.');

assert.equal(loadCreditCardState('uid-other'), null);
localStorage.setItem('moneycare:game:credit-card:corrupt', '{bad');
assert.equal(loadCreditCardState('corrupt'), null);
console.log('✓ Test 3 passed: UID isolation & corrupt JSON resilience verified.');

const fresh = resetCreditCardState('uid-cc');
assert.equal(fresh.status, 'intro');
assert.equal(JSON.parse(localStorage.getItem('moneycare:game:job-loss:uid-cc')!).sentinel, 'job-ok');
assert.equal(JSON.parse(localStorage.getItem('moneycare_academy_progress_uid-cc')!).totalXP, 170);
console.log('✓ Test 4 passed: Reset isolated from Job Loss and 170 XP.');

console.log('==================================================================');
console.log('🎉 ALL THẺ TÍN DỤNG STORAGE TESTS PASSED!');
console.log('==================================================================');
