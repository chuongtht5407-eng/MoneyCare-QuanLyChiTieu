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

/**
 * Đăng nhập người dùng.
 * Sử dụng Firebase Authentication nếu đã cấu hình, ngược lại chạy chế độ Demo Ngoại Tuyến (Local Storage).
 */
export async function loginUser(email: string, pass: string): Promise<UserProfile> {
  if (isFirebaseConfigured && auth) {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      let displayName = res.user.displayName || email.split('@')[0];

      // Lấy thêm thông tin hồ sơ từ Firestore nếu có
      if (db) {
        try {
          const userDoc = await getDoc(doc(db, 'users', res.user.uid));
          if (userDoc.exists()) {
            displayName = userDoc.data().displayName || displayName;
          }
        } catch (err) {
          console.warn('Không thể đọc dữ liệu người dùng từ Firestore:', err);
        }
      }

      const profile: UserProfile = {
        uid: res.user.uid,
        displayName,
        email: res.user.email || email,
      };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
      return profile;
    } catch (err: unknown) {
      throw new Error(mapAuthError(err));
    }
  } else {
    // [DEMO LOCAL MODE] Chế độ demo ngoại tuyến khi chưa cấu hình Firebase
    console.info('[DEMO] Đang sử dụng chế độ xác thực ngoại tuyến (Local Storage)');
    const profile: UserProfile = {
      uid: `local-user-${email.replace(/[^a-zA-Z0-9]/g, '')}`,
      displayName: email.split('@')[0] || 'Minh Hùng',
      email,
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    return profile;
  }
}

/**
 * Đăng ký tài khoản mới.
 */
export async function registerUser(
  displayName: string,
  email: string,
  pass: string
): Promise<UserProfile> {
  const trimmedName = displayName.trim();
  if (!trimmedName) {
    throw new Error('Họ và tên không được để trống.');
  }
  if (trimmedName.length > 50) {
    throw new Error('Họ và tên không được vượt quá 50 ký tự.');
  }

  if (isFirebaseConfigured && auth) {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(res.user, { displayName: trimmedName });

      const profile: UserProfile = {
        uid: res.user.uid,
        displayName: trimmedName,
        email: res.user.email || email,
        createdAt: new Date().toISOString(),
      };

      if (db) {
        try {
          await setDoc(doc(db, 'users', res.user.uid), profile);
        } catch (err) {
          console.warn('Không thể lưu hồ sơ người dùng vào Firestore:', err);
        }
      }

      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
      return profile;
    } catch (err: unknown) {
      throw new Error(mapAuthError(err));
    }
  } else {
    // [DEMO LOCAL MODE] Chế độ demo ngoại tuyến
    console.info('[DEMO] Đang tạo tài khoản chế độ ngoại tuyến (Local Storage)');
    const profile: UserProfile = {
      uid: `local-user-${Date.now()}`,
      displayName: trimmedName || 'Minh Hùng',
      email,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    return profile;
  }
}

/**
 * Cập nhật tên hiển thị của người dùng (DisplayName).
 */
export async function updateUserDisplayName(name: string): Promise<UserProfile> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error('Họ và tên không được để trống.');
  }
  if (trimmedName.length > 50) {
    throw new Error('Họ và tên không được vượt quá 50 ký tự.');
  }

  const currentProfile = getCurrentUserProfile();
  if (!currentProfile) {
    throw new Error('Không tìm thấy phiên đăng nhập.');
  }

  const updatedProfile: UserProfile = {
    ...currentProfile,
    displayName: trimmedName,
  };

  if (isFirebaseConfigured && auth && auth.currentUser) {
    try {
      await updateProfile(auth.currentUser, { displayName: trimmedName });

      if (db) {
        await setDoc(
          doc(db, 'users', auth.currentUser.uid),
          {
            displayName: trimmedName,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch (err: unknown) {
      throw new Error(mapAuthError(err));
    }
  }

  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updatedProfile));
  return updatedProfile;
}

export async function logoutUser(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Lỗi khi đăng xuất Firebase:', err);
    }
  }
  localStorage.removeItem(LOCAL_USER_KEY);
}

export async function sendPasswordReset(email: string): Promise<void> {
  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    throw new Error('Địa chỉ email không hợp lệ.');
  }

  if (isFirebaseConfigured && auth) {
    try {
      await firebaseSendPasswordResetEmail(auth, trimmedEmail);
    } catch (err: unknown) {
      throw new Error(mapAuthError(err));
    }
  } else {
    // [DEMO LOCAL MODE] Giả lập gửi email thành công
    console.info(`[DEMO] Giả lập gửi email đặt lại mật khẩu tới: ${trimmedEmail}`);
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
