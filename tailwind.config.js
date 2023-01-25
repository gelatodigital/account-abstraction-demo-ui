/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "state-pending": "#FAC25B",
        "state-successful": "#5FB927",
        "state-failed": "#FF5A46",
      },
    },
  },
  plugins: [],
};
