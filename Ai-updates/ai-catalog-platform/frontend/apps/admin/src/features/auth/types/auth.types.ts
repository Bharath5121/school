export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'PARENT' | 'TEACHER' | 'ADMIN';
  gradeLevel?: string;
  parentEmail?: string;
  onboardingCompleted?: boolean;
  profile?: {
    onboardingCompleted: boolean;
    gradeLevel?: string;
  };
}

export interface Session {
  id: string;
  userId: string;
  ipAddress?: string;
}
