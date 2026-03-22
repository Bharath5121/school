-- ============================================================
-- Discovery Feature: Schema + Seed Data
-- ============================================================

-- Enum for discovery link types
DO $$ BEGIN
  CREATE TYPE "catalog"."DiscoveryLinkType" AS ENUM ('MODEL', 'AGENT', 'APP');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Main discoveries table
CREATE TABLE IF NOT EXISTS "catalog"."discoveries" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "cover_image_url" TEXT,
  "industry_slug" TEXT NOT NULL,
  "difficulty" "content"."DifficultyLevel" NOT NULL DEFAULT 'BEGINNER',
  "video_url" TEXT,
  "video_title" TEXT,
  "notebook_lm_url" TEXT,
  "notebook_description" TEXT,
  "architecture_description" TEXT,
  "architecture_diagram_url" TEXT,
  "is_published" BOOLEAN NOT NULL DEFAULT false,
  "published_at" TIMESTAMPTZ,
  "is_featured" BOOLEAN NOT NULL DEFAULT false,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "xp" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "discoveries_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "discoveries_slug_key" UNIQUE ("slug"),
  CONSTRAINT "discoveries_industry_slug_fkey" FOREIGN KEY ("industry_slug") REFERENCES "content"."Industry"("slug") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "discoveries_industry_slug_idx" ON "catalog"."discoveries"("industry_slug");
CREATE INDEX IF NOT EXISTS "discoveries_is_published_published_at_idx" ON "catalog"."discoveries"("is_published", "published_at");
CREATE INDEX IF NOT EXISTS "discoveries_is_featured_idx" ON "catalog"."discoveries"("is_featured");

-- Discovery links table (linked models, agents, apps)
CREATE TABLE IF NOT EXISTS "catalog"."discovery_links" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "discovery_id" TEXT NOT NULL,
  "type" "catalog"."DiscoveryLinkType" NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "redirect_url" TEXT,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "discovery_links_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "discovery_links_discovery_id_fkey" FOREIGN KEY ("discovery_id") REFERENCES "catalog"."discoveries"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "discovery_links_discovery_id_idx" ON "catalog"."discovery_links"("discovery_id");

-- Discovery chat messages table
CREATE TABLE IF NOT EXISTS "catalog"."discovery_chat_messages" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "discovery_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "response" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "discovery_chat_messages_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "discovery_chat_messages_discovery_id_fkey" FOREIGN KEY ("discovery_id") REFERENCES "catalog"."discoveries"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "discovery_chat_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "discovery_chat_messages_discovery_id_created_at_idx" ON "catalog"."discovery_chat_messages"("discovery_id", "created_at");
CREATE INDEX IF NOT EXISTS "discovery_chat_messages_user_id_idx" ON "catalog"."discovery_chat_messages"("user_id");

-- ============================================================
-- Seed 5 Discoveries
-- ============================================================

INSERT INTO "catalog"."discoveries" (id, title, slug, summary, description, industry_slug, difficulty, video_url, video_title, notebook_lm_url, notebook_description, architecture_description, architecture_diagram_url, is_published, published_at, is_featured, sort_order, xp) VALUES

