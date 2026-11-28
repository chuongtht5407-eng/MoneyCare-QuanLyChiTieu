import { getCurrentUserProfile } from './authService';
import {
  StickyRiceGameState,
  createInitialStickyRiceState,
  validateStickyRiceState,
} from '../data/stickyRiceGame';

/**
 * Strictly device-local storage for Gánh xôi khởi nghiệp (7 ngày làm chủ).
 * - Uses simulated money ONLY.
 * - NEVER touches MoneyCare real balance, Transactions, Budgets, XP, Streak, Roadmap, or other games.
 */
const getStickyRiceStorageKey = (uid: string) => `moneycare:game:sticky-rice:${uid}`;

function resolveUid(explicitUid?: string): string {
  if (explicitUid && explicitUid.trim().length > 0) return explicitUid;
  const user = getCurrentUserProfile();
  return user ? user.uid : 'guest';
}

export function loadStickyRiceState(explicitUid?: string): StickyRiceGameState | null {
  if (typeof localStorage === 'undefined') return null;
  const uid = resolveUid(explicitUid);
  const raw = localStorage.getItem(getStickyRiceStorageKey(uid));
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return validateStickyRiceState(parsed);
  } catch {
    return null;
  }
}

export interface SaveStickyRiceResult {
  saved: boolean;
  reason: 'ok' | 'storage-unavailable' | 'invalid-state' | 'stale-overwrite-blocked' | 'storage-error';
}

export function saveStickyRiceState(
  state: StickyRiceGameState,
  explicitUid?: string
): SaveStickyRiceResult {
  if (typeof localStorage === 'undefined') {
    return { saved: false, reason: 'storage-unavailable' };
  }

  const valid = validateStickyRiceState(state);
  if (!valid) {
    return { saved: false, reason: 'invalid-state' };
  }

  const uid = resolveUid(explicitUid);
  const existing = loadStickyRiceState(uid);

  if (existing && existing.runId === valid.runId) {
    if (existing.history.length > valid.history.length) {
      return { saved: false, reason: 'stale-overwrite-blocked' };
    }
    if (existing.status === 'completed' && valid.status !== 'completed') {
      return { saved: false, reason: 'stale-overwrite-blocked' };
    }
  }

  try {
    localStorage.setItem(getStickyRiceStorageKey(uid), JSON.stringify(valid));
    return { saved: true, reason: 'ok' };
  } catch {
    return { saved: false, reason: 'storage-error' };
  }
}

export function resetStickyRiceState(explicitUid?: string): StickyRiceGameState {
  const uid = resolveUid(explicitUid);
  const fresh = createInitialStickyRiceState();
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(getStickyRiceStorageKey(uid), JSON.stringify(fresh));
    } catch {
      // Ignore quota errors
    }
  }
  return fresh;
}
