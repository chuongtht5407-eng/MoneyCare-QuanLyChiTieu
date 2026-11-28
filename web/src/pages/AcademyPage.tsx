import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BottomNavigation } from '../components/BottomNavigation';
import { AcademyHeader, AcademyTab } from '../components/academy/AcademyHeader';
import { TodayMissionTab } from '../components/academy/TodayMissionTab';
import { RoadmapTab } from '../components/academy/RoadmapTab';
import { RoadmapLessonView } from '../components/academy/RoadmapLessonView';
import { HardCasesTab } from '../components/academy/HardCasesTab';
import { BossBattleView } from '../components/academy/BossBattleView';
import { StickyRiceGameView } from '../components/academy/StickyRiceGameView';
import { JobLossGameView } from '../components/academy/JobLossGameView';
import { CreditCardGameView } from '../components/academy/CreditCardGameView';
import { useAuth } from '../hooks/useAuth';
import { getDailyQuestion, QuizQuestion } from '../data/academyQuestions';
import {
  canAccessLesson,
  getDaysByStage,
  getLessonById,
  getStageById,
  getStageProgress,
  isStageUnlocked,
} from '../data/academyRoadmap';
import {
  BOSS_BATTLE_CONFIG,
  BossBattleGameState,
  BossOptionId,
  HARD_CASE_PROFILES,
  HardCaseId,
  advanceBossBattleDay,
  applyBossBattleChoice,
  createInitialBossBattleState,
  startBossBattle,
} from '../data/bossBattle200k';
import {
  STICKY_RICE_CONFIG,
  StickyRiceConfirmInput,
  StickyRiceGameState,
  advanceStickyRiceDay,
  confirmStickyRiceDay,
  createInitialStickyRiceState,
  startStickyRiceGame,
} from '../data/stickyRiceGame';
import {
  JOB_LOSS_CONFIG,
  JobLossGameState,
  JobLossOptionId,
  advanceJobLossStage,
  applyJobLossChoice,
  createInitialJobLossState,
  startJobLossGame,
} from '../data/jobLossGame';
import {
  CREDIT_CARD_CONFIG,
  ConfirmCreditCycleInput,
  CreditCardGameState,
  advanceCreditCardCycle,
  confirmCreditCardCycle,
  createInitialCreditCardState,
  startCreditCardGame,
} from '../data/creditCardGame';
import {
  fetchAcademyProgress,
  fetchDailyRecord,
  submitDailyQuiz,
  calculateLevelInfo,
  getVietnamDateKey,
  AcademyProgress,
  AcademyDailyRecord,
} from '../services/academyService';
import {
  fetchRoadmapProgress,
  completeRoadmapLesson,
  CompleteRoadmapLessonResult,
  RoadmapProgressMap,
} from '../services/academyRoadmapService';
import {
  loadBossBattleState,
  resetBossBattleState,
  saveBossBattleState,
} from '../services/bossBattleStorageService';
import {
  loadStickyRiceState,
  resetStickyRiceState,
  saveStickyRiceState,
} from '../services/stickyRiceStorageService';
import {
  loadJobLossState,
  resetJobLossState,
  saveJobLossState,
} from '../services/jobLossStorageService';
import {
  loadCreditCardState,
  resetCreditCardState,
  saveCreditCardState,
} from '../services/creditCardStorageService';
import { reportCloudSuccess } from '../services/syncStatus';

function parseTabParam(raw: string | null): AcademyTab {
  if (raw === 'roadmap' || raw === 'advanced' || raw === 'today') {
    return raw;
  }
  return 'today';
}

function parseStageParam(raw: string | null): number | null {
  if (!raw) return null;
  const num = Number(raw);
  return Number.isInteger(num) ? num : null;
}

const VALID_HARD_CASE_IDS = new Set<string>(HARD_CASE_PROFILES.map((p) => p.id));

function parseHardCaseParam(raw: string | null): HardCaseId | null {
  if (raw && VALID_HARD_CASE_IDS.has(raw)) {
    return raw as HardCaseId;
  }
  return null;
}

