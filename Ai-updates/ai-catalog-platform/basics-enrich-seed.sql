-- ═══════════════════════════════════════════════════════════════════════
-- Enrich existing BasicsTopic rows with video, notebook, architecture
-- and add links (models, agents, apps)
-- ═══════════════════════════════════════════════════════════════════════

-- Topic 1: What is Artificial Intelligence?
UPDATE "content"."BasicsTopic"
SET "videoUrl" = 'https://www.youtube.com/watch?v=2ePf9rue1Ao',
    "videoTitle" = 'What Is Artificial Intelligence? - Crash Course AI',
    "notebookLmUrl" = 'https://notebooklm.google.com',
    "notebookDescription" = 'Use NotebookLM to explore foundational AI concepts interactively. Upload your study notes and let AI help you learn faster.',
    "architectureDescription" = 'Artificial Intelligence sits at the top of a hierarchy:\n\n1. **AI** — broad field of making machines smart\n2. **Machine Learning** — subset where machines learn from data\n3. **Deep Learning** — subset using neural networks\n4. **Generative AI** — creates new content from patterns\n\nEach layer builds on the previous one, adding more capability and complexity.'
WHERE "slug" = 'what-is-artificial-intelligence';

-- Topic 2: How Do Computers Think?
UPDATE "content"."BasicsTopic"
SET "videoUrl" = 'https://www.youtube.com/watch?v=aircAruvnKk',
    "videoTitle" = 'But what is a Neural Network? - 3Blue1Brown',
    "notebookLmUrl" = 'https://notebooklm.google.com',
    "notebookDescription" = 'Explore neural network concepts with NotebookLM. Great for breaking down complex math into simple analogies.',
    "architectureDescription" = 'How computers "think" through neural networks:\n\n1. **Input Layer** — receives data (images, text, numbers)\n2. **Hidden Layers** — processes and transforms data through weighted connections\n3. **Activation Functions** — decides which neurons "fire"\n4. **Output Layer** — produces the final prediction or classification\n\nThink of it like a very sophisticated voting system where each neuron votes on what the answer should be.'
WHERE "slug" = 'how-do-computers-think';

-- Topic 3: AI in Your Daily Life
UPDATE "content"."BasicsTopic"
SET "videoUrl" = 'https://www.youtube.com/watch?v=mJeNghZXtMo',
    "videoTitle" = 'How AI is Already Changing Your Life',
    "notebookLmUrl" = 'https://notebooklm.google.com',
    "notebookDescription" = 'Create a personal notebook tracking all the AI you encounter in a typical day. You will be surprised!'
WHERE "slug" = 'ai-in-your-daily-life';

-- Topic 4: Types of AI
UPDATE "content"."BasicsTopic"
SET "videoUrl" = 'https://www.youtube.com/watch?v=Yl_8cawGR7c',
    "videoTitle" = 'Types of AI - From Narrow to General Intelligence',
    "architectureDescription" = 'The three types of Artificial Intelligence:\n\n1. **Narrow AI (ANI)** — Specialized in one task (Siri, chess engines, image recognition)\n2. **General AI (AGI)** — Human-level intelligence across any task (does not exist yet)\n3. **Super AI (ASI)** — Surpasses human intelligence (theoretical)\n\nToday, all commercial AI is Narrow AI. The jump to AGI remains one of the biggest challenges in computer science.'
WHERE "slug" = 'types-of-ai';

-- Topic 5: A Short History of AI
UPDATE "content"."BasicsTopic"
SET "videoUrl" = 'https://www.youtube.com/watch?v=056v4OxKwlI',
    "videoTitle" = 'The History of Artificial Intelligence',
    "notebookLmUrl" = 'https://notebooklm.google.com',
    "notebookDescription" = 'Build a timeline of AI milestones from 1950 to today using NotebookLM. Perfect for understanding how we got here.'
WHERE "slug" = 'a-short-history-of-ai';

-- ─── Add Links (Models, Agents, Apps) ─────────────────────────────────

-- For "What is Artificial Intelligence?"
INSERT INTO "content"."BasicsTopicLink" ("id", "topicId", "type", "name", "description", "redirectUrl", "sortOrder")
SELECT gen_random_uuid()::text, t."id", 'MODEL', 'ChatGPT', 'OpenAI conversational AI model — great for exploring AI capabilities firsthand.', 'https://chat.openai.com', 0
FROM "content"."BasicsTopic" t WHERE t."slug" = 'what-is-artificial-intelligence';

INSERT INTO "content"."BasicsTopicLink" ("id", "topicId", "type", "name", "description", "redirectUrl", "sortOrder")
SELECT gen_random_uuid()::text, t."id", 'MODEL', 'Google Gemini', 'Google multimodal AI — understands text, images, and code.', 'https://gemini.google.com', 1
FROM "content"."BasicsTopic" t WHERE t."slug" = 'what-is-artificial-intelligence';

