module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: "module",
    parser: "@typescript-eslint/parser",
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:nuxt/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    indent: ["warn", 2],
    quotes: ["error", "double"],
    // "vue/html-closing-bracket-newline": [
    //   "warn",
    //   {
    //     singleline: "never",
    //     multiline: "always",
    //   },
    // ],
    "vue/html-self-closing": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/multi-word-component-names": [
      "error",
      {
        ignores: ["./pages/*"],
      },
    ],
    "vue/no-unused-vars": "warn",
    "vue/script-setup-no-uses-vars": "off",
    "vue/singleline-html-element-content-newline": "off",
  },
  overrides: [
    {
      files: ["layouts/*.vue", "pages/**/*.vue"],
      rules: { "vue/multi-word-component-names": "off" },
    },
  ],
};
