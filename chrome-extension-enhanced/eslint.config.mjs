import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'public', 'node_modules', 'test-results', 'playwright-report'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    // scripts配下はNode.jsで直接実行するスクリプト
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        URL: 'readonly',
        // page.evaluate / worker.evaluate のコールバック内で参照される
        document: 'readonly',
        chrome: 'readonly',
      },
    },
  },
  {
    // Playwright のフィクスチャは空の分割代入パターンを使う書き方が公式の作法
    files: ['tests/**/*.ts'],
    rules: {
      'no-empty-pattern': 'off',
    },
  }
);
