import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { Transaction } from '../types/transaction';
import { DEMO_TRANSACTIONS } from '../data/demoTransactions';
import { getCurrentUserProfile } from './authService';

/**
 * Key prefix lưu trữ LocalStorage phân tách theo từng tài khoản người dùng
 */
function getLocalTxKey(uid?: string): string {
  return uid ? `moneycare_transactions_${uid}` : 'moneycare_transactions';
}

/**
 * Kiểm tra tính hợp lệ của dữ liệu giao dịch trước khi lưu
 */
export function validateTransactionData(data: Partial<Transaction>): void {
  // 1. Kiểm tra loại giao dịch
  if (!data.type || (data.type !== 'income' && data.type !== 'expense')) {
    throw new Error('Loại giao dịch không hợp lệ (phải là "income" hoặc "expense").');
  }

  // 2. Kiểm tra số tiền: phải là số, không âm và lớn hơn 0
  if (typeof data.amount !== 'number' || isNaN(data.amount) || data.amount <= 0) {
    throw new Error('Số tiền phải lớn hơn 0 và là số hợp lệ.');
  }

  // 3. Kiểm tra danh mục
  if (!data.categoryId || typeof data.categoryId !== 'string' || !data.categoryId.trim()) {
    throw new Error('Vui lòng chọn danh mục giao dịch.');
  }
  if (!data.categoryName || typeof data.categoryName !== 'string' || !data.categoryName.trim()) {
    throw new Error('Tên danh mục không được để trống.');
  }

  // 4. Kiểm tra ngày giao dịch (chuẩn YYYY-MM-DD)
  if (!data.date || typeof data.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    throw new Error('Ngày giao dịch không hợp lệ (định dạng chuẩn YYYY-MM-DD).');
  }

  const parsedDate = new Date(data.date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error('Ngày giao dịch không tồn tại trên lịch.');
  }
}

/**
 * Chuẩn hóa chuỗi thời gian hiển thị thân thiện (Hôm nay, Hôm qua hoặc DD/MM/YYYY)
 */
export function formatTransactionTime(dateStr: string): string {
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (dateStr === todayStr) {
    return 'Hôm nay';
  } else if (dateStr === yesterdayStr) {
    return 'Hôm qua';
  } else {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }
}

/**
 * Sắp xếp danh sách giao dịch:
 * 1. Ngày giao dịch (date) mới nhất trước
 * 2. Cùng ngày thì sắp xếp theo thời gian tạo (createdAt) mới nhất trước
 */
export function sortTransactions(list: Transaction[]): Transaction[] {
  return [...list].sort((a, b) => {
    if (b.date !== a.date) {
      return b.date.localeCompare(a.date);
    }
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    return timeB - timeA;
  });
}

/**
 * Đọc danh sách giao dịch cục bộ của người dùng
 */
function getLocalTransactions(uid?: string): Transaction[] {
  const user = getCurrentUserProfile();
  const effectiveUid = uid || user?.uid;
  const key = getLocalTxKey(effectiveUid);
  const saved = localStorage.getItem(key);

  if (!saved) {
    localStorage.setItem(key, JSON.stringify(DEMO_TRANSACTIONS));
    return DEMO_TRANSACTIONS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return DEMO_TRANSACTIONS;
  }
}

/**
 * Lưu danh sách giao dịch cục bộ của người dùng
 */
function saveLocalTransactions(txs: Transaction[], uid?: string): void {
  const user = getCurrentUserProfile();
  const effectiveUid = uid || user?.uid;
  const key = getLocalTxKey(effectiveUid);
  localStorage.setItem(key, JSON.stringify(txs));
}

/**
 * READ: Lấy toàn bộ giao dịch của tài khoản hiện tại
 */
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
      const sorted = sortTransactions(list);
      // Lưu vào cache cục bộ theo đúng tài khoản để dự phòng mất mạng
      saveLocalTransactions(sorted, user.uid);
      return sorted;
    } catch (err) {
      console.warn('Firestore fetch failed, returning cached transactions:', err);
      return sortTransactions(getLocalTransactions(user.uid));
    }
  }

  return sortTransactions(getLocalTransactions(user?.uid));
}

/**
 * READ BY ID: Lấy thông tin 1 giao dịch theo ID
 */
export async function getTransactionById(id: string): Promise<Transaction | null> {
  const user = getCurrentUserProfile();

  if (isFirebaseConfigured && db && user) {
    try {
      const docRef = doc(db, 'users', user.uid, 'transactions', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Transaction;
      }
    } catch (err) {
      console.warn('Firestore getTransactionById error, reading from local cache:', err);
    }
  }

  const localList = getLocalTransactions(user?.uid);
  return localList.find((t) => t.id === id) || null;
}

/**
 * CREATE: Thêm mới một giao dịch (Thu nhập hoặc Chi tiêu)
 */
