module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        netflix: {
          black: '#050505',
          dark: '#0D0D0D',
          surface: '#121212',
          red: '#E50914',
          redDark: '#B20710',
          redGlow: 'rgba(229, 9, 20, 0.4)',
          text: '#FFFFFF',
          textMuted: '#999999',
          received: '#1A1A1A',
        }
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '20px',
        '3xl': '32px'
      },
      boxShadow: {
        'luxury-red': '0 0 30px rgba(229, 9, 20, 0.2)',
        'luxury-white': '0 0 30px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #0D0D0D 0%, #050505 100%)',
        'red-gradient': 'linear-gradient(90deg, #E50914 0%, #8E060D 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
      }
    }
  },
  plugins: []
}


