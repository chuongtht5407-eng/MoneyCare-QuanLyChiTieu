import { getCurrentUserProfile } from './authService';
import {
  CreditCardGameState,
  createInitialCreditCardState,
  validateCreditCardState,
} from '../data/creditCardGame';

/**
 * Strictly device-local storage for Thẻ tín dụng không phải tiền miễn phí (3 kỳ sao kê).
 */
const getCreditCardStorageKey = (uid: string) => `moneycare:game:credit-card:${uid}`;

function resolveUid(explicitUid?: string): string {
  if (explicitUid && explicitUid.trim().length > 0) return explicitUid;
  const user = getCurrentUserProfile();
  return user ? user.uid : 'guest';
}

export function loadCreditCardState(explicitUid?: string): CreditCardGameState | null {
  if (typeof localStorage === 'undefined') return null;
  const uid = resolveUid(explicitUid);
  const raw = localStorage.getItem(getCreditCardStorageKey(uid));
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return validateCreditCardState(parsed);
  } catch {
    return null;
  }
}

export interface SaveCreditCardResult {
  saved: boolean;
  reason: 'ok' | 'storage-unavailable' | 'invalid-state' | 'stale-overwrite-blocked' | 'storage-error';
}

export function saveCreditCardState(
  state: CreditCardGameState,
  explicitUid?: string
): SaveCreditCardResult {
  if (typeof localStorage === 'undefined') {
    return { saved: false, reason: 'storage-unavailable' };
  }
  const valid = validateCreditCardState(state);
  if (!valid) {
    return { saved: false, reason: 'invalid-state' };
  }

  const uid = resolveUid(explicitUid);
  const existing = loadCreditCardState(uid);
  if (existing && existing.runId === valid.runId) {
    if (existing.history.length > valid.history.length) {
      return { saved: false, reason: 'stale-overwrite-blocked' };
    }
    if (existing.status === 'completed' && valid.status !== 'completed') {
      return { saved: false, reason: 'stale-overwrite-blocked' };
    }
  }

  try {
    localStorage.setItem(getCreditCardStorageKey(uid), JSON.stringify(valid));
    return { saved: true, reason: 'ok' };
  } catch {
    return { saved: false, reason: 'storage-error' };
  }
}

export function resetCreditCardState(explicitUid?: string): CreditCardGameState {
  const uid = resolveUid(explicitUid);
  const fresh = createInitialCreditCardState();
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(getCreditCardStorageKey(uid), JSON.stringify(fresh));
    } catch {
      // ignore quota errors
    }
  }
  return fresh;
}
