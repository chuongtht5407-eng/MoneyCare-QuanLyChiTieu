import { getCurrentUserProfile } from './authService';
import {
  BossBattleGameState,
  createInitialBossBattleState,
  validateBossBattleState,
} from '../data/bossBattle200k';

/**
 * Strictly local device storage for Boss Battle (7 ngày với 200k).
 * - Uses simulated money ONLY.
 * - NEVER touches MoneyCare real balance, Transactions, Budgets, Academy XP, Level, Streak, or Roadmap progress.
 * - NEVER writes to Cloud Firestore in Phase 3.
 */
const getBossBattleStorageKey = (uid: string) =>
  `moneycare_academy_boss_battle_200k_v1_${uid}`;

function resolveUid(explicitUid?: string): string {
  if (explicitUid && explicitUid.trim().length > 0) return explicitUid;
  const user = getCurrentUserProfile();
  return user ? user.uid : 'guest';
}

export function hasInProgressBossBattle(state: BossBattleGameState | null): boolean {
  if (!state) return false;
  return state.status === 'playing' && state.history.length > 0;
}

/**
 * Loads validated Boss Battle state from localStorage for the given UID.
 * Returns null if no saved run exists or if stored JSON is invalid/corrupted.
 */
export function loadBossBattleState(explicitUid?: string): BossBattleGameState | null {
  if (typeof localStorage === 'undefined') return null;
  const uid = resolveUid(explicitUid);
  const raw = localStorage.getItem(getBossBattleStorageKey(uid));
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return validateBossBattleState(parsed);
  } catch {
    return null;
  }
}

export interface SaveBossBattleResult {
  saved: boolean;
  reason: 'ok' | 'storage-unavailable' | 'invalid-state' | 'stale-overwrite-blocked' | 'storage-error';
}

/**
 * Saves Boss Battle state to localStorage with validation and anti-overwrite guard:
 * - Refuses to overwrite an in-progress run of the SAME runId with an older/regressed history length.
 * - Allows saving a brand-new runId (explicit restart via resetBossBattleState).
 */
export function saveBossBattleState(
  state: BossBattleGameState,
  explicitUid?: string
): SaveBossBattleResult {
  if (typeof localStorage === 'undefined') {
    return { saved: false, reason: 'storage-unavailable' };
  }

  const valid = validateBossBattleState(state);
  if (!valid) {
    return { saved: false, reason: 'invalid-state' };
  }

  const uid = resolveUid(explicitUid);
  const existing = loadBossBattleState(uid);

  // Guard against accidental stale overwrite of the same run
  if (
    existing &&
    existing.runId === valid.runId &&
    existing.history.length > valid.history.length
  ) {
    return { saved: false, reason: 'stale-overwrite-blocked' };
  }

  try {
    localStorage.setItem(getBossBattleStorageKey(uid), JSON.stringify(valid));
    return { saved: true, reason: 'ok' };
  } catch {
    return { saved: false, reason: 'storage-error' };
  }
}

/**
 * Explicitly starts a fresh Boss Battle run and saves it under a new runId.
 */
export function resetBossBattleState(explicitUid?: string): BossBattleGameState {
  const fresh = createInitialBossBattleState();
  saveBossBattleState(fresh, explicitUid);
  return fresh;
}
