module.exports = {
  plugins: ["./lib/index.js"],
  rules: {
    "./lib/index.js/vue-script-setup-order": "error",
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    parser: "@typescript-eslint/parser",
  },
};
