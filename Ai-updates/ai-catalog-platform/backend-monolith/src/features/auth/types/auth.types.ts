export enum UserRole {
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthContext {
  userId: string;
  role: UserRole;
}