-- 1. AI Discovers New Planet in Space
('d0000001-0001-4000-a000-000000000001',
 'AI Discovers New Planet in Space',
 'ai-discovers-new-planet',
 'NASA used AI to discover a hidden planet called Kepler-90i in a distant solar system. The AI was trained on data from the Kepler Space Telescope and found patterns humans missed.',
 E'## How AI Found a Hidden Planet\n\nIn 2017, NASA partnered with Google to apply machine learning to data from the Kepler Space Telescope. The AI system analyzed light curves — tiny dips in starlight that occur when a planet passes in front of its star.\n\n### Why This Matters\n\nThe Kepler telescope collected data on over 150,000 stars, producing billions of data points. Human scientists could only analyze a fraction. The neural network was trained on 15,000 previously vetted signals and learned to distinguish real planetary transits from false positives.\n\n### The Discovery\n\nThe AI found **Kepler-90i**, an eighth planet orbiting the star Kepler-90, making it the first known star system with as many planets as our own solar system. The planet is rocky, about 30% larger than Earth, and orbits very close to its star with a surface temperature of about 800°F.\n\n### Key Takeaway\n\nThis discovery proved that AI can find what humans miss in massive datasets. Today, similar techniques are used to discover exoplanets, gravitational waves, and even new particles in physics experiments.',
 'science', 'BEGINNER',
 'https://www.youtube.com/watch?v=BxRSqHGaEBY',
 'NASA: How AI Discovered a New Planet',
 'https://notebooklm.google.com',
 'Explore how neural networks analyze telescope data to find exoplanets. This notebook covers the basics of transit detection, light curve analysis, and how convolutional neural networks are applied to space data.',
 E'## Architecture: AI Exoplanet Detection Pipeline\n\n**1. Data Collection** — Kepler Space Telescope captures light intensity from 150,000+ stars every 30 minutes.\n\n**2. Preprocessing** — Raw light curves are cleaned, normalized, and segmented into individual transit windows.\n\n**3. Feature Extraction** — Transit signals are extracted using Box Least Squares (BLS) algorithm.\n\n**4. Neural Network Classification** — A Convolutional Neural Network (CNN) classifies each signal as planet vs. false positive.\n\n**5. Human Verification** — Top candidates are reviewed by astronomers for confirmation.\n\n**Tech Stack:** TensorFlow, Python, NASA Exoplanet Archive API',
 NULL,
 true, now(), true, 1, 40),

-- 2. How TikTok''s Algorithm Works
('d0000001-0002-4000-a000-000000000002',
 'How TikTok''s Algorithm Works',
 'how-tiktoks-algorithm-works',
 'TikTok''s AI is insanely good at figuring out what you like! The For You page uses an AI algorithm that learns your preferences in minutes.',
 E'## The Most Powerful Recommendation Engine\n\nTikTok''s recommendation algorithm is considered one of the most sophisticated AI systems in consumer technology. Unlike YouTube or Instagram, TikTok can personalize content for new users within minutes — not days.\n\n### How It Works\n\n**1. Content Understanding**\nEvery video is analyzed by multiple AI models:\n- Computer vision identifies objects, scenes, and actions\n- NLP processes captions, hashtags, and speech-to-text\n- Audio analysis classifies music and sound patterns\n\n**2. User Modeling**\nThe algorithm tracks hundreds of signals:\n- Watch time (most important — even partial replays)\n- Likes, comments, shares, follows\n- Videos you skip or mark "Not Interested"\n- Device and account settings\n\n**3. Candidate Generation**\nThe system narrows billions of videos to a few thousand candidates using collaborative filtering and content-based filtering.\n\n**4. Ranking**\nA deep learning model scores each candidate video with a predicted engagement probability. The top-ranked videos become your For You page.\n\n### Why It Feels Like Mind Reading\n\nThe key innovation is TikTok''s focus on **content graph** over **social graph**. It recommends based on what you engage with, not who you follow. This means even creators with zero followers can go viral if their content is engaging.',
 'technology', 'INTERMEDIATE',
 'https://www.youtube.com/watch?v=nfczi2cI6Cs',
 'How TikTok''s Algorithm Actually Works',
 'https://notebooklm.google.com',
 'Deep dive into recommendation systems, collaborative filtering, and how modern social media platforms use deep learning to predict user engagement.',
 E'## Architecture: TikTok Recommendation System\n\n**1. Content Pipeline**\n- Video Upload → Transcoding → AI Analysis (Vision + NLP + Audio)\n- Each video gets a feature vector representing its content\n\n**2. User Pipeline**\n- Interaction events → Real-time feature store\n- User embedding updated with each interaction\n\n**3. Candidate Generation**\n- Retrieval models narrow billions → thousands of candidates\n- Uses approximate nearest neighbor search (ANN)\n\n**4. Ranking Model**\n- Multi-task deep neural network\n- Predicts: P(watch), P(like), P(share), P(comment)\n- Weighted combination produces final score\n\n**5. Re-ranking & Diversity**\n- Ensures content diversity (no 10 cat videos in a row)\n- Applies business rules and content policies\n\n**Tech Stack:** PyTorch, Feature Store, Redis, Kafka, GPU Inference Clusters',
 NULL,
 true, now(), true, 2, 45),

