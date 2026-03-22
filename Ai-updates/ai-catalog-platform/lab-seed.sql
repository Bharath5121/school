-- ═══════════════════════════════════════════════════════════════════════
-- AI Lab Seed Data — Categories + Models + Apps
-- ═══════════════════════════════════════════════════════════════════════

-- Categories (panels)
INSERT INTO "content"."LabCategory" ("id","slug","title","description","icon","sortOrder") VALUES
('lc-text-text',  'text-to-text',  'Text to Text',  'AI models that take text input and produce text output — chatbots, summarizers, translators, coders.', '💬', 0),
('lc-text-image', 'text-to-image', 'Text to Image', 'Generate stunning images from text descriptions using diffusion and GAN models.', '🎨', 1),
('lc-text-audio', 'text-to-audio', 'Text to Audio', 'Convert written text into natural-sounding speech or music.', '🔊', 2),
('lc-text-video', 'text-to-video', 'Text to Video', 'Create short video clips from text prompts — the cutting edge of generative AI.', '🎬', 3),
('lc-image-text', 'image-to-text', 'Image to Text', 'Extract text, captions, or descriptions from images using vision models.', '👁️', 4),
('lc-code',       'code-generation','Code Generation','AI tools that write, explain, debug, and review code across languages.', '💻', 5);

-- ─── Text to Text ─────────────────────────────────────────────────────
INSERT INTO "content"."LabItem" ("slug","title","tagline","description","icon","provider","type","useCases","features","sortOrder","categoryId") VALUES
('chatgpt','ChatGPT','Conversational AI by OpenAI','ChatGPT is a large language model trained by OpenAI. It can answer questions, write essays, generate code, translate languages, and hold nuanced conversations on virtually any topic.','🤖','OpenAI','MODEL',
 ARRAY['Homework help','Essay writing','Brainstorming ideas','Learning new concepts','Code generation'],
 ARRAY['Multi-turn conversation','Code interpreter','Web browsing','Image understanding','File uploads'],0,'lc-text-text'),

('claude','Claude','Thoughtful AI by Anthropic','Claude is designed to be helpful, harmless, and honest. It excels at long documents, careful reasoning, and following detailed instructions.','🧠','Anthropic','MODEL',
 ARRAY['Research assistance','Document analysis','Creative writing','Coding','Summarization'],
 ARRAY['200K context window','Careful reasoning','Nuanced responses','Artifact creation','Vision'],1,'lc-text-text'),

('gemini','Google Gemini','Multimodal AI by Google','Gemini understands text, images, code, and audio natively. Integrated into Google products for seamless productivity.','✨','Google','MODEL',
 ARRAY['Multimodal reasoning','Google Workspace integration','Study assistance','Trip planning','Code review'],
 ARRAY['Multimodal input','Google integration','Real-time information','Extensions','Long context'],2,'lc-text-text'),

('grammarly','Grammarly','AI Writing Assistant','Grammarly uses AI to check grammar, spelling, punctuation, clarity, and tone in real-time across all your writing.','✏️','Grammarly Inc.','APP',
 ARRAY['Essay proofreading','Email polishing','Report clarity','Tone adjustment','Plagiarism check'],
 ARRAY['Real-time suggestions','Tone detector','Plagiarism checker','Style guide','Browser extension'],3,'lc-text-text');

-- ─── Text to Image ────────────────────────────────────────────────────
INSERT INTO "content"."LabItem" ("slug","title","tagline","description","icon","provider","type","useCases","features","sortOrder","categoryId") VALUES
('dall-e','DALL·E 3','Image generation by OpenAI','DALL·E 3 creates highly detailed images from natural language descriptions. Integrated into ChatGPT for conversational image generation.','🖼️','OpenAI','MODEL',
 ARRAY['Art creation','Poster design','Concept visualization','Storyboarding','Meme generation'],
 ARRAY['High fidelity','Text rendering','ChatGPT integration','Safety filters','Inpainting'],0,'lc-text-image'),

('midjourney','Midjourney','Premium AI art generator','Midjourney produces breathtaking artistic images. Known for its distinctive aesthetic style and community-driven approach via Discord.','🎭','Midjourney Inc.','MODEL',
 ARRAY['Digital art','Album covers','Game concept art','Fashion design','Architecture visualization'],
 ARRAY['Artistic style','Upscaling','Variations','Style parameters','Community gallery'],1,'lc-text-image'),

('canva-ai','Canva AI','Design made easy with AI','Canva integrates AI tools for generating images, removing backgrounds, and creating complete designs from simple prompts.','🎨','Canva','APP',
 ARRAY['Social media posts','Presentations','Logo design','Poster creation','Photo editing'],
 ARRAY['Magic Design','Background remover','Text to image','Brand kit','Templates'],2,'lc-text-image');

