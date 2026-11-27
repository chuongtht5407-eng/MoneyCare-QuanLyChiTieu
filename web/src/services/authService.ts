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
import { mapAuthError } from '../utils/authErrors';

const LOCAL_USER_KEY = 'moneycare_current_user';

export async function loginUser(email: string, pass: string): Promise<UserProfile> {
  const trimmedEmail = email.trim();
  if (isFirebaseConfigured && auth) {
    try {
      const res = await signInWithEmailAndPassword(auth, trimmedEmail, pass);
      let displayName = res.user.displayName || trimmedEmail.split('@')[0];

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
        email: res.user.email || trimmedEmail,
      };
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
      }
      return profile;
    } catch (err: unknown) {
      throw new Error(mapAuthError(err));
    }
  } else {
    const profile: UserProfile = {
      uid: `local-user-${trimmedEmail.replace(/[^a-zA-Z0-9]/g, '')}`,
      displayName: trimmedEmail.split('@')[0] || 'Minh Hùng',
      email: trimmedEmail,
    };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    }
    return profile;
  }
}

export async function registerUser(
  displayName: string,
  email: string,
  pass: string
): Promise<UserProfile> {
  const trimmedName = displayName.trim();
  const trimmedEmail = email.trim();

  if (isFirebaseConfigured && auth) {
    try {
      const res = await createUserWithEmailAndPassword(auth, trimmedEmail, pass);
      await updateProfile(res.user, { displayName: trimmedName });

      const profile: UserProfile = {
        uid: res.user.uid,
        displayName: trimmedName,
        email: res.user.email || trimmedEmail,
        createdAt: new Date().toISOString(),
      };

      if (db) {
        try {
          await setDoc(doc(db, 'users', res.user.uid), profile);
        } catch (err) {
          console.warn('Could not save user profile to Firestore:', err);
        }
      }

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
      }
      return profile;
    } catch (err: unknown) {
      throw new Error(mapAuthError(err));
    }
  } else {
    const profile: UserProfile = {
      uid: `local-user-${Date.now()}`,
      displayName: trimmedName || 'Minh Hùng',
      email: trimmedEmail,
      createdAt: new Date().toISOString(),
    };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    }
    return profile;
  }
}

export async function logoutUser(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    try {
      await firebaseSignOut(auth);
    } catch (err: unknown) {
      console.warn('Sign out error:', err);
    }
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(LOCAL_USER_KEY);
  }
}

export async function sendPasswordReset(email: string): Promise<void> {
  const trimmedEmail = email.trim();
  if (isFirebaseConfigured && auth) {
    try {
      await firebaseSendPasswordResetEmail(auth, trimmedEmail);
    } catch (err: unknown) {
      throw new Error(mapAuthError(err));
    }
  } else {
    console.info(`[DEMO] Giả lập gửi email đặt lại mật khẩu tới: ${trimmedEmail}`);
  }
}

export async function updateUserDisplayName(newName: string): Promise<UserProfile> {
  const trimmed = newName.trim();
  const currentUser = getCurrentUserProfile();
  if (!currentUser) throw new Error('Chưa đăng nhập.');

  const updatedProfile: UserProfile = { ...currentUser, displayName: trimmed };

  if (isFirebaseConfigured && auth && auth.currentUser) {
    try {
      await updateProfile(auth.currentUser, { displayName: trimmed });
      if (db) {
        await setDoc(
          doc(db, 'users', auth.currentUser.uid),
          { displayName: trimmed },
          { merge: true }
        );
      }
    } catch (err: unknown) {
      console.warn('Could not update Firebase user profile:', err);
    }
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updatedProfile));
  }

  return updatedProfile;
}

export function getCurrentUserProfile(): UserProfile | null {
  if (typeof localStorage === 'undefined') return null;
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
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        }
        callback(profile);
      } else {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(LOCAL_USER_KEY);
        }
        callback(null);
      }
    });
  } else {
    const currentUser = getCurrentUserProfile();
    callback(currentUser);
    return () => {};
  }
}
