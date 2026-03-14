import { z } from 'zod';

const AllowedRegistrationRole = z.enum(['STUDENT', 'PARENT', 'TEACHER']);

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters long')
      .max(128)
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    role: AllowedRegistrationRole.optional(),
    gradeLevel: z.string().max(20).optional(),
    parentEmail: z.string().email().optional(),
    childName: z.string().min(2).max(100).optional(),
    childEmail: z.string().email('Invalid child email address').optional(),
  }).strict().refine(
    (data) => {
      if (data.role === 'PARENT') return !!data.childEmail;
      return true;
    },
    { message: "Child's email is required for parent registration", path: ['childEmail'] }
  )
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }).strict()
});

export const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh token required in cookies' }),
  })
});
