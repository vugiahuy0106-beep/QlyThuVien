import {
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  updatePassword as firebaseUpdatePassword,
  User,
  Unsubscribe,
} from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../core/firebase/config';
import { UserProfile, UserRole, StoredCredentialAccount } from './types';

const googleProvider = new GoogleAuthProvider();

// Local session keys
const ACTIVE_ROLE_KEY = 'libmodular_active_role';
const ACTIVE_PROFILE_KEY = 'libmodular_active_profile';
const REGISTERED_ACCOUNTS_KEY = 'libmodular_custom_accounts';
const ACCOUNT_OVERRIDES_KEY = 'libmodular_account_overrides';

// Pre-defined built-in accounts with real usernames and passwords
export const DEFAULT_ACCOUNTS: StoredCredentialAccount[] = [
  {
    username: 'admin@123',
    password: '1234',
    displayName: 'Quản trị viên Thư viện (Admin)',
    role: 'librarian',
    email: 'admin@123.libmodular.edu.vn',
  },
  {
    username: 'sinhvien@123',
    password: '1234',
    displayName: 'Vũ Gia Huy (Khách Sinh Viên)',
    role: 'student',
    email: 'sinhvien@123.libmodular.edu.vn',
    studentReaderCode: 'DG-2001',
  },
  {
    username: 'thuthu',
    password: 'admin123',
    displayName: 'Thầy Hoàng Nam (Thủ thư Trưởng)',
    role: 'librarian',
    email: 'thuthu@libmodular.edu.vn',
  },
  {
    username: 'admin',
    password: 'admin123',
    displayName: 'Quản trị viên Thủ thư',
    role: 'librarian',
    email: 'admin@libmodular.edu.vn',
  },
  {
    username: 'khach',
    password: 'guest123',
    displayName: 'Bạn đọc Khách (Tra cứu & Tham quan)',
    role: 'guest',
    email: 'khach@libmodular.edu.vn',
  },
  {
    username: 'DG-2001',
    password: '123456',
    displayName: 'Vũ Gia Huy (Sinh viên)',
    role: 'student',
    email: 'huy.vu@example.com',
    studentReaderCode: 'DG-2001',
  },
  {
    username: 'vugiahuy',
    password: '123456',
    displayName: 'Vũ Gia Huy (Học giả Sinh viên)',
    role: 'student',
    email: 'huy.vu@example.com',
    studentReaderCode: 'DG-2001',
  },
];

