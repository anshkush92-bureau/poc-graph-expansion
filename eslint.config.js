import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '.sizeout', '.sizeprobe', 'graphify-out', '.bench-drivers'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    languageOptions: {
      ecmaVersion: 2022,
      globals: { window: 'readonly', document: 'readonly', performance: 'readonly',
                 localStorage: 'readonly', requestAnimationFrame: 'readonly',
                 cancelAnimationFrame: 'readonly', setTimeout: 'readonly',
                 clearTimeout: 'readonly', setInterval: 'readonly', clearInterval: 'readonly',
                 ResizeObserver: 'readonly', PerformanceObserver: 'readonly', console: 'readonly',
                 confirm: 'readonly', self: 'readonly', Worker: 'readonly', URL: 'readonly',
                 MouseEvent: 'readonly', PointerEvent: 'readonly' }
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Deliberate mount-only effects are everywhere in the adapters and each
      // one is commented. A warning keeps them visible without blocking work;
      // each gets an explicit disable comment as its file is migrated.
      'react-hooks/exhaustive-deps': 'warn',
      // eslint-plugin-react-hooks@7 folds the whole React Compiler readiness
      // suite into `recommended`. This app predates React Compiler and the
      // "latest ref" callback-caching pattern (`ref.current = fn` during
      // render, read back in an effect/handler) is deliberate and pervasive
      // across every adapter, as is the odd impure read (performance.now())
      // used purely for instrumentation. Downgraded to warn for the same
      // reason as exhaustive-deps: addressed file by file as each adapter is
      // migrated, not blocked wholesale here.
      'react-hooks/refs': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Escape hatch of last resort, and it must say why.
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }]
    }
  }
)