export async function createTransaction(
  data: Omit<Transaction, 'id'>
): Promise<Transaction> {
  // 1. Kiểm tra validation bắt buộc
  validateTransactionData(data);

  const user = getCurrentUserProfile();
  const now = new Date().toISOString();
  const formattedTime = data.formattedTime || formatTransactionTime(data.date);

  const txDataToSave = {
    type: data.type,
    amount: data.amount,
    categoryId: data.categoryId,
    categoryName: data.categoryName,
    date: data.date,
    formattedTime,
    note: data.note || '',
    userId: user?.uid,
    createdAt: now,
    updatedAt: now,
  };

  // 2. Ghi lên Cloud Firestore nếu có kết nối
  if (isFirebaseConfigured && db && user) {
    try {
      const colRef = collection(db, 'users', user.uid, 'transactions');
      const docRef = await addDoc(colRef, txDataToSave);
      const createdTx: Transaction = {
        id: docRef.id,
        ...txDataToSave,
      };
      // Đồng bộ vào bộ nhớ cục bộ của user
      const current = getLocalTransactions(user.uid);
      saveLocalTransactions(sortTransactions([createdTx, ...current]), user.uid);
      return createdTx;
    } catch (err) {
      console.warn('Firestore create error, falling back to local storage:', err);
    }
  }

  // 3. Fallback lưu vào LocalStorage
  const newTx: Transaction = {
    id: `tx-${Date.now()}`,
    ...txDataToSave,
  };
  const current = getLocalTransactions(user?.uid);
  const updated = sortTransactions([newTx, ...current]);
  saveLocalTransactions(updated, user?.uid);
  return newTx;
}

/**
 * UPDATE: Cập nhật giao dịch đã có mà không tạo document mới
 */
export async function updateTransaction(
  id: string,
  data: Partial<Omit<Transaction, 'id'>>
): Promise<void> {
  if (!id || typeof id !== 'string') {
    throw new Error('ID giao dịch cần cập nhật không hợp lệ.');
  }

  // Validate các trường cập nhật nếu có
  if (data.amount !== undefined) {
    if (typeof data.amount !== 'number' || isNaN(data.amount) || data.amount <= 0) {
      throw new Error('Số tiền phải lớn hơn 0 và là số hợp lệ.');
    }
  }
  if (data.type !== undefined) {
    if (data.type !== 'income' && data.type !== 'expense') {
      throw new Error('Loại giao dịch không hợp lệ (phải là "income" hoặc "expense").');
    }
  }
  if (data.categoryId !== undefined && (!data.categoryId || !data.categoryId.trim())) {
    throw new Error('Danh mục không được để trống.');
  }
  if (data.date !== undefined) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || isNaN(new Date(data.date).getTime())) {
      throw new Error('Ngày giao dịch không hợp lệ (định dạng chuẩn YYYY-MM-DD).');
    }
  }

  const user = getCurrentUserProfile();
  const now = new Date().toISOString();
  const updatePayload: Record<string, any> = {
    ...data,
    updatedAt: now,
  };

  if (data.date && !data.formattedTime) {
    updatePayload.formattedTime = formatTransactionTime(data.date);
  }

  // 1. Cập nhật trên Firestore
  if (isFirebaseConfigured && db && user) {
    try {
      const docRef = doc(db, 'users', user.uid, 'transactions', id);
      await updateDoc(docRef, updatePayload);

      // Cập nhật bộ nhớ cục bộ
      const current = getLocalTransactions(user.uid);
      const index = current.findIndex((t) => t.id === id);
      if (index !== -1) {
        current[index] = { ...current[index], ...updatePayload } as Transaction;
        saveLocalTransactions(sortTransactions(current), user.uid);
      }
      return;
    } catch (err) {
      console.warn('Firestore update error, updating locally:', err);
    }
  }

  // 2. Fallback cập nhật LocalStorage
  const current = getLocalTransactions(user?.uid);
  const index = current.findIndex((t) => t.id === id);
  if (index !== -1) {
    current[index] = { ...current[index], ...updatePayload } as Transaction;
    saveLocalTransactions(sortTransactions(current), user?.uid);
  }
}

/**
 * DELETE: Xóa giao dịch chính xác theo document ID
 */
export async function deleteTransaction(id: string): Promise<void> {
  if (!id || typeof id !== 'string') {
    throw new Error('ID giao dịch cần xóa không hợp lệ.');
  }

  const user = getCurrentUserProfile();

  // 1. Xóa trên Firestore
  if (isFirebaseConfigured && db && user) {
    try {
      const docRef = doc(db, 'users', user.uid, 'transactions', id);
      await deleteDoc(docRef);

      const current = getLocalTransactions(user.uid);
      const filtered = current.filter((t) => t.id !== id);
      saveLocalTransactions(filtered, user.uid);
      return;
    } catch (err) {
      console.warn('Firestore delete error, deleting locally:', err);
    }
  }

  // 2. Fallback xóa trên LocalStorage
  const current = getLocalTransactions(user?.uid);
  const filtered = current.filter((t) => t.id !== id);
  saveLocalTransactions(filtered, user?.uid);
}
