/** @type {import('tailwindcss').Config} */
const nodeAccents = ['emerald', 'amber', 'violet', 'rose', 'sky', 'cyan', 'orange', 'indigo', 'blue'];

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  safelist: [
    ...nodeAccents.map((accent) => `bg-node-${accent}`),
    ...nodeAccents.map((accent) => `border-node-${accent}`),
    ...nodeAccents.map((accent) => `text-node-${accent}`),
    ...nodeAccents.map((accent) => `hover:ring-node-${accent}/40`),
  ],
  theme: {
    extend: {
      colors: {
        vs: {
          canvas: '#0f1419',
          surface: '#1C2536',
          header: '#3b82f6',
          accent: '#513dd9',
          border: '#2d3748',
          muted: '#94a3b8',
        },
        node: {
          emerald: '#10b981',
          amber: '#f59e0b',
          violet: '#8b5cf6',
          rose: '#f43f5e',
          sky: '#0ea5e9',
          cyan: '#06b6d4',
          orange: '#f97316',
          indigo: '#6366f1',
          blue: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
