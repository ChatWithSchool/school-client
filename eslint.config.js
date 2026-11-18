import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tailwind from 'eslint-plugin-tailwindcss';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import path from 'node:path';

const tailwindConfig = path.join(import.meta.dirname, 'tailwind.config.cjs');

// The tailwindcss plugin only checks className and the cx() calls. Class strings also live in
// constant maps (VARIANT, SIZE, TONE in components/ui), so these patterns check every string.
// A pattern may not contain "/" (the selector syntax ends the pattern there).

/** An arbitrary value (w-[420px], bg-[#123456]); a variant such as data-[state=open]: is fine. */
const ARBITRARY = String.raw`(^|[\s:])-?[a-z][a-z0-9-]*-\[[^\]\s]+\](?!:)`;

/** A physical direction class: the screens are RTL, so use the logical ones. */
const PHYSICAL = [
  String.raw`(^|[\s:])-?(ml|mr|pl|pr|left|right|scroll-ml|scroll-mr|scroll-pl|scroll-pr)-\S`,
  String.raw`(^|[\s:])text-(left|right)(?=\s|$)`,
  String.raw`(^|[\s:])(rounded|border)-(l|r|tl|tr|bl|br)(?=[-\s]|$)`,
].join('|');

const classPatterns = (pattern, message) => [
  { selector: `Literal[value=/${pattern}/]`, message },
  { selector: `TemplateElement[value.raw=/${pattern}/]`, message },
];

/** Warns on a JSX style attribute: only a value computed at run time may use it. */
const noInlineStyle = {
  meta: {
    type: 'suggestion',
    messages: {
      style:
        'Use token classes instead of style. Inline style is only for a value computed at run time: disable this line with a reason.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.type === 'JSXIdentifier' && node.name.name === 'style')
          context.report({ node, messageId: 'style' });
      },
    };
  },
};

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'public', 'coverage', 'storybook-static', '*.cjs'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  // Node scripts that run from npm (for example contract:sync)
  { files: ['scripts/**/*.mjs'], languageOptions: { globals: { ...globals.node } } },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      tailwindcss: tailwind,
      local: { rules: { 'no-inline-style': noInlineStyle } },
    },
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
      'no-restricted-syntax': [
        'error',
        ...classPatterns(
          ARBITRARY,
          'No arbitrary Tailwind values (w-[420px], bg-[#123456]): use the design tokens, or add a token to tailwind.config.cjs.',
        ),
        ...classPatterns(
          PHYSICAL,
          'No physical direction classes in an RTL app: use the logical ones (ms-/me-, ps-/pe-, start-/end-, text-start/text-end, rounded-s/rounded-e, border-s/border-e).',
        ),
      ],
      'local/no-inline-style': 'warn',
    },
  },
);
