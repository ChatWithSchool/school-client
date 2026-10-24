import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tailwind from 'eslint-plugin-tailwindcss';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import path from 'node:path';

const tailwindConfig = path.join(import.meta.dirname, 'tailwind.config.cjs');

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'public', 'coverage', 'storybook-static', '*.cjs'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh, tailwindcss: tailwind },
    // the closed palette: classes like bg-[#123456] or w-[420px] are not allowed, use the tokens
    settings: { tailwindcss: { config: tailwindConfig, callees: ['cx'] } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      'tailwindcss/no-arbitrary-value': 'error',
    },
  },
);
