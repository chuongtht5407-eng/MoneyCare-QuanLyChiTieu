import React from 'react';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  CreditCard,
  Flame,
  Info,
  Lock,
  Play,
  Store,
  Trophy,
} from 'lucide-react';
import {
  BossBattleGameState,
  HARD_CASE_PROFILES,
  HardCaseId,
  HardCaseProfile,
  evaluateBossBattleOutcome,
  formatBossVnd,
} from '../../data/bossBattle200k';
import {
  StickyRiceGameState,
  evaluateStickyRiceOutcome,
  formatSignedStickyRiceVnd,
  formatStickyRiceVnd,
} from '../../data/stickyRiceGame';
import {
  JobLossGameState,
  evaluateJobLossOutcome,
  formatJobLossVnd,
} from '../../data/jobLossGame';
import {
  CreditCardGameState,
  evaluateCreditCardOutcome,
  formatCreditVnd,
} from '../../data/creditCardGame';
import { ViBeMascot } from './ViBeMascot';

interface HardCasesTabProps {
  bossBattleState: BossBattleGameState;
  stickyRiceState: StickyRiceGameState;
  jobLossState: JobLossGameState;
  creditCardState: CreditCardGameState;
  accessNotice: string | null;
  onDismissAccessNotice: () => void;
  onOpenHardCase: (caseId: HardCaseId) => void;
}

