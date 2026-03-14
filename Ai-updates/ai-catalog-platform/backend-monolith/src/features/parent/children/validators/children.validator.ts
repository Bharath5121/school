import { z } from 'zod';

export const linkChildSchema = z.object({
  body: z.object({
    childName: z.string().min(2, 'Child name must be at least 2 characters').max(100),
    childEmail: z.string().email('Invalid child email address'),
  }).strict(),
});
