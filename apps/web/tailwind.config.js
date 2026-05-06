/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F2340',
          light: '#1A3A5C',
        },
        gold: {
          DEFAULT: '#C8960C',
          light: '#E8B020',
          pale: '#FDF3D8',
        },
        cream: '#FAFAF7',
        gray: {
          100: '#F4F4F0',
          200: '#E8E8E2',
          400: '#9A9A90',
          600: '#5A5A52',
          900: '#1A1A16',
        },
        success: {
          DEFAULT: '#1E8449',
          pale: '#E8F5E9',
        },
        warning: {
          DEFAULT: '#F57F17',
          pale: '#FFF8E1',
        },
        error: {
          DEFAULT: '#C0392B',
          pale: '#FDECEA',
        },
        info: {
          DEFAULT: '#1565C0',
          pale: '#EAF2FB',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.08)',
        md: '0 4px 16px rgba(0,0,0,0.10)',
        lg: '0 8px 32px rgba(0,0,0,0.13)',
        xl: '0 16px 48px rgba(0,0,0,0.16)',
      },
    },
  },
  plugins: [],
};