function BossNoodleIcon({ className = 'w-11 h-11' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="16" fill="#FFF4E5" />
      <path d="M23 15C21.5 18 24.5 19.5 23 22" stroke="#F97316" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M32 13C30.5 16 33.5 17.5 32 20" stroke="#F97316" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M41 15C39.5 18 42.5 19.5 41 22" stroke="#F97316" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M16 31C20 24 44 24 48 31" fill="#FACC15" stroke="#EA580C" strokeWidth="2" />
      <path d="M21 28.5C25 26 28 29.5 32 27.5C36 25.5 39 29.5 43 28" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13 31H51C50.5 42 43 49 32 49C21 49 13.5 42 13 31Z" fill="#FFFFFF" stroke="#2F5BEA" strokeWidth="2.4" />
      <path d="M23 49H41L39 53H25L23 49Z" fill="#2F5BEA" />
      <path d="M23 36.5L27 38" stroke="#171923" strokeWidth="2" strokeLinecap="round" />
      <path d="M41 36.5L37 38" stroke="#171923" strokeWidth="2" strokeLinecap="round" />
      <circle cx="25.5" cy="40" r="1.8" fill="#171923" />
      <circle cx="38.5" cy="40" r="1.8" fill="#171923" />
      <path d="M29 44C30.5 42.5 33.5 42.5 35 44" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function renderProfileIcon(profile: HardCaseProfile) {
  if (profile.iconKey === 'noodles') {
    return <BossNoodleIcon className="w-12 h-12 shrink-0" />;
  }

  const Icon =
    profile.iconKey === 'store'
      ? Store
      : profile.iconKey === 'briefcase'
      ? Briefcase
      : CreditCard;

  return (
    <div
      className={`w-12 h-12 rounded-2xl ${profile.accentBg} ${profile.accentText} flex items-center justify-center shrink-0 border border-black/5`}
    >
      <Icon className="w-6 h-6" />
    </div>
  );
}

interface CardStatusMeta {
  isPlaying: boolean;
  isCompleted: boolean;
  playingBadge: string | null;
  completedBadge: string | null;
  completedTone: 'good' | 'warn' | 'bad';
  ctaLabel: string;
  metrics: readonly [
    { label: string; value: string; tone?: 'blue' | 'green' | 'red' | 'dark' },
    { label: string; value: string; tone?: 'blue' | 'green' | 'red' | 'dark' },
    { label: string; value: string; tone?: 'blue' | 'green' | 'red' | 'dark' }
  ] | null;
}

function getCardStatusMeta(
  id: HardCaseId,
  props: HardCasesTabProps
): CardStatusMeta {
  if (id === 'boss-battle-200k') {
    const s = props.bossBattleState;
    const isPlaying = s.status === 'playing';
    const isCompleted = s.status === 'completed';
    const out = isCompleted ? evaluateBossBattleOutcome(s) : null;
    return {
      isPlaying,
      isCompleted,
      playingBadge: isPlaying ? `Đang chơi: Ngày ${s.currentDay}/7` : null,
      completedBadge: out?.badgeText ?? null,
      completedTone:
        out?.type === 'victory' ? 'good' : out?.type === 'survived_hard' ? 'warn' : 'bad',
      ctaLabel: isPlaying
        ? `Tiếp tục Ngày ${s.currentDay}/7`
        : isCompleted
        ? 'Xem kết quả'
        : 'Bắt đầu thử thách',
      metrics:
        isPlaying || isCompleted
          ? [
              { label: 'Ngân sách', value: formatBossVnd(s.budget), tone: 'blue' },
              {
                label: 'Nợ',
                value: formatBossVnd(s.debt),
                tone: s.debt > 0 ? 'red' : 'green',
              },
              { label: 'Thiết yếu', value: `${s.essentialsScore}/100`, tone: 'dark' },
            ]
          : null,
    };
  }

  if (id === 'ganh-xoi-khoi-nghiep') {
    const s = props.stickyRiceState;
    const isPlaying = s.status === 'playing';
    const isCompleted = s.status === 'completed';
    const out = isCompleted ? evaluateStickyRiceOutcome(s) : null;
    return {
      isPlaying,
      isCompleted,
      playingBadge: isPlaying ? `Đang chơi: Ngày ${s.currentDay}/7` : null,
      completedBadge: out?.badgeText ?? null,
      completedTone:
        out?.type === 'profit' ? 'good' : out?.type === 'breakeven_low_profit' ? 'warn' : 'bad',
      ctaLabel: isPlaying
        ? `Tiếp tục Ngày ${s.currentDay}/7`
        : isCompleted
        ? 'Xem kết quả'
        : 'Bắt đầu',
      metrics:
        isPlaying || isCompleted
          ? [
              { label: 'Tiền mặt', value: formatStickyRiceVnd(s.cash), tone: 'blue' },
              {
                label: 'Lãi / lỗ',
                value: formatSignedStickyRiceVnd(s.totalProfit),
                tone: s.totalProfit >= 0 ? 'green' : 'red',
              },
              { label: 'Đã bán', value: `${s.totalPortionsSold} suất`, tone: 'dark' },
            ]
          : null,
    };
  }

  if (id === 'mat-viec-bat-ngo') {
    const s = props.jobLossState;
    const isPlaying = s.status === 'playing';
    const isCompleted = s.status === 'completed';
    const out = isCompleted ? evaluateJobLossOutcome(s) : null;
    return {
      isPlaying,
      isCompleted,
      playingBadge: isPlaying ? `Đang chơi: Chặng ${s.currentStage}/6` : null,
      completedBadge: out?.badgeText ?? null,
      completedTone:
        out?.type === 'strong_recovery'
          ? 'good'
          : out?.type === 'survived_strengthen'
          ? 'warn'
          : 'bad',
      ctaLabel: isPlaying
        ? `Tiếp tục Chặng ${s.currentStage}/6`
        : isCompleted
        ? 'Xem kết quả'
        : 'Bắt đầu',
      metrics:
        isPlaying || isCompleted
          ? [
              { label: 'Dự phòng', value: formatJobLossVnd(s.cash), tone: 'blue' },
              {
                label: 'Nợ / HĐ',
                value: formatJobLossVnd(s.debt + s.unpaidBills),
                tone: s.debt + s.unpaidBills > 0 ? 'red' : 'green',
              },
              { label: 'Tìm việc', value: `${s.jobSearchProgress}%`, tone: 'dark' },
            ]
          : null,
    };
  }

  // the-tin-dung
  const s = props.creditCardState;
  const isPlaying = s.status === 'playing';
  const isCompleted = s.status === 'completed';
  const out = isCompleted ? evaluateCreditCardOutcome(s) : null;
  return {
    isPlaying,
    isCompleted,
    playingBadge: isPlaying ? `Đang chơi: Kỳ ${s.currentCycle}/3` : null,
    completedBadge: out?.badgeText ?? null,
    completedTone:
      out?.type === 'good_management'
        ? 'good'
        : out?.type === 'needs_improvement'
        ? 'warn'
        : 'bad',
    ctaLabel: isPlaying
      ? `Tiếp tục Kỳ ${s.currentCycle}/3`
      : isCompleted
      ? 'Xem kết quả'
      : 'Bắt đầu',
    metrics:
      isPlaying || isCompleted
        ? [
            {
              label: 'Dư nợ',
              value: formatCreditVnd(s.currentBalance),
              tone: s.currentBalance > 0 ? 'red' : 'green',
            },
            {
              label: 'Lãi & phí',
              value: formatCreditVnd(s.totalInterest + s.totalLateFees),
              tone: s.totalInterest + s.totalLateFees > 0 ? 'red' : 'green',
            },
            { label: 'Khả dụng', value: formatCreditVnd(s.availableLimit), tone: 'blue' },
          ]
        : null,
  };
}

function metricToneClass(tone?: 'blue' | 'green' | 'red' | 'dark'): string {
  if (tone === 'blue') return 'text-[#2F5BEA]';
  if (tone === 'green') return 'text-[#16A66A]';
  if (tone === 'red') return 'text-[#EF4444]';
  return 'text-[#171923]';
}

export const HardCasesTab: React.FC<HardCasesTabProps> = (props) => {
  const { accessNotice, onDismissAccessNotice, onOpenHardCase } = props;

  return (
    <div className="space-y-4 academy-tab-enter">
      {/* Header Hero Card (White + MoneyCare Blue) */}
      <section
        aria-label="Giới thiệu tab Hồ sơ khó"
        className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#214CE0] via-[#2F5BEA] to-[#528BFF] text-white p-4 shadow-sm"
      >
        <div className="pointer-events-none absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-10 right-14 w-24 h-24 rounded-full bg-white/10" />

        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0 space-y-1.5">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white px-2.5 py-0.5 rounded-full">
              4 tình huống mô phỏng thực tế
            </span>
            <h2 className="text-base sm:text-lg font-extrabold leading-tight tracking-tight">
              Hồ sơ khó – Thực chiến giữ ví
            </h2>
            <p className="text-xs text-blue-50/95 leading-relaxed">
              Thử sức xử lý 4 tình huống tài chính căng thẳng bằng tiền giả lập — không ảnh hưởng số dư thật.
            </p>
          </div>

          <div className="shrink-0 -mr-1 -mb-2">
            <ViBeMascot variant="banner" className="w-[80px] h-[74px]" />
          </div>
        </div>
      </section>

      {/* URL Access Notice for invalid case IDs */}
      {accessNotice && (
        <div
          role="alert"
          className="bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] rounded-2xl p-3 text-xs flex items-start justify-between gap-2"
        >
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
            <span>{accessNotice}</span>
          </div>
          <button
            onClick={onDismissAccessNotice}
            type="button"
            className="text-[11px] font-bold text-[#92400E] underline shrink-0"
          >
            Đóng
          </button>
        </div>
      )}

      {/* All 4 Playable Hard Case Profiles */}
      <section aria-label="Danh sách 4 hồ sơ khó" className="space-y-3">
        {HARD_CASE_PROFILES.map((profile) => {
          const meta = getCardStatusMeta(profile.id, props);

          return (
            <div
              key={profile.id}
              data-hard-case-id={profile.id}
              className="bg-white rounded-[22px] p-4 border-2 border-[#DCE6FF] shadow-xs space-y-3"
            >
              <div className="flex items-start gap-3">
                {renderProfileIcon(profile)}

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        profile.id === 'boss-battle-200k'
                          ? 'text-[#EA580C] bg-[#FFF4E5] border border-[#FED7AA]'
                          : `${profile.accentText} ${profile.accentBg}`
                      }`}
                    >
                      {profile.id === 'boss-battle-200k' && (
                        <Flame className="w-3 h-3 fill-[#F97316] text-[#F97316]" />
                      )}
                      {profile.badgeText}
                    </span>

                    {meta.isPlaying && meta.playingBadge && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2F5BEA] bg-[#EAF0FF] px-2 py-0.5 rounded-full">
                        <Play className="w-3 h-3 fill-[#2F5BEA]" />
                        {meta.playingBadge}
                      </span>
                    )}

                    {meta.isCompleted && meta.completedBadge && (
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          meta.completedTone === 'good'
                            ? 'text-[#16A66A] bg-[#ECFDF5]'
                            : meta.completedTone === 'warn'
                            ? 'text-[#B45309] bg-[#FFFBEB]'
                            : 'text-[#EF4444] bg-[#FEF2F2]'
                        }`}
                      >
                        {meta.completedTone === 'good' ? (
                          <Trophy className="w-3 h-3" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {meta.completedBadge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-[15px] font-extrabold text-[#171923] leading-snug">
                    {profile.title}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{profile.description}</p>
                </div>
              </div>

              {/* Live Mini Status Pill when in-progress or completed */}
              {meta.metrics && (
                <div className="bg-[#F4F7FF] border border-[#DCE6FF] rounded-xl px-2.5 py-2 grid grid-cols-3 gap-1.5 text-center text-[11px]">
                  {meta.metrics.map((m, idx) => (
                    <div
                      key={m.label}
                      className={`min-w-0 ${idx === 1 ? 'border-x border-[#DCE6FF] px-1' : ''}`}
                    >
                      <p className="text-[10px] font-semibold text-[#64748B] truncate">{m.label}</p>
                      <p
                        className={`font-extrabold tabular-nums whitespace-nowrap ${metricToneClass(
                          m.tone
                        )}`}
                      >
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => onOpenHardCase(profile.id)}
                className="w-full py-3 px-4 rounded-xl bg-[#2F5BEA] hover:bg-[#244CD9] text-white text-xs sm:text-sm font-bold transition-all active:scale-[0.98] shadow-2xs flex items-center justify-center gap-2"
              >
                <span>{meta.ctaLabel}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          );
        })}
      </section>

      {/* Honest Device-Local & Simulated-Money Disclosure */}
      <div className="bg-white border border-[#E8EAF0] rounded-2xl p-3 text-[11px] text-[#64748B] flex items-start gap-2 leading-relaxed">
        <Info className="w-4 h-4 text-[#2F5BEA] shrink-0 mt-0.5" />
        <span>
          <strong>Tiến độ trò chơi được lưu trên thiết bị này, chưa đồng bộ Cloud.</strong> Tiền trong Hồ sơ khó là tiền giả lập, không làm thay đổi số dư MoneyCare, giao dịch, ngân sách, XP hay Streak của bạn.
        </span>
      </div>
    </div>
  );
};
