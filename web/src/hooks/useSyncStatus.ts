import { useSyncExternalStore } from 'react';
import {
  getSyncStatus,
  subscribeSyncStatus,
  SyncStatus,
} from '../services/syncStatus';

export function useSyncStatus(): SyncStatus {
  return useSyncExternalStore(subscribeSyncStatus, getSyncStatus, getSyncStatus);
}