-- 3. AI Composes Music for Movies
('d0000001-0003-4000-a000-000000000003',
 'AI Composes Music for Movies',
 'ai-composes-music-for-movies',
 'AI is now creating background music for movies, video games, and even YouTube videos! Tools like AIVA and Suno are changing how music is made.',
 E'## When AI Becomes the Composer\n\nArtificial Intelligence is revolutionizing music composition. Tools like AIVA (Artificial Intelligence Virtual Artist), Suno, and Google''s MusicLM can now generate original music that sounds like it was written by human composers.\n\n### How AI Music Generation Works\n\n**Training Data**\nAI music models are trained on thousands of musical compositions. They learn patterns in:\n- Melody (sequences of notes)\n- Harmony (chords and progressions)\n- Rhythm (timing and tempo)\n- Structure (verse, chorus, bridge patterns)\n\n**Generation Process**\nModern music AI uses transformer architectures (similar to ChatGPT) adapted for audio. The model generates music token by token, where each token represents a small audio segment.\n\n### Real-World Applications\n\n- **Film Scoring**: AIVA has composed music for commercials and short films\n- **Video Games**: Procedural music that adapts to gameplay\n- **Content Creators**: Royalty-free background music generated in seconds\n- **Music Production**: AI-assisted songwriting and arrangement\n\n### The Debate\n\nWhile AI music tools are powerful, they raise questions about creativity, copyright, and the future of human musicians. Most experts agree AI will augment human creativity rather than replace it.',
 'creative-arts', 'BEGINNER',
 'https://www.youtube.com/watch?v=SGUCcjHTmGY',
 'How AI is Changing Music Forever',
 'https://notebooklm.google.com',
 'Learn about transformer-based music generation, MIDI representation, audio tokenization, and the creative applications of AI in the arts.',
 NULL, NULL,
 true, now(), true, 3, 35),

-- 4. AI Helps Doctors Detect Cancer Earlier
('d0000001-0004-4000-a000-000000000004',
 'AI Helps Doctors Detect Cancer Earlier',
 'ai-detects-cancer-earlier',
 'AI systems can now detect certain cancers more accurately than experienced doctors. Medical imaging AI is saving lives by catching diseases at earlier stages.',
 E'## AI in Medical Imaging: Saving Lives Earlier\n\nArtificial intelligence is transforming how doctors detect cancer. In multiple studies, AI systems have matched or outperformed experienced radiologists in detecting breast cancer, lung cancer, and skin cancer from medical images.\n\n### How Medical Imaging AI Works\n\n**1. Training**\nAI models are trained on millions of medical images (X-rays, CT scans, MRIs, mammograms) that have been labeled by expert doctors. The model learns to recognize patterns associated with disease.\n\n**2. Detection**\nWhen a new image is fed to the AI:\n- Convolutional Neural Networks scan every pixel\n- The model identifies suspicious regions\n- It outputs a probability score and highlights areas of concern\n\n**3. Clinical Integration**\nAI doesn''t replace doctors — it acts as a \"second pair of eyes\":\n- Flags images that need urgent review\n- Reduces false negatives (missed cancers)\n- Helps prioritize cases in busy hospitals\n\n### Real Impact\n\n- **Google Health**: AI detected breast cancer with 11.5% fewer false negatives than radiologists\n- **Viz.ai**: Detects strokes in CT scans and alerts specialists within minutes\n- **PathAI**: Analyzes pathology slides to assist in diagnosis\n\n### Key Takeaway\n\nAI in medicine is not about replacing doctors — it''s about giving them superpowers. Early detection is the single biggest factor in cancer survival rates, and AI is making early detection more reliable and accessible.',
 'healthcare', 'INTERMEDIATE',
 'https://www.youtube.com/watch?v=2HMPRXstSvQ',
 'How AI Is Detecting Cancer Better Than Doctors',
 'https://notebooklm.google.com',
 'Explore convolutional neural networks for medical imaging, transfer learning in healthcare, and the regulatory landscape for AI-assisted diagnosis.',
 E'## Architecture: Medical Imaging AI Pipeline\n\n**1. Data Ingestion**\n- Hospital PACS systems send DICOM images\n- Images are anonymized and standardized\n\n**2. Preprocessing**\n- Windowing, normalization, augmentation\n- Region of Interest (ROI) extraction\n\n**3. AI Model**\n- Deep CNN (ResNet/EfficientNet backbone)\n- Trained on 100K+ annotated scans\n- Multi-class output: Normal / Benign / Malignant\n\n**4. Post-processing**\n- Grad-CAM heatmaps show attention regions\n- Confidence scores per finding\n\n**5. Clinical Decision Support**\n- Results appear in radiologist worklist\n- Urgent cases auto-prioritized\n- Full audit trail for regulatory compliance\n\n**Tech Stack:** PyTorch, MONAI, DICOM, HL7 FHIR, Cloud GPU inference',
 NULL,
 true, now(), true, 4, 50),

