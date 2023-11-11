const { truncate } = require("lodash");
const { mtnConsts } = require("../../Constants");
const UcVersionarOcorrencia = require("./UcVersionarOcorrencia");

const ID_MTN = 9999;

const MOCK_TRX = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

const DADOS_USUARIO = {
  chave: "F0000000",
  nome_usuario: "FULANO DE TAL",
  prefixo: "0000",
  dependencia: "DEPENDENCIA EXEMPLO",
};

const DADOS_ENVOLVIDO_FINALIZADO = {
  id: 1,
  respondido_em: "0000-00-00",
  aprovacao_pendente: false,
  versionado: false,
  id_mtn: ID_MTN
};

const DADOS_ENVOLVIDO_FINALIZADO_VERSIONADO = {
  id: 1,
  respondido_em: "0000-00-00",
  aprovacao_pendente: false,
  versionado: true,
  id_mtn: ID_MTN
};

const DADOS_ENVOLVIDO_NAO_FINALIZADO = {
  id: 1,
  respondido_em: null,
  aprovacao_pendente: false,
  id_mtn: ID_MTN
};

const mockEnvolvidoRepository = {
  duplicar: jest.fn(),
  update: jest.fn(),
  getDadosEnvolvido: jest.fn(),
};

const mockMtnRepository = {
  update: jest.fn(),
};

const mockInsereTimeline = jest.fn();

const MOCK_ID_ENVOLVIDO = 9999;
const AGORA = "0000-00-00";

const _runUseCase = async (idEnvolvido) => {
  const ucVersionarOcorrencia = new UcVersionarOcorrencia({
    repository: {
      envolvido: mockEnvolvidoRepository,
      mtn: mockMtnRepository,
    },
    functions: {
      insereTimeline: mockInsereTimeline,
    },
    trx: MOCK_TRX,
  });

  const { error, payload } = await ucVersionarOcorrencia.run({
    idEnvolvido,
    dadosUsuario: DADOS_USUARIO,
    agora: AGORA,
  });

  return { error, payload };
};

describe("UcVersionarOcorrencia", () => {
  describe("sucesso ao versionar ocorrência", () => {
    beforeEach(() => {
      mockEnvolvidoRepository.getDadosEnvolvido.mockResolvedValue(
        DADOS_ENVOLVIDO_FINALIZADO
      );
      mockEnvolvidoRepository.duplicar.mockResolvedValue(
        DADOS_ENVOLVIDO_FINALIZADO
      );
    });

    it("não devem ser retornados erros e payload", async () => {
      const { error, payload } = await _runUseCase(MOCK_ID_ENVOLVIDO);

      expect(error).toBeUndefined();
      expect(payload).toBeUndefined();
    });

    it("verificação do retorno dos dados do envolvido", async () => {
      await _runUseCase(MOCK_ID_ENVOLVIDO);

      expect(mockEnvolvidoRepository.getDadosEnvolvido).toHaveBeenCalledTimes(
        1
      );
      expect(mockEnvolvidoRepository.getDadosEnvolvido).toHaveBeenCalledWith(
        { idEnvolvido: MOCK_ID_ENVOLVIDO },
        MOCK_TRX
      );
    });

    it("verifica a duplicação dos dados do envolvido", async () => {
      await _runUseCase(MOCK_ID_ENVOLVIDO);

      expect(mockEnvolvidoRepository.duplicar).toHaveBeenCalledTimes(1);
      expect(mockEnvolvidoRepository.duplicar).toHaveBeenCalledWith(
        MOCK_ID_ENVOLVIDO,
        MOCK_TRX
      );
    });

    it("verifica a atualização da ocorrência sendo versionada", async () => {
      await _runUseCase(MOCK_ID_ENVOLVIDO);

      expect(mockEnvolvidoRepository.update).toHaveBeenCalledTimes(1);
      expect(mockEnvolvidoRepository.update).toHaveBeenCalledWith(
        MOCK_ID_ENVOLVIDO,
        {
          versao_id_nova: DADOS_ENVOLVIDO_FINALIZADO.id,
          versionado: true,
          versionado_em: AGORA,
          versionado_por_matricula: DADOS_USUARIO.chave,
          versionado_por_nome: DADOS_USUARIO.nome_usuario,
        },
        MOCK_TRX
      );
    });

    it("verifica a inserção nas timelines", async () => {
      await _runUseCase(MOCK_ID_ENVOLVIDO);
      expect(mockInsereTimeline).toHaveBeenCalledTimes(2);

      expect(mockInsereTimeline).toHaveBeenCalledWith(
        MOCK_ID_ENVOLVIDO,
        mtnConsts.acoes.VERSIONAR_OCORRENCIA,
        DADOS_USUARIO,
        null,
        false,
        MOCK_TRX
      );

      expect(mockInsereTimeline).toHaveBeenCalledWith(
        DADOS_ENVOLVIDO_FINALIZADO.id,
        mtnConsts.acoes.CRIACAO_NOVA_VERSAO,
        DADOS_USUARIO,
        null,
        false,
        MOCK_TRX
      );
    });

    it("verifica a reabertura do MTN", async () => {
      await _runUseCase(MOCK_ID_ENVOLVIDO);

      expect(mockMtnRepository.update).toHaveBeenCalledTimes(1);
      expect(mockMtnRepository.update).toHaveBeenCalledWith(
        DADOS_ENVOLVIDO_FINALIZADO.id_mtn,
        {
          id_status: mtnConsts.mtnStatus.EM_ANALISE,
        },
        MOCK_TRX
      );
    });
  });

  describe("verificação de erros", () => {
    it("ocorrência não finalizada", async () => {
      mockEnvolvidoRepository.getDadosEnvolvido.mockResolvedValue(
        DADOS_ENVOLVIDO_NAO_FINALIZADO
      );
      const { error, payload } = await _runUseCase(MOCK_ID_ENVOLVIDO);
      expect(payload).toBeUndefined();
      expect(error).toEqual([
        "Somente uma ocorrência finalizada por ser versionada",
        400,
      ]);
    });

    it("ocorrência não finalizada", async () => {
      mockEnvolvidoRepository.getDadosEnvolvido.mockResolvedValue(
        DADOS_ENVOLVIDO_FINALIZADO_VERSIONADO
      );
      const { error, payload } = await _runUseCase(MOCK_ID_ENVOLVIDO);
      expect(payload).toBeUndefined();
      expect(error).toEqual(["Está ocorrência já foi versionada", 400]);
    });
  });
});
