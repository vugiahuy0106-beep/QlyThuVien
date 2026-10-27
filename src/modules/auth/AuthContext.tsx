import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserProfile, UserRole, StoredCredentialAccount } from './types';
import { authService, DEFAULT_ACCOUNTS } from './authService';
import { testConnection } from '../../core/firebase/config';

interface AuthContextValue {
  user: UserProfile | null;
  role: UserRole;
  isLoading: boolean;
  isFirebaseConnected: boolean;
  isAccountSettingsOpen: boolean;
  setIsAccountSettingsOpen: (open: boolean) => void;
  loginWithCredentials: (username: string, password: string, role?: UserRole) => Promise<UserProfile>;
  registerAccount: (account: StoredCredentialAccount) => void;
  getAllAccounts: () => StoredCredentialAccount[];
  signInWithGoogle: (role?: UserRole) => Promise<void>;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: { displayName?: string; photoURL?: string | null; email?: string }) => Promise<UserProfile>;
  changePassword: (currentPass: string, newPass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    testConnection().then((connected) => {
      setIsFirebaseConnected(connected);
    });

    const unsubscribe = authService.subscribeAuthState((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithCredentials = async (
    username: string,
    password: string,
    preferredRole?: UserRole
  ): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const profile = await authService.loginWithCredentials(username, password, preferredRole);
      setUser(profile);
      return profile;
    } finally {
      setIsLoading(false);
    }
  };

  const registerAccount = (account: StoredCredentialAccount) => {
    authService.registerAccount(account);
  };

  const getAllAccounts = () => {
    return authService.getAllAccounts();
  };

  const signInWithGoogle = async (role: UserRole = 'librarian') => {
    setIsLoading(true);
    try {
      const profile = await authService.signInWithGoogle(role);
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = (newRole: UserRole) => {
    authService.setSessionRole(newRole);
    if (user) {
      const isStudent = newRole === 'student';
      const isGuest = newRole === 'guest';
      const updatedProfile: UserProfile = {
        ...user,
        role: newRole,
        displayName: isStudent
          ? 'Vũ Gia Huy (Sinh viên)'
          : isGuest
          ? 'Độc giả Khách (Tham quan)'
          : 'Thầy Hoàng Nam (Thủ thư Trưởng)',
        email: isStudent
          ? 'huy.vu@example.com'
          : isGuest
          ? 'guest@libmodular.edu.vn'
          : 'librarian.admin@libmodular.edu.vn',
        studentReaderCode: isStudent ? 'DG-2001' : undefined,
        studentReaderName: isStudent ? 'Vũ Gia Huy' : undefined,
        studentReaderEmail: isStudent ? 'huy.vu@example.com' : undefined,
      };
      localStorage.setItem('libmodular_active_profile', JSON.stringify(updatedProfile));
      setUser(updatedProfile);
    }
  };

  const updateProfile = async (updates: { displayName?: string; photoURL?: string | null; email?: string }): Promise<UserProfile> => {
    const updated = await authService.updateUserProfile(updates);
    setUser(updated);
    return updated;
  };

  const changePassword = async (currentPass: string, newPass: string): Promise<void> => {
    await authService.changePassword(currentPass, newPass);
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'librarian',
        isLoading,
        isFirebaseConnected,
        isAccountSettingsOpen,
        setIsAccountSettingsOpen,
        loginWithCredentials,
        registerAccount,
        getAllAccounts,
        signInWithGoogle,
        switchRole,
        updateProfile,
        changePassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
