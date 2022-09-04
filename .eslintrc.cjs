module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "import/no-unresolved": "off", // until https://github.com/import-js/eslint-plugin-import/pull/2483
    "@typescript-eslint/no-floating-promises": "warn",
  },
  ignorePatterns: ["**/*.js", "**/*.cjs"],
};
