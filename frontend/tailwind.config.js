// tailwind.config.js
module.exports = {
    content: [
      './src/**/*.{js,jsx,ts,tsx}', // Make sure all your src files are covered.
    ],
    theme: {
      extend: {
        animation: {
          'spin-slow': 'spin 10s linear infinite',
          'spin-reverse-slow': 'spin-reverse 10s linear infinite',
          'float': 'float 5s ease-in-out infinite',
          'fadeIn': 'fadeIn 0.3s ease-out forwards',
          'slideIn': 'slideIn 0.4s ease-out forwards',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        },
        keyframes: {
          spin: {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
          'spin-reverse': {
            '0%': { transform: 'rotate(360deg)' },
            '100%': { transform: 'rotate(0deg)' },
          },
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' },
          },
          fadeIn: {
            '0%': { opacity: '0', transform: 'scale(0.95)' },
            '100%': { opacity: '1', transform: 'scale(1)' },
          },
          slideIn: {
            '0%': { opacity: '0', transform: 'translateX(-10px)' },
            '100%': { opacity: '1', transform: 'translateX(0)' },
          },
          bounceGentle: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-5px)' },
          },
        },
        boxShadow: {
          'glow': '0 0 20px rgba(16, 185, 129, 0.3)',
          'glow-lg': '0 0 40px rgba(16, 185, 129, 0.4)',
        },
        borderWidth: {
          '3': '3px',
        },
      },
    },
    plugins: [],
  };