import js from '@eslint/js'
import { Linter } from 'eslint'
import * as vuelint from 'eslint-plugin-vue'

export default [
  js.configs.recommended,
  {
    files: [
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
      '**/*.ts',
      '**/*.cts',
      '**/*.tsx',
      '**/*.mts',
      '**/*.vue'
    ],
    ignores: ['**/node_modules/**', 'dist/**', '**/*.config.*'],
    rules: {
      'prefer-const': 'warn',
      'no-constant-binary-expression': 'error'
    },
    plugins: {
      vue: vuelint
    }
  }
] satisfies Linter.Config[]