INSERT INTO "content"."BasicsTopicLink" ("id", "topicId", "type", "name", "description", "redirectUrl", "sortOrder")
SELECT gen_random_uuid()::text, t."id", 'APP', 'Teachable Machine', 'Train your own simple AI model in your browser — no code required!', 'https://teachablemachine.withgoogle.com', 2
FROM "content"."BasicsTopic" t WHERE t."slug" = 'what-is-artificial-intelligence';

-- For "How Do Computers Think?"
INSERT INTO "content"."BasicsTopicLink" ("id", "topicId", "type", "name", "description", "redirectUrl", "sortOrder")
SELECT gen_random_uuid()::text, t."id", 'MODEL', 'TensorFlow Playground', 'Interactive neural network visualization — see how neurons learn in real-time.', 'https://playground.tensorflow.org', 0
FROM "content"."BasicsTopic" t WHERE t."slug" = 'how-do-computers-think';

INSERT INTO "content"."BasicsTopicLink" ("id", "topicId", "type", "name", "description", "redirectUrl", "sortOrder")
SELECT gen_random_uuid()::text, t."id", 'AGENT', 'Perplexity AI', 'AI-powered research agent that can explain complex topics step by step.', 'https://www.perplexity.ai', 1
FROM "content"."BasicsTopic" t WHERE t."slug" = 'how-do-computers-think';

-- For "AI in Your Daily Life"
INSERT INTO "content"."BasicsTopicLink" ("id", "topicId", "type", "name", "description", "redirectUrl", "sortOrder")
SELECT gen_random_uuid()::text, t."id", 'APP', 'Google Lens', 'Point your camera at anything and AI tells you what it is.', 'https://lens.google', 0
FROM "content"."BasicsTopic" t WHERE t."slug" = 'ai-in-your-daily-life';

INSERT INTO "content"."BasicsTopicLink" ("id", "topicId", "type", "name", "description", "redirectUrl", "sortOrder")
SELECT gen_random_uuid()::text, t."id", 'APP', 'Spotify', 'AI-powered music recommendations that learn your taste over time.', 'https://spotify.com', 1
FROM "content"."BasicsTopic" t WHERE t."slug" = 'ai-in-your-daily-life';

INSERT INTO "content"."BasicsTopicLink" ("id", "topicId", "type", "name", "description", "redirectUrl", "sortOrder")
SELECT gen_random_uuid()::text, t."id", 'AGENT', 'Siri', 'Apple voice assistant — one of the most common AI agents in daily life.', NULL, 2
FROM "content"."BasicsTopic" t WHERE t."slug" = 'ai-in-your-daily-life';

-- For "Types of AI"
INSERT INTO "content"."BasicsTopicLink" ("id", "topicId", "type", "name", "description", "redirectUrl", "sortOrder")
SELECT gen_random_uuid()::text, t."id", 'MODEL', 'Claude', 'Anthropic AI assistant — an example of advanced Narrow AI.', 'https://claude.ai', 0
FROM "content"."BasicsTopic" t WHERE t."slug" = 'types-of-ai';

INSERT INTO "content"."BasicsTopicLink" ("id", "topicId", "type", "name", "description", "redirectUrl", "sortOrder")
SELECT gen_random_uuid()::text, t."id", 'MODEL', 'DALL-E', 'OpenAI image generation model — Narrow AI for creating images from text.', 'https://openai.com/dall-e-3', 1
FROM "content"."BasicsTopic" t WHERE t."slug" = 'types-of-ai';

-- For "A Short History of AI"
INSERT INTO "content"."BasicsTopicLink" ("id", "topicId", "type", "name", "description", "redirectUrl", "sortOrder")
SELECT gen_random_uuid()::text, t."id", 'APP', 'AI Timeline Explorer', 'Interactive timeline of major AI milestones from 1950 to present.', 'https://www.aihistory.org', 0
FROM "content"."BasicsTopic" t WHERE t."slug" = 'a-short-history-of-ai';

INSERT INTO "content"."BasicsTopicLink" ("id", "topicId", "type", "name", "description", "redirectUrl", "sortOrder")
SELECT gen_random_uuid()::text, t."id", 'MODEL', 'Deep Blue', 'IBM chess computer — the AI that beat world champion Kasparov in 1997.', NULL, 1
FROM "content"."BasicsTopic" t WHERE t."slug" = 'a-short-history-of-ai';

INSERT INTO "content"."BasicsTopicLink" ("id", "topicId", "type", "name", "description", "redirectUrl", "sortOrder")
SELECT gen_random_uuid()::text, t."id", 'AGENT', 'AlphaGo', 'DeepMind AI agent that mastered the game of Go — a landmark in AI history.', NULL, 2
FROM "content"."BasicsTopic" t WHERE t."slug" = 'a-short-history-of-ai';
