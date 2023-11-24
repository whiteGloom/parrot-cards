module.exports = {
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "react-app",
    "react-app/jest",
  ],
  "plugins": ["react","@typescript-eslint"],
  "rules": {
    "semi": ["error","always"],
    "array-callback-return": "error",
    "eqeqeq": ["error", "always"],
    "space-before-blocks": "error",
    "no-multi-spaces": "error",
    "quotes": ["error", "single"],
    "keyword-spacing": "error",
    "comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline",
      "functions": "never"
    }]
  },
  "globals": {
    'gapi': 'readonly',
    'google': 'readonly',
  },
  "parser": "@typescript-eslint/parser",
  "root": true,
  "parserOptions": {
    "project": true
  }
}