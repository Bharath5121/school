export interface NavItemType {
  title: string;
  href: string;
  icon: string;
}

export interface NavSectionType {
  section: string;
  items: NavItemType[];
}

export const STUDENT_NAV: NavSectionType[] = [
  {
    section: 'DISCOVER',
    items: [
      { title: 'My Feed', href: '/feed', icon: '📰' },
      { title: 'Explore Industries', href: '/industries', icon: '🔍' },
      { title: 'Trending', href: '/trending', icon: '🔥' },
      { title: 'AI Curriculum', href: '/curriculum', icon: '🎓' },
    ],
  },
  {
    section: 'MY LEARNING',
    items: [
      { title: 'Explore Careers', href: '/career-map', icon: '🗺️' },
      { title: 'Learning Guides', href: '/guides', icon: '💡' },
      { title: 'Skills Tracker', href: '/skills', icon: '🧩' },
      { title: 'Saved Items', href: '/saved', icon: '📌' },
      { title: 'Reading History', href: '/history', icon: '📖' },
    ],
  },
];

export const PARENT_NAV: NavSectionType[] = [
  {
    section: 'OVERVIEW',
    items: [
      { title: 'Dashboard', href: '/feed', icon: '🏠' },
      { title: 'Messages', href: '/parent/messages', icon: '💬' },
    ],
  },
  {
    section: 'ACCOUNT',
    items: [
      { title: 'Manage Children', href: '/parent/settings', icon: '👦' },
    ],
  },
];

export const TEACHER_NAV: NavSectionType[] = [
  {
    section: 'MAIN',
    items: [
      { title: 'Class Dashboard', href: '/feed', icon: '🏫' },
      { title: 'Field Explorer', href: '/', icon: '🔍' },
    ],
  },
];

export const ADMIN_NAV: NavSectionType[] = [
  {
    section: 'OVERVIEW',
    items: [{ title: 'Dashboard', href: '/admin', icon: '📊' }],
  },
  {
    section: 'CONTENT',
    items: [
      { title: 'Industries', href: '/admin/industries', icon: '🏭' },
      { title: 'AI Models', href: '/admin/models', icon: '🤖' },
      { title: 'AI Agents', href: '/admin/agents', icon: '🧠' },
      { title: 'Apps', href: '/admin/apps', icon: '📱' },
      { title: 'Career Paths', href: '/admin/careers', icon: '🗺️' },
      { title: 'Skills', href: '/admin/skills', icon: '🧠' },
      { title: 'Guides', href: '/admin/guides', icon: '💡' },
      { title: 'Notebooks', href: '/admin/notebooks', icon: '📓' },
      { title: 'Questions', href: '/admin/questions', icon: '❓' },
      { title: 'Basics', href: '/admin/basics', icon: '📚' },
    ],
  },
  {
    section: 'PLATFORM',
    items: [{ title: 'User Management', href: '/admin/users', icon: '👥' }],
  },
];

export const COMMON_ACCOUNT_NAV = [
  { title: 'Settings', href: '/settings', icon: '⚙️' },
];
