import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import {globalIgnores} from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config([globalIgnores(['dist']), {
  files: ['**/*.{ts,tsx}'],
  plugins: {
    '@stylistic': stylistic,
  },
  extends: [
    stylistic.configs.recommended,
    js.configs.recommended,
    tseslint.configs.recommended,
    reactHooks.configs['recommended-latest'],
    reactRefresh.configs.vite,
  ],
  rules: {
    'react-refresh/only-export-components': 'off',
    '@stylistic/semi': ['error', 'always'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        caughtErrors: 'none',
      },
    ],
  },
  languageOptions: {
    ecmaVersion: 2020, globals: globals.browser,
  },
}]);
