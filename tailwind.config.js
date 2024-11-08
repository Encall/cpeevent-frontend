import { nextui } from '@nextui-org/theme';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans', 'sans-serif'],
      },
      colors: {
        'zinc-75': 'rgba(247,247,247,1)',
        primary: {
          DEFAULT: '#6d28d9',
        }
      },
    },
    darkMode: "class",
  },
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: "#6d28d9",
          },
        },
      },
      dark: {
        colors: {
          primary: {
            DEFAULT: "#6d28d9",
          },
        },
      },
    },
  })],
};

export default config;
