const UcCadastrarProcuracao = require("./UcCadastrarProcuracao");
const FactoryGetOneFunci = require("../../../Tests/FactoryGetOneFunci");
const { getOneFluxoMinuta, getFluxos } = require("../__mocks__/FluxosProcuracao");

const OutorgadoEntity = require("../../entidades/Outorgado");

const outorgadoEntity = new OutorgadoEntity();

const badRequestError = 400;

describe("UcGetProcuracoesOutorgante", () => {
  const mockProcuracoesRepository = {
    cadastrarDadosProcuracao: jest.fn(),
    cadastrarProcuracaoSubsidiaria: jest.fn(),
    getUrlDocumento: jest.fn(),
    getPoderesByOutorgante: jest.fn(),
    cadastrarProxy: jest.fn(),
    cadastrarCadeiaProcuracao: jest.fn(),
    cadastrarHistoricoDocumento: jest.fn(),
    getProxyExistente: jest.fn(),
  };

  const mockCartorioRepository = {
    getCartorios: jest.fn(),
    cadastrarCartorio: jest.fn(),
    getCartorioById: jest.fn(),
  };

  const mockOutorgadosRepository = {
    cadastrarOutorgado: jest.fn(),
  };

  const mockMinutaRepository = {
    getOneFluxoMinuta: jest.fn(),
    softDeleteMinutaCadastrada: jest.fn(),
  };

  const mockEventosRepository = {
    saveEventoWithTrx: jest.fn(),
  };

  const mockTrx = {
    commit: jest.fn(),
    rollback: jest.fn(),
  };

  const mockGetOneFunci = jest.fn();
  const mockMatriculaRegistro = 'mock matricula registro';

  const VALID_DATA_SUPER_UT = () => ({
    tipoFluxo: {
      idFluxo: "f8dd7ebd-8c5c-4f7e-92c0-4a9ac7e52ba4",
      fluxo: getFluxos().SUBSIDIARIA,
      minuta: '1º Nível Gerencial UT (Superintendente UT)'
    },
    dadosProcuracao: {
      dataEmissao: 'emissaoSuper',
      dataVencimento: 'vencimentoSuper',
      custo: 1,
      superCusto: 0,
      zerarCusto: 0,
      prefixoCusto: 1,
      dataManifesto: 'manifestoSuper',
      folha: 'folhaSuper',
      livro: 'livroSuper',
    },
    idCartorio: 'idCartorioSuperUT',
    idSubsidiaria: 'idSubsidiariaSuperUT',
    matriculaOutorgado: 'matriculaOutorgadoSuperUT',
    arquivoProcuracao: null,
    urlDocumento: "http://testeSuper.com",
    matriculaRegistro: mockMatriculaRegistro,
  });

  const VALID_DATA_PARTICULAR = () => ({
    tipoFluxo: {
      idFluxo: "f2a79756-0a31-44af-aa3a-cbcfcd5d03ef",
      fluxo: getFluxos().PARTICULAR,
      minuta: '3º Nível Gerencial UN (Demais Gerentes) | Particular'
    },
    dadosProcuracao: {
      dataEmissao: 'emissaoParticular',
      dataVencimento: 'vencimentoParticular',
      custo: 1,
      superCusto: 0,
      zerarCusto: 0,
      prefixoCusto: 1,
    },
    idSubsidiaria: 'idSubsidiariaParticular',
    matriculaOutorgado: 'matriculaOutorgadoParticular',
    arquivoProcuracao: null,
    urlDocumento: 'http://testeParticular.com',
    poderes: {
      matricula: 'matriculaOutorgante',
      nome: 'nomeOutorgante',
      idProcuracao: null,
      idProxy: 'idProxyOutorgante',
      subsidiariasSelected: ['idSubsidiariaOutorganteUm', 'idSubsidiariaOutorganteDois']
    },
    matriculaRegistro: mockMatriculaRegistro,
  });

  const VALID_DATA_PUBLICA = () => ({
    tipoFluxo: {
      idFluxo: "33c79330-1c11-4021-bf7c-d22e70359438",
      fluxo: getFluxos().PUBLICA,
      minuta: '1º Nível Gerencial UN (Gerente Geral)'
    },
    dadosProcuracao: {
      dataEmissao: 'emissaoPublica',
      dataVencimento: 'vencimentoPublica',
      dataManifesto: 'manifestoPublica',
      custo: 1,
      superCusto: 0,
      zerarCusto: 0,
      prefixoCusto: 1,
      folha: 'folhaPublica',
      livro: 'livroPublica',
    },
    idCartorio: 'idCartorioPublica',
    matriculaOutorgado: 'matriculaOutorgadoPublica',
    arquivoProcuracao: null,
    urlDocumento: "http://testePublica.com",
    poderes: {
      matricula: 'matriculaOutorgante',
      nome: 'nomeOutorgante',
      idProcuracao: null,
      idProxy: 'idProxyOutorgante',
      subsidiariasSelected: ['idSubsidiariaOutorganteUm', 'idSubsidiariaOutorganteDois']
    },
    matriculaRegistro: mockMatriculaRegistro,
  });

  const DADOS_OUTORGADO_SUPER_UT = FactoryGetOneFunci({
    matricula: "F1111111",
    refOrganizacionalFuncLotacao: "1GUT",
    prefixoLotacao: "9009"
  });

  const DADOS_OUTORGADO_GER_GERAL = FactoryGetOneFunci({
    matricula: "F2222222",
    refOrganizacionalFuncLotacao: "1GUN",
  });

  const DADOS_OUTORGADO_TERCEIRO_NIVEL = FactoryGetOneFunci({
    matricula: "F3333333",
    refOrganizacionalFuncLotacao: "3GUN",
  });

  const DADOS_NOVA_PROCURACAO = (dataBase, id) => ({
    id,
    idOutorgadoSnapshot: dataBase.matriculaOutorgado,
    ...dataBase.dadosProcuracao,
    ativo: 1,
    idCartorio: dataBase.idCartorio,
    urlDocumento: dataBase.urlDocumento,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });

  const DADOS_NOVA_PROCURACAO_SUBSIDIARIA = DADOS_NOVA_PROCURACAO(VALID_DATA_SUPER_UT(), 'idProcuracaoSuper');
  const DADOS_NOVA_PROCURACAO_PARTICULAR = DADOS_NOVA_PROCURACAO(VALID_DATA_PARTICULAR(), 'idProcuracaoParticular');
  const DADOS_NOVA_PROCURACAO_PUBLICA = DADOS_NOVA_PROCURACAO(VALID_DATA_PUBLICA(), 'idProcuracaoPublica');

  function mockChamadasParaFluxo(fluxo) {
    mockProcuracoesRepository.cadastrarDadosProcuracao.mockResolvedValue(
      fluxo
    );

    mockProcuracoesRepository.getUrlDocumento.mockResolvedValue(
      fluxo.urlDocumento
    );

    mockOutorgadosRepository.cadastrarOutorgado.mockResolvedValue({
      id: fluxo.idOutorgadoSnapshot
    });

    mockProcuracoesRepository.cadastrarCadeiaProcuracao.mockResolvedValue();
  }

  /**
   * @param {UcCadastrarProcuracao.RunArgs} parametrosUseCase
   */
  const runUseCase = async (parametrosUseCase) => {
    const ucCadastrarProcuracao = new UcCadastrarProcuracao({
      repository: {
        cartorio: mockCartorioRepository,
        // @ts-ignore
        minuta: mockMinutaRepository,
        outorgados: mockOutorgadosRepository,
        // @ts-ignore
        procuracoes: mockProcuracoesRepository,
        eventos: mockEventosRepository,
      },
      functions: {
        getOneFunci: mockGetOneFunci,
      },
      trx: mockTrx,
    });
    return ucCadastrarProcuracao.run(parametrosUseCase);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    mockMinutaRepository.getOneFluxoMinuta.mockImplementation(getOneFluxoMinuta);
    mockCartorioRepository.getCartorioById.mockImplementation(async (id) => ({ id }));
  });

  describe("ao rodar todos os métodos para cadastro de uma procuração", () => {
    it("o cadastro de procuração para superintendente funciona com sucesso", async () => {
      mockChamadasParaFluxo(DADOS_NOVA_PROCURACAO_SUBSIDIARIA);
      mockGetOneFunci.mockResolvedValue(DADOS_OUTORGADO_SUPER_UT);

      const { error, payload } = await runUseCase(VALID_DATA_SUPER_UT());

      expect(error).toBeUndefined();
      expect(payload).toEqual("Procuração cadastrada com sucesso");
    });

    it("o cadastro de procuração de Gerente Geral funciona com sucesso", async () => {
      mockChamadasParaFluxo(DADOS_NOVA_PROCURACAO_PUBLICA);
      mockGetOneFunci.mockResolvedValue(DADOS_OUTORGADO_GER_GERAL);

      const { error, payload } = await runUseCase(VALID_DATA_PUBLICA());

      expect(error).toBeUndefined();
      expect(payload).toEqual("Procuração cadastrada com sucesso");
    });

    it("o cadastro de procuração particular funciona com sucesso", async () => {
      mockChamadasParaFluxo(DADOS_NOVA_PROCURACAO_PARTICULAR);
      mockGetOneFunci.mockResolvedValue(DADOS_OUTORGADO_TERCEIRO_NIVEL);
      const { error, payload } = await runUseCase(VALID_DATA_PARTICULAR());

      expect(error).toBeUndefined();
      expect(payload).toEqual("Procuração cadastrada com sucesso");
    });

    it("o cadastro de minuta sem restrição de refOrganizacional", async () => {
      mockChamadasParaFluxo(DADOS_NOVA_PROCURACAO_PARTICULAR);
      mockGetOneFunci.mockResolvedValue(DADOS_OUTORGADO_TERCEIRO_NIVEL);
      mockMinutaRepository.getOneFluxoMinuta.mockReturnValue({
        ...getOneFluxoMinuta(VALID_DATA_PARTICULAR().tipoFluxo.idFluxo),
        outorgados: {}
      });
      const { error, payload } = await runUseCase(VALID_DATA_PARTICULAR());

      expect(error).toBeUndefined();
      expect(payload).toEqual("Procuração cadastrada com sucesso");
    });

    it("o payload retorna com mensagem de sucesso para Demais Gerentes e múltiplos poderes", async () => {
      mockChamadasParaFluxo(DADOS_NOVA_PROCURACAO_PUBLICA);
      mockGetOneFunci.mockResolvedValue(DADOS_OUTORGADO_GER_GERAL);
      const { error, payload } = await runUseCase(VALID_DATA_PUBLICA());
      expect(error).toBeUndefined();
      expect(payload).toEqual("Procuração cadastrada com sucesso");
    });
  });

  describe("ao rodar o cadastro para um 'Superintendente UT'", () => {
    beforeEach(async () => {
      mockChamadasParaFluxo(DADOS_NOVA_PROCURACAO_SUBSIDIARIA);
      mockGetOneFunci.mockResolvedValue(DADOS_OUTORGADO_SUPER_UT);
      // @ts-ignore
      await runUseCase(VALID_DATA_SUPER_UT());
    });

    it("pesquisa os dados do cartório informado", async () => {
      expect(mockCartorioRepository.getCartorioById).toHaveBeenCalledTimes(1);
      expect(mockCartorioRepository.getCartorioById).toHaveBeenCalledWith(
        VALID_DATA_SUPER_UT().idCartorio
      );
    });

    it("pesquisa os dados do outorgado informado", async () => {
      expect(mockGetOneFunci).toHaveBeenCalledTimes(1);
      expect(mockGetOneFunci).toHaveBeenCalledWith(
        VALID_DATA_SUPER_UT().matriculaOutorgado
      );
    });

    it("cadastra o outorgado", async () => {
      expect(
        mockOutorgadosRepository.cadastrarOutorgado
      ).toHaveBeenCalledTimes(1);
      expect(
        mockOutorgadosRepository.cadastrarOutorgado
      ).toHaveBeenCalledWith(
        // @ts-ignore
        outorgadoEntity.transformFunciOutorgado(DADOS_OUTORGADO_SUPER_UT),
        mockTrx
      );
    });

    it("cadastra os dados da procuração", async () => {
      expect(
        mockProcuracoesRepository.cadastrarDadosProcuracao
      ).toHaveBeenCalledTimes(1);
      expect(
        mockProcuracoesRepository.cadastrarDadosProcuracao
      ).toHaveBeenCalledWith(
        {
          dataEmissao: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.dataEmissao,
          dataVencimento: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.dataVencimento,
          dataManifesto: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.dataManifesto,
          folha: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.folha,
          livro: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.livro,
          ativo: 1,
          idCartorio: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.idCartorio,
          idOutorgadoSnapshot: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.idOutorgadoSnapshot,
          urlDocumento: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.urlDocumento,
          idFluxo: VALID_DATA_SUPER_UT().tipoFluxo.idFluxo,
          matriculaRegistro: mockMatriculaRegistro,
        },
        mockTrx
      );
    });

    it("cadastra o histórico do documento", async () => {
      expect(
        mockProcuracoesRepository.cadastrarHistoricoDocumento
      ).toHaveBeenCalledTimes(1);
      expect(
        mockProcuracoesRepository.cadastrarHistoricoDocumento
      ).toHaveBeenCalledWith(
        {
          urlDocumento: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.urlDocumento,
          idProcuracao: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.id,
          dataManifesto: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.dataManifesto,
          mensagem: "Versão Inicial",
          matriculaRegistro: mockMatriculaRegistro,
        },
        mockTrx
      );
    });

    it("cadastrada o proxy da procuração", async () => {
      expect(mockProcuracoesRepository.cadastrarProxy).toHaveBeenCalledTimes(
        1
      );
      expect(mockProcuracoesRepository.cadastrarProxy).toHaveBeenCalledWith(
        {
          idSubsidiaria: VALID_DATA_SUPER_UT().idSubsidiaria,
          novaProcuracaoId: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.id,
          matriculaOutorgado: DADOS_OUTORGADO_SUPER_UT.matricula,
        },
        mockTrx
      );
    });

    it("cadastra o poder da procuração vinculado à subsidiária", async () => {
      expect(
        mockProcuracoesRepository.cadastrarProcuracaoSubsidiaria
      ).toHaveBeenCalledTimes(1);
      expect(
        mockProcuracoesRepository.cadastrarProcuracaoSubsidiaria
      ).toHaveBeenCalledWith(
        [
          {
            idProcuracao: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.id,
            idSubsidiaria: VALID_DATA_SUPER_UT().idSubsidiaria,
            direto: true,
          },
        ],
        mockTrx
      );
    });

    it("cadastra a cadeia de procuração", async () => {
      expect(
        mockProcuracoesRepository.cadastrarCadeiaProcuracao
      ).toHaveBeenCalledTimes(1);
      expect(
        mockProcuracoesRepository.cadastrarCadeiaProcuracao
      ).toHaveBeenCalledWith(
        {
          idProcuracaoAtual: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.id,
          idProcuracaoParent: null,
          idProxyParent: null,
        },
        mockTrx
      );
    });

    it('cria um evento de custo', async () => {
      expect(mockEventosRepository.saveEventoWithTrx).toBeCalledTimes(1);
      expect(mockEventosRepository.saveEventoWithTrx).toBeCalledWith({
        custo: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.custo,
        superCusto: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.superCusto,
        dataCusto: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.dataEmissao,
        evento: "Cadastro de Procuração",
        idCartorio: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.idCartorio,
        idProcuracao: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.id,
        matriculaRegistro: mockMatriculaRegistro,
        prefixoCusto: DADOS_NOVA_PROCURACAO_SUBSIDIARIA.prefixoCusto,
      }, mockTrx);
    });
  });

  describe("ao rodar o cadastro para procuracao pública", () => {
    beforeEach(async () => {
      mockChamadasParaFluxo(DADOS_NOVA_PROCURACAO_PUBLICA);
      mockGetOneFunci.mockResolvedValue(DADOS_OUTORGADO_GER_GERAL);
      // @ts-ignore
      await runUseCase(VALID_DATA_PUBLICA());
    });

    it("cadastra a cadeia de procuração com um poder", async () => {
      expect(
        mockProcuracoesRepository.cadastrarCadeiaProcuracao
      ).toHaveBeenCalledTimes(1);
      expect(
        mockProcuracoesRepository.cadastrarCadeiaProcuracao
      ).toHaveBeenCalledWith(
        {
          idProcuracaoAtual: DADOS_NOVA_PROCURACAO_PUBLICA.id,
          idProcuracaoParent: VALID_DATA_PUBLICA().poderes.idProcuracao,
          idProxyParent: VALID_DATA_PUBLICA().poderes.idProxy,
        },
        mockTrx
      );
    });

    it("pesquisa os dados do cartório informado", async () => {
      expect(mockCartorioRepository.getCartorioById).toHaveBeenCalledTimes(1);
      expect(mockCartorioRepository.getCartorioById).toHaveBeenCalledWith(
        VALID_DATA_PUBLICA().idCartorio
      );
    });

    it("pesquisa os dados do outorgado informado", async () => {
      expect(mockGetOneFunci).toHaveBeenCalledTimes(1);
      expect(mockGetOneFunci).toHaveBeenCalledWith(
        VALID_DATA_PUBLICA().matriculaOutorgado
      );
    });

    it("cadastra o outorgado", async () => {
      expect(
        mockOutorgadosRepository.cadastrarOutorgado
      ).toHaveBeenCalledTimes(1);
      expect(
        mockOutorgadosRepository.cadastrarOutorgado
      ).toHaveBeenCalledWith(
        // @ts-ignore
        outorgadoEntity.transformFunciOutorgado(DADOS_OUTORGADO_GER_GERAL),
        mockTrx
      );
    });

    it("cadastra os dados da procuração", async () => {
      expect(
        mockProcuracoesRepository.cadastrarDadosProcuracao
      ).toHaveBeenCalledTimes(1);
      expect(
        mockProcuracoesRepository.cadastrarDadosProcuracao
      ).toHaveBeenCalledWith(
        {
          dataEmissao: DADOS_NOVA_PROCURACAO_PUBLICA.dataEmissao,
          dataVencimento: DADOS_NOVA_PROCURACAO_PUBLICA.dataVencimento,
          dataManifesto: DADOS_NOVA_PROCURACAO_PUBLICA.dataManifesto,
          folha: DADOS_NOVA_PROCURACAO_PUBLICA.folha,
          livro: DADOS_NOVA_PROCURACAO_PUBLICA.livro,
          ativo: 1,
          idCartorio: DADOS_NOVA_PROCURACAO_PUBLICA.idCartorio,
          idOutorgadoSnapshot: DADOS_NOVA_PROCURACAO_PUBLICA.idOutorgadoSnapshot,
          urlDocumento: DADOS_NOVA_PROCURACAO_PUBLICA.urlDocumento,
          idFluxo: VALID_DATA_PUBLICA().tipoFluxo.idFluxo,
          matriculaRegistro: mockMatriculaRegistro,
        },
        mockTrx
      );
    });

    it("cadastra o histórico do documento", async () => {
      expect(
        mockProcuracoesRepository.cadastrarHistoricoDocumento
      ).toHaveBeenCalledTimes(1);
      expect(
        mockProcuracoesRepository.cadastrarHistoricoDocumento
      ).toHaveBeenCalledWith(
        {
          urlDocumento: DADOS_NOVA_PROCURACAO_PUBLICA.urlDocumento,
          idProcuracao: DADOS_NOVA_PROCURACAO_PUBLICA.id,
          dataManifesto: DADOS_NOVA_PROCURACAO_PUBLICA.dataManifesto,
          mensagem: "Versão Inicial",
          matriculaRegistro: mockMatriculaRegistro,
        },
        mockTrx
      );
    });

    it("naõ cadastra o proxy da procuração", async () => {
      expect(mockProcuracoesRepository.cadastrarProxy).not.toBeCalled();
    });

    it("cadastra o poder da procuração vinculado à subsidiária", async () => {
      expect(
        mockProcuracoesRepository.cadastrarProcuracaoSubsidiaria
      ).toHaveBeenCalledTimes(1);
      expect(
        mockProcuracoesRepository.cadastrarProcuracaoSubsidiaria
      ).toHaveBeenCalledWith(
        VALID_DATA_PUBLICA()
          .poderes
          .subsidiariasSelected
          .map((idSubsidiaria) => ({
            idProcuracao: DADOS_NOVA_PROCURACAO_PUBLICA.id,
            idSubsidiaria,
            direto: false,
          })),
        mockTrx
      );
    });

    it('cria um evento de custo', async () => {
      expect(mockEventosRepository.saveEventoWithTrx).toBeCalledTimes(1);
      expect(mockEventosRepository.saveEventoWithTrx).toBeCalledWith({
        custo: DADOS_NOVA_PROCURACAO_PUBLICA.custo,
        superCusto: DADOS_NOVA_PROCURACAO_PUBLICA.superCusto,
        dataCusto: DADOS_NOVA_PROCURACAO_PUBLICA.dataEmissao,
        evento: "Cadastro de Procuração",
        idCartorio: DADOS_NOVA_PROCURACAO_PUBLICA.idCartorio,
        idProcuracao: DADOS_NOVA_PROCURACAO_PUBLICA.id,
        matriculaRegistro: mockMatriculaRegistro,
        prefixoCusto: DADOS_NOVA_PROCURACAO_PUBLICA.prefixoCusto,
      }, mockTrx);
    });
  });

  describe("ao rodar o cadastro para procuracao pública feita na super", () => {
    const mockSuperCusto = 1;
    const mockCustoCadeia = 1;
    const mockCartorioCadeia = 9;

    beforeEach(async () => {
      mockChamadasParaFluxo(DADOS_NOVA_PROCURACAO_PUBLICA);
      mockGetOneFunci.mockResolvedValue(DADOS_OUTORGADO_GER_GERAL);
      await runUseCase({
        ...VALID_DATA_PUBLICA(),
        // @ts-ignore
        dadosProcuracao: {
          ...VALID_DATA_PUBLICA().dadosProcuracao,
          custoCadeia: mockCustoCadeia,
          cartorioCadeia: mockCartorioCadeia,
          superCusto: mockSuperCusto,
        }
      });
    });

    it('cadastra dois eventos de custo', async () => {
      expect(mockEventosRepository.saveEventoWithTrx).toBeCalledTimes(2);

      expect(mockEventosRepository.saveEventoWithTrx).toHaveBeenNthCalledWith(1, {
        custo: DADOS_NOVA_PROCURACAO_PUBLICA.custo,
        superCusto: mockSuperCusto,
        dataCusto: DADOS_NOVA_PROCURACAO_PUBLICA.dataEmissao,
        evento: "Cadastro de Procuração",
        idCartorio: DADOS_NOVA_PROCURACAO_PUBLICA.idCartorio,
        idProcuracao: DADOS_NOVA_PROCURACAO_PUBLICA.id,
        matriculaRegistro: mockMatriculaRegistro,
        prefixoCusto: DADOS_NOVA_PROCURACAO_PUBLICA.prefixoCusto,
      }, mockTrx);

      expect(mockEventosRepository.saveEventoWithTrx).toHaveBeenNthCalledWith(2, {
        custo: mockCustoCadeia,
        superCusto: mockSuperCusto,
        dataCusto: DADOS_NOVA_PROCURACAO_PUBLICA.dataManifesto,
        evento: "Custo da Cadeia de Procurações",
        idCartorio: mockCartorioCadeia,
        idProcuracao: DADOS_NOVA_PROCURACAO_PUBLICA.id,
        matriculaRegistro: mockMatriculaRegistro,
        prefixoCusto: DADOS_NOVA_PROCURACAO_PUBLICA.prefixoCusto,
      }, mockTrx);
    });
  })

  describe("ao rodar o cadastro para procuracao particular", () => {
    beforeEach(async () => {
      mockChamadasParaFluxo(DADOS_NOVA_PROCURACAO_PARTICULAR);
      mockGetOneFunci.mockResolvedValue(DADOS_OUTORGADO_TERCEIRO_NIVEL);
      // @ts-ignore
      await runUseCase(VALID_DATA_PARTICULAR());
    });

    it("cadastra a cadeia de procuração com um poder", async () => {
      expect(
        mockProcuracoesRepository.cadastrarCadeiaProcuracao
      ).toHaveBeenCalledTimes(1);
      expect(
        mockProcuracoesRepository.cadastrarCadeiaProcuracao
      ).toHaveBeenCalledWith(
        {
          idProcuracaoAtual: DADOS_NOVA_PROCURACAO_PARTICULAR.id,
          idProcuracaoParent: VALID_DATA_PARTICULAR().poderes.idProcuracao,
          idProxyParent: VALID_DATA_PARTICULAR().poderes.idProxy,
        },
        mockTrx
      );
    });

    it("não chama procura de cartório", async () => {
      expect(mockCartorioRepository.getCartorioById).toHaveBeenCalledTimes(0);
    });

    it("pesquisa os dados do outorgado informado", async () => {
      expect(mockGetOneFunci).toHaveBeenCalledTimes(1);
      expect(mockGetOneFunci).toHaveBeenCalledWith(
        VALID_DATA_PARTICULAR().matriculaOutorgado
      );
    });

    it("cadastra o outorgado", async () => {
      expect(
        mockOutorgadosRepository.cadastrarOutorgado
      ).toHaveBeenCalledTimes(1);
      expect(
        mockOutorgadosRepository.cadastrarOutorgado
      ).toHaveBeenCalledWith(
        // @ts-ignore
        outorgadoEntity.transformFunciOutorgado(DADOS_OUTORGADO_TERCEIRO_NIVEL),
        mockTrx
      );
    });

    it("cadastra os dados da procuração", async () => {
      expect(
        mockProcuracoesRepository.cadastrarDadosProcuracao
      ).toHaveBeenCalledTimes(1);
      expect(
        mockProcuracoesRepository.cadastrarDadosProcuracao
      ).toHaveBeenCalledWith(
        {
          dataEmissao: DADOS_NOVA_PROCURACAO_PARTICULAR.dataEmissao,
          dataVencimento: DADOS_NOVA_PROCURACAO_PARTICULAR.dataVencimento,
          folha: DADOS_NOVA_PROCURACAO_PARTICULAR.folha,
          livro: DADOS_NOVA_PROCURACAO_PARTICULAR.livro,
          ativo: 1,
          idCartorio: DADOS_NOVA_PROCURACAO_PARTICULAR.idCartorio,
          idOutorgadoSnapshot: DADOS_NOVA_PROCURACAO_PARTICULAR.idOutorgadoSnapshot,
          urlDocumento: DADOS_NOVA_PROCURACAO_PARTICULAR.urlDocumento,
          idFluxo: VALID_DATA_PARTICULAR().tipoFluxo.idFluxo,
          matriculaRegistro: mockMatriculaRegistro,
        },
        mockTrx
      );
    });

    it("cadastra o histórico do documento", async () => {
      expect(
        mockProcuracoesRepository.cadastrarHistoricoDocumento
      ).toHaveBeenCalledTimes(1);
      expect(
        mockProcuracoesRepository.cadastrarHistoricoDocumento
      ).toHaveBeenCalledWith(
        {
          urlDocumento: DADOS_NOVA_PROCURACAO_PARTICULAR.urlDocumento,
          idProcuracao: DADOS_NOVA_PROCURACAO_PARTICULAR.id,
          mensagem: "Versão Inicial",
          matriculaRegistro: mockMatriculaRegistro,
        },
        mockTrx
      );
    });

    it("não cadastra o proxy da procuração", async () => {
      expect(mockProcuracoesRepository.cadastrarProxy).not.toBeCalled();
    });

    it("cadastra o poder da procuração vinculado à subsidiária", async () => {
      expect(
        mockProcuracoesRepository.cadastrarProcuracaoSubsidiaria
      ).toHaveBeenCalledTimes(1);
      expect(
        mockProcuracoesRepository.cadastrarProcuracaoSubsidiaria
      ).toHaveBeenCalledWith(
        VALID_DATA_PARTICULAR()
          .poderes
          .subsidiariasSelected
          .map((idSubsidiaria) => ({
            idProcuracao: DADOS_NOVA_PROCURACAO_PARTICULAR.id,
            idSubsidiaria,
            direto: false,
          })),
        mockTrx
      );
    });

    it('cria um evento de custo', async () => {
      expect(mockEventosRepository.saveEventoWithTrx).toBeCalledTimes(1);
      expect(mockEventosRepository.saveEventoWithTrx).toBeCalledWith({
        custo: DADOS_NOVA_PROCURACAO_PARTICULAR.custo,
        superCusto: DADOS_NOVA_PROCURACAO_PARTICULAR.superCusto,
        dataCusto: DADOS_NOVA_PROCURACAO_PARTICULAR.dataEmissao,
        evento: "Cadastro de Procuração",
        idCartorio: DADOS_NOVA_PROCURACAO_PARTICULAR.idCartorio,
        idProcuracao: DADOS_NOVA_PROCURACAO_PARTICULAR.id,
        matriculaRegistro: mockMatriculaRegistro,
        prefixoCusto: DADOS_NOVA_PROCURACAO_PARTICULAR.prefixoCusto,
      }, mockTrx);
    });
  });

  describe("ao rodar o cadastro para procuracao particular com custo zerado", () => {
    beforeEach(async () => {
      mockChamadasParaFluxo(DADOS_NOVA_PROCURACAO_PARTICULAR);
      mockGetOneFunci.mockResolvedValue(DADOS_OUTORGADO_TERCEIRO_NIVEL);
    });

    it('cria um evento com custo zerado se passando flag de custo', async () => {
      await runUseCase({
        ...VALID_DATA_PARTICULAR(),
        // @ts-ignore
        dadosProcuracao: {
          ...VALID_DATA_PARTICULAR().dadosProcuracao,
          custo: 0,
          zerarCusto: 1,
        }
      });

      expect(mockEventosRepository.saveEventoWithTrx).toBeCalledTimes(1);
      expect(mockEventosRepository.saveEventoWithTrx).toBeCalledWith({
        custo: 0,
        superCusto: DADOS_NOVA_PROCURACAO_PARTICULAR.superCusto,
        dataCusto: DADOS_NOVA_PROCURACAO_PARTICULAR.dataEmissao,
        evento: "Cadastro de Procuração",
        idCartorio: DADOS_NOVA_PROCURACAO_PARTICULAR.idCartorio,
        idProcuracao: DADOS_NOVA_PROCURACAO_PARTICULAR.id,
        matriculaRegistro: mockMatriculaRegistro,
        prefixoCusto: DADOS_NOVA_PROCURACAO_PARTICULAR.prefixoCusto,
      }, mockTrx);
    });

    it('cria um evento com custo zerado se passando flag de custo mesmo passando um custo', async () => {
      await runUseCase({
        ...VALID_DATA_PARTICULAR(),
        // @ts-ignore
        dadosProcuracao: {
          ...VALID_DATA_PARTICULAR().dadosProcuracao,
          custo: 100,
          zerarCusto: 1,
        }
      });

      expect(mockEventosRepository.saveEventoWithTrx).toBeCalledTimes(1);
      expect(mockEventosRepository.saveEventoWithTrx).toBeCalledWith({
        custo: 0,
        superCusto: DADOS_NOVA_PROCURACAO_PARTICULAR.superCusto,
        dataCusto: DADOS_NOVA_PROCURACAO_PARTICULAR.dataEmissao,
        evento: "Cadastro de Procuração",
        idCartorio: DADOS_NOVA_PROCURACAO_PARTICULAR.idCartorio,
        idProcuracao: DADOS_NOVA_PROCURACAO_PARTICULAR.id,
        matriculaRegistro: mockMatriculaRegistro,
        prefixoCusto: DADOS_NOVA_PROCURACAO_PARTICULAR.prefixoCusto,
      }, mockTrx);
    });
  });

  describe("quando existe erro nos dados incluídos ou na validação", () => {
    beforeEach(() => {
      mockGetOneFunci.mockResolvedValue(DADOS_OUTORGADO_GER_GERAL);
      mockChamadasParaFluxo(DADOS_NOVA_PROCURACAO_SUBSIDIARIA);
    });

    it("retorna erro de usuário não encontrado", async () => {
      mockGetOneFunci.mockResolvedValue(null);

      const { error } = await runUseCase(VALID_DATA_SUPER_UT());
      expect(error).toEqual([`Funcionário ${VALID_DATA_SUPER_UT().matriculaOutorgado} não encontrado.`, badRequestError]);
    });

    it("retorna erro de poderes sem matricula", async () => {
      const { error } = await runUseCase({
        ...VALID_DATA_PUBLICA(),
        poderes: {
          ...VALID_DATA_PUBLICA().poderes,
          matricula: null,
        }
      });
      expect(error).toEqual(['É necessário uma matricula de Outorgante.', badRequestError]);
    });

    it("retorna erro de poderes com proxy e procuracao", async () => {
      const { error } = await runUseCase({
        ...VALID_DATA_PUBLICA(),
        poderes: {
          ...VALID_DATA_PUBLICA().poderes,
          idProxy: 'idProxyPoderes',
          idProcuracao: 'idProcuracaoPoderes'
        }
      });
      expect(error).toEqual(['Não é possível receber poderes de multiplas fontes.', badRequestError]);
    });

    it("retorna erro de poderes sem subsidiarias selectionadas", async () => {
      const { error } = await runUseCase({
        ...VALID_DATA_PUBLICA(),
        poderes: {
          ...VALID_DATA_PUBLICA().poderes,
          subsidiariasSelected: null,
        }
      });
      expect(error).toEqual(['É necessário ao menos uma subsidiária.', badRequestError]);
    });

    it("retorna erro de poderes com subsidiarias sendo um array vazio", async () => {
      const { error } = await runUseCase({
        ...VALID_DATA_PUBLICA(),
        poderes: {
          ...VALID_DATA_PUBLICA().poderes,
          subsidiariasSelected: [],
        }
      });
      expect(error).toEqual(['É necessário ao menos uma subsidiária.', badRequestError]);
    });

    it("retorna erro de minuta inválida", async () => {
      const { error } = await runUseCase({
        ...VALID_DATA_SUPER_UT(),
        tipoFluxo: {
          idFluxo: "invalido",
          fluxo: '',
          minuta: ''
        },
      });
      expect(error).toEqual(["Fluxo não encontrado!", badRequestError]);
    });

    it("retorna erro de minuta corrompida", async () => {
      const { error } = await runUseCase({
        ...VALID_DATA_SUPER_UT(),
        tipoFluxo: {
          idFluxo: 'f2a79756-0a31-44af-aa3a-cbcfcd5d03ef',
          fluxo: getFluxos().PARTICULAR,
          minuta: 'nome invalido'
        },
      });
      expect(error).toEqual(["Fluxo Corrompido!", badRequestError]);
    });

    it("retorna erro de funcionário com função inválida", async () => {
      mockGetOneFunci.mockResolvedValue(DADOS_OUTORGADO_SUPER_UT);
      mockMinutaRepository.getOneFluxoMinuta.mockReturnValue({
        ...getOneFluxoMinuta(VALID_DATA_SUPER_UT().tipoFluxo.idFluxo),
        outorgados: {
          ...getOneFluxoMinuta(VALID_DATA_SUPER_UT().tipoFluxo.idFluxo).outorgados,
          refOrganizacional: ["outros"],
        }
      });
      const { error } = await runUseCase(VALID_DATA_SUPER_UT());
      expect(error).toEqual([`Função do funcionário ${DADOS_OUTORGADO_SUPER_UT.matricula} não está incluído no grupo de funções permitido.`, badRequestError]);
    });

    it("retorna erro de funcionário com prefixo inválida", async () => {
      mockGetOneFunci.mockResolvedValue(DADOS_OUTORGADO_SUPER_UT);
      mockMinutaRepository.getOneFluxoMinuta.mockReturnValue({
        ...getOneFluxoMinuta(VALID_DATA_SUPER_UT().tipoFluxo.idFluxo),
        outorgados: {
          ...getOneFluxoMinuta(VALID_DATA_SUPER_UT().tipoFluxo.idFluxo).outorgados,
          prefixos: ["outros"]
        }
      });
      const { error } = await runUseCase(VALID_DATA_SUPER_UT());
      expect(error).toEqual([`Prefixo do funcionário ${DADOS_OUTORGADO_SUPER_UT.matricula} não está incluído no grupo de prefixos permitido.`, badRequestError]);
    });

    it("retorna erro de dados da procuração inválidos", async () => {
      const { error } = await runUseCase({
        ...VALID_DATA_SUPER_UT(),
        dadosProcuracao: {
          ...VALID_DATA_SUPER_UT().dadosProcuracao,
          folha: null,
        },
      });

      expect(error).toEqual(["Dados da procuração inválidos!", badRequestError]);
    });

    it("retorna erro de matrícula inválida", async () => {
      const { error } = await runUseCase({
        ...VALID_DATA_SUPER_UT(),
        matriculaOutorgado: null,
      });

      expect(error).toEqual(["Informar os outorgados é obrigatório.", badRequestError]);
    });

    it("retorna erro de cartório inválido", async () => {
      const { error } = await runUseCase({
        ...VALID_DATA_SUPER_UT(),
        idCartorio: null,
      });

      expect(error).toEqual(["Cartório é obrigatório!", badRequestError]);
    });

    it("retorna erro de arquivo da procuração inválido", async () => {
      const { error } = await runUseCase({
        ...VALID_DATA_SUPER_UT(),
        urlDocumento: null,
        arquivoProcuracao: null,
      });

      expect(error).toEqual(["Arquivo da procuração inválido!", badRequestError]);
    });

    it("retorna erro de cartório não encontrado", async () => {
      mockCartorioRepository.getCartorioById.mockResolvedValue(null);

      const { error } = await runUseCase({
        ...VALID_DATA_SUPER_UT(),
      });

      expect(error).toEqual(["Cartório não encontrado!", badRequestError]);
    });

    it("retorna erro de usuario não logado", async () => {
      const { error } = await runUseCase({
        ...VALID_DATA_SUPER_UT(),
        matriculaRegistro: null,
      });

      expect(error).toEqual(["Usuário não está logado.", badRequestError]);
    });

    describe('erros de validação do custo', () => {
      beforeEach(() => {
        mockGetOneFunci.mockResolvedValue(DADOS_OUTORGADO_GER_GERAL);
        mockChamadasParaFluxo(DADOS_NOVA_PROCURACAO_PUBLICA);
      });

      it('retorna erro se custo não é passado', async () => {
        const { error } = await runUseCase({
          ...VALID_DATA_PUBLICA(),
          // @ts-expect-error
          dadosProcuracao: {
            ...VALID_DATA_PUBLICA().dadosProcuracao,
            custo: null,
          },
        });

        expect(error).toEqual(["Dados da procuração inválidos!", badRequestError]);
      });

      it('retorna erro se custo é invalido', async () => {
        const { error } = await runUseCase({
          ...VALID_DATA_PUBLICA(),
          dadosProcuracao: {
            ...VALID_DATA_PUBLICA().dadosProcuracao,
            // @ts-expect-error
            custo: 'invalido',
          },
        });

        expect(error).toEqual(["Dados da procuração inválidos!", badRequestError]);
      });

      it('retorna erro se prefixo do custo é invalido', async () => {
        const { error } = await runUseCase({
          ...VALID_DATA_PUBLICA(),
          dadosProcuracao: {
            ...VALID_DATA_PUBLICA().dadosProcuracao,
            // @ts-expect-error
            prefixoCusto: 'invalido',
          },
        });

        expect(error).toEqual(["Dados da procuração inválidos!", badRequestError]);
      });

      it('retorna erro se prefixo do custo é out of range', async () => {
        const { error } = await runUseCase({
          ...VALID_DATA_PUBLICA(),
          // @ts-expect-error
          dadosProcuracao: {
            ...VALID_DATA_PUBLICA().dadosProcuracao,
            prefixoCusto: 10000,
          },
        });

        expect(error).toEqual(["Dados da procuração inválidos!", badRequestError]);
      });

      it('retorna erro se prefixo do custo não é passado', async () => {
        const { error } = await runUseCase({
          ...VALID_DATA_PUBLICA(),
          // @ts-expect-error
          dadosProcuracao: {
            ...VALID_DATA_PUBLICA().dadosProcuracao,
            prefixoCusto: null,
          },
        });

        expect(error).toEqual(["Dados da procuração inválidos!", badRequestError]);
      });

      it('retorna erro se superCusto não é passado', async () => {
        const { error } = await runUseCase({
          ...VALID_DATA_PUBLICA(),
          // @ts-expect-error
          dadosProcuracao: {
            ...VALID_DATA_PUBLICA().dadosProcuracao,
            superCusto: null,
          },
        });

        expect(error).toEqual(["Dados da procuração inválidos!", badRequestError]);
      });

      it('retorna erro se superCusto é invalido', async () => {
        const { error } = await runUseCase({
          ...VALID_DATA_PUBLICA(),
          dadosProcuracao: {
            ...VALID_DATA_PUBLICA().dadosProcuracao,
            // @ts-expect-error
            superCusto: 'invalido',
          },
        });

        expect(error).toEqual(["Dados da procuração inválidos!", badRequestError]);
      });

      it('retorna erro se zerarCusto não é passado', async () => {
        const { error } = await runUseCase({
          ...VALID_DATA_PUBLICA(),
          // @ts-expect-error
          dadosProcuracao: {
            ...VALID_DATA_PUBLICA().dadosProcuracao,
            zerarCusto: null,
          },
        });

        expect(error).toEqual(["Dados da procuração inválidos!", badRequestError]);
      });

      it('retorna erro se zerarCusto é invalido', async () => {
        const { error } = await runUseCase({
          ...VALID_DATA_PUBLICA(),
          dadosProcuracao: {
            ...VALID_DATA_PUBLICA().dadosProcuracao,
            // @ts-expect-error
            zerarCusto: 'invalido',
          },
        });

        expect(error).toEqual(["Dados da procuração inválidos!", badRequestError]);
      });

      it('retorna erro se custoCadeia é zero junto superCusto', async () => {
        const { error } = await runUseCase({
          ...VALID_DATA_PUBLICA(),
          // @ts-expect-error
          dadosProcuracao: {
            ...VALID_DATA_PUBLICA().dadosProcuracao,
            custoCadeia: 0,
            superCusto: 1,
          },
        });

        expect(error).toEqual(["Dados da procuração inválidos!", badRequestError]);
      });
    });
  });

  describe('ao cadastrar procuração com base em uma minuta cadastrada', () => {
    const idMinutaCadastradaMock = 'mock id minuta cadastrada';

    beforeEach(async () => {
      mockChamadasParaFluxo(DADOS_NOVA_PROCURACAO_PARTICULAR);
      mockGetOneFunci.mockResolvedValue(DADOS_OUTORGADO_TERCEIRO_NIVEL);
    });

    describe('quando a minuta cadastrada é encontrada', () => {
      beforeEach(() => {
        mockMinutaRepository.softDeleteMinutaCadastrada.mockResolvedValue(1);
      });

      it('cadastra a procuração com sucesso', async () => {
        const { payload } = await runUseCase({ ...VALID_DATA_PARTICULAR(), idMinutaCadastrada: idMinutaCadastradaMock });
        expect(payload).toEqual("Procuração cadastrada com sucesso");
      });

      it('chama o repositorio para deletar a minuta', async () => {
        await runUseCase({ ...VALID_DATA_PARTICULAR(), idMinutaCadastrada: idMinutaCadastradaMock });
        expect(mockMinutaRepository.softDeleteMinutaCadastrada).toHaveBeenCalledTimes(1);
        expect(mockMinutaRepository.softDeleteMinutaCadastrada).toHaveBeenCalledWith(idMinutaCadastradaMock, mockTrx);
      });
    });

    describe('quando a minuta cadastrada não é encontrada', () => {
      beforeEach(() => {
        mockMinutaRepository.softDeleteMinutaCadastrada.mockResolvedValue(0);
      });

      it('retorna erro caso o id da minuta não seja encontrado', async () => {
        const { error } = await runUseCase({ ...VALID_DATA_PARTICULAR(), idMinutaCadastrada: idMinutaCadastradaMock });
        expect(error).toEqual(["Minuta cadastrada não foi encontrada.", badRequestError]);
      });

      it('chama o repositorio para deletar a minuta', async () => {
        await runUseCase({ ...VALID_DATA_PARTICULAR(), idMinutaCadastrada: idMinutaCadastradaMock });
        expect(mockMinutaRepository.softDeleteMinutaCadastrada).toHaveBeenCalledTimes(1);
        expect(mockMinutaRepository.softDeleteMinutaCadastrada).toHaveBeenCalledWith(idMinutaCadastradaMock, mockTrx);
      });
    });
  });
});
