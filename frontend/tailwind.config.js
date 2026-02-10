/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        xl: '2rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
      colors: {
        'primary': {
          DEFAULT: '#55849E',
          light: '#A6CDE4',
          dark: '#3B5B71',
        },
        'secondary': {
          DEFAULT: '#D4B8AE', // Rosy Beige
          light: '#E0CFC9',
          dark: '#BA9B92',
        },
        'text': {
          dark: '#2F4858', // Dark Blue-Gray
          medium: '#5C7C8A', // Medium Blue-Gray
          light: '#8DA1AA',  // Light Blue-Gray
        },
        'background': '#F5F6F7', // Soft Off-White
        'neutral': {
          light: '#E0E4E7', // Light Neutral Gray
          medium: '#CBD2D8', // Medium Neutral Gray
        },
        // Keeping red and green for feedback messages
        'danger': '#EF4444', // Tailwind's red-500
        'success': '#22C55E', // Tailwind's green-500
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}