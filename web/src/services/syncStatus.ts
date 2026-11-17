import { isFirebaseConfigured, auth } from '../lib/firebase';

export type SyncMode = 'cloud' | 'local' | 'degraded';

export interface SyncStatus {
  mode: SyncMode;
  lastError: string | null;
  lastSyncedAt: Date | null;
}

let syncStatus: SyncStatus = {
  mode: isFirebaseConfigured && auth?.currentUser ? 'cloud' : 'local',
  lastError: null,
  lastSyncedAt: null,
};

const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function getSyncStatus(): SyncStatus {
  // Nếu chưa cấu hình Firebase hoặc chưa đăng nhập thì luôn là 'local'
  if (!isFirebaseConfigured || !auth?.currentUser) {
    if (syncStatus.mode !== 'local' && syncStatus.mode !== 'degraded') {
      syncStatus = {
        ...syncStatus,
        mode: 'local',
      };
    }
  }
  return syncStatus;
}

export function subscribeSyncStatus(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function reportCloudSuccess(): void {
  syncStatus = {
    mode: 'cloud',
    lastError: null,
    lastSyncedAt: new Date(),
  };
  notify();
}

export function reportCloudFailure(err: unknown): void {
  const errCode = (err as { code?: string })?.code || '';
  const errMsg = err instanceof Error ? err.message : String(err);

  // Kiểm tra lỗi hết hạn phiên hoặc không có quyền (permission-denied / unauthenticated)
  const isAuthExpired =
    errCode === 'permission-denied' ||
    errCode === 'unauthenticated' ||
    errMsg.includes('permission-denied') ||
    errMsg.includes('unauthenticated');

  if (isAuthExpired) {
    // Đăng xuất và điều hướng về /login?expired=1
    try {
      localStorage.removeItem('moneycare_current_user');
      if (auth) {
        auth.signOut().catch(() => {});
      }
    } catch {
      // Bỏ qua lỗi local storage
    }

    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/login?expired=1';
    }
    return;
  }

  // Lỗi mạng hoặc lỗi kết nối Firestore: chuyển sang 'degraded', không đăng xuất
  syncStatus = {
    ...syncStatus,
    mode: 'degraded',
    lastError: errMsg,
  };
  notify();
}

export function setLocalSyncMode(): void {
  syncStatus = {
    mode: 'local',
    lastError: null,
    lastSyncedAt: null,
  };
  notify();
}
