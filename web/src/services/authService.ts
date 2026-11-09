import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { UserProfile } from '../types/auth';

const LOCAL_USER_KEY = 'moneycare_current_user';

export async function loginUser(email: string, pass: string): Promise<UserProfile> {
  if (isFirebaseConfigured && auth) {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    let displayName = res.user.displayName || email.split('@')[0];

    // Fetch profile from Firestore if available
    if (db) {
      try {
        const userDoc = await getDoc(doc(db, 'users', res.user.uid));
        if (userDoc.exists()) {
          displayName = userDoc.data().displayName || displayName;
        }
      } catch (err) {
        console.warn('Could not fetch user doc:', err);
      }
    }

    const profile: UserProfile = {
      uid: res.user.uid,
      displayName,
      email: res.user.email || email,
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    return profile;
  } else {
    // Local storage authentication fallback
    const profile: UserProfile = {
      uid: `local-user-${email.replace(/[^a-zA-Z0-9]/g, '')}`,
      displayName: email.split('@')[0] || 'Minh Hùng',
      email,
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    return profile;
  }
}

export async function registerUser(
  displayName: string,
  email: string,
  pass: string
): Promise<UserProfile> {
  if (isFirebaseConfigured && auth) {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(res.user, { displayName });

    const profile: UserProfile = {
      uid: res.user.uid,
      displayName,
      email: res.user.email || email,
      createdAt: new Date().toISOString(),
    };

    if (db) {
      try {
        await setDoc(doc(db, 'users', res.user.uid), profile);
      } catch (err) {
        console.warn('Could not save user profile to Firestore:', err);
      }
    }

    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    return profile;
  } else {
    const profile: UserProfile = {
      uid: `local-user-${Date.now()}`,
      displayName: displayName || 'Minh Hùng',
      email,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    return profile;
  }
}

export async function logoutUser(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await firebaseSignOut(auth);
  }
  localStorage.removeItem(LOCAL_USER_KEY);
}

export async function sendPasswordReset(email: string): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await firebaseSendPasswordResetEmail(auth, email);
  }
}

export function getCurrentUserProfile(): UserProfile | null {
  const saved = localStorage.getItem(LOCAL_USER_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}

export function subscribeToAuthChanges(callback: (user: UserProfile | null) => void): () => void {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'Minh Hùng',
          email: firebaseUser.email || '',
        };
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        callback(profile);
      } else {
        localStorage.removeItem(LOCAL_USER_KEY);
        callback(null);
      }
    });
  } else {
    const currentUser = getCurrentUserProfile();
    callback(currentUser);
    return () => {};
  }
}
