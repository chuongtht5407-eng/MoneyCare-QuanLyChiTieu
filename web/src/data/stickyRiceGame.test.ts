import assert from 'node:assert/strict';
import {
  STICKY_RICE_CONFIG,
  STICKY_RICE_DAYS,
  StickyRiceConfirmInput,
  advanceStickyRiceDay,
  confirmStickyRiceDay,
  createInitialStickyRiceState,
  evaluateStickyRiceOutcome,
  startStickyRiceGame,
  validateStickyRiceState,
} from './stickyRiceGame';

function runFull7Days(plan: Omit<StickyRiceConfirmInput, 'dayNumber'>[]) {
  assert.equal(plan.length, 7);
  let state = startStickyRiceGame(createInitialStickyRiceState('2026-11-28T07:00:00Z', 'run-test'));
  for (let i = 0; i < 7; i++) {
    const res = confirmStickyRiceDay(state, { ...plan[i], dayNumber: i + 1 });
    assert.equal(res.applied, true, `Day ${i + 1} failed: ${res.reason}`);
    state = res.state;
    const adv = advanceStickyRiceDay(state);
    assert.equal(adv.advanced, true);
    state = adv.state;
  }
  return state;
}

console.log('===============================================================');
console.log('🍚 RUNNING GÁNH XÔI KHỞI NGHIỆP (7 NGÀY) PURE ENGINE TESTS');
console.log('===============================================================');

// Test 1: Exact 7 distinct days & integer money rules
assert.equal(STICKY_RICE_DAYS.length, 7);
assert.equal(new Set(STICKY_RICE_DAYS.map((d) => d.title)).size, 7);
assert.equal(STICKY_RICE_CONFIG.initialCapital, 1_000_000);
console.log('✓ Test 1 passed: 7 distinct business events & 1.000.000 đ initial capital verified.');

// Test 2: Exact Day 1 Revenue, Cost, Profit, Cashflow, Spoilage, Sold <= Prepared
{
  let s = startStickyRiceGame(createInitialStickyRiceState('2026-11-28T07:00:00Z', 'run-d1'));
  // Day 1: 50 portions at 20,000đ, Tactic A (+20k cost, +8 demand => base 42 + 8 = 50 demand)
  const r = confirmStickyRiceDay(s, {
    dayNumber: 1,
    basePortions: 50,
    unitPrice: 20_000,
    tacticId: 'A',
  });
  assert.equal(r.applied, true);
  const rec = r.state.history[0];
  assert.equal(rec.preparedPortions, 50);
  assert.equal(rec.soldPortions, 50);
  assert.equal(rec.unsoldPortions, 0);
  assert.equal(rec.variableCost, 500_000);
  assert.equal(rec.fixedCost, 50_000);
  assert.equal(rec.eventCost, 20_000);
  assert.equal(rec.totalCost, 570_000);
  assert.equal(rec.revenue, 1_000_000);
  assert.equal(rec.profit, 430_000);
  assert.equal(rec.endingCash, 1_430_000);
  assert.equal(r.state.cash, 1_430_000);

  // Anti-double-deduction on same day
  const dup = confirmStickyRiceDay(r.state, {
    dayNumber: 1,
    basePortions: 50,
    unitPrice: 20_000,
    tacticId: 'A',
  });
  assert.equal(dup.applied, false);
  assert.equal(dup.reason, 'already-confirmed');
  assert.equal(dup.state.cash, 1_430_000);
  console.log('✓ Test 2 passed: Exact revenue/cost/profit/cashflow & anti-double-deduction verified.');
}

// Test 3: Sold portions NEVER exceed prepared portions & unsold inventory never double-deducted
{
  let s = startStickyRiceGame(createInitialStickyRiceState('2026-11-28T07:00:00Z', 'run-cap'));
  // Prepare only 20 at 15,000đ (demand 55) -> must sell ONLY 20!
  const r1 = confirmStickyRiceDay(s, {
    dayNumber: 1,
    basePortions: 20,
    unitPrice: 15_000,
    tacticId: 'B',
  });
  assert.equal(r1.applied, true);
  assert.equal(r1.state.history[0].soldPortions, 20);
  assert.equal(r1.state.history[0].unsoldPortions, 0);
  assert.equal(r1.state.history[0].revenue, 300_000);
  assert.equal(r1.state.history[0].totalCost, 250_000); // 20*10k + 50k
  assert.equal(r1.state.history[0].profit, 50_000);

  // Over-prepare 60 at 25,000đ (demand 28) -> 32 unsold; cash identity: starting + revenue - totalCost
  const s2 = startStickyRiceGame(createInitialStickyRiceState('2026-11-28T07:00:00Z', 'run-unsold'));
  const r2 = confirmStickyRiceDay(s2, {
    dayNumber: 1,
    basePortions: 60,
    unitPrice: 25_000,
    tacticId: 'B',
  });
  assert.equal(r2.applied, true);
  const rec2 = r2.state.history[0];
  assert.equal(rec2.soldPortions, 28);
  assert.equal(rec2.unsoldPortions, 32);
  assert.equal(rec2.totalCost, 650_000); // 60*10k + 50k (spoilage already inside 60*10k!)
  assert.equal(rec2.spoilageValue, 320_000);
  assert.equal(rec2.revenue, 700_000);
  assert.equal(rec2.profit, 50_000);
  assert.equal(rec2.endingCash, 1_000_000 + 700_000 - 650_000);
  console.log('✓ Test 3 passed: Sold <= Prepared & zero double-deduction on unsold stock verified.');
}

