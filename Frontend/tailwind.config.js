/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        "cyan-bluish-gray": "#abb8c3",
        white: "#ffffff",
        "pale-pink": "#f78da7",
        "vivid-red": "#cf2e2e",
        "luminous-vivid-orange": "#ff6900",
        "luminous-vivid-amber": "#fcb900",
        "light-green-cyan": "#7bdcb5",
        "vivid-green-cyan": "#00d084",
        "pale-cyan-blue": "#8ed1fc",
        "vivid-cyan-blue": "#0693e3",
        "vivid-purple": "#9b51e0",
      },
      backgroundImage: {
        "vivid-cyan-blue-to-vivid-purple":
          "linear-gradient(135deg, #0693e3 0%, #9b51e0 100%)",
        "light-green-cyan-to-vivid-green-cyan":
          "linear-gradient(135deg, #7adcb4 0%, #00d082 100%)",
        "luminous-vivid-amber-to-luminous-vivid-orange":
          "linear-gradient(135deg, #fcb900 0%, #ff6900 100%)",
        "luminous-vivid-orange-to-vivid-red":
          "linear-gradient(135deg, #ff6900 0%, #cf2e2e 100%)",
        "very-light-gray-to-cyan-bluish-gray":
          "linear-gradient(135deg, #eeeeee 0%, #a9b8c3 100%)",
        "cool-to-warm-spectrum":
          "linear-gradient(135deg, #4aeada 0%, #9778d1 20%, #cf2aba 40%, #ee2c82 60%, #fb6962 80%, #fef84c 100%)",
        "blush-light-purple":
          "linear-gradient(135deg, #ffceec 0%, #9896f0 100%)",
        "blush-bordeaux":
          "linear-gradient(135deg, #fecda5 0%, #fe2d2d 50%, #6b003e 100%)",
        "luminous-dusk":
          "linear-gradient(135deg, #ffcb70 0%, #c751c0 50%, #4158d0 100%)",
        "pale-ocean":
          "linear-gradient(135deg, #fff5cb 0%, #b6e3d4 50%, #33a7b5 100%)",
        "electric-grass": "linear-gradient(135deg, #caf880 0%, #71ce7e 100%)",
        midnight: "linear-gradient(135deg, #020381 0%, #2874fc 100%)",
      },
      aspectRatio: {
        square: "1",
        "4-3": "4 / 3",
        "3-4": "3 / 4",
        "3-2": "3 / 2",
        "2-3": "2 / 3",
        "16-9": "16 / 9",
        "9-16": "9 / 16",
      },
      fontSize: {
        small: "13px",
        medium: "20px",
        large: "36px",
        "x-large": "42px",
      },
      spacing: {
        20: "0.44rem",
        30: "0.67rem",
        40: "1rem",
        50: "1.5rem",
        60: "2.25rem",
        70: "3.38rem",
        80: "5.06rem",
      },
      boxShadow: {
        natural: "6px 6px 9px rgba(0, 0, 0, 0.2)",
        deep: "12px 12px 50px rgba(0, 0, 0, 0.4)",
        sharp: "6px 6px 0px rgba(0, 0, 0, 0.2)",
        outlined:
          "6px 6px 0px -3px rgba(255, 255, 255, 1), 6px 6px rgba(0, 0, 0, 1)",
        crisp: "6px 6px 0px rgba(0, 0, 0, 1)",
      },
    },
  },
  plugins: [],
};
