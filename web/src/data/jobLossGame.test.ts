import assert from 'node:assert/strict';
import {
  JOB_LOSS_CONFIG,
  JOB_LOSS_STAGES,
  JobLossOptionId,
  advanceJobLossStage,
  applyJobLossChoice,
  createInitialJobLossState,
  evaluateJobLossOutcome,
  startJobLossGame,
  validateJobLossState,
} from './jobLossGame';

function playAll6Stages(choices: JobLossOptionId[]) {
  assert.equal(choices.length, 6);
  let state = startJobLossGame(createInitialJobLossState('2026-11-28T07:00:00Z', 'job-test'));
  for (let i = 0; i < 6; i++) {
    const r = applyJobLossChoice(state, i + 1, choices[i]);
    assert.equal(r.applied, true, `Stage ${i + 1} failed: ${r.reason}`);
    state = r.state;
    const adv = advanceJobLossStage(state);
    assert.equal(adv.advanced, true);
    state = adv.state;
  }
  return state;
}

console.log('===============================================================');
console.log('💼 RUNNING MẤT VIỆC BẤT NGỜ (30 NGÀY / 6 CHẶNG) ENGINE TESTS');
console.log('===============================================================');

// Test 1: Structure & initial emergency fund
assert.equal(JOB_LOSS_STAGES.length, 6);
assert.equal(JOB_LOSS_CONFIG.initialCash, 6_000_000);
console.log('✓ Test 1 passed: 6 stages (30 days) & 6.000.000 đ emergency fund verified.');

// Test 2: Strong Recovery Path (prepares CV -> unlocks Stage 5 conditional income +2.4M!)
{
  // S1 A (-500k, job 10+25=35) -> S2 A (-3.3M, job 40) -> S3 A (+1.2M, -500k, job 60) ->
  // S4 A (-1.5M, job 65) -> S5 A (job 65 >= 45 -> +2.4M real!, -500k, job 100) -> S6 A (-500k)
  // Net cash: 6.0 - 0.5 - 3.3 + 0.7 - 1.5 + 1.9 - 0.5 = 2.8M
  const finalState = playAll6Stages(['A', 'A', 'A', 'A', 'A', 'A']);
  assert.equal(finalState.status, 'completed');
  assert.equal(finalState.outcome, 'strong_recovery');
  assert.equal(evaluateJobLossOutcome(finalState).badgeText, 'Vượt khó tốt');
  assert.equal(finalState.cash, 2_800_000);
  assert.equal(finalState.totalTempIncome, 3_600_000); // 1.2M + 2.4M
  assert.equal(finalState.debt, 0);
  assert.equal(finalState.unpaidBills, 0);
  assert.equal(finalState.history[4].conditionalTriggered, true);
  console.log(`✓ Test 2 passed: Strong Recovery verified (cash=${finalState.cash} đ, tempIncome=${finalState.totalTempIncome} đ).`);
}

// Test 3: Conditional income does NOT pay when jobSearchProgress < 45!
{
  // S1 B (job 15) -> S2 A (job 20) -> S3 C (job 20) -> S4 A (job 25) -> S5 A (25 < 45 => 0 đ!)
  let s = startJobLossGame(createInitialJobLossState('2026-11-28T07:00:00Z', 'job-cond'));
  for (const [idx, opt] of (['B', 'A', 'C', 'A', 'A'] as JobLossOptionId[]).entries()) {
    const r = applyJobLossChoice(s, idx + 1, opt);
    assert.equal(r.applied, true);
    s = r.state;
    if (idx < 4) s = advanceJobLossStage(s).state;
  }
  const rec5 = s.history[4];
  assert.equal(rec5.conditionalTriggered, false);
  assert.equal(rec5.incomeReceived, 0);
  assert.equal(s.totalTempIncome, 0);
  console.log('✓ Test 3 passed: Conditional income stays 0 đ when readiness threshold is unmet.');
}

// Test 4: Unpaid bills tracking & Stage 6 automatic paydown
{
  // S1 A -> S2 B (+1.2M unpaid bills) -> S3 A (+1.2M) -> S4 A -> S5 B (+1.5M) -> S6 A (pays off 1.2M unpaid bills!)
  const finalState = playAll6Stages(['A', 'B', 'A', 'A', 'B', 'A']);
  assert.equal(finalState.history[1].unpaidBillsAfter, 1_200_000);
  assert.equal(finalState.history[5].billsPaidOff, 1_200_000);
  assert.equal(finalState.unpaidBills, 0);
  console.log('✓ Test 4 passed: Unpaid bills accrued in Stage 2 and paid down cleanly in Stage 6.');
}

// Test 5: Risky Debt (Stage 4 Option B) NEVER counts as victory -> 'need_rebuild'
{
  const finalState = playAll6Stages(['A', 'A', 'A', 'B', 'B', 'A']);
  assert.equal(finalState.usedRiskyDebt, true);
  assert.ok(finalState.debt >= 2_400_000);
  assert.equal(finalState.outcome, 'need_rebuild');
  assert.equal(evaluateJobLossOutcome(finalState).badgeText, 'Cần xây dựng lại kế hoạch');
  console.log('✓ Test 5 passed: Risky debt strictly results in need_rebuild.');
}

// Test 6: Skipping meals/health (C on S1 & S4) NEVER counts as victory -> 'need_rebuild'
{
  const finalState = playAll6Stages(['C', 'A', 'A', 'C', 'B', 'A']);
  assert.equal(finalState.essentialsMissed, 2);
  assert.equal(finalState.outcome, 'need_rebuild');
  console.log('✓ Test 6 passed: Neglecting essentials strictly rejected from victory.');
}

// Test 7: Middle outcome ('survived_strengthen')
{
  // S1 B (-1.4M) -> S2 A (-3.3M) -> S3 A (+1.2M, -500k) -> S4 A (-1.5M) -> S5 B (+1.5M, -500k) -> S6 C (-1.7M)
  // Final cash low / small debt <= 1M, no risky debt, no missed essentials -> survived_strengthen
  const finalState = playAll6Stages(['B', 'A', 'A', 'A', 'B', 'C']);
  assert.equal(finalState.outcome, 'survived_strengthen');
  assert.equal(evaluateJobLossOutcome(finalState).badgeText, 'Vượt qua nhưng cần củng cố tài chính');
  console.log(`✓ Test 7 passed: Survived-strengthen outcome verified (cash=${finalState.cash} đ, debt=${finalState.debt} đ).`);
}

// Test 8: Anti-double-deduction & strict stage ordering & schema validation
{
  const s0 = startJobLossGame(createInitialJobLossState('2026-11-28T07:00:00Z', 'job-dup'));
  const r1 = applyJobLossChoice(s0, 1, 'A');
  assert.equal(r1.applied, true);
  const dup = applyJobLossChoice(r1.state, 1, 'A');
  assert.equal(dup.applied, false);
  assert.equal(dup.reason, 'already-confirmed');
  assert.equal(dup.state.cash, 5_500_000);

  assert.equal(validateJobLossState(null), null);
  assert.ok(validateJobLossState(r1.state) !== null);
  assert.equal(validateJobLossState({ ...r1.state, cash: -1 }), null);
  console.log('✓ Test 8 passed: Anti-double-deduction and schema validator verified.');
}

console.log('===============================================================');
console.log('🎉 ALL MẤT VIỆC BẤT NGỜ ENGINE TESTS PASSED!');
console.log('===============================================================');
