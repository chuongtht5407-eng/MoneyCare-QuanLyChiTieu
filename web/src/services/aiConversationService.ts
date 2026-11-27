import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { AIConversation, ChatMessage } from '../types/ai';
import { getCurrentUserProfile } from './authService';

const getConvKey = (uid: string) => `moneycare_ai_conversations_${uid}`;
const getMsgKey = (uid: string, convId: string) => `moneycare_ai_messages_${uid}_${convId}`;

function getLocalConversations(uid: string): AIConversation[] {
  if (typeof localStorage === 'undefined') return [];
  const saved = localStorage.getItem(getConvKey(uid));
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

function saveLocalConversations(uid: string, convs: AIConversation[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(getConvKey(uid), JSON.stringify(convs));
}

function getLocalMessages(uid: string, convId: string): ChatMessage[] {
  if (typeof localStorage === 'undefined') return [];
  const saved = localStorage.getItem(getMsgKey(uid, convId));
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

function saveLocalMessages(uid: string, convId: string, msgs: ChatMessage[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(getMsgKey(uid, convId), JSON.stringify(msgs));
}

export async function fetchConversations(): Promise<AIConversation[]> {
  const user = getCurrentUserProfile();
  if (!user) return [];

  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'users', user.uid, 'aiConversations'),
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const list: AIConversation[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as AIConversation);
      });
      return list;
    } catch (err) {
      console.warn('Firestore fetch conversations failed, returning local cache:', err);
      return getLocalConversations(user.uid);
    }
  }

  return getLocalConversations(user.uid);
}

export async function createConversation(title: string): Promise<AIConversation> {
  const user = getCurrentUserProfile();
  const uid = user ? user.uid : 'guest';
  const now = new Date().toISOString();
  const convId = `conv-${Date.now()}`;

  const newConv: AIConversation = {
    id: convId,
    userId: uid,
    title: title.slice(0, 45) || 'Cuộc trò chuyện mới',
    createdAt: now,
    updatedAt: now,
    lastMessagePreview: title,
  };

  if (isFirebaseConfigured && db && user) {
    try {
      const docRef = doc(db, 'users', user.uid, 'aiConversations', convId);
      await setDoc(docRef, newConv);
      return newConv;
    } catch (err) {
      console.warn('Firestore create conversation failed, saving locally:', err);
    }
  }

  const current = getLocalConversations(uid);
  const updated = [newConv, ...current];
  saveLocalConversations(uid, updated);
  return newConv;
}

export async function updateConversation(
  convId: string,
  data: Partial<Pick<AIConversation, 'title' | 'lastMessagePreview' | 'updatedAt'>>
): Promise<void> {
  const user = getCurrentUserProfile();
  const uid = user ? user.uid : 'guest';
  const now = new Date().toISOString();
  const patch = { ...data, updatedAt: now };

  if (isFirebaseConfigured && db && user) {
    try {
      const docRef = doc(db, 'users', user.uid, 'aiConversations', convId);
      await setDoc(docRef, patch, { merge: true });
    } catch (err) {
      console.warn('Firestore update conversation failed, updating locally:', err);
    }
  }

  const current = getLocalConversations(uid);
  const idx = current.findIndex((c) => c.id === convId);
  if (idx !== -1) {
    current[idx] = { ...current[idx], ...patch };
    saveLocalConversations(uid, current);
  }
}

export async function deleteConversation(convId: string): Promise<void> {
  const user = getCurrentUserProfile();
  const uid = user ? user.uid : 'guest';

  if (isFirebaseConfigured && db && user) {
    try {
      // Delete subcollection messages first
      const msgsRef = collection(db, 'users', user.uid, 'aiConversations', convId, 'messages');
      const snapshot = await getDocs(msgsRef);
      const deletePromises = snapshot.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(deletePromises);

      // Delete parent conversation doc
      const docRef = doc(db, 'users', user.uid, 'aiConversations', convId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore delete conversation failed, deleting locally:', err);
    }
  }

  const current = getLocalConversations(uid);
  const filtered = current.filter((c) => c.id !== convId);
  saveLocalConversations(uid, filtered);
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(getMsgKey(uid, convId));
  }
}

export async function fetchConversationMessages(convId: string): Promise<ChatMessage[]> {
  const user = getCurrentUserProfile();
  const uid = user ? user.uid : 'guest';

  if (isFirebaseConfigured && db && user) {
    try {
      const q = query(
        collection(db, 'users', user.uid, 'aiConversations', convId, 'messages'),
        orderBy('createdAt', 'asc')
      );
      const snapshot = await getDocs(q);
      const list: ChatMessage[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, conversationId: convId, ...d.data() } as ChatMessage);
      });
      return list;
    } catch (err) {
      console.warn('Firestore fetch messages failed, returning local cache:', err);
      return getLocalMessages(uid, convId);
    }
  }

  return getLocalMessages(uid, convId);
}

export async function saveConversationMessage(
  convId: string,
  message: ChatMessage
): Promise<void> {
  const user = getCurrentUserProfile();
  const uid = user ? user.uid : 'guest';
  const now = new Date().toISOString();

  const msgData = {
    ...message,
    conversationId: convId,
    createdAt: message.createdAt || now,
  };

  if (isFirebaseConfigured && db && user) {
    try {
      const docRef = doc(db, 'users', user.uid, 'aiConversations', convId, 'messages', message.id);
      await setDoc(docRef, msgData);

      // Update parent conversation preview & timestamp
      await updateConversation(convId, {
        lastMessagePreview: message.content.slice(0, 60),
        updatedAt: now,
      });
    } catch (err) {
      console.warn('Firestore save message failed, saving locally:', err);
    }
  }

  const currentMsgs = getLocalMessages(uid, convId);
  const exists = currentMsgs.some((m) => m.id === message.id);
  const updatedMsgs = exists
    ? currentMsgs.map((m) => (m.id === message.id ? msgData : m))
    : [...currentMsgs, msgData];

  saveLocalMessages(uid, convId, updatedMsgs);
  updateConversation(convId, {
    lastMessagePreview: message.content.slice(0, 60),
    updatedAt: now,
  });
}
