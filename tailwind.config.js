/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#050709',
          card:    '#0d1117',
          card2:   '#111827',
          border:  '#1f2937',
        },
        brand: {
          orange: '#f97316',
          amber:  '#eab308',
          teal:   '#06b6d4',
          green:  '#10b981',
        },
      },
      backgroundImage: {
        'brand-gradient':      'linear-gradient(135deg,#f97316 0%,#eab308 40%,#06b6d4 70%,#10b981 100%)',
        'brand-gradient-text': 'linear-gradient(90deg,#f97316,#eab308 40%,#06b6d4 70%,#10b981)',
        'card-gradient':       'linear-gradient(135deg,rgba(13,17,23,0.9) 0%,rgba(17,24,39,0.9) 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        disp: ['Syne', 'sans-serif'],
      },
      animation: {
        'spin-slow':       'spin 20s linear infinite',
        'float':           'float 6s ease-in-out infinite',
        'pulse-brand':     'pulse-brand 3s ease-in-out infinite',
        'gradient-shift':  'gradient-shift 4s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        'pulse-brand': {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
