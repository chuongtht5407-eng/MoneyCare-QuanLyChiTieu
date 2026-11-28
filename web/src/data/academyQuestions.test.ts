import { ACADEMY_QUESTIONS, getDailyQuestion } from './academyQuestions';

function runAcademyQuestionsTests() {
  console.log('====================================================');
  console.log('🤖 RUNNING ACADEMY QUESTIONS BANK TESTS');
  console.log('====================================================');

  // Test 1: Verify question bank size
  if (ACADEMY_QUESTIONS.length !== 20) {
    throw new Error(`Test 1 Failed: Expected 20 questions, got ${ACADEMY_QUESTIONS.length}`);
  }
  console.log('✓ Test 1 passed: Question bank contains exactly 20 questions.');

  // Test 2: Verify question structure
  ACADEMY_QUESTIONS.forEach((q, idx) => {
    if (!q.id || !q.question || !q.explanation || !q.financialTip) {
      throw new Error(`Test 2 Failed: Question at index ${idx} missing required fields.`);
    }
    if (q.options.length !== 3) {
      throw new Error(`Test 2 Failed: Question ${q.id} does not have 3 options.`);
    }
    if (!['A', 'B', 'C'].includes(q.correctAnswerId)) {
      throw new Error(`Test 2 Failed: Question ${q.id} has invalid correctAnswerId ${q.correctAnswerId}.`);
    }
  });
  console.log('✓ Test 2 passed: All 20 questions have valid 3-option A/B/C structure.');

  // Test 3: Verify daily question determinism
  const d1 = new Date('2026-11-15T10:00:00');
  const d2 = new Date('2026-11-15T18:00:00');
  const q1 = getDailyQuestion(d1);
  const q2 = getDailyQuestion(d2);

  if (q1.id !== q2.id) {
    throw new Error(`Test 3 Failed: Daily question changed within same day (${q1.id} vs ${q2.id}).`);
  }
  console.log('✓ Test 3 passed: Daily question is deterministic on same date:', q1.id);

  // Test 4: Verify question changes on next day
  const d3 = new Date('2026-11-16T10:00:00');
  const q3 = getDailyQuestion(d3);

  if (q1.id === q3.id) {
    throw new Error('Test 4 Failed: Daily question did not change on consecutive days.');
  }
  console.log('✓ Test 4 passed: Daily question successfully changes on next day:', q3.id);

  console.log('====================================================');
  console.log('🎉 ALL ACADEMY QUESTIONS BANK TESTS PASSED!');
  console.log('====================================================');
}

runAcademyQuestionsTests();
