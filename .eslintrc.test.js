module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["./lib/index.js"],
  rules: {
    "vue-code-order/vue-script-setup-order": "error",
    "no-unused-vars": "off",
    "no-undef": "off",
  },
};
