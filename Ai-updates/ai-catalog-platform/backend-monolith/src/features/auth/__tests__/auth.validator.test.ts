import { registerSchema, loginSchema } from '../validators/auth.validator';

describe('Auth Validators', () => {
  // ── registerSchema ──────────────────────────────────────────────────────────

  describe('registerSchema', () => {
    const validBody = {
      email: 'student@example.com',
      password: 'StrongPass1',
      name: 'John Doe',
    };

    it('passes with all required fields', () => {
      const result = registerSchema.safeParse({ body: validBody });
      expect(result.success).toBe(true);
    });

    it('passes with optional role STUDENT', () => {
      const result = registerSchema.safeParse({ body: { ...validBody, role: 'STUDENT' } });
      expect(result.success).toBe(true);
    });

    it('passes with optional role PARENT', () => {
      const result = registerSchema.safeParse({ body: { ...validBody, role: 'PARENT' } });
      expect(result.success).toBe(true);
    });

    it('passes with optional role TEACHER', () => {
      const result = registerSchema.safeParse({ body: { ...validBody, role: 'TEACHER' } });
      expect(result.success).toBe(true);
    });

    it('rejects ADMIN role during registration', () => {
      const result = registerSchema.safeParse({ body: { ...validBody, role: 'ADMIN' } });
      expect(result.success).toBe(false);
    });

    it('passes with optional gradeLevel and parentEmail', () => {
      const result = registerSchema.safeParse({
        body: {
          ...validBody,
          gradeLevel: '10th',
          parentEmail: 'parent@example.com',
        },
      });
      expect(result.success).toBe(true);
    });

    // Email validation
    it('fails with invalid email', () => {
      const result = registerSchema.safeParse({ body: { ...validBody, email: 'not-an-email' } });
      expect(result.success).toBe(false);
    });

    it('fails with empty email', () => {
      const result = registerSchema.safeParse({ body: { ...validBody, email: '' } });
      expect(result.success).toBe(false);
    });

    // Password validation
    it('fails when password is shorter than 8 characters', () => {
      const result = registerSchema.safeParse({ body: { ...validBody, password: 'Ab1' } });
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = result.error.issues.map(i => i.message);
        expect(messages).toContain('Password must be at least 8 characters long');
      }
    });

    it('fails when password has no uppercase letter', () => {
      const result = registerSchema.safeParse({ body: { ...validBody, password: 'nouppercase1' } });
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = result.error.issues.map(i => i.message);
        expect(messages).toContain('Password must contain at least one uppercase letter');
      }
    });

    it('fails when password has no lowercase letter', () => {
      const result = registerSchema.safeParse({ body: { ...validBody, password: 'NOLOWERCASE1' } });
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = result.error.issues.map(i => i.message);
        expect(messages).toContain('Password must contain at least one lowercase letter');
      }
    });

    it('fails when password has no number', () => {
      const result = registerSchema.safeParse({ body: { ...validBody, password: 'NoNumberHere' } });
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = result.error.issues.map(i => i.message);
        expect(messages).toContain('Password must contain at least one number');
      }
    });

    // Name validation
    it('fails when name is missing', () => {
      const { name, ...noName } = validBody;
      const result = registerSchema.safeParse({ body: noName });
      expect(result.success).toBe(false);
    });

    it('fails when name is too short', () => {
      const result = registerSchema.safeParse({ body: { ...validBody, name: 'A' } });
      expect(result.success).toBe(false);
    });

    it('fails when name exceeds 100 characters', () => {
      const result = registerSchema.safeParse({ body: { ...validBody, name: 'x'.repeat(101) } });
      expect(result.success).toBe(false);
    });

    // Strict mode
    it('rejects unknown fields', () => {
      const result = registerSchema.safeParse({ body: { ...validBody, hackField: true } });
      expect(result.success).toBe(false);
    });

    it('fails when parentEmail is not a valid email', () => {
      const result = registerSchema.safeParse({
        body: { ...validBody, parentEmail: 'bad-email' },
      });
      expect(result.success).toBe(false);
    });
  });

  // ── loginSchema ─────────────────────────────────────────────────────────────

  describe('loginSchema', () => {
    const validLogin = {
      email: 'user@example.com',
      password: 'password123',
    };

    it('passes with valid credentials', () => {
      const result = loginSchema.safeParse({ body: validLogin });
      expect(result.success).toBe(true);
    });

    it('fails with invalid email', () => {
      const result = loginSchema.safeParse({ body: { ...validLogin, email: 'invalid' } });
      expect(result.success).toBe(false);
    });

    it('fails with empty password', () => {
      const result = loginSchema.safeParse({ body: { ...validLogin, password: '' } });
      expect(result.success).toBe(false);
    });

    it('fails when email is missing', () => {
      const result = loginSchema.safeParse({ body: { password: 'abc' } });
      expect(result.success).toBe(false);
    });

    it('fails when password is missing', () => {
      const result = loginSchema.safeParse({ body: { email: 'user@example.com' } });
      expect(result.success).toBe(false);
    });

    it('rejects unknown fields', () => {
      const result = loginSchema.safeParse({ body: { ...validLogin, extra: 'field' } });
      expect(result.success).toBe(false);
    });
  });
});
