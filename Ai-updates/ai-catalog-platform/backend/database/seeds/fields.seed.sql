INSERT INTO content."Industry" (id, name, slug, description, icon, color, gradient, "isActive", "sortOrder", "createdAt") VALUES
('clmed001', 'Medicine', 'medicine', 'Medical advancements, biology, and health AI tools.', '🏥', '#ef4444', 'from-red-500 to-rose-600', true, 1, NOW()),
('cleng001', 'Engineering', 'engineering', 'Robotics, software development, civil and mechanical engineering AI.', '⚙️', '#3b82f6', 'from-blue-500 to-indigo-600', true, 2, NOW()),
('clart001', 'Art & Design', 'art-design', 'Generative art, music, design, and creative AI.', '🎨', '#a855f7', 'from-purple-500 to-violet-600', true, 3, NOW()),
('cllaw001', 'Law', 'law', 'Legal tech, compliance, and AI legislation.', '⚖️', '#f59e0b', 'from-amber-500 to-yellow-600', true, 4, NOW()),
('clgam001', 'Gaming', 'gaming', 'Game development, AI NPCs, and procedural generation.', '🎮', '#10b981', 'from-emerald-500 to-teal-600', true, 5, NOW()),
('clbus001', 'Business & Finance', 'business-finance', 'Analytics, finance, marketing, and business strategy AI.', '📊', '#06b6d4', 'from-cyan-500 to-sky-600', true, 6, NOW()),
('clsci001', 'Science', 'science', 'Physics, chemistry, astronomy, and general scientific AI.', '🔬', '#8b5cf6', 'from-violet-500 to-purple-600', true, 7, NOW()),
('cledu001', 'Education', 'education', 'EdTech, learning platforms, and AI tutoring.', '📚', '#f97316', 'from-orange-500 to-amber-600', true, 8, NOW()),
('clagr001', 'Agriculture', 'agriculture', 'Precision farming, crop analytics, and agricultural AI.', '🌾', '#22c55e', 'from-green-500 to-emerald-600', true, 9, NOW()),
('clenv001', 'Environment', 'environment', 'Climate AI, sustainability, and environmental monitoring.', '🌍', '#14b8a6', 'from-teal-500 to-green-600', true, 10, NOW()),
('clmfg001', 'Manufacturing', 'manufacturing', 'Industrial AI, quality control, and smart factories.', '🏭', '#64748b', 'from-slate-500 to-gray-600', true, 11, NOW()),
('clmed002', 'Media & Entertainment', 'media-entertainment', 'Content creation, streaming AI, and digital media.', '🎬', '#ec4899', 'from-pink-500 to-rose-600', true, 12, NOW())
ON CONFLICT (slug) DO NOTHING;
