module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build', // Alterações no sistema de build ou dependências externas
        'ci', // Alterações nos arquivos e scripts de CI
        'docs', // Apenas mudanças na documentação
        'feat', // Nova funcionalidade
        'fix', // Correção de bug
        'perf', // Mudança de código que melhora a performance
        'refactor', // Mudança de código que não corrige bug nem adiciona funcionalidade
        'style', // Mudanças que não afetam o significado do código (espaços, formatação, etc)
        'test', // Adição de testes ou correção de testes existentes
        'chore', // Outras mudanças que não modificam src ou arquivos de teste
        'revert', // Reverte um commit anterior
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
  },
};