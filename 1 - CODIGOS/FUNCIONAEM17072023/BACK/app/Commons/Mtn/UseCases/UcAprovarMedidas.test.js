const UcAprovarMedidas = require("./UcAprovarMedidas");

const moment = require("moment");

const { mtnConsts } = require("../../Constants");
const { medidas, tiposAnexo, acoes } = mtnConsts;

const factoryMockAnexoRepository = () => {
  return {
    salvarAnexos: jest.fn(),
  };
};

const factoryMockEnvolvidoRepository = () => {
  return {
    getPareceresPendentesAprovacao: jest.fn(),
    getDadosEnvolvido: jest.fn(),
    salvarAprovacaoMedida: jest.fn(),
    getDadosCompletosEnvolvido: jest.fn(),
    moveAnexosToRecurso: jest.fn(),
    limparParecerEnvolvido: jest.fn(),
    marcarEnvolvidoComoAprovado: jest.fn(),
    update: jest.fn(),
  };
};

const factoryMockMedidaRepository = () => {
  return {
    getDadosMedida: jest.fn(),
  };
};

const factoryMockRecursoRepository = () => {
  return {
    getRecursoByEnvolvido: jest.fn(),
    create: jest.fn(),
  };
};

const mockTrx = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

const mockExecutarAcao = jest.fn();

const DADOS_USUARIO = {
  chave: "F0000000",
  nome_usuario: "FULANO DE TAL",
  prefixo: "0000",
  dependencia: "DEPENDENCIA EXEMPLO",
};

const IDS_ENVOLVIDOS = [{ id: 1 }, { id: 1 }, { id: 1 }];

const DADOS_APROVAR_MEDIDA = {
  idsEnvolvidos: IDS_ENVOLVIDOS,
  dadosUsuario: DADOS_USUARIO,
  deveRegistrarAprovacao: true,
};

const runUseCase = async ({
  idsEnvolvidos,
  dadosUsuario,
  deveRegistrarAprovacao,
  mockAnexoRepository,
  mockEnvolvidoRepository,
  mockMedidaRepository,
  mockRecursoRepository,
}) => {
  const ucAprovarMedidas = new UcAprovarMedidas({
    repository: {
      anexo: mockAnexoRepository,
      envolvido: mockEnvolvidoRepository,
      medida: mockMedidaRepository,
      recurso: mockRecursoRepository,
    },
    functions: {
      // A função foi passada dessa maneira para preservar o escopo do `this`
      executarAcao: mockExecutarAcao,
    },
    trx: mockTrx,
  });

  const { error, payload } = await ucAprovarMedidas.run({
    idsEnvolvidos,
    usuarioLogado: dadosUsuario,
    deveRegistrarAprovacao,
  });

  return { error, payload };
};

