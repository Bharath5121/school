export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

export interface NavSectionType {
  section: string;
  items: NavItem[];
}

export const STUDENT_NAV: NavSectionType[] = [
  {
    section: 'Discover',
    items: [
      { title: 'My Feed', href: '/feed', icon: 'newspaper' },
      { title: 'Explore Industries', href: '/industries', icon: 'search' },
      { title: 'Trending', href: '/trending', icon: 'flame' },
      { title: 'AI Curriculum', href: '/curriculum', icon: 'graduation-cap' },
    ],
  },
  {
    section: 'Learn',
    items: [
      { title: 'Basics', href: '/basics', icon: 'book-open' },
      { title: "Today's Discovery", href: '/today', icon: 'sparkles' },
      { title: 'AI Lab', href: '/lab', icon: 'flask-conical' },
    ],
  },
  {
    section: 'My Learning',
    items: [
      { title: 'Explore Careers', href: '/career-map', icon: 'map' },
      { title: 'Learning Guides', href: '/guides', icon: 'lightbulb' },
      { title: 'Skills Tracker', href: '/skills', icon: 'target' },
      { title: 'Saved Items', href: '/saved', icon: 'bookmark' },
      { title: 'Reading History', href: '/history', icon: 'clock' },
    ],
  },
  {
    section: 'My Stuff',
    items: [
      { title: 'My Badges', href: '/badges', icon: 'award' },
      { title: 'My Progress', href: '/progress', icon: 'bar-chart' },
      { title: 'Notebooks', href: '/notebooks', icon: 'notebook-pen' },
    ],
  },
  {
    section: 'Explore',
    items: [
      { title: 'Explore Futures', href: '/futures', icon: 'rocket' },
      { title: 'Ask Buddy', href: '/ask-buddy', icon: 'message-circle' },
    ],
  },
];

export const PARENT_NAV: NavSectionType[] = [
  {
    section: 'Overview',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: 'layout-dashboard' },
      { title: 'My Children', href: '/children', icon: 'users' },
    ],
  },
  {
    section: 'Activity',
    items: [
      { title: 'Child Activity', href: '/activity', icon: 'activity' },
      { title: 'Notifications', href: '/notifications', icon: 'bell' },
    ],
  },
];

export const TEACHER_NAV: NavSectionType[] = [
  {
    section: 'Dashboard',
    items: [
      { title: 'Overview', href: '/dashboard', icon: 'layout-dashboard' },
      { title: 'Students', href: '/students', icon: 'users' },
    ],
  },
];

export const ADMIN_NAV: NavSectionType[] = [
  {
    section: '',
    items: [
      { title: 'Dashboard', href: '/admin', icon: 'layout-dashboard' },
    ],
  },
  {
    section: 'Content',
    items: [
      { title: 'Industries', href: '/admin/industries', icon: 'globe' },
      { title: 'AI Models', href: '/admin/models', icon: 'box' },
      { title: 'AI Agents', href: '/admin/agents', icon: 'bot' },
      { title: 'Apps', href: '/admin/apps', icon: 'app-window' },
      { title: 'Spark Content', href: '/admin/feed', icon: 'message-square' },
    ],
  },
  {
    section: 'Learning',
    items: [
      { title: 'Career Paths', href: '/admin/careers', icon: 'map' },
      { title: 'Skills', href: '/admin/skills', icon: 'brain' },
      { title: 'Guides & Prompts', href: '/admin/guides', icon: 'lightbulb' },
      { title: 'Notebooks', href: '/admin/notebooks', icon: 'notebook-pen' },
    ],
  },
  {
    section: 'Engagement',
    items: [
      { title: 'Basics', href: '/admin/basics', icon: 'book-open' },
    ],
  },
  {
    section: 'System',
    items: [
      { title: 'Users', href: '/admin/users', icon: 'users' },
    ],
  },
];

export const COMMON_ACCOUNT_NAV: NavItem[] = [
  { title: 'Settings', href: '/settings', icon: 'settings' },
];
