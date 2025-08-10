module.exports = {
  env: {
    node: true,
    es2020: true,
  },
  extends: ["eslint:recommended", "@vue/typescript/recommended"],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    parser: "@typescript-eslint/parser",
  },
  plugins: ["@typescript-eslint", "vue"],
  rules: {
    "vue-code-order/vue-script-setup-order-simple": [
      "error",
      {
        allowCyclicDependencies: true,
      },
    ],
  },
};
