import assert from 'node:assert/strict';
import {
  CREDIT_CARD_CONFIG,
  CREDIT_CARD_CYCLES,
  advanceCreditCardCycle,
  calculateMinimumPayment,
  confirmCreditCardCycle,
  createInitialCreditCardState,
  evaluateCreditCardOutcome,
  startCreditCardGame,
  validateCreditCardState,
} from './creditCardGame';

console.log('===============================================================');
console.log('💳 RUNNING THẺ TÍN DỤNG (3 KỲ SAO KÊ) PURE ENGINE TESTS');
console.log('===============================================================');

// Test 1: Config & 3 cycles
assert.equal(CREDIT_CARD_CYCLES.length, 3);
assert.equal(CREDIT_CARD_CONFIG.creditLimit, 10_000_000);
assert.equal(calculateMinimumPayment(0), 0);
assert.equal(calculateMinimumPayment(50_000), 50_000);
assert.equal(calculateMinimumPayment(1_000_000), 100_000);
assert.equal(calculateMinimumPayment(9_000_000), 450_000);
console.log('✓ Test 1 passed: 3 billing cycles, 10M limit & minimum payment rules verified.');

// Test 2: Full payment on time => 0 interest, 0 fee, Good Management
{
  let s = startCreditCardGame(createInitialCreditCardState('2026-11-28T07:00:00Z', 'cc-good'));
  const c1 = confirmCreditCardCycle(s, {
    cycleNumber: 1,
    newPurchases: 2_000_000,
    purchaseSummary: 'Khóa học',
    paymentPlanId: 'full',
  });
  assert.equal(c1.applied, true);
  assert.equal(c1.state.currentBalance, 0);
  assert.equal(c1.state.totalInterest, 0);
  assert.equal(c1.state.totalLateFees, 0);
  assert.equal(c1.state.availableLimit, 10_000_000);
  s = advanceCreditCardCycle(c1.state).state;

  const c2 = confirmCreditCardCycle(s, {
    cycleNumber: 2,
    newPurchases: 1_500_000,
    purchaseSummary: 'Sale cuối năm',
    paymentPlanId: 'full',
  });
  assert.equal(c2.applied, true);
  assert.equal(c2.state.currentBalance, 0);
  s = advanceCreditCardCycle(c2.state).state;

  const c3 = confirmCreditCardCycle(s, {
    cycleNumber: 3,
    newPurchases: 0,
    purchaseSummary: 'Không quẹt',
    paymentPlanId: 'full',
  });
  assert.equal(c3.applied, true);
  s = advanceCreditCardCycle(c3.state).state;

  assert.equal(s.status, 'completed');
  assert.equal(s.outcome, 'good_management');
  assert.equal(evaluateCreditCardOutcome(s).badgeText, 'Quản lý thẻ tốt');
  assert.equal(s.totalSpent, 3_500_000);
  assert.equal(s.totalPaid, 3_500_000);
  assert.equal(s.totalInterest, 0);
  assert.equal(s.totalLateFees, 0);
  console.log('✓ Test 2 passed: Full payment yields 0 đ interest, 0 đ fee, Quản lý thẻ tốt.');
}

// Test 3: Partial payment => exact 2% interest on UNPAID balance ONLY (never on 10M limit!), Needs Improvement
{
  let s = startCreditCardGame(createInitialCreditCardState('2026-11-28T07:00:00Z', 'cc-mid'));
  // Spend 5,500,000 -> exceeds 4.5M monthly payment budget -> 'full' must be rejected!
  const badFull = confirmCreditCardCycle(s, {
    cycleNumber: 1,
    newPurchases: 5_500_000,
    purchaseSummary: 'Điện thoại',
    paymentPlanId: 'full',
  });
  assert.equal(badFull.applied, false);
  assert.equal(badFull.reason, 'invalid-payment-plan');

  // Pay 'major' = 4,500,000 -> unpaid = 1,000,000 -> 2% interest = 20,000 -> closing = 1,020,000
  const c1 = confirmCreditCardCycle(s, {
    cycleNumber: 1,
    newPurchases: 5_500_000,
    purchaseSummary: 'Điện thoại',
    paymentPlanId: 'major',
  });
  assert.equal(c1.applied, true);
  assert.equal(c1.state.history[0].paymentAmount, 4_500_000);
  assert.equal(c1.state.history[0].unpaidAfterPayment, 1_000_000);
  assert.equal(c1.state.history[0].interestCharged, 20_000);
  assert.equal(c1.state.history[0].lateFeeCharged, 0);
  assert.equal(c1.state.currentBalance, 1_020_000);
  assert.equal(c1.state.availableLimit, 8_980_000);

  // Anti-double-deduction / anti-double-interest on Cycle 1
  const dup = confirmCreditCardCycle(c1.state, {
    cycleNumber: 1,
    newPurchases: 5_500_000,
    purchaseSummary: 'Điện thoại',
    paymentPlanId: 'major',
  });
  assert.equal(dup.applied, false);
  assert.equal(dup.reason, 'already-confirmed');
  assert.equal(dup.state.totalInterest, 20_000);

  // Cycle 2: 0 spending, pay full 1,020,000 -> 0 balance, 0 new interest
  s = advanceCreditCardCycle(c1.state).state;
  const c2 = confirmCreditCardCycle(s, {
    cycleNumber: 2,
    newPurchases: 0,
    purchaseSummary: 'Không quẹt',
    paymentPlanId: 'full',
  });
  assert.equal(c2.applied, true);
  assert.equal(c2.state.currentBalance, 0);
  assert.equal(c2.state.totalInterest, 20_000);

  s = advanceCreditCardCycle(c2.state).state;
  const c3 = confirmCreditCardCycle(s, {
    cycleNumber: 3,
    newPurchases: 0,
    purchaseSummary: 'Không quẹt',
    paymentPlanId: 'full',
  });
  s = advanceCreditCardCycle(c3.state).state;
  assert.equal(s.outcome, 'needs_improvement');
  assert.equal(evaluateCreditCardOutcome(s).badgeText, 'Cần cải thiện');
  console.log('✓ Test 3 passed: Exact 2% interest on unpaid balance only, no double interest, Cần cải thiện.');
}

