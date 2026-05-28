module.exports = {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    // Força o Jest a ler a versão do uuid feita para o Node antigo
    '^uuid$': require.resolve('uuid')
  }
};