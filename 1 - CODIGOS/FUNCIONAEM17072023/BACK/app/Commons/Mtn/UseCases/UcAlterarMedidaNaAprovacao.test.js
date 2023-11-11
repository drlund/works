const UcAlterarMedidaNaAprovacao = require("./UcAlterarMedidaNaAprovacao");

const moment = require("moment");

const { mtnConsts } = require("../../Constants");
const { medidas, tiposAnexo, acoes } = mtnConsts;

const mockAnexoRepository = {
  salvarAnexos: jest.fn(),
};

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

const mockMedidaRepository = {
  getDadosMedida: jest.fn(),
};

const mockRecursoRepository = {
  getRecursoByEnvolvido: jest.fn(),
  create: jest.fn(),
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

const DADOS_ALTERACAO_MEDIDA = {
  idEnvolvido: 1,
  novaMedida: medidas.ORIENTACOES,
  novoParecer: "TEXTO DE UM NOVO PARECER",
  dadosUsuario: DADOS_USUARIO,
};

const runUseCase = async (
  { idEnvolvido, novaMedida, novoParecer, dadosUsuario },
  trx
) => {
  const ucAlterarMedidaNaAprovacao = new UcAlterarMedidaNaAprovacao({
    repository: {
      anexo: mockAnexoRepository,
      envolvido: mockEnvolvidoRepository,
      medida: mockMedidaRepository,
      recurso: mockRecursoRepository,
    },
    functions: {
      // A função foi passada dessa maneira para preservar o escopo do `this`
      insereTimeline: mockInsereTimeline,
    },
    trx,
  });

  const { error, payload } = await ucAlterarMedidaNaAprovacao.run({
    idEnvolvido,
    novaMedida,
    novoParecer,
    dadosUsuario,
  });

  return { error, payload };
};

describe("UcAlterarMedidaNaAprovacao", () => {
  const DADOS_ENVOLVIDO = {
    txt_analise: "TEXTO ORIGINAL DA ANÁLISE",
    id_medida: medidas.ORIENTACOES,
    mat_resp_analise: "F000000",
    nome_resp_analise: "FULANO ANALISTA",
  };

  it("com sucesso", async () => {
    mockEnvolvidoRepository.getDadosEnvolvido.mockResolvedValue(
      DADOS_ENVOLVIDO
    );
    const { error, payload } = await runUseCase(
      DADOS_ALTERACAO_MEDIDA,
      mockTrx
    );

    expect(error).toBeUndefined();
    expect(payload).toBeUndefined();

    expect(mockEnvolvidoRepository.getDadosEnvolvido).toBeCalledTimes(1);
    expect(mockEnvolvidoRepository.getDadosEnvolvido).toHaveBeenCalledWith(
      {
        idEnvolvido: DADOS_ALTERACAO_MEDIDA.idEnvolvido,
      },
      mockTrx
    );

    const dadosAprovacaoEsperado = {
      analista_matricula: DADOS_ENVOLVIDO.mat_resp_analise,
      analista_nome: DADOS_ENVOLVIDO.nome_resp_analise,
      analise_em: moment().format("YYYY-MM-DD HH:mm"),
      id_envolvido: DADOS_ALTERACAO_MEDIDA.idEnvolvido,
      aprovador_matricula: DADOS_USUARIO.chave,
      aprovador_nome: DADOS_USUARIO.nome_usuario,

      id_medida_proposta: DADOS_ENVOLVIDO.id_medida,
      parecer_proposto: DADOS_ENVOLVIDO.txt_analise,

      id_medida_aprovada: DADOS_ALTERACAO_MEDIDA.novaMedida,
      parecer_aprovado: DADOS_ALTERACAO_MEDIDA.novoParecer,

      alterado: true,
    };

    expect(mockEnvolvidoRepository.salvarAprovacaoMedida).toBeCalledTimes(1);
    expect(mockEnvolvidoRepository.salvarAprovacaoMedida).toHaveBeenCalledWith(
      dadosAprovacaoEsperado,
      mockTrx
    );

    expect(mockEnvolvidoRepository.update).toBeCalledTimes(1);
    expect(mockEnvolvidoRepository.update).toHaveBeenCalledWith(
      DADOS_ALTERACAO_MEDIDA.idEnvolvido,
      {
        id_medida: DADOS_ALTERACAO_MEDIDA.novaMedida,
        txt_analise: DADOS_ALTERACAO_MEDIDA.novoParecer,
        mat_resp_analise: DADOS_USUARIO.chave,
        nome_resp_analise: DADOS_USUARIO.nome_usuario,
      },
      mockTrx
    );

    expect(mockInsereTimeline).toBeCalledTimes(1);
    expect(mockInsereTimeline).toHaveBeenCalledWith({
      idEnvolvido: DADOS_ALTERACAO_MEDIDA.idEnvolvido,
      idAcao: acoes.ALTEROU_MEDIDA,
      dadosRespAcao: DADOS_USUARIO,
      tipoNotificacao: null,
      trx: mockTrx
    });
  });

  describe("com erros", () => {
    it("id do envolvido incorreto", async () => {
      const { error, payload } = await runUseCase(
        { ...DADOS_ALTERACAO_MEDIDA, idEnvolvido: undefined },
        mockTrx
      );

      expect(error[0]).toBe("É obrigatório informar o id do envolvido.");
      expect(error[1]).toBe(400);

      expect(payload).toBeUndefined();


    });

    it("não informar a nova medida", async () => {
      const { error, payload } = await runUseCase(
        { ...DADOS_ALTERACAO_MEDIDA, novaMedida: undefined },
        mockTrx
      );

      expect(error[0]).toBe(
        "Para o caso de alteração da medida, deve-se informar a nova medida e novo parecer."
      );
      expect(error[1]).toBe(400);
    });

    it("não informar o novo parecer", async () => {
      const { error, payload } = await runUseCase(
        { ...DADOS_ALTERACAO_MEDIDA, novoParecer: undefined },
        mockTrx
      );

      expect(error[0]).toBe(
        "Para o caso de alteração da medida, deve-se informar a nova medida e novo parecer."
      );
      expect(error[1]).toBe(400);

    });

    it("não informar o novo parecer nem a nova medida", async () => {
      const { error, payload } = await runUseCase(
        {
          ...DADOS_ALTERACAO_MEDIDA,
          novoParecer: undefined,
          novoParecer: undefined,
        },
        mockTrx
      );

      expect(error[0]).toBe(
        "Para o caso de alteração da medida, deve-se informar a nova medida e novo parecer."
      );
      expect(error[1]).toBe(400);
    });
  });
});