// Test 4: Minimum payment & Missed payment trap -> High Debt Risk + Late Fee
{
  let s = startCreditCardGame(createInitialCreditCardState('2026-11-28T07:00:00Z', 'cc-risk'));
  // Cycle 1: spend 9M, pay minimum (450k) -> unpaid 8,550,000 -> 2% = 171,000 -> closing = 8,721,000
  const c1 = confirmCreditCardCycle(s, {
    cycleNumber: 1,
    newPurchases: 9_000_000,
    purchaseSummary: 'Quẹt quá tay',
    paymentPlanId: 'minimum',
  });
  assert.equal(c1.applied, true);
  assert.equal(c1.state.history[0].interestCharged, 171_000);
  assert.equal(c1.state.history[0].lateFeeCharged, 0);
  assert.equal(c1.state.currentBalance, 8_721_000);
  s = advanceCreditCardCycle(c1.state).state;

  // Trying to spend 1,500,000 in Cycle 2 exceeds 10M limit (8,721,000 + 1,500,000 > 10M) -> BLOCKED!
  const overLimit = confirmCreditCardCycle(s, {
    cycleNumber: 2,
    newPurchases: 1_500_000,
    purchaseSummary: 'Vượt hạn mức',
    paymentPlanId: 'minimum',
  });
  assert.equal(overLimit.applied, false);
  assert.equal(overLimit.reason, 'exceeds-credit-limit');

  // Cycle 2: 0 spend, missed payment -> 2% interest + 200k late fee
  const c2 = confirmCreditCardCycle(s, {
    cycleNumber: 2,
    newPurchases: 0,
    purchaseSummary: 'Không quẹt',
    paymentPlanId: 'missed',
  });
  assert.equal(c2.applied, true);
  assert.equal(c2.state.history[1].lateFeeCharged, 200_000);
  assert.equal(c2.state.history[1].interestCharged, Math.round((8_721_000 * 2) / 100));
  s = advanceCreditCardCycle(c2.state).state;

  const c3 = confirmCreditCardCycle(s, {
    cycleNumber: 3,
    newPurchases: 0,
    purchaseSummary: 'Không quẹt',
    paymentPlanId: 'minimum',
  });
  s = advanceCreditCardCycle(c3.state).state;
  assert.equal(s.outcome, 'high_debt_risk');
  assert.equal(evaluateCreditCardOutcome(s).badgeText, 'Rủi ro nợ cao');
  assert.ok(s.currentBalance > 0); // never negative
  console.log(`✓ Test 4 passed: Limit enforcement, late fee (200k), & Rủi ro nợ cao (balance=${s.currentBalance} đ) verified.`);
}

// Test 5: Schema validation blocks negative balance / corrupted state
{
  assert.equal(validateCreditCardState(null), null);
  const valid = createInitialCreditCardState('2026-11-28T07:00:00Z', 'cc-val');
  assert.ok(validateCreditCardState(valid) !== null);
  assert.equal(validateCreditCardState({ ...valid, currentBalance: -1 }), null);
  assert.equal(validateCreditCardState({ ...valid, version: 2 }), null);
  console.log('✓ Test 5 passed: Schema validator blocks negative balance & corrupt payloads.');
}

console.log('===============================================================');
console.log('🎉 ALL THẺ TÍN DỤNG ENGINE TESTS PASSED!');
console.log('===============================================================');
