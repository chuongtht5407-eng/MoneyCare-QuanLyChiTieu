import {
  BOSS_BATTLE_CONFIG,
  BOSS_BATTLE_DAYS,
  BossBattleGameState,
  BossOptionId,
  HARD_CASE_PROFILES,
  advanceBossBattleDay,
  applyBossBattleChoice,
  createInitialBossBattleState,
  evaluateBossBattleOutcome,
  startBossBattle,
  validateBossBattleState,
} from './bossBattle200k';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

function playFullGame(choices: readonly BossOptionId[]): BossBattleGameState {
  assert(choices.length === 7, 'Must provide exactly 7 choices');
  let state = startBossBattle(createInitialBossBattleState('2026-11-28T09:00:00.000Z'));

  for (let day = 1; day <= 7; day += 1) {
    const choiceRes = applyBossBattleChoice(state, day, choices[day - 1]);
    assert(choiceRes.applied === true, `Expected day ${day} choice to apply`);
    state = choiceRes.state;

    const advRes = advanceBossBattleDay(state);
    assert(advRes.advanced === true, `Expected day ${day} advance to succeed`);
    state = advRes.state;
  }

  return state;
}

function runBossBattleEngineTests() {
  console.log('===============================================================');
  console.log('🎮 RUNNING BOSS BATTLE (7 NGÀY VỚI 200K) PURE ENGINE TESTS');
  console.log('===============================================================');

  // Test 1: 4 required Hard Case profiles (all 4 playable after Phase 4 completion)
  assert(HARD_CASE_PROFILES.length === 4, `Expected 4 hard case profiles, got ${HARD_CASE_PROFILES.length}`);
  const playable = HARD_CASE_PROFILES.filter((p) => p.isPlayable);
  assert(
    playable.length === 4 && playable.some((p) => p.id === 'boss-battle-200k'),
    'All 4 hard case profiles including boss-battle-200k should be playable'
  );
  console.log('✓ Test 1 passed: All 4 hard case profiles verified playable.');

  // Test 2: 7 distinct daily scenarios & Ví Bé iconic student quotes
  assert(BOSS_BATTLE_DAYS.length === 7, `Expected 7 days, got ${BOSS_BATTLE_DAYS.length}`);
  const titles = new Set<string>();
  const allReactions: string[] = [];
  BOSS_BATTLE_DAYS.forEach((d, idx) => {
    assert(d.dayNumber === idx + 1, `Expected dayNumber ${idx + 1}, got ${d.dayNumber}`);
    assert(!titles.has(d.title), `Duplicate day title: ${d.title}`);
    titles.add(d.title);
    assert(d.options.length === 3, `Day ${d.dayNumber} must have 3 options`);
    d.options.forEach((o) => allReactions.push(o.vibeReaction));
  });
  const combinedReactions = allReactions.join(' ');
  assert(
    combinedReactions.includes('Ủa, còn 200k mà buffet 199k hả chủ nhân?') &&
      combinedReactions.includes('Sale 50% không có nghĩa ví tự nhiên giàu hơn đâu!') &&
      combinedReactions.includes('Ví Bé đề nghị họp khẩn về ngân sách!'),
    'Missing required Ví Bé signature quotes'
  );
  console.log('✓ Test 2 passed: 7 unique daily scenarios and Ví Bé quotes verified.');

  // Test 3: Full 7-day Victory Path A (with Day 6 textbook sale +30k)
  const victoryA = playFullGame(['B', 'B', 'B', 'A', 'B', 'A', 'A']);
  assert(victoryA.status === 'completed', 'Game should be completed after 7 days');
  assert(victoryA.budget === 35_000, `Expected 35,000 remaining, got ${victoryA.budget}`);
  assert(victoryA.debt === 0, `Expected 0 debt, got ${victoryA.debt}`);
  assert(victoryA.totalSpent === 195_000, `Expected 195,000 totalSpent, got ${victoryA.totalSpent}`);
  assert(victoryA.totalIncome === 30_000, `Expected 30,000 totalIncome, got ${victoryA.totalIncome}`);
  assert(victoryA.essentialsMissed === 0, 'Expected 0 missed essentials');
  assert(victoryA.outcome === 'victory', `Expected victory, got ${victoryA.outcome}`);
  console.log('✓ Test 3 passed: Victory Path A (+35,000đ, 0 nợ, 7/7 thiết yếu) verified.');

  // Test 4: Full 7-day Victory Path B (pure expense, no side income)
  const victoryB = playFullGame(['B', 'B', 'B', 'A', 'B', 'B', 'A']);
  assert(victoryB.budget === 5_000 && victoryB.debt === 0, 'Expected 5,000đ remaining and 0 debt');
  assert(victoryB.outcome === 'victory', `Expected pure-expense victory, got ${victoryB.outcome}`);
  console.log('✓ Test 4 passed: Pure-expense Victory Path B (+5,000đ, 0 nợ) verified.');

  // Test 5: Survived-Hard Path (minor debt <= 50,000đ)
  const survivedHard = playFullGame(['B', 'B', 'A', 'A', 'B', 'A', 'A']);
  assert(survivedHard.budget === 0 && survivedHard.debt === 25_000, `Expected 0 budget and 25,000 debt, got ${survivedHard.budget}/${survivedHard.debt}`);
  assert(survivedHard.outcome === 'survived_hard', `Expected survived_hard, got ${survivedHard.outcome}`);
  console.log('✓ Test 5 passed: Survived-Hard Path (small debt 25,000đ) verified.');

  // Test 6: Debt Failure Path (reckless spending)
  const debtFail = playFullGame(['A', 'A', 'A', 'B', 'A', 'C', 'B']);
  assert(debtFail.budget === 0 && debtFail.debt > BOSS_BATTLE_CONFIG.maxSurvivedDebt, 'Expected heavy debt > 50,000đ');
  assert(debtFail.outcome === 'failed', `Expected failed for heavy debt, got ${debtFail.outcome}`);
  console.log(`✓ Test 6 passed: Reckless Debt Failure Path (debt ${debtFail.debt}đ -> failed) verified.`);

  // Test 7: Starving / Skipping Essentials MUST FAIL even with high cash & 0 debt!
  const starveFail = playFullGame(['C', 'B', 'C', 'C', 'B', 'B', 'C']);
  assert(
    starveFail.budget === 100_000 && starveFail.debt === 0,
    `Starve path should have exact 100,000đ cash and 0 debt, got ${starveFail.budget}/${starveFail.debt}`
  );
  assert(starveFail.essentialsMissed === 4, `Expected 4 missed essentials, got ${starveFail.essentialsMissed}`);
  assert(starveFail.outcome === 'failed', 'Skipping meals/essentials MUST NEVER be victory — expected failed');
  const starveSummary = evaluateBossBattleOutcome(starveFail);
  assert(starveSummary.type === 'failed', 'Outcome evaluator must mark starving as failed');

  // Single missed essential must also NEVER be victory
  const singleSlip = playFullGame(['B', 'B', 'B', 'A', 'B', 'B', 'C']);
  assert(singleSlip.budget === 15_000 && singleSlip.debt === 0 && singleSlip.essentialsMissed === 1, 'Single slip setup mismatch');
  assert(singleSlip.outcome !== 'victory', 'Skipping even 1 essential must NOT award victory');
  console.log('✓ Test 7 passed: Skipping meals/essentials is strictly rejected from victory.');

  // Test 8: Anti-double-deduction & strict day-order enforcement
  let s = createInitialBossBattleState();
  // Cannot choose while in intro
  const beforeStart = applyBossBattleChoice(s, 1, 'B');
  assert(!beforeStart.applied && beforeStart.reason === 'not-playing', 'Must reject choice before game starts');

  s = startBossBattle(s);
  // Cannot advance before confirming Day 1
  const skipDay1 = advanceBossBattleDay(s);
  assert(!skipDay1.advanced && skipDay1.reason === 'day-not-confirmed', 'Must block advancing unconfirmed day');

  // Cannot submit Day 2 while on Day 1
  const wrongDay = applyBossBattleChoice(s, 2, 'B');
  assert(!wrongDay.applied && wrongDay.reason === 'wrong-day', 'Must block out-of-order day submission');

  // Confirm Day 1 once (-25,000 -> 175,000)
  const firstConfirm = applyBossBattleChoice(s, 1, 'B');
  assert(firstConfirm.applied && firstConfirm.state.budget === 175_000, 'First Day 1 confirm must deduct 25,000 once');

  // Attempt double confirm on Day 1 -> MUST NOT deduct again!
  const secondConfirm = applyBossBattleChoice(firstConfirm.state, 1, 'B');
  assert(
    !secondConfirm.applied &&
      secondConfirm.reason === 'already-confirmed' &&
      secondConfirm.state.budget === 175_000 &&
      secondConfirm.state.history.length === 1,
    'Second confirm on same day must be blocked with zero double deduction'
  );
  console.log('✓ Test 8 passed: Anti-double-deduction and strict day-order transitions verified.');

  // Test 9: State validation rejects tampered/corrupted payloads
  assert(validateBossBattleState(victoryA) !== null, 'Valid completed state must pass validation');
  assert(validateBossBattleState(null) === null, 'Null must fail validation');
  assert(validateBossBattleState({ ...victoryA, budget: -500 }) === null, 'Negative budget must fail validation');
  assert(validateBossBattleState({ ...victoryA, version: 999 }) === null, 'Wrong version must fail validation');
  assert(
    validateBossBattleState({ ...victoryA, status: 'completed', history: victoryA.history.slice(0, 3) }) === null,
    'Completed state with < 7 days must fail validation'
  );
  console.log('✓ Test 9 passed: State schema validator blocks tampered/corrupted payloads.');

  console.log('===============================================================');
  console.log('🎉 ALL BOSS BATTLE PURE ENGINE TESTS PASSED!');
  console.log('===============================================================');
}

runBossBattleEngineTests();