-- 5. Self-Driving Cars: How They See the Road
('d0000001-0005-4000-a000-000000000005',
 'Self-Driving Cars: How They See the Road',
 'self-driving-cars-see-road',
 'Self-driving cars use cameras, radar, and LiDAR combined with AI to understand the road. Learn how computer vision makes autonomous driving possible.',
 E'## How Autonomous Vehicles See the World\n\nSelf-driving cars need to perceive, understand, and navigate the real world in real-time. This requires a combination of hardware sensors and sophisticated AI algorithms working together.\n\n### The Sensor Suite\n\n**Cameras** (8-12 per car)\n- Provide rich visual information: lane markings, traffic signs, pedestrians\n- Limited in bad weather and direct sunlight\n\n**LiDAR** (Light Detection and Ranging)\n- Creates a 3D point cloud of the environment\n- Accurate distance measurement up to 200 meters\n- Works in darkness but struggles in heavy rain\n\n**Radar**\n- Detects speed and distance of other vehicles\n- Works in all weather conditions\n- Lower resolution than LiDAR\n\n### The AI Stack\n\n**1. Perception**\nDeep learning models process sensor data to identify:\n- Other vehicles, pedestrians, cyclists\n- Traffic lights and signs\n- Road boundaries and lane markings\n- Construction zones and obstacles\n\n**2. Prediction**\nThe AI predicts what other road users will do next:\n- Will that pedestrian cross the street?\n- Is that car going to change lanes?\n- Trajectory prediction models use past behavior patterns\n\n**3. Planning**\nThe vehicle decides what to do:\n- Path planning: optimal route through traffic\n- Speed planning: when to accelerate, brake, or yield\n- Safety constraints: always maintaining safe distances\n\n**4. Control**\nThe plan is converted into physical actions:\n- Steering angle adjustments\n- Throttle and brake commands\n- Updated 10-20 times per second\n\n### The Levels of Autonomy\n\n- **Level 2** (Tesla Autopilot): Driver must stay alert\n- **Level 3** (Mercedes Drive Pilot): Car drives in specific conditions\n- **Level 4** (Waymo): Fully autonomous in mapped areas\n- **Level 5**: Fully autonomous anywhere (not yet achieved)',
 'transportation', 'ADVANCED',
 'https://www.youtube.com/watch?v=yjztvddhZmI',
 'How Do Self-Driving Cars Actually Work?',
 'https://notebooklm.google.com',
 'Dive into computer vision, sensor fusion, path planning algorithms, and the software architecture of autonomous vehicles.',
 E'## Architecture: Autonomous Vehicle AI Stack\n\n**1. Sensor Layer**\n- 8+ Cameras → Image streams at 30fps\n- LiDAR → 3D point clouds at 10Hz\n- Radar → Velocity and range data\n- GPS/IMU → Position and orientation\n\n**2. Perception Layer**\n- Object Detection: YOLO / CenterNet on camera images\n- 3D Object Detection: PointPillars on LiDAR data\n- Sensor Fusion: Combines all detections into unified world model\n- Semantic Segmentation: Labels every pixel (road, sidewalk, building)\n\n**3. Prediction Layer**\n- Motion forecasting for all detected agents\n- Uses graph neural networks on interaction patterns\n- Outputs multiple possible future trajectories with probabilities\n\n**4. Planning Layer**\n- Route planning (A* / Dijkstra on HD map)\n- Behavior planning (state machine: follow, lane change, stop)\n- Motion planning (trajectory optimization with safety constraints)\n\n**5. Control Layer**\n- PID controllers for steering and speed\n- Model Predictive Control (MPC) for smooth execution\n- Safety monitor with emergency stop capability\n\n**Tech Stack:** C++, CUDA, ROS2, TensorRT, HD Maps, Simulation (CARLA)',
 NULL,
 true, now(), false, 5, 55)

ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Seed Discovery Links
-- ============================================================

