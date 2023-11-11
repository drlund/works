const mockException = jest.fn();

globalThis.use = jest.fn().mockReturnValue(mockException);

const UcDevolveMedidaParaAnalise = require("./UcDevolverMedidaParaAnalise");

const { mtnConsts } = require("../../Constants");
const { medidas, acoes } = mtnConsts;

const mockEnvolvidoRepository = {
  getPareceresPendentesAprovacao: jest.fn(),
  getDadosEnvolvido: jest.fn(),
  salvarAprovacaoMedida: jest.fn(),
  getDadosCompletosEnvolvido: jest.fn(),
  moveAnexosToRecurso: jest.fn(),
  limparParecerEnvolvido: jest.fn(),
  marcarEnvolvidoComoAprovado: jest.fn(),
  update: jest.fn(),
};

const mockTrx = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

const mockInsereTimeline = jest.fn();

const DADOS_USUARIO = {
  chave: "F0000000",
  nome_usuario: "FULANO DE TAL",
  prefixo: "0000",
  dependencia: "DEPENDENCIA EXEMPLO",
};

const ID_ENVOLVIDO = "000";

const runUseCase = async ({ idEnvolvido, dadosUsuario }, trx) => {
  const ucDevolverMedidaParaAnalise = new UcDevolveMedidaParaAnalise({
    repository: {
      envolvido: mockEnvolvidoRepository,
    },
    functions: {
      insereTimeline: mockInsereTimeline,
    },
    trx,
  });

  const { error, payload } = await ucDevolverMedidaParaAnalise.run({
    idEnvolvido,
    usuarioLogado: dadosUsuario,
  });

  return { error, payload };
};

describe("UcDevolverMedidaParaAnalise", () => {
  describe("devolvido com sucesso", () => {
    mockEnvolvidoRepository.getDadosEnvolvido.mockResolvedValue({
      aprovacao_pendente: true,
    });

    it("não retornou um erro", async () => {
      const { error } = await runUseCase(
        {
          idEnvolvido: ID_ENVOLVIDO,
          dadosUsuario: DADOS_USUARIO,
        },
        mockTrx
      );
      expect(error).toBeUndefined();
    });

    it("não retorna payload", async () => {
      const { payload } = await runUseCase(
        {
          idEnvolvido: ID_ENVOLVIDO,
          dadosUsuario: DADOS_USUARIO,
        },
        mockTrx
      );
      expect(payload).toBeUndefined();
    });

    it("o envolvido está pendente de aprovação", async () => {
      await runUseCase(
        {
          idEnvolvido: ID_ENVOLVIDO,
          dadosUsuario: DADOS_USUARIO,
        },
        mockTrx
      );

      expect(mockEnvolvidoRepository.getDadosEnvolvido).toBeCalledTimes(1);
      expect(mockEnvolvidoRepository.getDadosEnvolvido).toBeCalledWith({
        idEnvolvido: ID_ENVOLVIDO,
      });
    });

    it("dados do envolvido atualizados corretamente", async () => {
      await runUseCase(
        {
          idEnvolvido: ID_ENVOLVIDO,
          dadosUsuario: DADOS_USUARIO,
        },
        mockTrx
      );

      expect(mockEnvolvidoRepository.update).toBeCalledTimes(1);
      expect(mockEnvolvidoRepository.update).toBeCalledWith(
        ID_ENVOLVIDO,
        {
          aprovacao_pendente: false,
          enviado_aprovacao_em: null,
        },
        mockTrx
      );
    });

    it("dados da timeline inseridos corretamente", async () => {
      await runUseCase(
        {
          idEnvolvido: ID_ENVOLVIDO,
          dadosUsuario: DADOS_USUARIO,
        },
        mockTrx
      );

      expect(mockInsereTimeline).toBeCalledTimes(1);
      expect(mockInsereTimeline).toBeCalledWith({
        idEnvolvido: ID_ENVOLVIDO,
        idAcao: acoes.DEVOLVER_PARA_ANALISE,
        dadosRespAcao: DADOS_USUARIO,
        tipoNotificacao: null,
        trx: mockTrx,
      });
    });
  });

  describe("erros", () => {
    it("id do envolvido não informado", async () => {
      const { error } = await runUseCase(
        {
          dadosUsuario: DADOS_USUARIO,
        },
        mockTrx
      );

      expect(Array.isArray(error)).toBe(true);
      expect(error[0]).toBe("É obrigado informar o id do envolvido.");
      expect(error[1]).toBe(400);
    });

    it("envolvido não está pendente", async () => {
      mockEnvolvidoRepository.getDadosEnvolvido.mockResolvedValue({
        aprovacao_pendente: false,
      });

      const { error, payload } = await runUseCase(
        {
          idEnvolvido: ID_ENVOLVIDO,
          dadosUsuario: DADOS_USUARIO,
        },
        mockTrx
      );

      expect(Array.isArray(error)).toBe(true);
      expect(error[0]).toBe("Envolvido não está pendente de aprovação.");
      expect(error[1]).toBe(400);
    });
  });
});
