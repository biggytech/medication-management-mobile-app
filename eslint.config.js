// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const pluginQuery = require("@tanstack/eslint-plugin-query");

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  ...pluginQuery.configs["flat/recommended"],
  {
    ignores: ["dist/*"],
    rules: {
      "prettier/prettier": "error",

      // disable for toastify-react-native lib type errors
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);