INSERT INTO "catalog"."discovery_links" (id, discovery_id, type, name, description, redirect_url, sort_order) VALUES

-- Links for Discovery 1: AI Discovers New Planet
('dl000001-0001-4000-a000-000000000001', 'd0000001-0001-4000-a000-000000000001', 'MODEL', 'TensorFlow Exoplanet CNN', 'The convolutional neural network used by Google/NASA to classify Kepler light curves.', 'https://github.com/google-research/exoplanet-ml', 1),
('dl000001-0002-4000-a000-000000000002', 'd0000001-0001-4000-a000-000000000001', 'APP', 'NASA Exoplanet Archive', 'Browse confirmed exoplanets and their properties.', 'https://exoplanetarchive.ipac.caltech.edu/', 2),
('dl000001-0003-4000-a000-000000000003', 'd0000001-0001-4000-a000-000000000001', 'AGENT', 'Kepler Data Analysis Agent', 'Automated agent that processes and classifies transit signals from telescope data.', NULL, 3),

-- Links for Discovery 2: TikTok Algorithm
('dl000002-0001-4000-a000-000000000001', 'd0000001-0002-4000-a000-000000000002', 'MODEL', 'Deep Retrieval Model', 'Collaborative filtering model that generates video candidates from user embeddings.', NULL, 1),
('dl000002-0002-4000-a000-000000000002', 'd0000001-0002-4000-a000-000000000002', 'MODEL', 'Video Understanding Transformer', 'Multi-modal transformer that extracts features from video content (vision + audio + text).', NULL, 2),
('dl000002-0003-4000-a000-000000000003', 'd0000001-0002-4000-a000-000000000002', 'APP', 'TikTok', 'Try the algorithm yourself — notice how it adapts to your interests.', 'https://www.tiktok.com', 3),

-- Links for Discovery 3: AI Music
('dl000003-0001-4000-a000-000000000001', 'd0000001-0003-4000-a000-000000000003', 'APP', 'AIVA', 'AI composer that creates emotional soundtracks. Free tier available.', 'https://www.aiva.ai/', 1),
('dl000003-0002-4000-a000-000000000002', 'd0000001-0003-4000-a000-000000000003', 'APP', 'Suno AI', 'Generate full songs with vocals from a text prompt.', 'https://suno.com/', 2),
('dl000003-0003-4000-a000-000000000003', 'd0000001-0003-4000-a000-000000000003', 'MODEL', 'MusicLM by Google', 'Google''s text-to-music generation model based on transformers.', 'https://google-research.github.io/seanet/musiclm/examples/', 3),

-- Links for Discovery 4: AI Cancer Detection
('dl000004-0001-4000-a000-000000000001', 'd0000001-0004-4000-a000-000000000004', 'MODEL', 'Google Health Mammography AI', 'Deep learning model that outperformed radiologists in breast cancer screening.', 'https://health.google/health-research/imaging-and-diagnostics/', 1),
('dl000004-0002-4000-a000-000000000002', 'd0000001-0004-4000-a000-000000000004', 'AGENT', 'Viz.ai Stroke Detection', 'AI agent that analyzes CT scans in real-time and alerts stroke specialists.', 'https://www.viz.ai/', 2),
('dl000004-0003-4000-a000-000000000003', 'd0000001-0004-4000-a000-000000000004', 'APP', 'PathAI', 'AI-powered pathology platform for cancer diagnosis.', 'https://www.pathai.com/', 3),

-- Links for Discovery 5: Self-Driving Cars
('dl000005-0001-4000-a000-000000000001', 'd0000001-0005-4000-a000-000000000005', 'MODEL', 'YOLO (You Only Look Once)', 'Real-time object detection model used for identifying vehicles, pedestrians, and objects.', 'https://docs.ultralytics.com/', 1),
('dl000005-0002-4000-a000-000000000002', 'd0000001-0005-4000-a000-000000000005', 'AGENT', 'Waymo Driver', 'Waymo''s autonomous driving agent that handles perception, prediction, and planning.', 'https://waymo.com/', 2),
('dl000005-0003-4000-a000-000000000003', 'd0000001-0005-4000-a000-000000000005', 'APP', 'CARLA Simulator', 'Open-source autonomous driving simulator for testing self-driving algorithms.', 'https://carla.org/', 3)

ON CONFLICT DO NOTHING;
