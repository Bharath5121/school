export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  emailVerified?: string;
  createdAt: string;
  updatedAt: string;
  profile?: {
    gradeLevel?: string;
    onboardingCompleted: boolean;
  };
}
