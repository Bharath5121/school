import type { Config } from 'tailwindcss';
import baseConfig from '../shared/tailwind.base';

const config: Config = {
  ...baseConfig,
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../shared/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      ...baseConfig.theme?.extend,
    },
  },
};

export default config;
