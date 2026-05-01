import js from "@eslint/js"
import tseslint from "typescript-eslint"
import pluginVue from "eslint-plugin-vue"
import vueParser from "vue-eslint-parser"
import globals from "globals"

export default tseslint.config(
  {
    ignores: ["dist/**", "coverage/**", "e2e/**", "*.config.ts", "*.config.js"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],

  {
    files: ["src/**/*.{ts,vue}"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        project: "./tsconfig.json",
        extraFileExtensions: [".vue"],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/await-thenable": "error",
      "vue/component-api-style": ["error", ["script-setup"]],
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
      "vue/no-v-html": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "vue/max-attributes-per-line": "off",
      "vue/html-indent": "off",
      "vue/html-self-closing": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/multiline-html-element-content-newline": "off",
      "vue/html-closing-bracket-newline": "off",
    },
  },

  {
    files: ["src/test/**/*.{ts,vue}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
)
