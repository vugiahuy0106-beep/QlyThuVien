export type UserRole = 'librarian' | 'student' | 'guest';

export interface UserProfile {
  uid: string;
  username?: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  role: UserRole;
  studentReaderCode?: string;
  studentReaderName?: string;
  studentReaderEmail?: string;
}

export interface StoredCredentialAccount {
  username: string;
  password: string;
  displayName: string;
  role: UserRole;
  email: string;
  studentReaderCode?: string;
}
