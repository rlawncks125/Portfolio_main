module.exports = {
  plugins: ["cypress"],
  env: {
    // mocha: true,
    jet: true,
    "cypress/globals": true,
  },
  rules: {
    strict: "off",
  },
};
