export interface OnboardingData {
  role: 'STUDENT' | 'PARENT' | 'TEACHER';
  gradeLevel?: string;
  stream?: string;
  interests: string[];
  learningStyle: {
    dailyTime: string;
    contentPreference: string[];
    emailDigest: boolean;
  };
  parentEmail?: string;
}

export interface OnboardingStepProps {
  data: OnboardingData;
  update: (data: Partial<OnboardingData>) => void;
}
