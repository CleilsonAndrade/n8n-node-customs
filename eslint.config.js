import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 1. Configurações Globais de Ignorar
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      'coverage',
      '.env',
      '.env.*',
      '*.d.ts',
      'eslint.config.js',
    ],
  },
  eslint.configs.recommended, // Regras recomendadas do ESLint
  ...tseslint.configs.recommended, // Regras recomendadas para TypeScript
  prettier, // Desabilita regras do ESLint que conflitam com Prettier
  {
    plugins: {
      prettier: prettierPlugin,
    },
    files: ['**/*.{js,jsx,ts,tsx}'], // Aplica-se a todos os arquivos de código
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest', // Usa a versão mais recente do ECMAScript
        sourceType: 'module',
        // A linha abaixo só é necessária para projetos React. Comente ou remova para projetos NestJS.
        project: './tsconfig.json', // Aponta para o tsconfig.json do projeto atual
      },
      globals: {
        ...globals.node, // Para ambientes Node.js (NestJS)
        ...globals.jest, // Para ambientes de teste (Jest)
      },
    },
    rules: {
      'prettier/prettier': 'error', // Garante que o Prettier seja executado como uma regra do ESLint
      '@typescript-eslint/no-unused-vars': 'off', // Desativa a regra de variáveis não utilizadas (ajuste se preferir 'warn' ou 'error')
      '@typescript-eslint/no-explicit-any': 'warn', // Avisa sobre o uso de 'any' (ajuste se preferir 'error')
    },
  }
);
