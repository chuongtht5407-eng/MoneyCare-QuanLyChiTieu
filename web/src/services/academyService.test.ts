import {
  calculateLevelInfo,
  calculateNewStreak,
  getVietnamDateKey,
  getYesterdayDateKey,
  submitDailyQuiz,
  fetchAcademyProgress,
} from './academyService';

// Polyfill localStorage for Node test environment
if (typeof localStorage === 'undefined') {
  const store: Record<string, string> = {};
  (global as unknown as { localStorage: Storage }).localStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, val: string) => { store[key] = val; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    key: (i: number) => Object.keys(store)[i] || null,
    length: 0,
  };
}

function runAcademyServiceTests() {
  console.log('====================================================');
  console.log('🤖 RUNNING ACADEMY SERVICE & LEVEL/STREAK TESTS');
  console.log('====================================================');

  // Test 1: Level Formula Calculation
  const l1 = calculateLevelInfo(0);
  if (l1.level !== 1 || l1.progressPercent !== 0) {
    throw new Error(`Test 1 Failed: Expected L1 0%, got L${l1.level} ${l1.progressPercent}%`);
  }

  const l2 = calculateLevelInfo(150);
  if (l2.level !== 2 || l2.progressPercent !== 50) {
    throw new Error(`Test 1 Failed: Expected L2 50%, got L${l2.level} ${l2.progressPercent}%`);
  }

  const l3 = calculateLevelInfo(320);
  if (l3.level !== 4 || l3.progressPercent !== 20) {
    throw new Error(`Test 1 Failed: Expected L4 20%, got L${l3.level} ${l3.progressPercent}%`);
  }
  console.log('✓ Test 1 passed: Level and progress percentage formulas are accurate.');

  // Test 2: Vietnam Date Key Generation & Yesterday Key
  const todayKey = '2026-11-15';
  const yesterdayKey = getYesterdayDateKey(todayKey);
  if (yesterdayKey !== '2026-11-14') {
    throw new Error(`Test 2 Failed: Expected "2026-11-14", got "${yesterdayKey}"`);
  }
  console.log('✓ Test 2 passed: Date keys generated correctly:', todayKey, '-> Yesterday:', yesterdayKey);

  // Test 3: Streak Calculation Logic
  // 3a. First day
  const s1 = calculateNewStreak(null, todayKey, 0);
  if (s1 !== 1) throw new Error(`Test 3a Failed: Expected streak 1, got ${s1}`);

  // 3b. Consecutive next day
  const s2 = calculateNewStreak('2026-11-14', todayKey, 1);
  if (s2 !== 2) throw new Error(`Test 3b Failed: Expected streak 2, got ${s2}`);

  // 3c. Same day repeat
  const s3 = calculateNewStreak(todayKey, todayKey, 2);
  if (s3 !== 2) throw new Error(`Test 3c Failed: Expected streak 2, got ${s3}`);

  // 3d. Missed day reset
  const s4 = calculateNewStreak('2026-11-10', todayKey, 5);
  if (s4 !== 1) throw new Error(`Test 3d Failed: Expected streak 1 after missed days, got ${s4}`);

  console.log('✓ Test 3 passed: Streak calculations for all edge cases verified.');

  // Test 4: Submit Quiz & Anti-Double-XP Claim Logic
  const testDateKey = '2026-11-20';
  submitDailyQuiz(testDateKey, 'q-1', 'A', true)
    .then((res1) => {
      if (!res1.isFirstSubmission || res1.earnedXP !== 20 || res1.progress.totalXP < 20) {
        throw new Error(`Test 4a Failed: First submission expected +20 XP, got ${res1.earnedXP}`);
      }
      console.log('✓ Test 4a passed: First submission awarded +20 XP correctly.');

      // Second submission on same date key (Attempt double XP claim)
      return submitDailyQuiz(testDateKey, 'q-1', 'B', false).then((res2) => {
        if (res2.isFirstSubmission || res2.earnedXP !== 0) {
          throw new Error('Test 4b Failed: Second submission on same day improperly awarded XP!');
        }
        console.log('✓ Test 4b passed: Anti-double XP claim protected successfully.');
        console.log('====================================================');
        console.log('🎉 ALL ACADEMY SERVICE TESTS PASSED!');
        console.log('====================================================');
      });
    })
    .catch((err) => {
      console.error('Academy Service Test Failed:', err);
      process.exit(1);
    });
}

runAcademyServiceTests();
