import { getCurrentUserProfile } from './authService';
import {
  JobLossGameState,
  createInitialJobLossState,
  validateJobLossState,
} from '../data/jobLossGame';

/**
 * Strictly device-local storage for Mất việc bất ngờ (30 ngày giữ vững tài chính).
 */
const getJobLossStorageKey = (uid: string) => `moneycare:game:job-loss:${uid}`;

function resolveUid(explicitUid?: string): string {
  if (explicitUid && explicitUid.trim().length > 0) return explicitUid;
  const user = getCurrentUserProfile();
  return user ? user.uid : 'guest';
}

export function loadJobLossState(explicitUid?: string): JobLossGameState | null {
  if (typeof localStorage === 'undefined') return null;
  const uid = resolveUid(explicitUid);
  const raw = localStorage.getItem(getJobLossStorageKey(uid));
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return validateJobLossState(parsed);
  } catch {
    return null;
  }
}

export interface SaveJobLossResult {
  saved: boolean;
  reason: 'ok' | 'storage-unavailable' | 'invalid-state' | 'stale-overwrite-blocked' | 'storage-error';
}

export function saveJobLossState(
  state: JobLossGameState,
  explicitUid?: string
): SaveJobLossResult {
  if (typeof localStorage === 'undefined') {
    return { saved: false, reason: 'storage-unavailable' };
  }
  const valid = validateJobLossState(state);
  if (!valid) {
    return { saved: false, reason: 'invalid-state' };
  }

  const uid = resolveUid(explicitUid);
  const existing = loadJobLossState(uid);
  if (existing && existing.runId === valid.runId) {
    if (existing.history.length > valid.history.length) {
      return { saved: false, reason: 'stale-overwrite-blocked' };
    }
    if (existing.status === 'completed' && valid.status !== 'completed') {
      return { saved: false, reason: 'stale-overwrite-blocked' };
    }
  }

  try {
    localStorage.setItem(getJobLossStorageKey(uid), JSON.stringify(valid));
    return { saved: true, reason: 'ok' };
  } catch {
    return { saved: false, reason: 'storage-error' };
  }
}

export function resetJobLossState(explicitUid?: string): JobLossGameState {
  const uid = resolveUid(explicitUid);
  const fresh = createInitialJobLossState();
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(getJobLossStorageKey(uid), JSON.stringify(fresh));
    } catch {
      // ignore quota errors
    }
  }
  return fresh;
}
