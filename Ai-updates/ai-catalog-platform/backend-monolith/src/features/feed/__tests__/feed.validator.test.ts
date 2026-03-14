import { createFeedSchema, queryFeedSchema, idParamSchema } from '../validators/feed.validator';

describe('Feed Validators', () => {
  // ── createFeedSchema ────────────────────────────────────────────────────────

  describe('createFeedSchema', () => {
    const validBody = {
      title: 'GPT-5 Released',
      summary: 'OpenAI releases GPT-5 with dramatically improved reasoning capabilities',
      contentType: 'MODEL',
      fieldSlug: 'ai-ml',
    };

    it('passes with all required fields', () => {
      const result = createFeedSchema.safeParse({ body: validBody });
      expect(result.success).toBe(true);
    });

    it('passes with all optional fields included', () => {
      const result = createFeedSchema.safeParse({
        body: {
          ...validBody,
          content: '<p>Full article body</p>',
          targetRole: 'STUDENT',
          careerImpactScore: 85,
          careerImpactText: 'High impact on ML engineers',
          metadata: { source: 'openai.com' },
        },
      });
      expect(result.success).toBe(true);
    });

    it('fails when title is missing', () => {
      const { title, ...noTitle } = validBody;
      const result = createFeedSchema.safeParse({ body: noTitle });
      expect(result.success).toBe(false);
    });

    it('fails when title is too short', () => {
      const result = createFeedSchema.safeParse({ body: { ...validBody, title: 'AB' } });
      expect(result.success).toBe(false);
    });

    it('fails when summary is missing', () => {
      const { summary, ...noSummary } = validBody;
      const result = createFeedSchema.safeParse({ body: noSummary });
      expect(result.success).toBe(false);
    });

    it('fails when summary is too short', () => {
      const result = createFeedSchema.safeParse({ body: { ...validBody, summary: 'short' } });
      expect(result.success).toBe(false);
    });

    it('fails when contentType is missing', () => {
      const { contentType, ...noCt } = validBody;
      const result = createFeedSchema.safeParse({ body: noCt });
      expect(result.success).toBe(false);
    });

    it('fails when contentType is invalid', () => {
      const result = createFeedSchema.safeParse({ body: { ...validBody, contentType: 'PODCAST' } });
      expect(result.success).toBe(false);
    });

    it('accepts all valid contentType enums', () => {
      const types = ['MODEL', 'ADVANCEMENT', 'AGENT', 'PRODUCT', 'LEARNING', 'CAREER', 'GUIDE'];
      for (const contentType of types) {
        const result = createFeedSchema.safeParse({ body: { ...validBody, contentType } });
        expect(result.success).toBe(true);
      }
    });

    it('fails when fieldSlug is missing', () => {
      const { fieldSlug, ...noField } = validBody;
      const result = createFeedSchema.safeParse({ body: noField });
      expect(result.success).toBe(false);
    });

    it('fails when fieldSlug is too short', () => {
      const result = createFeedSchema.safeParse({ body: { ...validBody, fieldSlug: 'a' } });
      expect(result.success).toBe(false);
    });

    it('fails when careerImpactScore is out of range', () => {
      const over = createFeedSchema.safeParse({ body: { ...validBody, careerImpactScore: 101 } });
      expect(over.success).toBe(false);

      const under = createFeedSchema.safeParse({ body: { ...validBody, careerImpactScore: -1 } });
      expect(under.success).toBe(false);
    });

    it('fails with unknown fields due to strict mode', () => {
      const result = createFeedSchema.safeParse({ body: { ...validBody, hackerField: true } });
      expect(result.success).toBe(false);
    });

    it('accepts valid targetRole values', () => {
      for (const role of ['STUDENT', 'PARENT', 'TEACHER', 'ADMIN']) {
        const result = createFeedSchema.safeParse({ body: { ...validBody, targetRole: role } });
        expect(result.success).toBe(true);
      }
    });

    it('rejects invalid targetRole', () => {
      const result = createFeedSchema.safeParse({ body: { ...validBody, targetRole: 'SUPERUSER' } });
      expect(result.success).toBe(false);
    });
  });

  // ── queryFeedSchema ─────────────────────────────────────────────────────────

  describe('queryFeedSchema', () => {
    it('passes with empty query', () => {
      const result = queryFeedSchema.safeParse({ query: {} });
      expect(result.success).toBe(true);
    });

    it('passes with all valid query params', () => {
      const result = queryFeedSchema.safeParse({
        query: {
          fieldSlug: 'ai-ml',
          contentType: 'MODEL',
          search: 'GPT',
          page: '2',
          limit: '10',
        },
      });
      expect(result.success).toBe(true);
    });

    it('transforms page and limit strings to numbers', () => {
      const result = queryFeedSchema.safeParse({ query: { page: '3', limit: '15' } });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.query.page).toBe(3);
        expect(result.data.query.limit).toBe(15);
      }
    });

    it('fails when page is not a digit string', () => {
      const result = queryFeedSchema.safeParse({ query: { page: 'abc' } });
      expect(result.success).toBe(false);
    });

    it('fails when limit is not a digit string', () => {
      const result = queryFeedSchema.safeParse({ query: { limit: '10.5' } });
      expect(result.success).toBe(false);
    });

    it('fails with invalid contentType', () => {
      const result = queryFeedSchema.safeParse({ query: { contentType: 'INVALID' } });
      expect(result.success).toBe(false);
    });

    it('fails with unknown query fields due to strict mode', () => {
      const result = queryFeedSchema.safeParse({ query: { extraField: 'value' } });
      expect(result.success).toBe(false);
    });
  });

  // ── idParamSchema ───────────────────────────────────────────────────────────

  describe('idParamSchema', () => {
    it('passes with a valid UUID', () => {
      const result = idParamSchema.safeParse({
        params: { id: '550e8400-e29b-41d4-a716-446655440000' },
      });
      expect(result.success).toBe(true);
    });

    it('fails with an invalid UUID format', () => {
      const result = idParamSchema.safeParse({ params: { id: 'not-a-uuid' } });
      expect(result.success).toBe(false);
    });

    it('fails with a numeric id', () => {
      const result = idParamSchema.safeParse({ params: { id: '12345' } });
      expect(result.success).toBe(false);
    });

    it('fails when id is missing', () => {
      const result = idParamSchema.safeParse({ params: {} });
      expect(result.success).toBe(false);
    });

    it('fails when params is missing', () => {
      const result = idParamSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