export const AcademyPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const activeTab = parseTabParam(searchParams.get('tab'));
  const rawStageParam = searchParams.get('stage');
  const rawLessonParam = searchParams.get('lesson');
  const rawCaseParam = searchParams.get('case');

  const today = useMemo(() => new Date(), []);
  const dateKey = useMemo(() => getVietnamDateKey(today), [today]);
  const currentQuestion: QuizQuestion = useMemo(() => getDailyQuestion(today), [today]);

  // 1. Academy XP, Level, Streak & Daily Quiz State (Phase 1 — preserved)
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<AcademyProgress>({
    totalXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
    updatedAt: new Date().toISOString(),
  });

  const [dailyRecord, setDailyRecord] = useState<AcademyDailyRecord | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<'A' | 'B' | 'C' | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isQuizExpanded, setIsQuizExpanded] = useState<boolean>(false);
  const [earnedXpNotice, setEarnedXpNotice] = useState<number | null>(null);

  // 2. Roadmap Lesson Completion State (Phase 2.2 — self-paced & strictly separated from XP/Streak)
  const [roadmapLoading, setRoadmapLoading] = useState<boolean>(true);
  const [roadmapCompleted, setRoadmapCompleted] = useState<RoadmapProgressMap>({});
  const [roadmapSyncError, setRoadmapSyncError] = useState<string | null>(null);
  const [roadmapAccessNotice, setRoadmapAccessNotice] = useState<string | null>(null);
  const [expandedStageId, setExpandedStageId] = useState<number | null>(1);

  // 3. Hard Cases — All 4 Simulated Games (device-local only, strictly isolated per UID & gameId)
  const [bossBattleState, setBossBattleState] = useState<BossBattleGameState>(() =>
    loadBossBattleState(user?.uid) ?? createInitialBossBattleState()
  );
  const [stickyRiceState, setStickyRiceState] = useState<StickyRiceGameState>(() =>
    loadStickyRiceState(user?.uid) ?? createInitialStickyRiceState()
  );
  const [jobLossState, setJobLossState] = useState<JobLossGameState>(() =>
    loadJobLossState(user?.uid) ?? createInitialJobLossState()
  );
  const [creditCardState, setCreditCardState] = useState<CreditCardGameState>(() =>
    loadCreditCardState(user?.uid) ?? createInitialCreditCardState()
  );

  const lastGamesUidRef = useRef<string | undefined>(user?.uid);
  const [hardCaseAccessNotice, setHardCaseAccessNotice] = useState<string | null>(null);

  // Sync all 4 Hard Cases states ONLY when authenticated UID actually changes (logout / account switch)
  useEffect(() => {
    if (lastGamesUidRef.current === user?.uid) return;
    lastGamesUidRef.current = user?.uid;
    setBossBattleState(loadBossBattleState(user?.uid) ?? createInitialBossBattleState());
    setStickyRiceState(loadStickyRiceState(user?.uid) ?? createInitialStickyRiceState());
    setJobLossState(loadJobLossState(user?.uid) ?? createInitialJobLossState());
    setCreditCardState(loadCreditCardState(user?.uid) ?? createInitialCreditCardState());
  }, [user?.uid]);

  // Load Academy XP/Streak & Today's Daily Record (Read-only)
  useEffect(() => {
    if (authLoading) return;
    let isMounted = true;

    async function loadAcademyData() {
      setLoading(true);
      try {
        const [prog, daily] = await Promise.all([
          fetchAcademyProgress(),
          fetchDailyRecord(dateKey),
        ]);

        if (!isMounted) return;

        setProgress(prog);

        if (daily && daily.completed) {
          setDailyRecord(daily);
          setSelectedOptionId(daily.selectedAnswerId);
          setIsConfirmed(true);
        } else {
          setDailyRecord(null);
          setSelectedOptionId(null);
          setIsConfirmed(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAcademyData();
    return () => {
      isMounted = false;
    };
  }, [dateKey, user?.uid, authLoading]);

  // Load Roadmap Progress independently (Read-only)
  useEffect(() => {
    if (authLoading) return;
    let isMounted = true;

    async function loadRoadmapData() {
      setRoadmapLoading(true);
      try {
        const result = await fetchRoadmapProgress();
        if (!isMounted) return;

        setRoadmapCompleted(result.completedLessons);
        setRoadmapSyncError(result.errorMessage);
        if (result.source === 'cloud') {
          reportCloudSuccess();
        }
      } finally {
        if (isMounted) {
          setRoadmapLoading(false);
        }
      }
    }

    loadRoadmapData();
    return () => {
      isMounted = false;
    };
  }, [user?.uid, authLoading]);

  // Strict URL Access Guard for locked chapters or lessons still in development
  useEffect(() => {
    if (activeTab !== 'roadmap' || roadmapLoading) return;

    if (rawLessonParam) {
      const lesson = getLessonById(rawLessonParam);
      const allowed = canAccessLesson(rawLessonParam, roadmapCompleted);
      if (!allowed) {
        if (!lesson) {
          setRoadmapAccessNotice('Bài học không tồn tại trong Lộ trình 90 bài học.');
        } else {
          const stage = getStageById(lesson.stageId);
          const unlocked = isStageUnlocked(lesson.stageId, roadmapCompleted);
          if (!unlocked && stage) {
            setRoadmapAccessNotice(
              `${stage.label} chưa mở khóa. ${stage.unlockRequirementText}.`
            );
          } else {
            setRoadmapAccessNotice(
              `Bài ${lesson.dayNumber} (${stage?.label ?? 'Lộ trình'}) hiện đang phát triển nội dung. Bạn có thể học tự do bất kỳ bài nào trong Chương 1.`
            );
          }
        }
        setSearchParams({ tab: 'roadmap' }, { replace: true });
        return;
      }
    }

    if (rawStageParam) {
      const stageId = parseStageParam(rawStageParam);
      const stage = stageId !== null ? getStageById(stageId) : undefined;
      if (!stage || !isStageUnlocked(stage.id, roadmapCompleted)) {
        setRoadmapAccessNotice(
          stage
            ? `${stage.label} chưa mở khóa. ${stage.unlockRequirementText}.`
            : 'Chương học không hợp lệ.'
        );
        setSearchParams({ tab: 'roadmap' }, { replace: true });
      } else {
        setExpandedStageId(stage.id);
      }
    }
  }, [activeTab, roadmapLoading, rawLessonParam, rawStageParam, roadmapCompleted, setSearchParams]);

  // Strict URL Access Guard for Tab Hồ sơ khó (handles invalid/corrupted ?case= query safely)
  useEffect(() => {
    if (activeTab !== 'advanced' || !rawCaseParam) return;
    if (!parseHardCaseParam(rawCaseParam)) {
      setHardCaseAccessNotice(
        'Hồ sơ mô phỏng không tồn tại. Vui lòng chọn một trong 4 thử thách bên dưới.'
      );
      setSearchParams({ tab: 'advanced' }, { replace: true });
    }
  }, [activeTab, rawCaseParam, setSearchParams]);

  const levelInfo = calculateLevelInfo(progress.totalXP);

  // Derived safe Roadmap lesson & next lesson in the same chapter
  const safeLesson = useMemo(() => {
    if (activeTab !== 'roadmap' || !rawLessonParam) return null;
    if (!canAccessLesson(rawLessonParam, roadmapCompleted)) return null;
    return getLessonById(rawLessonParam) ?? null;
  }, [activeTab, rawLessonParam, roadmapCompleted]);

  const nextAvailableLesson = useMemo(() => {
    if (!safeLesson) return null;
    const stageLessons = getDaysByStage(safeLesson.stageId).filter((d) => d.isAvailable);
    const sequentialNext = stageLessons.find((d) => d.dayNumber === safeLesson.dayNumber + 1);
    if (sequentialNext) return sequentialNext;
    const firstUncompleted = stageLessons.find(
      (d) => d.lessonId !== safeLesson.lessonId && !roadmapCompleted[d.lessonId]
    );
    return firstUncompleted ?? null;
  }, [safeLesson, roadmapCompleted]);

  const safeLessonStageStats = useMemo(() => {
    if (!safeLesson) return null;
    return getStageProgress(safeLesson.stageId, roadmapCompleted);
  }, [safeLesson, roadmapCompleted]);

  const activeHardCaseId = activeTab === 'advanced' ? parseHardCaseParam(rawCaseParam) : null;

  const handleTabChange = (tab: AcademyTab) => {
    setRoadmapAccessNotice(null);
    setHardCaseAccessNotice(null);
    if (tab === 'today') {
      setSearchParams({}, { replace: false });
    } else {
      setSearchParams({ tab }, { replace: false });
    }
  };

  const handleToggleStage = (stageId: number) => {
    setRoadmapAccessNotice(null);
    setExpandedStageId((prev) => (prev === stageId ? null : stageId));
  };

  const handleSelectLesson = (lessonId: string) => {
    const lesson = getLessonById(lessonId);
    if (!lesson || !canAccessLesson(lessonId, roadmapCompleted)) {
      const stage = lesson ? getStageById(lesson.stageId) : undefined;
      if (lesson && stage && !isStageUnlocked(lesson.stageId, roadmapCompleted)) {
        setRoadmapAccessNotice(`${stage.label} chưa mở khóa. ${stage.unlockRequirementText}.`);
      } else {
        setRoadmapAccessNotice('Bài học này đang phát triển nội dung.');
      }
      return;
    }
    setRoadmapAccessNotice(null);
    setExpandedStageId(lesson.stageId);
    setSearchParams(
      { tab: 'roadmap', stage: String(lesson.stageId), lesson: lesson.lessonId },
      { replace: false }
    );
  };

  const handleBackToRoadmapStages = () => {
    setSearchParams({ tab: 'roadmap' }, { replace: false });
  };

  const handleCompleteRoadmapLesson = async (
    lessonId: string
  ): Promise<CompleteRoadmapLessonResult> => {
    const result = await completeRoadmapLesson(lessonId, roadmapCompleted);
    if (result.success && result.completion) {
      setRoadmapCompleted((prev) => ({
        ...prev,
        [result.completion!.lessonId]: result.completion!,
      }));
      setRoadmapSyncError(null);
    }
    return result;
  };

  // Hard Cases shared navigation
  const handleOpenHardCase = (caseId: HardCaseId) => {
    setHardCaseAccessNotice(null);
    setSearchParams({ tab: 'advanced', case: caseId }, { replace: false });
  };

  const handleBackToHardCases = () => {
    setSearchParams({ tab: 'advanced' }, { replace: false });
  };

  // Game 0: Boss Battle handlers (Phase 3 — preserved intact)
  const handleStartBossBattle = () => {
    setBossBattleState((prev) => {
      const next = startBossBattle(prev);
      saveBossBattleState(next, user?.uid);
      return next;
    });
  };

  const handleConfirmBossChoice = (dayNumber: number, optionId: BossOptionId) => {
    setBossBattleState((prev) => {
      const result = applyBossBattleChoice(prev, dayNumber, optionId);
      if (!result.applied) return prev;
      saveBossBattleState(result.state, user?.uid);
      return result.state;
    });
  };

  const handleAdvanceBossDay = () => {
    setBossBattleState((prev) => {
      const result = advanceBossBattleDay(prev);
      if (!result.advanced) return prev;
      saveBossBattleState(result.state, user?.uid);
      return result.state;
    });
  };

  const handleRestartBossBattle = () => {
    const fresh = resetBossBattleState(user?.uid);
    const playing = startBossBattle(fresh);
    saveBossBattleState(playing, user?.uid);
    setBossBattleState(playing);
  };

  // Game 1: Gánh xôi khởi nghiệp handlers (Phase 4A)
  const handleStartStickyRice = () => {
    setStickyRiceState((prev) => {
      const next = startStickyRiceGame(prev);
      saveStickyRiceState(next, user?.uid);
      return next;
    });
  };

  const handleConfirmStickyRiceDay = (input: StickyRiceConfirmInput) => {
    setStickyRiceState((prev) => {
      const result = confirmStickyRiceDay(prev, input);
      if (!result.applied) return prev;
      saveStickyRiceState(result.state, user?.uid);
      return result.state;
    });
  };

  const handleAdvanceStickyRiceDay = () => {
    setStickyRiceState((prev) => {
      const result = advanceStickyRiceDay(prev);
      if (!result.advanced) return prev;
      saveStickyRiceState(result.state, user?.uid);
      return result.state;
    });
  };

  const handleRestartStickyRice = () => {
    const fresh = resetStickyRiceState(user?.uid);
    const playing = startStickyRiceGame(fresh);
    saveStickyRiceState(playing, user?.uid);
    setStickyRiceState(playing);
  };

  // Game 2: Mất việc bất ngờ handlers (Phase 4B)
  const handleStartJobLoss = () => {
    setJobLossState((prev) => {
      const next = startJobLossGame(prev);
      saveJobLossState(next, user?.uid);
      return next;
    });
  };

  const handleConfirmJobLossChoice = (stageNumber: number, optionId: JobLossOptionId) => {
    setJobLossState((prev) => {
      const result = applyJobLossChoice(prev, stageNumber, optionId);
      if (!result.applied) return prev;
      saveJobLossState(result.state, user?.uid);
      return result.state;
    });
  };

  const handleAdvanceJobLossStage = () => {
    setJobLossState((prev) => {
      const result = advanceJobLossStage(prev);
      if (!result.advanced) return prev;
      saveJobLossState(result.state, user?.uid);
      return result.state;
    });
  };

  const handleRestartJobLoss = () => {
    const fresh = resetJobLossState(user?.uid);
    const playing = startJobLossGame(fresh);
    saveJobLossState(playing, user?.uid);
    setJobLossState(playing);
  };

  // Game 3: Thẻ tín dụng handlers (Phase 4C)
  const handleStartCreditCard = () => {
    setCreditCardState((prev) => {
      const next = startCreditCardGame(prev);
      saveCreditCardState(next, user?.uid);
      return next;
    });
  };

  const handleConfirmCreditCardCycle = (input: ConfirmCreditCycleInput) => {
    setCreditCardState((prev) => {
      const result = confirmCreditCardCycle(prev, input);
      if (!result.applied) return prev;
      saveCreditCardState(result.state, user?.uid);
      return result.state;
    });
  };

  const handleAdvanceCreditCardCycle = () => {
    setCreditCardState((prev) => {
      const result = advanceCreditCardCycle(prev);
      if (!result.advanced) return prev;
      saveCreditCardState(result.state, user?.uid);
      return result.state;
    });
  };

  const handleRestartCreditCard = () => {
    const fresh = resetCreditCardState(user?.uid);
    const playing = startCreditCardGame(fresh);
    saveCreditCardState(playing, user?.uid);
    setCreditCardState(playing);
  };

  // Daily Quiz handlers (Phase 1 — untouched)
  const handleSelectOption = (optionId: 'A' | 'B' | 'C') => {
    if (isConfirmed || isSubmitting) return;
    setSelectedOptionId(optionId);
  };

  const handleConfirmAnswer = async () => {
    if (!selectedOptionId || isConfirmed || isSubmitting) return;

    const isCorrect = selectedOptionId === currentQuestion.correctAnswerId;
    setIsSubmitting(true);

    try {
      const result = await submitDailyQuiz(
        dateKey,
        currentQuestion.id,
        selectedOptionId,
        isCorrect
      );

      setIsConfirmed(true);
      setProgress(result.progress);
      setDailyRecord(result.dailyRecord);

      if (result.isFirstSubmission && result.earnedXP > 0) {
        setEarnedXpNotice(result.earnedXP);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetQuiz = () => {
    setIsConfirmed(false);
    setSelectedOptionId(null);
    setEarnedXpNotice(null);
  };

  const handleBottomNavClick = (tabName: string) => {
    if (tabName === 'home') navigate('/home');
    else if (tabName === 'transactions') navigate('/transactions');
    else if (tabName === 'add') navigate('/transactions/new');
    else if (tabName === 'statistics') navigate('/analytics');
    else if (tabName === 'profile') navigate('/profile');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F7F8FC] text-[#171923] min-h-full">
      {/* 1. Academy Header & 3 Fixed Tabs */}
      <AcademyHeader
        levelInfo={levelInfo}
        currentStreak={progress.currentStreak}
        activeTab={activeTab}
        onBack={() => navigate('/home')}
        onTabChange={handleTabChange}
      />

      {/* 2. Main Scrollable Content Area (pb-16 clears BottomNavigation's floating + button) */}
      <main className="p-4 pb-16 space-y-4 flex-1 overflow-x-hidden">
        {/* TAB 1: HÔM NAY (Phase 1 — Preserved intact) */}
        {activeTab === 'today' && (
          <TodayMissionTab
            progress={progress}
            levelInfo={levelInfo}
            dateKey={dateKey}
            loading={loading}
            currentQuestion={currentQuestion}
            dailyRecord={dailyRecord}
            selectedOptionId={selectedOptionId}
            isConfirmed={isConfirmed}
            isSubmitting={isSubmitting}
            isQuizExpanded={isQuizExpanded}
            earnedXpNotice={earnedXpNotice}
            onSelectOption={handleSelectOption}
            onConfirmAnswer={handleConfirmAnswer}
            onResetQuiz={handleResetQuiz}
            onSetQuizExpanded={setIsQuizExpanded}
            onOpenNewTransaction={() => navigate('/transactions/new')}
          />
        )}

        {/* TAB 2: LỘ TRÌNH 90 BÀI HỌC (Phase 2.2 — Preserved intact) */}
        {activeTab === 'roadmap' &&
          (safeLesson ? (
            <RoadmapLessonView
              key={safeLesson.lessonId}
              lesson={safeLesson}
              existingCompletion={roadmapCompleted[safeLesson.lessonId] ?? null}
              nextLesson={nextAvailableLesson}
              chapterCompletedCount={safeLessonStageStats?.completedCount ?? 0}
              chapterTotalCount={safeLessonStageStats?.totalDays ?? 15}
              onCompleteLesson={handleCompleteRoadmapLesson}
              onSelectLesson={handleSelectLesson}
              onBackToRoadmap={handleBackToRoadmapStages}
            />
          ) : (
            <RoadmapTab
              completedLessons={roadmapCompleted}
              expandedStageId={expandedStageId}
              loading={roadmapLoading}
              syncError={roadmapSyncError}
              accessNotice={roadmapAccessNotice}
              onDismissAccessNotice={() => setRoadmapAccessNotice(null)}
              onToggleStage={handleToggleStage}
              onSelectLesson={handleSelectLesson}
            />
          ))}

        {/* TAB 3: HỒ SƠ KHÓ (Phase 3 + Phase 4 — All 4 Playable Financial Simulations) */}
        {activeTab === 'advanced' &&
          (activeHardCaseId === BOSS_BATTLE_CONFIG.id ? (
            <BossBattleView
              gameState={bossBattleState}
              onStartGame={handleStartBossBattle}
              onConfirmChoice={handleConfirmBossChoice}
              onAdvanceDay={handleAdvanceBossDay}
              onRestartGame={handleRestartBossBattle}
              onBackToHardCases={handleBackToHardCases}
            />
          ) : activeHardCaseId === STICKY_RICE_CONFIG.id ? (
            <StickyRiceGameView
              gameState={stickyRiceState}
              onStartGame={handleStartStickyRice}
              onConfirmDay={handleConfirmStickyRiceDay}
              onAdvanceDay={handleAdvanceStickyRiceDay}
              onRestartGame={handleRestartStickyRice}
              onBackToHardCases={handleBackToHardCases}
            />
          ) : activeHardCaseId === JOB_LOSS_CONFIG.id ? (
            <JobLossGameView
              gameState={jobLossState}
              onStartGame={handleStartJobLoss}
              onConfirmChoice={handleConfirmJobLossChoice}
              onAdvanceStage={handleAdvanceJobLossStage}
              onRestartGame={handleRestartJobLoss}
              onBackToHardCases={handleBackToHardCases}
            />
          ) : activeHardCaseId === CREDIT_CARD_CONFIG.id ? (
            <CreditCardGameView
              gameState={creditCardState}
              onStartGame={handleStartCreditCard}
              onConfirmCycle={handleConfirmCreditCardCycle}
              onAdvanceCycle={handleAdvanceCreditCardCycle}
              onRestartGame={handleRestartCreditCard}
              onBackToHardCases={handleBackToHardCases}
            />
          ) : (
            <HardCasesTab
              bossBattleState={bossBattleState}
              stickyRiceState={stickyRiceState}
              jobLossState={jobLossState}
              creditCardState={creditCardState}
              accessNotice={hardCaseAccessNotice}
              onDismissAccessNotice={() => setHardCaseAccessNotice(null)}
              onOpenHardCase={handleOpenHardCase}
            />
          ))}
      </main>

      <BottomNavigation activeTab="home" onTabClick={handleBottomNavClick} />
    </div>
  );
};
