/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "bounce-short": "bounces 2s ease-in-out 1",
      },
      keyframes: {
        bounces: {
          "0%": {
            transform: "scale(1)",
          },

          "25%": {
            transform: "scale(1.15)",
          },

          "50%": {
            transform: "scale(0.85)",
          },

          "75%": {
            transform: "scale(1.15)",
          },

          "100%": {
            transform: "scale(1)",
          },
        },
      },
      colors: {
        "state-pending": "#FAC25B",
        "state-successful": "#5FB927",
        "state-failed": "#FF5A46",
      },
    },
  },
  plugins: [],
};