// Test 4: Cannot buy ingredients exceeding available cash
{
  const s = startStickyRiceGame({
    ...createInitialStickyRiceState('2026-11-28T07:00:00Z', 'run-low'),
    cash: 200_000,
  });
  const fail = confirmStickyRiceDay(s, {
    dayNumber: 1,
    basePortions: 30, // needs 300k + 50k = 350k > 200k
    unitPrice: 20_000,
    tacticId: 'B',
  });
  assert.equal(fail.applied, false);
  assert.equal(fail.reason, 'insufficient-cash');
  console.log('✓ Test 4 passed: Insufficient cash strictly blocks over-purchasing.');
}

// Test 5: Profitable 7-day Outcome ('profit')
{
  const finalState = runFull7Days([
    { basePortions: 45, unitPrice: 20_000, tacticId: 'A' },
    { basePortions: 35, unitPrice: 20_000, tacticId: 'A' },
    { basePortions: 35, unitPrice: 20_000, tacticId: 'A' },
    { basePortions: 40, unitPrice: 20_000, tacticId: 'A' },
    { basePortions: 50, unitPrice: 20_000, tacticId: 'B' }, // +10 extra portions = 60 prepared
    { basePortions: 45, unitPrice: 20_000, tacticId: 'A' },
    { basePortions: 50, unitPrice: 20_000, tacticId: 'A' },
  ]);
  assert.equal(finalState.status, 'completed');
  assert.equal(finalState.outcome, 'profit');
  assert.equal(evaluateStickyRiceOutcome(finalState).badgeText, 'Kinh doanh có lãi');
  assert.equal(finalState.cash, STICKY_RICE_CONFIG.initialCapital + finalState.totalProfit);
  assert.equal(finalState.totalProfit, finalState.totalRevenue - finalState.totalCost);
  assert.ok(finalState.totalProfit >= STICKY_RICE_CONFIG.profitThreshold);
  console.log(`✓ Test 5 passed: Profitable 7-day run verified (profit=${finalState.totalProfit} đ, cash=${finalState.cash} đ).`);
}

// Test 6: Breakeven / Low-Profit 7-day Outcome ('breakeven_low_profit')
{
  // Prepare 15 portions/day at 15,000đ (margin 5k/portion -> 75k - 50k fixed = +25k/day)
  // Day 4 unitVar = 12k -> margin 3k -> 45k - 50k = -5k => total ~+145k (>= 0 and < 300k)
  const finalState = runFull7Days([
    { basePortions: 15, unitPrice: 15_000, tacticId: 'B' },
    { basePortions: 15, unitPrice: 15_000, tacticId: 'B' },
    { basePortions: 15, unitPrice: 15_000, tacticId: 'B' },
    { basePortions: 15, unitPrice: 15_000, tacticId: 'A' },
    { basePortions: 15, unitPrice: 15_000, tacticId: 'A' },
    { basePortions: 15, unitPrice: 15_000, tacticId: 'B' },
    { basePortions: 15, unitPrice: 15_000, tacticId: 'B' },
  ]);
  assert.equal(finalState.outcome, 'breakeven_low_profit');
  assert.equal(evaluateStickyRiceOutcome(finalState).badgeText, 'Hòa vốn hoặc lãi thấp');
  assert.ok(finalState.totalProfit >= 0 && finalState.totalProfit < STICKY_RICE_CONFIG.profitThreshold);
  console.log(`✓ Test 6 passed: Breakeven/low-profit run verified (profit=${finalState.totalProfit} đ).`);
}

// Test 7: Loss 7-day Outcome ('loss') via heavy over-preparation on slow days + failing to cover fixed costs
{
  const finalState = runFull7Days([
    { basePortions: 60, unitPrice: 25_000, tacticId: 'B' }, // +50k -> 1,050k
    { basePortions: 60, unitPrice: 25_000, tacticId: 'B' }, // rival -14 -> demand 14 -> -300k -> 750k
    { basePortions: 50, unitPrice: 25_000, tacticId: 'B' }, // rain -18 -> demand 10 -> -300k -> 450k
    { basePortions: 5, unitPrice: 15_000, tacticId: 'A' },  // under-scaled: 75k - 110k = -35k
    { basePortions: 5, unitPrice: 15_000, tacticId: 'A' },  // 75k - 100k = -25k
    { basePortions: 5, unitPrice: 15_000, tacticId: 'B' },  // 75k - 100k = -25k
    { basePortions: 5, unitPrice: 15_000, tacticId: 'B' },  // 75k - 100k = -25k
  ]);
  assert.equal(finalState.outcome, 'loss');
  assert.equal(evaluateStickyRiceOutcome(finalState).badgeText, 'Kinh doanh thua lỗ');
  assert.ok(finalState.totalProfit < 0);
  assert.equal(finalState.cash, STICKY_RICE_CONFIG.initialCapital + finalState.totalProfit);
  console.log(`✓ Test 7 passed: Loss run verified (profit=${finalState.totalProfit} đ, cash=${finalState.cash} đ).`);
}

// Test 8: Schema validator blocks invalid/corrupted payloads
{
  assert.equal(validateStickyRiceState(null), null);
  assert.equal(validateStickyRiceState({ version: 99 }), null);
  const valid = createInitialStickyRiceState('2026-11-28T07:00:00Z', 'run-val');
  assert.ok(validateStickyRiceState(valid) !== null);
  assert.equal(validateStickyRiceState({ ...valid, cash: -100 }), null);
  assert.equal(validateStickyRiceState({ ...valid, cash: 100.5 }), null);
  console.log('✓ Test 8 passed: Schema validator blocks corrupted/float/negative state.');
}

console.log('===============================================================');
console.log('🎉 ALL GÁNH XÔI KHỞI NGHIỆP ENGINE TESTS PASSED!');
console.log('===============================================================');