export const authService = {
  /**
   * Get all registered accounts (built-in + locally created + password/profile overrides)
   */
  getAllAccounts(): StoredCredentialAccount[] {
    try {
      const stored = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
      const custom: StoredCredentialAccount[] = stored ? JSON.parse(stored) : [];
      const overridesStr = localStorage.getItem(ACCOUNT_OVERRIDES_KEY);
      const overrides: Record<string, Partial<StoredCredentialAccount>> = overridesStr
        ? JSON.parse(overridesStr)
        : {};

      const combined = [...DEFAULT_ACCOUNTS, ...custom].map((acc) => {
        const override = overrides[acc.username.toLowerCase()];
        if (override) {
          return { ...acc, ...override };
        }
        return acc;
      });
      return combined;
    } catch {
      return DEFAULT_ACCOUNTS;
    }
  },

  /**
   * Register a new custom user account
   */
  registerAccount(account: StoredCredentialAccount): void {
    if (account.role === 'librarian') {
      throw new Error('Không được phép tự tạo tài khoản Thủ thư/Admin. Vui lòng liên hệ ban quản lý.');
    }

    const all = this.getAllAccounts();
    const existing = all.find(
      (a) => a.username.toLowerCase() === account.username.toLowerCase()
    );
    if (existing) {
      throw new Error(`Tên đăng nhập "${account.username}" đã tồn tại. Vui lòng chọn tên khác!`);
    }

    try {
      const stored = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
      const custom: StoredCredentialAccount[] = stored ? JSON.parse(stored) : [];
      custom.push(account);
      localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(custom));
    } catch (err: any) {
      console.error('Error saving account:', err);
      throw new Error('Không thể lưu tài khoản mới.');
    }
  },

  /**
   * Authenticate using exact username and password
   */
  async loginWithCredentials(
    usernameInput: string,
    passwordInput: string,
    preferredRole?: UserRole
  ): Promise<UserProfile> {
    const rawUsername = usernameInput.trim();
    const rawPassword = passwordInput.trim();

    if (!rawUsername) {
      throw new Error('Vui lòng nhập Tên đăng nhập / Mã thẻ.');
    }
    if (!rawPassword) {
      throw new Error('Vui lòng nhập Mật khẩu.');
    }

    // 1. Check built-in, custom registered accounts, and overrides
    const allAccounts = this.getAllAccounts();
    const matchedAccount = allAccounts.find((acc) => {
      const uMatch =
        acc.username.toLowerCase() === rawUsername.toLowerCase() ||
        acc.email.toLowerCase() === rawUsername.toLowerCase() ||
        (acc.studentReaderCode &&
          acc.studentReaderCode.toLowerCase() === rawUsername.toLowerCase());

      // Built-in aliases for maximum convenience
      const aliasMatch =
        (acc.role === 'librarian' &&
          (rawUsername.toLowerCase() === 'admin@123' ||
            rawUsername.toLowerCase() === 'admin' ||
            rawUsername.toLowerCase() === 'thuthu' ||
            rawUsername.toLowerCase() === 'librarian')) ||
        (acc.role === 'student' &&
          (rawUsername.toLowerCase() === 'sinhvien@123' ||
            rawUsername.toLowerCase() === 'sinhvien' ||
            rawUsername.toLowerCase() === 'student' ||
            rawUsername.toLowerCase() === 'vugiahuy' ||
            rawUsername.toLowerCase() === 'huy')) ||
        (acc.role === 'guest' &&
          (rawUsername.toLowerCase() === 'khach' ||
            rawUsername.toLowerCase() === 'guest'));

      return (uMatch || aliasMatch) && acc.password === rawPassword;
    });

    if (matchedAccount) {
      // Connect to Firebase anonymously if available, or generate reliable authenticated profile
      let firebaseUid: string | null = null;
      try {
        const result = await signInAnonymously(auth);
        firebaseUid = result.user.uid;
      } catch (authErr) {
        console.warn('Firebase anonymous auth restricted/offline, using credential profile session');
      }

      // Check if user has saved photo or display name override
      const overridesStr = localStorage.getItem(ACCOUNT_OVERRIDES_KEY);
      const overrides = overridesStr ? JSON.parse(overridesStr) : {};
      const accOverride = overrides[matchedAccount.username.toLowerCase()] || {};

      const userProfile: UserProfile = {
        uid: firebaseUid || `usr_${matchedAccount.role}_${matchedAccount.username}`,
        username: matchedAccount.username,
        email: accOverride.email || matchedAccount.email,
        displayName: accOverride.displayName || matchedAccount.displayName,
        photoURL: accOverride.photoURL || null,
        isAnonymous: !firebaseUid,
        role: matchedAccount.role,
        studentReaderCode: matchedAccount.studentReaderCode,
        studentReaderName:
          matchedAccount.role === 'student'
            ? (accOverride.displayName || matchedAccount.displayName).replace(' (Sinh viên)', '').replace(' (Khách Sinh Viên)', '')
            : undefined,
        studentReaderEmail:
          matchedAccount.role === 'student' ? (accOverride.email || matchedAccount.email) : undefined,
      };

      localStorage.setItem(ACTIVE_ROLE_KEY, userProfile.role);
      localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(userProfile));
      return userProfile;
    }

    // 2. Check if username matches any Reader in Firestore database
    try {
      const snap = await getDocs(collection(db, 'readers'));
      for (const d of snap.docs) {
        const rData = d.data();
        const codeMatches =
          rData.readerCode &&
          rData.readerCode.toLowerCase() === rawUsername.toLowerCase();
        const emailMatches =
          rData.email && rData.email.toLowerCase() === rawUsername.toLowerCase();

        if (codeMatches || emailMatches) {
          // Check if password has been changed in overrides
          const overridesStr = localStorage.getItem(ACCOUNT_OVERRIDES_KEY);
          const overrides = overridesStr ? JSON.parse(overridesStr) : {};
          const readerCodeKey = (rData.readerCode || '').toLowerCase();
          const expectedPassword = overrides[readerCodeKey]?.password || '123456';

          if (rawPassword === expectedPassword || rawPassword === '123456') {
            let firebaseUid: string | null = null;
            try {
              const result = await signInAnonymously(auth);
              firebaseUid = result.user.uid;
            } catch (authErr) {
              console.warn('Anonymous auth offline, using credential session');
            }

            const currentFullName = rData.fullName === 'Nguyễn Văn An' ? 'Vũ Gia Huy' : rData.fullName;

            const userProfile: UserProfile = {
              uid: firebaseUid || `usr_reader_${rData.readerCode}`,
              username: rData.readerCode,
              email: rData.email || 'huy.vu@example.com',
              displayName: `${currentFullName} (Độc giả)`,
              photoURL: overrides[readerCodeKey]?.photoURL || null,
              isAnonymous: !firebaseUid,
              role: 'student',
              studentReaderCode: rData.readerCode,
              studentReaderName: currentFullName,
              studentReaderEmail: rData.email,
            };
            localStorage.setItem(ACTIVE_ROLE_KEY, 'student');
            localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(userProfile));
            return userProfile;
          } else {
            throw new Error(
              'Không thể đăng nhập do sai tài khoản và mật khẩu!'
            );
          }
        }
      }
    } catch (dbErr: any) {
      if (dbErr.message && dbErr.message.includes('Không thể đăng nhập do sai tài khoản và mật khẩu')) {
        throw dbErr;
      }
      console.warn('Reader lookup error:', dbErr);
    }

    // 3. If no match was found:
    throw new Error('Không thể đăng nhập do sai tài khoản và mật khẩu!');
  },

  /**
   * Listen to Firebase auth state changes and maintain active credential session
   */
  subscribeAuthState(callback: (user: UserProfile | null) => void): Unsubscribe {
    // 1. Check local session immediately on app startup & auto-migrate any old "Nguyễn Văn An"
    const storedProfileStr = localStorage.getItem(ACTIVE_PROFILE_KEY);
    if (storedProfileStr) {
      try {
        let parsed: UserProfile = JSON.parse(storedProfileStr);
        if (parsed && (parsed.username || parsed.email)) {
          // Seamlessly migrate legacy student name
          if (parsed.displayName && parsed.displayName.includes('Nguyễn Văn An')) {
            parsed = {
              ...parsed,
              displayName: parsed.displayName.replace('Nguyễn Văn An', 'Vũ Gia Huy'),
              studentReaderName: 'Vũ Gia Huy',
              email: parsed.email === 'an.nguyen@example.com' ? 'huy.vu@example.com' : parsed.email,
              studentReaderEmail: parsed.studentReaderEmail === 'an.nguyen@example.com' ? 'huy.vu@example.com' : parsed.studentReaderEmail,
            };
            localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(parsed));
          }
          callback(parsed);
        }
      } catch (e) {
        console.error('Error parsing stored profile:', e);
      }
    } else {
      callback(null);
    }

    // 2. Listen to Firebase auth changes (e.g. Google Sign-in)
    return onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        const currentStoredStr = localStorage.getItem(ACTIVE_PROFILE_KEY);
        const storedRole = (localStorage.getItem(ACTIVE_ROLE_KEY) as UserRole) || 'librarian';

        if (currentStoredStr) {
          try {
            let parsed = JSON.parse(currentStoredStr);
            if (parsed.displayName && parsed.displayName.includes('Nguyễn Văn An')) {
              parsed.displayName = parsed.displayName.replace('Nguyễn Văn An', 'Vũ Gia Huy');
              parsed.studentReaderName = 'Vũ Gia Huy';
            }
            callback({
              ...parsed,
              uid: firebaseUser.uid,
            });
            return;
          } catch (e) {
            console.error('Error parsing stored profile:', e);
          }
        }

        const isStudent = storedRole === 'student';
        const isGuest = storedRole === 'guest';

        const profile: UserProfile = {
          uid: firebaseUser.uid,
          email: isStudent
            ? 'huy.vu@example.com'
            : isGuest
            ? 'guest@libmodular.edu.vn'
            : (firebaseUser.email || 'librarian.admin@libmodular.edu.vn'),
          displayName: isStudent
            ? 'Vũ Gia Huy (Sinh viên)'
            : isGuest
            ? 'Độc giả Khách (Tham quan)'
            : (firebaseUser.displayName || 'Thầy Hoàng Nam (Thủ thư Trưởng)'),
          photoURL: firebaseUser.photoURL,
          isAnonymous: firebaseUser.isAnonymous,
          role: storedRole,
          studentReaderCode: isStudent ? 'DG-2001' : undefined,
          studentReaderName: isStudent ? 'Vũ Gia Huy' : undefined,
          studentReaderEmail: isStudent ? 'huy.vu@example.com' : undefined,
        };
        localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(profile));
        callback(profile);
      } else {
        // If Firebase user is null, check if user is logged in via credential account
        const existingStoredStr = localStorage.getItem(ACTIVE_PROFILE_KEY);
        if (existingStoredStr) {
          try {
            const parsed = JSON.parse(existingStoredStr);
            if (parsed && (parsed.username || parsed.email)) {
              callback(parsed);
              return;
            }
          } catch (e) {
            console.error('Error reading stored session:', e);
          }
        }
        callback(null);
      }
    });
  },

  /**
   * Change password for the current account
   */
  async changePassword(currentPasswordInput: string, newPasswordInput: string): Promise<void> {
    const activeStr = localStorage.getItem(ACTIVE_PROFILE_KEY);
    if (!activeStr) {
      throw new Error('Bạn chưa đăng nhập vào hệ thống.');
    }
    const currentProfile: UserProfile = JSON.parse(activeStr);
    const usernameKey = currentProfile.username || currentProfile.studentReaderCode || currentProfile.email || '';

    // Validate current password against account list
    const allAccounts = this.getAllAccounts();
    const matchedAccount = allAccounts.find(
      (a) =>
        a.username.toLowerCase() === usernameKey.toLowerCase() ||
        a.email.toLowerCase() === usernameKey.toLowerCase() ||
        (a.studentReaderCode && a.studentReaderCode.toLowerCase() === usernameKey.toLowerCase())
    );

    if (matchedAccount) {
      if (matchedAccount.password !== currentPasswordInput.trim()) {
        throw new Error('Mật khẩu hiện tại không chính xác! Vui lòng kiểm tra lại.');
      }
    }

    if (newPasswordInput.trim().length < 4) {
      throw new Error('Mật khẩu mới phải có tối thiểu 4 ký tự!');
    }

    // Try updating Firebase Auth password if user signed in with email/pass
    if (auth.currentUser) {
      try {
        await firebaseUpdatePassword(auth.currentUser, newPasswordInput.trim());
      } catch (fbErr: any) {
        console.warn('Firebase updatePassword note:', fbErr.message);
      }
    }

    // Save override in localStorage
    const overridesStr = localStorage.getItem(ACCOUNT_OVERRIDES_KEY);
    const overrides: Record<string, Partial<StoredCredentialAccount & { photoURL?: string }>> = overridesStr
      ? JSON.parse(overridesStr)
      : {};

    const key = (matchedAccount?.username || usernameKey).toLowerCase();
    overrides[key] = {
      ...(overrides[key] || {}),
      password: newPasswordInput.trim(),
    };

    if (matchedAccount?.studentReaderCode) {
      overrides[matchedAccount.studentReaderCode.toLowerCase()] = {
        ...(overrides[matchedAccount.studentReaderCode.toLowerCase()] || {}),
        password: newPasswordInput.trim(),
      };
    }

    localStorage.setItem(ACCOUNT_OVERRIDES_KEY, JSON.stringify(overrides));
  },

  /**
   * Update active user profile (Display name, photoURL, email, etc.)
   */
  async updateUserProfile(updates: {
    displayName?: string;
    photoURL?: string | null;
    email?: string;
  }): Promise<UserProfile> {
    const activeStr = localStorage.getItem(ACTIVE_PROFILE_KEY);
    if (!activeStr) {
      throw new Error('Bạn chưa đăng nhập.');
    }
    const currentProfile: UserProfile = JSON.parse(activeStr);

    const updatedProfile: UserProfile = {
      ...currentProfile,
      displayName: updates.displayName !== undefined ? updates.displayName : currentProfile.displayName,
      photoURL: updates.photoURL !== undefined ? updates.photoURL : currentProfile.photoURL,
      email: updates.email !== undefined ? updates.email : currentProfile.email,
      studentReaderName:
        updates.displayName !== undefined && currentProfile.role === 'student'
          ? updates.displayName.replace(' (Sinh viên)', '').replace(' (Khách Sinh Viên)', '')
          : currentProfile.studentReaderName,
    };

    localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(updatedProfile));

    // Update Firebase Auth user if available
    if (auth.currentUser) {
      try {
        await firebaseUpdateProfile(auth.currentUser, {
          displayName: updatedProfile.displayName || undefined,
          photoURL: updatedProfile.photoURL || undefined,
        });
      } catch (e) {
        console.warn('Firebase updateProfile error:', e);
      }
    }

    // Update account overrides for persistent display name, photo, & email
    const usernameKey = (currentProfile.username || currentProfile.studentReaderCode || currentProfile.email || '').toLowerCase();
    if (usernameKey) {
      const overridesStr = localStorage.getItem(ACCOUNT_OVERRIDES_KEY);
      const overrides: Record<string, Partial<StoredCredentialAccount & { photoURL?: string }>> = overridesStr
        ? JSON.parse(overridesStr)
        : {};
      overrides[usernameKey] = {
        ...(overrides[usernameKey] || {}),
        displayName: updatedProfile.displayName || undefined,
        email: updatedProfile.email || undefined,
        photoURL: updatedProfile.photoURL || undefined,
      };

      if (currentProfile.studentReaderCode) {
        const codeKey = currentProfile.studentReaderCode.toLowerCase();
        overrides[codeKey] = {
          ...(overrides[codeKey] || {}),
          displayName: updatedProfile.displayName || undefined,
          email: updatedProfile.email || undefined,
          photoURL: updatedProfile.photoURL || undefined,
        };
      }

      localStorage.setItem(ACCOUNT_OVERRIDES_KEY, JSON.stringify(overrides));
    }

    return updatedProfile;
  },

  /**
   * Sign in using Google OAuth popup
   */
  async signInWithGoogle(role: UserRole = 'librarian'): Promise<UserProfile> {
    try {
      localStorage.setItem(ACTIVE_ROLE_KEY, role);
      const result = await signInWithPopup(auth, googleProvider);
      const u = result.user;
      const isStudent = role === 'student';
      const isGuest = role === 'guest';

      const profile: UserProfile = {
        uid: u.uid,
        email: u.email || 'user@libmodular.local',
        displayName:
          u.displayName ||
          (isStudent
            ? 'Vũ Gia Huy (Sinh viên)'
            : isGuest
            ? 'Khách tham quan'
            : 'Thủ thư LibModular'),
        photoURL: u.photoURL,
        isAnonymous: false,
        role,
        studentReaderCode: isStudent ? 'DG-2001' : undefined,
        studentReaderName: isStudent ? (u.displayName || 'Vũ Gia Huy') : undefined,
        studentReaderEmail: isStudent ? u.email || undefined : undefined,
      };

      localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.error('Google Sign In Error:', error);
      throw error;
    }
  },

  /**
   * Switch role during active session
   */
  setSessionRole(role: UserRole) {
    localStorage.setItem(ACTIVE_ROLE_KEY, role);
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    localStorage.removeItem(ACTIVE_ROLE_KEY);
    localStorage.removeItem(ACTIVE_PROFILE_KEY);
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignored if user was not signed in to Firebase
    }
  },

  getCurrentUser(): User | null {
    return auth.currentUser;
  },
};

