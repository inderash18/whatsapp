module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        chat: {
          primary: '#6C63FF',
          primaryDark: '#5A52E0',
          bg: '#F8F9FE',
          sidebar: '#FFFFFF',
          text: '#1A1A1A',
          textMuted: '#9BA1B7',
          received: '#FFFFFF',
          sent: 'rgba(255, 255, 255, 0.15)',
          purpleBg: '#5A52E0'
        }
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px'
      },
      boxShadow: {
        'soft': '0 10px 40px rgba(0, 0, 0, 0.04)',
        'purple': '0 10px 30px rgba(108, 99, 255, 0.2)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      },
      backgroundImage: {
        'purple-gradient': 'linear-gradient(135deg, #6C63FF 0%, #4B44D4 100%)',
      }
    }
  },
  plugins: []
}



