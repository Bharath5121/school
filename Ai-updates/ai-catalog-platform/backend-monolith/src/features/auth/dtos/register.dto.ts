import { UserRole } from '../types/auth.types';

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  gradeLevel?: string;
  parentEmail?: string;
  childName?: string;
  childEmail?: string;
}
