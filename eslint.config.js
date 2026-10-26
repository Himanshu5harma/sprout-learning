import js from "@eslint/js";
import tseslint from "typescript-eslint";
import hooks from "eslint-plugin-react-hooks";
import globals from "globals";
export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "output/**",
      "node_modules/**",
      "public/preview-runtime.js",
      "src/generated/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
  })),
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { "react-hooks": hooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["src/execution/{guest-bootstrap,react-guest}.js"],
    languageOptions: {
      globals: Object.fromEntries(
        [
          "__sproutSend",
          "__sproutSchedule",
          "__sproutCancel",
          "__sproutEqual",
          "__sproutClearTimers",
          "__sproutTimerCount",
          "__sproutLoad",
          "__sproutRender",
          "__sproutUnmount",
          "__sproutEvent",
        ].map((key) => [key, "readonly"]),
      ),
    },
  },
  {
    files: ["scripts/verify-*.mjs"],
    languageOptions: {
      globals: {
        document: "readonly",
        localStorage: "readonly",
        window: "readonly",
        getComputedStyle: "readonly",
        innerWidth: "readonly",
        innerHeight: "readonly",
      },
    },
  },
);
