export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  name: string;
  role?: string;
  gradeLevel?: string;
  childName?: string;
  childEmail?: string;
}

export interface AuthResponseDto {
  user: any;
  accessToken: string;
}
