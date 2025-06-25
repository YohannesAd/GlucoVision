/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  important: 'html',
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        primaryDark: '#2563EB',
        primaryLight: '#93C5FD',
        secondary: '#10B981',
        secondaryDark: '#059669',
        secondaryLight: '#6EE7B7',
        accent: '#F59E0B',
        accentDark: '#D97706',
        accentLight: '#FCD34D',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        softBlue: '#EBF4FF',
        darkBlue: '#1E3A8A',
        slate: '#64748B',
        textPrimary: '#111827',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
      },
      fontFamily: {
        'sans': ['System'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}

