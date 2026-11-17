import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { Transaction } from '../types/transaction';
import { DEMO_TRANSACTIONS } from '../data/demoTransactions';
import { getCurrentUserProfile } from './authService';
import { reportCloudSuccess, reportCloudFailure } from './syncStatus';

const LOCAL_TX_KEY = 'moneycare_transactions';

function getLocalTransactions(): Transaction[] {
  const saved = localStorage.getItem(LOCAL_TX_KEY);
  if (!saved) {
    localStorage.setItem(LOCAL_TX_KEY, JSON.stringify(DEMO_TRANSACTIONS));
    return DEMO_TRANSACTIONS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return DEMO_TRANSACTIONS;
  }
}

function saveLocalTransactions(txs: Transaction[]): void {
  localStorage.setItem(LOCAL_TX_KEY, JSON.stringify(txs));
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const user = getCurrentUserProfile();
  if (isFirebaseConfigured && db && user) {
    try {
      const q = query(
        collection(db, 'users', user.uid, 'transactions'),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      const list: Transaction[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Transaction);
      });
      reportCloudSuccess();
      return list;
    } catch (err) {
      reportCloudFailure(err);
      console.warn('Firestore fetch failed, returning local transactions:', err);
      return getLocalTransactions();
    }
  }
  return getLocalTransactions();
}

export async function createTransaction(
  data: Omit<Transaction, 'id'>
): Promise<Transaction> {
  const user = getCurrentUserProfile();
  const now = new Date().toISOString();

  if (isFirebaseConfigured && db && user) {
    try {
      const colRef = collection(db, 'users', user.uid, 'transactions');
      const docRef = await addDoc(colRef, {
        ...data,
        createdAt: now,
        updatedAt: now,
      });
      reportCloudSuccess();
      return { id: docRef.id, ...data };
    } catch (err) {
      reportCloudFailure(err);
      console.warn('Firestore create error, falling back to local storage:', err);
    }
  }

  const newTx: Transaction = {
    ...data,
    id: `tx-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  const current = getLocalTransactions();
  const updated = [newTx, ...current];
  saveLocalTransactions(updated);
  return newTx;
}

export async function updateTransaction(
  id: string,
  data: Partial<Omit<Transaction, 'id'>>
): Promise<void> {
  const user = getCurrentUserProfile();
  const now = new Date().toISOString();

  if (isFirebaseConfigured && db && user) {
    try {
      const docRef = doc(db, 'users', user.uid, 'transactions', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: now,
      });
      reportCloudSuccess();
      return;
    } catch (err) {
      reportCloudFailure(err);
      console.warn('Firestore update error, updating locally:', err);
    }
  }

  const current = getLocalTransactions();
  const index = current.findIndex((t) => t.id === id);
  if (index !== -1) {
    current[index] = { ...current[index], ...data, updatedAt: now };
    saveLocalTransactions(current);
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  const user = getCurrentUserProfile();

  if (isFirebaseConfigured && db && user) {
    try {
      const docRef = doc(db, 'users', user.uid, 'transactions', id);
      await deleteDoc(docRef);
      reportCloudSuccess();
      return;
    } catch (err) {
      reportCloudFailure(err);
      console.warn('Firestore delete error, deleting locally:', err);
    }
  }

  const current = getLocalTransactions();
  const filtered = current.filter((t) => (t.id === id ? false : true));
  saveLocalTransactions(filtered);
}
