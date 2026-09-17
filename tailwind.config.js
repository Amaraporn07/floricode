/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Mitr'", 'sans-serif'],
        body: ["'Prompt'", 'sans-serif'],
      },
      colors: {
        cream: '#FFF8F0',
        ink: '#4A3F35',
        peach: {
          50: '#FFF6F0',
          100: '#FFEADB',
          200: '#FFD6BC',
          300: '#FFBE96',
          400: '#FFA26E',
          500: '#F5854A',
        },
        leaf: {
          50: '#F2F8EE',
          100: '#E1F0D9',
          200: '#C6E4B8',
          300: '#A4D294',
          400: '#83BC70',
          500: '#66A356',
        },
        blush: {
          50: '#FFF2F4',
          100: '#FEE1E6',
          200: '#FBC7D1',
          300: '#F6A6B5',
          400: '#EF8399',
          500: '#E1637C',
        },
        beige: {
          50: '#FBF7EF',
          100: '#F4E9D6',
          200: '#E9D7B8',
          300: '#DBC094',
        },
        sky: {
          50: '#F0F6FB',
          100: '#DCEBF6',
          200: '#BEDBEE',
          300: '#98C4E0',
        },
        lilac: {
          50: '#F7F1FA',
          100: '#EBDDF3',
          200: '#D8BFE8',
          300: '#BE9AD8',
        },
      },
      boxShadow: {
        soft: '0 10px 30px -8px rgba(190, 145, 110, 0.28)',
        card: '0 6px 18px -6px rgba(190, 145, 110, 0.22)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
