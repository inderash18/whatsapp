module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        netflix: {
          black: '#0B0B0B',
          dark: '#141414',
          surface: '#1F1F1F',
          red: '#E50914',
          redDark: '#B20710',
          text: '#FFFFFF',
          textMuted: '#B3B3B3',
          received: '#262626',
        }
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        }
      },
      backgroundImage: {
        'netflix-gradient': 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
        'red-gradient': 'linear-gradient(135deg, #E50914 0%, #B20710 100%)',
      }
    }
  },
  plugins: []
}

