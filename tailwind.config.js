/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.tsx', // Adjust the path based on your project structure
    './src/**/*.ts',  // Adjust the path based on your project structure
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        graphinEdgeYellow: '#ffff00',
        graphinEdgeGreen: '#008000',
        graphinEdgeRed: '#ff0000',
      },
    },
  },
  plugins: [],
  // Enable the @apply feature
  experimental: {
    applyComplexClasses: true,
  },
}

