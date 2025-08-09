module.exports = {
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    parser: {
      ts: "@typescript-eslint/parser",
    },
  },
  plugins: ["vue-code-order"],
  rules: {
    "vue-code-order/vue-script-setup-order-simple": [
      "error",
      {
        allowCyclicDependencies: false,
      },
    ],
  },
};
