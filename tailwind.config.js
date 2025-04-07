/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.tsx',
    './src/**/*.ts',
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

