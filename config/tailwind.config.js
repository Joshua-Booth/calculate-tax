const isProduction = process.env.NODE_ENV;

module.exports = {
  mode: "jit",
  purge: {
    content: isProduction ? ["./src/**/*.html", "./src/**/*.js"] : [],
    options: {
      safeList: [/^notif/],
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#5f51fc",
        grey: "#888888",
        "light-grey": "#b7bbc2",
        "dark-grey": "#343333",
      },
    },
  },
  variants: {
    extend: {},
  },
  corePlugins: {
    container: false,
  },
  plugins: [require("@tailwindcss/forms")],
};
