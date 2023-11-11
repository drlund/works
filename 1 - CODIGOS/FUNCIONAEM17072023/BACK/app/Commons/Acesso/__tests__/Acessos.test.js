const UCFindPermissoesUsuario = require("../UseCases/UCFindPermissoesUsuario")

describe('Gestão de Acesso Ferramentas V8', () => {
  it('Usuário acessa a aplicação', () => {
    const permissoes = new UCFindPermissoesUsuario({
      repository: {
        concessoesAcessos: {
          findConcessoesAtivas: jest.fn()
        }
      }
    });
    const { error, payload } = permissoes.run();
    expect(error).toBe(undefined);
    expect(payload).toBe(undefined);
  });

  it.todo('Lista as Ferramentas Cadastradas');

  it.todo('Salva Nova Ferramenta');

  it.todo('Deleta Ferramenta');

  it.todo('Lista os Tipos de Acesso');

  it.todo('Lista Todas as Concessões Ativas');

  it.todo('Salva Concessão de Acesso');

  it.todo('Deleta Concessão de Acesso');

})
