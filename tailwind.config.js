module.exports = {
  content: ["./src/**/*.{html,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      mapHeight: {
        mobile: "calc(100vh - 19rem)",
      },
    },
    screens: {
      sm: "700px",
      // => @media (min-width: 700px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [],
};