-- ─── Text to Audio ────────────────────────────────────────────────────
INSERT INTO "content"."LabItem" ("slug","title","tagline","description","icon","provider","type","useCases","features","sortOrder","categoryId") VALUES
('elevenlabs','ElevenLabs','Realistic AI voice synthesis','ElevenLabs produces human-quality speech from text. Clone voices, create audiobooks, and generate voiceovers in seconds.','🎙️','ElevenLabs','MODEL',
 ARRAY['Audiobook narration','Podcast voiceovers','Video narration','Accessibility','Language dubbing'],
 ARRAY['Voice cloning','28+ languages','Emotion control','Real-time streaming','API access'],0,'lc-text-audio'),

('suno','Suno','AI music from text prompts','Suno generates full songs — vocals, instruments, and lyrics — from a simple text description. Create music in any genre instantly.','🎵','Suno Inc.','MODEL',
 ARRAY['Song creation','Background music','Jingles','Music prototyping','Educational demos'],
 ARRAY['Full songs with vocals','Genre control','Custom lyrics','Instrumental mode','Remix'],1,'lc-text-audio');

-- ─── Text to Video ────────────────────────────────────────────────────
INSERT INTO "content"."LabItem" ("slug","title","tagline","description","icon","provider","type","useCases","features","sortOrder","categoryId") VALUES
('sora','Sora','Video generation by OpenAI','Sora creates realistic videos from text prompts. It understands physics, motion, and cinematic composition for stunning results.','🎬','OpenAI','MODEL',
 ARRAY['Short films','Product demos','Social media clips','Concept videos','Storyboard animation'],
 ARRAY['Realistic physics','Up to 60s','Multiple styles','Camera control','Scene editing'],0,'lc-text-video'),

('runway','Runway Gen-3','Creative AI video suite','Runway offers a full suite of AI video tools — generate, edit, and enhance video content with state-of-the-art models.','🎥','Runway','APP',
 ARRAY['Video generation','Motion brush','Background removal','Color grading','Green screen'],
 ARRAY['Gen-3 Alpha','Motion brush','Inpainting','Frame interpolation','Multi-modal'],1,'lc-text-video');

-- ─── Image to Text ────────────────────────────────────────────────────
INSERT INTO "content"."LabItem" ("slug","title","tagline","description","icon","provider","type","useCases","features","sortOrder","categoryId") VALUES
('google-lens','Google Lens','Visual search and OCR by Google','Point your camera at anything and Google Lens will identify objects, translate text, solve math problems, and find similar products.','👁️','Google','APP',
 ARRAY['Homework solver','Plant identification','Product search','Text extraction','Translation'],
 ARRAY['Real-time OCR','Object recognition','Translate on camera','Shopping integration','Math solver'],0,'lc-image-text'),

('gpt-4-vision','GPT-4 Vision','Image understanding by OpenAI','GPT-4 with vision can analyze images, read charts, describe scenes, extract data from screenshots, and reason about visual content.','🔍','OpenAI','MODEL',
 ARRAY['Chart analysis','Screenshot data extraction','Accessibility descriptions','Visual Q&A','Document parsing'],
 ARRAY['High detail mode','Multiple images','Spatial reasoning','Text extraction','Diagram understanding'],1,'lc-image-text');

-- ─── Code Generation ──────────────────────────────────────────────────
INSERT INTO "content"."LabItem" ("slug","title","tagline","description","icon","provider","type","useCases","features","sortOrder","categoryId") VALUES
('github-copilot','GitHub Copilot','AI pair programmer','GitHub Copilot suggests code completions, writes functions, and helps you code faster directly inside your editor.','💻','GitHub / OpenAI','APP',
 ARRAY['Code completion','Test generation','Documentation','Bug fixing','Code explanation'],
 ARRAY['IDE integration','Multi-language','Context awareness','Chat interface','CLI support'],0,'lc-code'),

('cursor','Cursor','AI-first code editor','Cursor is a code editor built around AI — it understands your entire codebase and helps you write, edit, and debug code through natural conversation.','⚡','Cursor Inc.','APP',
 ARRAY['Full codebase editing','Bug debugging','Refactoring','Code review','Learning new frameworks'],
 ARRAY['Codebase awareness','Multi-file edits','Terminal integration','Agent mode','Tab completion'],1,'lc-code'),

('replit-ai','Replit AI','Code and deploy in the browser','Replit combines an online IDE with AI that can generate entire apps, explain code, and deploy with one click.','🚀','Replit','APP',
 ARRAY['Rapid prototyping','Learning to code','Hackathons','Deploying apps','Collaboration'],
 ARRAY['Browser-based','AI code generation','One-click deploy','Multiplayer','50+ languages'],2,'lc-code');
