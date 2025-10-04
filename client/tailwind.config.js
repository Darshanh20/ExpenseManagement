/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode
        background: {
          light: '#f1f5f9',
          dark: '#0f172a',
        },
        surface: {
          light: '#ffffff',
          dark: '#1e293b',
        },
        'text-primary': {
          light: '#1e293b',
          dark: '#e2e8f0',
        },
        'text-secondary': {
          light: '#64748b',
          dark: '#94a3b8',
        },
        accent: {
          light: '#4f46e5',
          'light-hover': '#4338ca',
          dark: '#6366f1',
          'dark-hover': '#818cf8',
        },
      },
    },
  },
  plugins: [],
};
