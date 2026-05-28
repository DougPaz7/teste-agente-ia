jest.mock('uuid', () => ({ v4: () => 'id-falso' }));

const { tools } = require("./server");

describe("Testes Unitários - Ferramentas do Agente (Tópico 8)", () => {

  // Teste da ferramenta de tempo
  test("Deve retornar a data e hora do sistema no formato string", () => {
    const resultado = tools.getTime();
    expect(typeof resultado).toBe("string");
    expect(resultado).not.toBeNull();
  });

  // Teste positivo da calculadora
  test("Deve calcular uma expressão matemática válida com sucesso", () => {
    const resultado = tools.calculate("1250 - 350");
    expect(resultado).toBe("900");
  });

  // Teste negativo da calculadora
  test("Deve tratar uma expressão inválida e retornar 'Erro ao calcular'", () => {
    const resultado = tools.calculate("10 / 0 + abc");
    expect(resultado).toBe("Erro ao calcular");
  });

});