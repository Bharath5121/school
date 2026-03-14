import { User } from '../types/auth.types';

export class AuthUserModel {
  /**
   * Translates incoming raw backend user data into safe frontend Model instances.
   */
  static fromResponse(data: any): User {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role || 'STUDENT',
      gradeLevel: data.gradeLevel || data.profile?.gradeLevel,
      parentEmail: data.parentEmail || data.profile?.parentEmail,
      onboardingCompleted: data.onboardingCompleted ?? data.profile?.onboardingCompleted ?? false,
      profile: data.profile
    };
  }
}
