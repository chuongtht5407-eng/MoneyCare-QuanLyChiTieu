import {
  ROADMAP_STAGES,
  ROADMAP_DAYS,
  getDaysByStage,
  getLessonById,
  hasStageAvailableContent,
  isStageUnlocked,
  canAccessLesson,
  getStageProgress,
} from './academyRoadmap';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

function buildCompletedMap(start: number, end: number): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  for (let i = start; i <= end; i++) {
    map[`day-${i}`] = true;
  }
  return map;
}

function runAcademyRoadmapTests() {
  console.log('===============================================================');
  console.log('🎓 RUNNING ACADEMY SELF-PACED 90-LESSON ROADMAP DATA TESTS');
  console.log('===============================================================');

  // Test 1: Exactly 4 chapters with exact labels, ranges & titles
  assert(ROADMAP_STAGES.length === 4, `Expected 4 chapters, got ${ROADMAP_STAGES.length}`);
  assert(
    ROADMAP_STAGES[0].label === 'Chương 1' &&
      ROADMAP_STAGES[0].dayStart === 1 &&
      ROADMAP_STAGES[0].dayEnd === 15 &&
      ROADMAP_STAGES[0].title === 'Tiền đi đâu hết rồi?',
    'Chapter 1 metadata mismatch'
  );
  assert(
    ROADMAP_STAGES[1].label === 'Chương 2' &&
      ROADMAP_STAGES[1].dayStart === 16 &&
      ROADMAP_STAGES[1].dayEnd === 30 &&
      ROADMAP_STAGES[1].title === 'Shopee gọi, lý trí có nghe?',
    'Chapter 2 metadata mismatch'
  );
  assert(
    ROADMAP_STAGES[2].label === 'Chương 3' &&
      ROADMAP_STAGES[2].dayStart === 31 &&
      ROADMAP_STAGES[2].dayEnd === 60 &&
      ROADMAP_STAGES[2].title === 'Cuối tháng không ăn mì gói',
    'Chapter 3 metadata mismatch'
  );
  assert(
    ROADMAP_STAGES[3].label === 'Chương 4' &&
      ROADMAP_STAGES[3].dayStart === 61 &&
      ROADMAP_STAGES[3].dayEnd === 90 &&
      ROADMAP_STAGES[3].title === 'Ví chưa giàu nhưng đã trưởng thành',
    'Chapter 4 metadata mismatch'
  );
  console.log('✓ Test 1 passed: 4 chapters with exact labels, titles, and lesson ranges verified.');

  // Test 2: Exact 90 lessons, contiguous 1..90, Firestore-compatible lessonId ('day-1'..'day-90')
  assert(ROADMAP_DAYS.length === 90, `Expected 90 lessons, got ${ROADMAP_DAYS.length}`);
  const seenNumbers = new Set<number>();
  const seenIds = new Set<string>();
  ROADMAP_DAYS.forEach((lesson, idx) => {
    const expectedNum = idx + 1;
    assert(lesson.dayNumber === expectedNum, `Expected lesson ${expectedNum}, got ${lesson.dayNumber}`);
    assert(lesson.lessonId === `day-${expectedNum}`, `Expected lessonId day-${expectedNum}, got ${lesson.lessonId}`);
    assert(!seenNumbers.has(lesson.dayNumber), `Duplicate dayNumber: ${lesson.dayNumber}`);
    assert(!seenIds.has(lesson.lessonId), `Duplicate lessonId: ${lesson.lessonId}`);
    seenNumbers.add(lesson.dayNumber);
    seenIds.add(lesson.lessonId);
  });
  assert(
    getDaysByStage(1).length === 15 &&
      getDaysByStage(2).length === 15 &&
      getDaysByStage(3).length === 30 &&
      getDaysByStage(4).length === 30,
    'Chapter lesson counts must be 15, 15, 30, 30'
  );
  console.log('✓ Test 2 passed: Exact 90 contiguous lessons (15 + 15 + 30 + 30) verified.');

  // Test 3: ALL 15 lessons of Chapter 1 have complete, distinct interactive content; Chapters 2-4 have 75 unavailable lessons
  const chapter1Lessons = getDaysByStage(1);
  const availableLessons = ROADMAP_DAYS.filter((d) => d.isAvailable);
  const unavailableLessons = ROADMAP_DAYS.filter((d) => !d.isAvailable);
  assert(availableLessons.length === 15, `Expected 15 available lessons in Chapter 1, got ${availableLessons.length}`);
  assert(unavailableLessons.length === 75, `Expected 75 unavailable lessons in Chapters 2-4, got ${unavailableLessons.length}`);
  assert(hasStageAvailableContent(1) === true, 'Chapter 1 must have available content');
  assert(hasStageAvailableContent(2) === false, 'Chapter 2 content is still in development');
  assert(hasStageAvailableContent(3) === false, 'Chapter 3 content is still in development');
  assert(hasStageAvailableContent(4) === false, 'Chapter 4 content is still in development');

  const ch1Titles = new Set<string>();
  const ch1ExampleBodies = new Set<string>();
  for (const lesson of chapter1Lessons) {
    assert(lesson.isAvailable === true, `Chapter 1 ${lesson.lessonId} must be available`);
    assert(Boolean(lesson.content), `Chapter 1 ${lesson.lessonId} must have full content`);
    const c = lesson.content!;
    assert(c.objectives.length >= 2, `${lesson.lessonId} must have at least 2 learning objectives`);
    assert(c.paragraphs.length >= 2, `${lesson.lessonId} must have at least 2 paragraphs`);
    assert(c.exampleBody.length >= 40, `${lesson.lessonId} must have a real detailed example`);
    assert(c.vibeQuote.length >= 10, `${lesson.lessonId} must have a Ví Bé quote`);
    assert(!ch1Titles.has(lesson.title), `Duplicate title in Chapter 1: ${lesson.title}`);
    assert(!ch1ExampleBodies.has(c.exampleBody), `Duplicate example body in Chapter 1: ${lesson.lessonId}`);
    ch1Titles.add(lesson.title);
    ch1ExampleBodies.add(c.exampleBody);
  }

  // Spot-check original Lessons 1-3 preserved + new interactive Lessons 4-15
  assert(getLessonById('day-1')?.content?.interaction.type === 'quiz', 'Lesson 1 must remain quiz');
  const l2Interaction = getLessonById('day-2')?.content?.interaction;
  assert(
    l2Interaction?.type === 'calculation' && l2Interaction.correctValue === 900000,
    'Lesson 2 must remain 900,000 VND calculation'
  );
  assert(getLessonById('day-3')?.content?.interaction.type === 'classification', 'Lesson 3 must remain classification');
  assert(getLessonById('day-6')?.content?.interaction.type === 'classification', 'Lesson 6 must have classification interaction');
  assert(getLessonById('day-15')?.content?.interaction.type === 'classification', 'Lesson 15 must have classification interaction');
  console.log('✓ Test 3 passed: All 15 Chapter 1 lessons have distinct real content; Chapters 2-4 have 75 honest in-development slots.');

  // Test 4: Self-paced out-of-order access inside unlocked Chapter 1 (ZERO time/day/order lock)
  assert(canAccessLesson('day-1', {}) === true, 'day-1 must be accessible with 0 completed');
  assert(canAccessLesson('day-5', {}) === true, 'day-5 must be accessible BEFORE completing day-1..4');
  assert(canAccessLesson('day-15', {}) === true, 'day-15 must be accessible BEFORE completing day-1..14');
  assert(canAccessLesson('day-16', {}) === false, 'day-16 (locked Chapter 2) must be blocked');
  assert(canAccessLesson('day-90', {}) === false, 'day-90 (locked Chapter 4) must be blocked');
  assert(canAccessLesson('invalid-lesson', {}) === false, 'Invalid lesson ID must be blocked');
  console.log('✓ Test 4 passed: Self-paced out-of-order access inside Chapter 1 works without date/time lock.');

  // Test 5: Pure progress-based Chapter unlocking boundaries (14/15 vs 15/15, Ch.2->Ch.3, Ch.3->Ch.4)
  assert(isStageUnlocked(1, {}) === true, 'Chapter 1 must be unlocked by default');
  assert(isStageUnlocked(2, {}) === false, 'Chapter 2 must be locked at 0/15');

  const ch1Fourteen = buildCompletedMap(1, 14);
  assert(
    isStageUnlocked(2, ch1Fourteen) === false,
    'Chapter 2 MUST stay locked at 14/15 lessons completed in Chapter 1'
  );

  const ch1AllFifteen = buildCompletedMap(1, 15);
  assert(
    isStageUnlocked(2, ch1AllFifteen) === true,
    'Chapter 2 MUST unlock immediately once 15/15 lessons of Chapter 1 are completed'
  );
  // Even when Chapter 2 is unlocked by progress, its lessons remain blocked from opening until content is ready
  assert(
    canAccessLesson('day-16', ch1AllFifteen) === false,
    'day-16 must stay non-openable while content is in development (isAvailable === false)'
  );
  assert(
    isStageUnlocked(3, ch1AllFifteen) === false,
    'Chapter 3 must stay locked until 15/15 of Chapter 2 are completed'
  );

  const ch1And2Done = buildCompletedMap(1, 30);
  assert(isStageUnlocked(3, ch1And2Done) === true, 'Chapter 3 must unlock after 15/15 of Chapter 2');
  assert(isStageUnlocked(4, ch1And2Done) === false, 'Chapter 4 must stay locked at 0/30 of Chapter 3');

  const ch3TwentyNine = buildCompletedMap(1, 59);
  assert(isStageUnlocked(4, ch3TwentyNine) === false, 'Chapter 4 must stay locked at 29/30 of Chapter 3');

  const ch1To3Done = buildCompletedMap(1, 60);
  assert(isStageUnlocked(4, ch1To3Done) === true, 'Chapter 4 must unlock after 30/30 of Chapter 3');
  assert(isStageUnlocked(99, ch1To3Done) === false, 'Invalid chapter ID must be blocked');
  console.log('✓ Test 5 passed: Exact chapter unlock thresholds (14/15 locked -> 15/15 unlocked, Ch.3, Ch.4) verified.');

  // Test 6: Progress stats math
  const stats0 = getStageProgress(1, {});
  assert(
    stats0.completedCount === 0 &&
      stats0.totalDays === 15 &&
      stats0.availableCount === 15 &&
      stats0.progressPercent === 0 &&
      stats0.isCompleted === false,
    'Initial Chapter 1 stats mismatch'
  );

  const stats3 = getStageProgress(1, { 'day-1': true, 'day-2': true, 'day-3': true });
  assert(stats3.completedCount === 3 && stats3.progressPercent === 20 && stats3.isCompleted === false, '3/15 must be 20%');

  const stats15 = getStageProgress(1, ch1AllFifteen);
  assert(stats15.completedCount === 15 && stats15.progressPercent === 100 && stats15.isCompleted === true, '15/15 must be 100% and isCompleted=true');
  console.log('✓ Test 6 passed: Chapter progress calculations verified.');

  console.log('===============================================================');
  console.log('🎉 ALL ACADEMY SELF-PACED ROADMAP DATA TESTS PASSED!');
  console.log('===============================================================');
}

runAcademyRoadmapTests();
