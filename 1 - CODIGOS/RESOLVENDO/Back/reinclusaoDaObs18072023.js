/**
 * Este teste cria uma instância da sua controller e simula a chamada do método `gravarParametro` passando um objeto 
 * `parametroExistente`. Além disso, foram criados mocks para a use case `UcGravarParametro` e suas dependências, 
 * permitindo verificar se os métodos são chamados com os parâmetros corretos. 
 * 
 * Tenha certeza de ajustar o caminho dos arquivos de acordo com a estrutura do seu projeto.
 * 
 * Vamos reescrever a resposta utilizando os códigos fornecidos em sua afirmação e simulando o teste de unidade. 
 * Vou mostrar o teste de unidade utilizando o framework Jest:
*/

// **SuaController.js**:

const moment = require("moment");
const UcGravarParametro = require("./UcGravarParametro"); // Substitua pelo caminho correto para o arquivo da sua use case
const ParametrosAlcadasRepository = require("./ParametrosAlcadasRepository"); // Substitua pelo caminho correto para o arquivo da sua repository
const ParamAlcadasIncluirFactory = require("./ParamAlcadasIncluirFactory"); // Substitua pelo caminho correto para o arquivo da sua factory

class SuaController {
  async gravarParametro({ request, response, session, parametroExistente }) {
    const dadosDosParametros = request.allParams();
    const usuario = session.get("currentUserAccount");

    if (!parametroExistente.ativo) {
      const acao = "Inclusão";
      const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
      dadosDosParametros.observacao = `Matrícula: ${usuario.matricula} - Data: ${dataAtual} - Ação: ${acao} - ${dadosDosParametros.observacao}`;
    } else {
      const acao = "Reinclusão";
      const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
      dadosDosParametros.observacao = `Matrícula: ${usuario.matricula} - Data: ${dataAtual} - Ação: ${acao} - ${dadosDosParametros.observacao}`;
    }

    const ucGravarParametro = new UcGravarParametro(
      new ParametrosAlcadasRepository(),
      new ParamAlcadasIncluirFactory()
    );
    await ucGravarParametro.validate(usuario, dadosDosParametros);
    const parametroGravado = await ucGravarParametro.run();

    response.ok(parametroGravado);
  }
}

module.exports = SuaController;

// **Teste da SuaController**:
const moment = require("moment");
const SuaController = require("./SuaController"); // Substitua pelo caminho correto para o arquivo da sua controller

// Mock da sessão para fins de teste
const mockSession = {
  get: (key) => {
    // Simule a sessão retornando o usuário atual
    return {
      matricula: '12345', // Substitua por uma matrícula válida
    };
  },
};

// Mock das dependências
jest.mock("./UcGravarParametro"); // Substitua pelo caminho correto para o arquivo da sua use case
const UcGravarParametro = require("./UcGravarParametro");
const mockValidate = jest.fn();
const mockRun = jest.fn().mockResolvedValue("Parâmetro gravado com sucesso!"); // Substitua por um valor adequado
UcGravarParametro.mockImplementation(() => ({
  validate: mockValidate,
  run: mockRun,
}));

describe("Teste da sua controller", () => {
  it("Deve gravar o parâmetro existente com ativo = 1 e nova observação", async () => {
    // Crie um objeto para representar o parâmetro existente
    const parametroExistente = {
      ativo: "1", // Simule que o parâmetro existente já está ativo
    };

    // Crie um objeto com os dados do novo parâmetro
    const novoParametro = {
      prefixoDestino: "algumPrefixo",
      comissaoDestino: "algumaComissao",
      observacao: "Nova observação que será adicionada",
    };

    // Crie um objeto da sua controller e chame o método a ser testado
    const suaController = new SuaController();
    await suaController.gravarParametro({
      request: { allParams: () => novoParametro },
      response: {
        ok: (data) => {
          // Aqui você pode verificar o valor de "data" retornado na response, se necessário
          console.log(data);
        },
      },
      session: mockSession,
      parametroExistente: parametroExistente, // Passe o parâmetro existente para a controller
    });

    // Verifique se a use case foi criada com as dependências corretas
    expect(UcGravarParametro).toHaveBeenCalledWith(
      expect.any(ParametrosAlcadasRepository),
      expect.any(ParamAlcadasIncluirFactory)
    );

    // Verifique se a função de validação foi chamada com os parâmetros corretos
    expect(mockValidate).toHaveBeenCalledWith(
      mockSession.get("currentUserAccount"),
      novoParametro
    );

    // Verifique se a função run foi chamada
    expect(mockRun).toHaveBeenCalled();
  });
});

