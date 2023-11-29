/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#414440",
          300: "#3c5693",
          500: "#7aa6d9",
          700: "#a3e1fe",
        },
        secondary: {
          100: "#3d4e2a",
          300: "#60a85d",
          500: "#6bcf9a",
          700: "#abf7e3",
        },
        fg: {
          primary: "#1f201f",
          secondary: "#eff1ea",
          accent: "#90b65b",
          dimmed: "#a0ae87",
          "alt-1": "#63806f",
          "alt-2": "#50584b",
          "alt-3": "#98d7b6",
          "alt-4": "#b4b97a",
          success: "#48a548",
          error: "#bb1f1f",
          warning: "#e9b604",
        },
        bg: {
          primary: "#eff1ea",
          secondary: "#000000",
          accent: "#bee294",
          "alt-1": "#c5dcaf",
          "alt-2": "#d5d4cc",
          "alt-3": "#3d4359",
          "alt-4": "#458433",
          success: "#caeec0",
          error: "#eec0ca",
          warning: "#eeeac0",
          header: "#000000",
          footer: "#eff1ea",
        },
        "box-shadow": "#00000025",
      },
      fontFmaily: {
        righteous: ["Righteous", "sans-serif"],
        tenorsans: ["Tenor Sans", "sans-serif"],
        fahkwang: ["Fahkwang", "sans-serif"],
        syncopate: ["Syncopate", "sans-serif"],
        cinzel: ["Cinzel", "serif"],
        noto: ["Noto Serif Display", "serif"],
      },
      screens: {
        xs: "480px",
        sm: "768px",
        md: "1060px",
      },
      backgroundImage: (theme) => ({
        "gradient-header": "linear-gradient( 200deg, #000000, #414440)",
        "gradient-footer": "linear-gradient( 160deg, #000000, #414440)",
      }),
    },
  },
  plugins: [],
};