describe("UcAprovarMedidas", () => {
  describe("sucesso", () => {
    const DADOS_ENVOLVIDO = {
      txt_analise: "TEXTO ORIGINAL DA ANÁLISE",
      id_medida: medidas.ORIENTACOES,
      mat_resp_analise: "F000000",
      nome_resp_analise: "FULANO ANALISTA",
      anexos: [],
      recursos: [{ id: 1 }],
    };

    const mockAnexoRepository = factoryMockAnexoRepository();

    describe("com criação de recurso", () => {
      const mockMedidaRepository = factoryMockMedidaRepository();

      mockMedidaRepository.getDadosMedida.mockResolvedValue({
        id: medidas.ALERTA_ETICO_NEGOCIAL,
        cabe_recurso: true,
      });

      mockExecutarAcao.mockResolvedValue({
        id: 1,
      });

      const mockRecursoRepository = factoryMockRecursoRepository();
      mockRecursoRepository.create.mockResolvedValue({ id: 1 });

      it("sem anexos", async () => {
        const mockEnvolvidoRepository = factoryMockEnvolvidoRepository();
        mockEnvolvidoRepository.getPareceresPendentesAprovacao.mockResolvedValue(
          IDS_ENVOLVIDOS
        );
        mockEnvolvidoRepository.getDadosEnvolvido.mockResolvedValue({
          ...DADOS_ENVOLVIDO,
          recursos: [],
        });
        mockEnvolvidoRepository.moveAnexosToRecurso.mockResolvedValue();

        const { error, payload } = await runUseCase({
          ...DADOS_APROVAR_MEDIDA,
          mockAnexoRepository,
          mockEnvolvidoRepository,
          mockMedidaRepository,
          mockRecursoRepository,
        });

        expect(error).toBeUndefined();
        expect(Array.isArray(payload)).toBe(true);

        expect(mockEnvolvidoRepository.getDadosEnvolvido).toBeCalledTimes(
          IDS_ENVOLVIDOS.length * 3
        );

        const dadosAprovacao = {
          analista_matricula: DADOS_ENVOLVIDO.mat_resp_analise,
          analista_nome: DADOS_ENVOLVIDO.nome_resp_analise,
          analise_em: moment().format("YYYY-MM-DD HH:mm"),
          id_medida_proposta: DADOS_ENVOLVIDO.id_medida,
          aprovador_matricula: DADOS_APROVAR_MEDIDA.dadosUsuario.chave,
          aprovador_nome: DADOS_APROVAR_MEDIDA.dadosUsuario.nome_usuario,
          id_envolvido: DADOS_APROVAR_MEDIDA.idsEnvolvidos[0],
          id_medida_aprovada: DADOS_ENVOLVIDO.id_medida,
          parecer_proposto: DADOS_ENVOLVIDO.txt_analise,
          parecer_aprovado: DADOS_ENVOLVIDO.txt_analise,
          alterado: false,
        };

        expect(mockEnvolvidoRepository.salvarAprovacaoMedida).toBeCalledTimes(
          DADOS_APROVAR_MEDIDA.idsEnvolvidos.length
        );
        expect(mockEnvolvidoRepository.salvarAprovacaoMedida).toBeCalledWith(
          dadosAprovacao,
          mockTrx
        );

        expect(mockRecursoRepository.create).toBeCalledTimes(
          IDS_ENVOLVIDOS.length
        );

        expect(mockEnvolvidoRepository.moveAnexosToRecurso).toBeCalledTimes(0);
      });

      it("com anexos", async () => {
        const mockEnvolvidoRepository = factoryMockEnvolvidoRepository();
        mockEnvolvidoRepository.getPareceresPendentesAprovacao.mockResolvedValue(
          IDS_ENVOLVIDOS
        );
        mockEnvolvidoRepository.getDadosEnvolvido.mockResolvedValue({
          ...DADOS_ENVOLVIDO,
          recursos: [],
          anexos: [{ id: 1 }, { id: 2 }],
        });
        mockEnvolvidoRepository.moveAnexosToRecurso.mockResolvedValue();

        const { error, payload } = await runUseCase({
          ...DADOS_APROVAR_MEDIDA,
          mockAnexoRepository,
          mockEnvolvidoRepository,
          mockMedidaRepository,
          mockRecursoRepository,
        });

        expect(error).toBeUndefined();
        expect(Array.isArray(payload)).toBe(true);

        expect(mockEnvolvidoRepository.getDadosEnvolvido).toBeCalledTimes(
          IDS_ENVOLVIDOS.length * 3
        );

        const dadosAprovacao = {
          analista_matricula: DADOS_ENVOLVIDO.mat_resp_analise,
          analista_nome: DADOS_ENVOLVIDO.nome_resp_analise,
          analise_em: moment().format("YYYY-MM-DD HH:mm"),
          id_medida_proposta: DADOS_ENVOLVIDO.id_medida,
          aprovador_matricula: DADOS_APROVAR_MEDIDA.dadosUsuario.chave,
          aprovador_nome: DADOS_APROVAR_MEDIDA.dadosUsuario.nome_usuario,
          id_envolvido: DADOS_APROVAR_MEDIDA.idsEnvolvidos[0],
          id_medida_aprovada: DADOS_ENVOLVIDO.id_medida,
          parecer_proposto: DADOS_ENVOLVIDO.txt_analise,
          parecer_aprovado: DADOS_ENVOLVIDO.txt_analise,
          alterado: false,
        };

        expect(mockEnvolvidoRepository.salvarAprovacaoMedida).toBeCalledTimes(
          DADOS_APROVAR_MEDIDA.idsEnvolvidos.length
        );
        expect(mockEnvolvidoRepository.salvarAprovacaoMedida).toBeCalledWith(
          dadosAprovacao,
          mockTrx
        );

        expect(mockRecursoRepository.create).toBeCalledTimes(
          IDS_ENVOLVIDOS.length
        );

        expect(mockEnvolvidoRepository.moveAnexosToRecurso).toBeCalledTimes(
          IDS_ENVOLVIDOS.length
        );
      });
    });

    describe("sem criação recurso", () => {
      const mockMedidaRepository = factoryMockMedidaRepository();

      mockMedidaRepository.getDadosMedida.mockResolvedValue({
        id: medidas.ORIENTACOES,
        cabe_recurso: false,
      });

      mockExecutarAcao.mockResolvedValue({
        id: 1,
      });

      const mockRecursoRepository = factoryMockRecursoRepository();
      mockRecursoRepository.create.mockResolvedValue({ id: 1 });

      it("sucesso", async () => {
        const mockEnvolvidoRepository = factoryMockEnvolvidoRepository();
        mockEnvolvidoRepository.getPareceresPendentesAprovacao.mockResolvedValue(
          IDS_ENVOLVIDOS
        );
        mockEnvolvidoRepository.getDadosEnvolvido.mockResolvedValue({
          ...DADOS_ENVOLVIDO,
          recursos: [],
        });
        mockEnvolvidoRepository.moveAnexosToRecurso.mockResolvedValue();

        const { error, payload } = await runUseCase({
          ...DADOS_APROVAR_MEDIDA,
          mockAnexoRepository,
          mockEnvolvidoRepository,
          mockMedidaRepository,
          mockRecursoRepository,
        });

        expect(error).toBeUndefined();
        expect(Array.isArray(payload)).toBe(true);

        expect(mockEnvolvidoRepository.getDadosEnvolvido).toBeCalledTimes(
          IDS_ENVOLVIDOS.length * 2
        );

        const dadosAprovacao = {
          analista_matricula: DADOS_ENVOLVIDO.mat_resp_analise,
          analista_nome: DADOS_ENVOLVIDO.nome_resp_analise,
          analise_em: moment().format("YYYY-MM-DD HH:mm"),
          id_medida_proposta: DADOS_ENVOLVIDO.id_medida,
          aprovador_matricula: DADOS_APROVAR_MEDIDA.dadosUsuario.chave,
          aprovador_nome: DADOS_APROVAR_MEDIDA.dadosUsuario.nome_usuario,
          id_envolvido: DADOS_APROVAR_MEDIDA.idsEnvolvidos[0],
          id_medida_aprovada: DADOS_ENVOLVIDO.id_medida,
          parecer_proposto: DADOS_ENVOLVIDO.txt_analise,
          parecer_aprovado: DADOS_ENVOLVIDO.txt_analise,
          alterado: false,
        };

        expect(mockEnvolvidoRepository.salvarAprovacaoMedida).toBeCalledTimes(
          DADOS_APROVAR_MEDIDA.idsEnvolvidos.length
        );
        expect(mockEnvolvidoRepository.salvarAprovacaoMedida).toBeCalledWith(
          dadosAprovacao,
          mockTrx
        );

        expect(mockRecursoRepository.create).toBeCalledTimes(0);
      });
    });
  });

  describe("erro", () => {
    const mockAnexoRepository = factoryMockAnexoRepository();
    const mockMedidaRepository = factoryMockMedidaRepository();
    const mockRecursoRepository = factoryMockRecursoRepository();

    it("sem lista e envolvidos", async () => {
      const mockEnvolvidoRepository = factoryMockEnvolvidoRepository();

      const { error, payload } = await runUseCase({
        ...{ ...DADOS_APROVAR_MEDIDA, idsEnvolvidos: [] },
        mockAnexoRepository,
        mockEnvolvidoRepository,
        mockMedidaRepository,
        mockRecursoRepository,
      });

      expect(payload).toBeUndefined();
      expect(error).not.toBeUndefined();
      expect(error).toStrictEqual([
        "É obrigatório informar a lista de envolvidos cujas medidas devem ser aprovadas.",
        400,
      ]);
    });

    it("pareceres não pendentes de aprovacao", async () => {
      const mockEnvolvidoRepository = factoryMockEnvolvidoRepository();
      // Dois elementos pendentes de aprovação sendo que três são passados
      mockEnvolvidoRepository.getPareceresPendentesAprovacao.mockResolvedValue([
        { id: 1 },
        { id: 2 },
      ]);

      const { error, payload } = await runUseCase({
        ...{ ...DADOS_APROVAR_MEDIDA },
        mockAnexoRepository,
        mockEnvolvidoRepository,
        mockMedidaRepository,
        mockRecursoRepository,
      });

      expect(payload).toBeUndefined();
      expect(error).not.toBeUndefined();

      expect(error).toStrictEqual([
        "Um ou mais dos pareceres recebidos não estão pendentes de aprovação.",
        400,
      ]);
    });
  });
});
