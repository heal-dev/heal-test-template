import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'node_modules/**',
      'test-results/**',
      'heal-traces/**',
      'playwright-report/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx,js,mjs,cjs}'],
    languageOptions: {
      parser: tseslint.parser,
    },
  },
];
