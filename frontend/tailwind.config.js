/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode by adding a "class" toggle
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      colors: {
        "light-blue": "#37AFE1",
        "orange-juice": "#ffb703",
        "ayran": "#ffff",
        "primary": "#5f6FFF",
        "dark-background": "#121212", // Dark background color
        "dark-text": "#E5E5E5",       // Light text color for dark mode
        "dark-card": "#1F1F1F",       // Dark card background
        "dark-border": "#333333",     // Border color for dark mode elements
        "dark-hover": "#444444",      // Hover state color in dark mode
        "dark-accent": "#BB86FC",     // Accent color for dark mode
      },
    },
  },
  plugins: [],
};
