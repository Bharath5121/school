-- Seed Chapter 1
INSERT INTO "content"."BasicsChapter" ("id", "slug", "title", "description", "icon", "sortOrder", "isPublished", "createdAt", "updatedAt")
VALUES (
  'ch-01-what-is-ai',
  'what-is-ai',
  'What is AI?',
  'Discover what Artificial Intelligence really means and how it shows up in your everyday life. 5 lessons.',
  'Brain',
  1,
  true,
  NOW(),
  NOW()
)
ON CONFLICT ("id") DO NOTHING;

-- Seed 5 subtopics
INSERT INTO "content"."BasicsTopic" ("id", "slug", "title", "tagline", "description", "icon", "color", "sortOrder", "concepts", "keyTakeaways", "difficulty", "xp", "isPublished", "chapterId", "createdAt", "updatedAt")
VALUES
(
  'bt-01-what-is-artificial-intelligence',
  'what-is-artificial-intelligence',
  'What is Artificial Intelligence?',
  'AI is when computers are programmed to think and learn like humans.',
  'Artificial Intelligence (AI) is a branch of computer science that aims to create machines capable of intelligent behavior. Just like humans learn from experience, AI systems learn from data. They can recognize patterns, make decisions, and even improve over time. AI is everywhere — from voice assistants like Siri and Alexa to recommendation systems on Netflix and YouTube.',
  'Brain',
  'emerald',
  1,
  ARRAY['Machine Learning', 'Neural Networks', 'Pattern Recognition', 'Training Data'],
  ARRAY['AI is about making machines that can learn and make decisions', 'AI learns from large amounts of data called training data', 'AI is already part of your daily life'],
  'beginner',
  40,
  true,
  'ch-01-what-is-ai',
  NOW(), NOW()
),
(
  'bt-02-how-do-computers-think',
  'how-do-computers-think',
  'How Do Computers Think?',
  'Computers dont really think the way you do. They follow instructions called algorithms.',
  'Computers process information using algorithms — step-by-step instructions that tell them what to do. When we say a computer "thinks," we mean it follows these instructions very quickly. AI algorithms are special because they can adapt and improve. A simple algorithm might sort numbers, but an AI algorithm can learn to recognize faces in photos or translate languages.',
  'Cpu',
  'emerald',
  2,
  ARRAY['Algorithms', 'Binary Code', 'Processing Speed', 'Logic Gates'],
  ARRAY['Computers follow step-by-step instructions called algorithms', 'AI algorithms can adapt and improve over time', 'Speed is what makes computers seem smart'],
  'beginner',
  40,
  true,
  'ch-01-what-is-ai',
  NOW(), NOW()
),
(
  'bt-03-ai-in-your-daily-life',
  'ai-in-your-daily-life',
  'AI in Your Daily Life',
  'You probably use AI every single day without knowing it!',
  'AI is not just for scientists and engineers — it is part of your everyday routine. When your phone unlocks with Face ID, that is AI. When Spotify suggests a new song, that is AI. When Google Maps finds the fastest route, that is AI too. Understanding where AI already exists helps you see its potential and limitations.',
  'Smartphone',
  'emerald',
  3,
  ARRAY['Voice Assistants', 'Recommendation Systems', 'Navigation AI', 'Social Media Algorithms'],
  ARRAY['AI powers many apps and services you use daily', 'Recommendation systems use AI to suggest content you might like', 'AI helps make everyday tasks faster and easier'],
  'beginner',
  40,
  true,
  'ch-01-what-is-ai',
  NOW(), NOW()
),
(
  'bt-04-types-of-ai',
  'types-of-ai',
  'Types of AI — Narrow, General, Super',
  'There are three types of AI that scientists talk about.',
  'AI can be categorized into three types based on capability. Narrow AI (Weak AI) is designed for a specific task — like playing chess or recognizing speech. This is the only type that exists today. General AI (Strong AI) would match human intelligence across all tasks. Super AI would surpass human intelligence entirely. While Narrow AI is incredibly useful, General and Super AI remain theoretical concepts that researchers are working toward.',
  'Layers',
  'emerald',
  4,
  ARRAY['Narrow AI (Weak AI)', 'General AI (Strong AI)', 'Super AI', 'AI Capabilities Spectrum'],
  ARRAY['Narrow AI is the only type that exists today and it is very good at specific tasks', 'General AI would be able to do anything a human can do', 'Super AI is still science fiction but scientists are thinking about it'],
  'beginner',
  40,
  true,
  'ch-01-what-is-ai',
  NOW(), NOW()
),
(
  'bt-05-short-history-of-ai',
  'short-history-of-ai',
  'A Short History of AI',
  'The idea of thinking machines has been around for centuries!',
  'The concept of artificial intelligence dates back to ancient myths about mechanical beings. Modern AI began in the 1950s when Alan Turing asked "Can machines think?" The Turing Test was proposed to measure machine intelligence. Through the decades, AI experienced periods of excitement (AI summers) and disappointment (AI winters). Today we are in an unprecedented AI boom, powered by massive datasets and powerful computers.',
  'History',
  'emerald',
  5,
  ARRAY['Alan Turing', 'The Turing Test', 'AI Summers and Winters', 'Deep Learning Revolution'],
  ARRAY['AI as a field started in the 1950s with pioneers like Alan Turing', 'AI has had ups and downs throughout history', 'Recent breakthroughs in deep learning have caused the current AI boom'],
  'beginner',
  40,
  true,
  'ch-01-what-is-ai',
  NOW(), NOW()
)
ON CONFLICT ("id") DO NOTHING;
