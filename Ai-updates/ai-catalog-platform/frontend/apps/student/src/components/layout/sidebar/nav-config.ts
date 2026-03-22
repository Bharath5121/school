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
    section: 'DISCOVER',
    items: [
      { title: 'Discoveries', href: '/discoveries', icon: 'compass' },
      { title: 'Trending Apps', href: '/trending', icon: 'rocket' },
    ],
  },
  {
    section: 'LEARN',
    items: [
      { title: 'Basics', href: '/basics', icon: 'book-open' },
    ],
  },
  {
    section: 'CAREER',
    items: [
      { title: 'Jobs in 2035', href: '/career-map', icon: 'briefcase' },
      { title: 'Career Guide', href: '/career-guide', icon: 'lightbulb' },
    ],
  },
  {
    section: 'GROW',
    items: [
      { title: 'Skills', href: '/skills', icon: 'zap' },
    ],
  },
  {
    section: 'PLAY',
    items: [
      { title: 'AI Lab', href: '/lab', icon: 'flask-conical' },
    ],
  },
  {
    section: 'ASSISTANT',
    items: [
      { title: 'Ask Buddy', href: '/ask-buddy', icon: 'bot' },
    ],
  },
  {
    section: 'MY STUFF',
    items: [
      { title: 'Saved Items', href: '/saved', icon: 'bookmark' },
      { title: 'Reading History', href: '/history', icon: 'clock' },
    ],
  },
];
