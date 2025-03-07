// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
      extend: {
        colors: {
          primary: '#000000', // deep black
          secondary: '#ffffff', // crisp white
          accent: {
            DEFAULT: '#8A2BE2', // a vivid violet
            glow: '#9B30FF',    // slightly brighter for a glowing effect
          },
        },
        fontFamily: {
          writer: ['Merriweather', 'serif'],
        },
        boxShadow: {
          violet: '0 0 20px 5px rgba(138, 43, 226, 0.5)', // subtle violet glow
        },
        animation: {
          'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
          'fade-in': 'fade-in 1.5s ease-out',
          'slide-up': 'slide-up 1s ease-out',
          'text-focus': 'text-focus 2s ease',
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out',
          'bounce-subtle': 'bounce 3s ease-in-out infinite',
          'spin-slow': 'spin 4s linear infinite',
          'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        keyframes: {
          'glow-pulse': {
            '0%, 100%': { boxShadow: '0 0 15px 5px rgba(138, 43, 226, 0.3)' },
            '50%': { boxShadow: '0 0 25px 8px rgba(155, 48, 255, 0.6)' },
          },
          'fade-in': {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          'slide-up': {
            '0%': { transform: 'translateY(30px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          'text-focus': {
            '0%': { filter: 'blur(12px)', opacity: '0' },
            '100%': { filter: 'blur(0)', opacity: '1' },
          },
          'accordion-down': {
            from: { height: 0 },
            to: { height: 'var(--radix-accordion-content-height)' },
          },
          'accordion-up': {
            from: { height: 'var(--radix-accordion-content-height)' },
            to: { height: 0 },
          },
        },
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
      require('tailwindcss-animate'),
    ],
  }
  