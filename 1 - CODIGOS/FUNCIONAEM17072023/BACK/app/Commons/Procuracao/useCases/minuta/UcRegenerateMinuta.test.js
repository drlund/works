const Diff = require('diff');
const UcRegenerateMinuta = require('./UcRegenerateMinuta');

describe('UcRegenerateMinuta', () => {
  const mockMinutaRepository = {
    getOneMinuta: jest.fn(),
    getOneFluxoMinuta: jest.fn(),
    getMinutaTemplateById: jest.fn(),
  };

  const getOneFunciMock = jest.fn();
  const getProcuracaoMock = jest.fn();

  const fluxoMock = {
    minuta: "minuta | fluxo mock",
    fluxo: "fluxo | fluxo mock",
    outorgados: "outorgados | fluxo mock",
  };

  const procuracaoMock = [{
    mock: "mock | procuracao mock",
    outorgado: {
      matricula: "matricula | procuracao mock",
      nome: "nome | procuracao mock",
    }
  }];

  const funciMock = "mock funci";

  const minutaTemplateMock = { templateBase: "mock minuta template" };

  const mockPayload = "id minuta cadastrada mock";

  const customDataMock = JSON.stringify({ mock: "mock custom data" });
  const diffsMock = Diff.createPatch('', minutaTemplateMock.templateBase, "minuta template");
  const matriculaOutorgadoMock = "mock matricula outorgado";
  const idTemplateBaseMock = "mock idTemplateBase";
  const idTemplateMock = "mock idTemplate";
  //! TODO: testes usando templateDerivado
  const idTemplateDerivadoMock = "mock idTemplateDerivado";
  const idFluxoMock = "mock id fluxo";
  const idProcuracaoMock = "mock id procuracao";
  const idProxyMock = "mock id proxy";
  const subsidiariasSelectedMock = JSON.stringify(["mock1", "mock2", "mock3"]);

  const mockMinutaCadastrada = ({
    idTemplate,
    idTemplateDerivado
  } = {}) => ({
    dadosMinuta_diffs: diffsMock,
    dadosMinuta_customData: customDataMock,
    dadosMinuta_idTemplate: idTemplate,
    dadosMinuta_idTemplateDerivado: idTemplateDerivado,
    matriculaOutorgado: matriculaOutorgadoMock,
    outorgante_idProcuracao: idProcuracaoMock,
    outorgante_idProxy: idProxyMock,
    outorgante_subsidiariasSelected: subsidiariasSelectedMock,
    idFluxo: idFluxoMock,
    idTemplateBase: idTemplateBaseMock,
  });

  beforeEach(() => {
    mockMinutaRepository.getOneMinuta.mockResolvedValue(mockMinutaCadastrada({ idTemplate: idTemplateMock }));
    mockMinutaRepository.getOneFluxoMinuta.mockResolvedValue(fluxoMock);
    mockMinutaRepository.getMinutaTemplateById.mockResolvedValue(minutaTemplateMock);
    getOneFunciMock.mockResolvedValue(funciMock);
    getProcuracaoMock.mockResolvedValue(procuracaoMock);
  });

  describe('happy path', () => {
    it('returns the data', async () => {
      const { payload } = await instantiateAndRun({ payload: mockPayload });
      expect(payload).toEqual({
        dadosMinuta: {
          customData: JSON.parse(customDataMock),
          diffs: diffsMock,
          idFluxo: idFluxoMock,
          idTemplate: idTemplateBaseMock,
          template: Diff.applyPatch(minutaTemplateMock.templateBase, diffsMock),
          templateBase: minutaTemplateMock.templateBase
        },
        minutaCadastrada: {
          dadosMinuta_customData: customDataMock,
          dadosMinuta_diffs: diffsMock,
          dadosMinuta_idTemplate: idTemplateMock,
          dadosMinuta_idTemplateDerivado: undefined,
          idFluxo: idFluxoMock,
          idTemplateBase: idTemplateBaseMock,
          matriculaOutorgado: matriculaOutorgadoMock,
          outorgante_idProcuracao: idProcuracaoMock,
          outorgante_idProxy: idProxyMock,
          outorgante_subsidiariasSelected: subsidiariasSelectedMock
        },
        outorgado: funciMock,
        poderes: {
          outorganteSelecionado: {
            idProcuracao: idProcuracaoMock,
            idProxy: idProxyMock,
            matricula: procuracaoMock[0].outorgado.matricula,
            nome: procuracaoMock[0].outorgado.nome,
            subsidiariasSelected: JSON.parse(subsidiariasSelectedMock),
          },
          outorgantes: [{
            idProcuracao: idProcuracaoMock,
            idProxy: idProxyMock,
            procuracao: procuracaoMock
          }]
        },
        tipoFluxo: {
          ...fluxoMock,
          idFluxo: idFluxoMock,
        },
      });
    });

    it('calls repository getOneMinuta once', async () => {
      await instantiateAndRun({ payload: mockPayload });
      expect(mockMinutaRepository.getOneMinuta).toHaveBeenCalledTimes(1);
      expect(mockMinutaRepository.getOneMinuta).toHaveBeenCalledWith(mockPayload);
    });

    it('calls repository getOneFluxoMinuta once', async () => {
      await instantiateAndRun({ payload: mockPayload });
      expect(mockMinutaRepository.getOneFluxoMinuta).toHaveBeenCalledTimes(1);
      expect(mockMinutaRepository.getOneFluxoMinuta).toHaveBeenCalledWith(idFluxoMock);
    });

    it('calls repository getMinutaTemplateById once', async () => {
      await instantiateAndRun({ payload: mockPayload });
      expect(mockMinutaRepository.getMinutaTemplateById).toHaveBeenCalledTimes(1);
      expect(mockMinutaRepository.getMinutaTemplateById).toHaveBeenCalledWith(idTemplateBaseMock);
    });

    it('calls functions getOneFunci once', async () => {
      await instantiateAndRun({ payload: mockPayload });
      expect(getOneFunciMock).toHaveBeenCalledTimes(1);
      expect(getOneFunciMock).toHaveBeenCalledWith(matriculaOutorgadoMock);
    });

    it('calls functions getProcuracao once', async () => {
      await instantiateAndRun({ payload: mockPayload });
      expect(getProcuracaoMock).toHaveBeenCalledTimes(1);
      expect(getProcuracaoMock).toHaveBeenCalledWith({ idProcuracao: idProcuracaoMock, idProxy: idProxyMock });
    });
  });

  describe('minuta cadastrada', () => {
    describe('when idMinuta is nullish', () => {
      it('throws an error', async () => {
        const { error } = await instantiateAndRun({ payload: null });
        expect(error).toEqual(["ID da Minuta é necessário.", 400]);
      });
    });

    describe('when minuta cadastrada is not found', () => {
      it('throws an error', async () => {
        mockMinutaRepository.getOneMinuta.mockResolvedValue(null);
        const { error } = await instantiateAndRun({ payload: mockPayload });
        expect(error).toEqual(["Minuta não encontrada", 404]);
      });
    });

    describe('when getOneMinuta throws', () => {
      it('throws an error', async () => {
        const err = 'mockError';
        mockMinutaRepository.getOneMinuta.mockRejectedValue(err);
        const { error } = await instantiateAndRun({ payload: mockPayload });
        expect(error).toEqual([err, 400]);
      });
    });
  });

  describe('fluxo', () => {
    describe('when fluxo is not found', () => {
      it('throws an error', async () => {
        mockMinutaRepository.getOneFluxoMinuta.mockResolvedValue(null);
        const { error } = await instantiateAndRun({ payload: mockPayload });
        expect(error).toEqual(["Fluxo de minuta não encontrado.", 400]);
      });
    });

    describe('when getOneFluxoMinuta throws', () => {
      it('throws an error', async () => {
        const err = 'mockError';
        mockMinutaRepository.getOneFluxoMinuta.mockRejectedValue(err);
        const { error } = await instantiateAndRun({ payload: mockPayload });
        expect(error).toEqual([err, 400]);
      });
    });
  });

  describe('templates', () => {
    describe('when templateBase is not found', () => {
      it('throws an error', async () => {
        mockMinutaRepository.getMinutaTemplateById.mockResolvedValue(null);
        const { error } = await instantiateAndRun({ payload: mockPayload });
        expect(error).toEqual(["Template utilizado na minuta não encontrado.", 400]);
      });
    });

    describe('when getMinutaTemplateById throws', () => {
      it('throws an error', async () => {
        const err = 'mockError';
        mockMinutaRepository.getMinutaTemplateById.mockRejectedValue(err);
        const { error } = await instantiateAndRun({ payload: mockPayload });
        expect(error).toEqual([err, 400]);
      });
    });

    describe('when diffs cant be applied to template', () => {
      it('throws an error', async () => {
        mockMinutaRepository
          .getMinutaTemplateById
          .mockResolvedValue({ templateBase: "wrong template" });
        const { error } = await instantiateAndRun({ payload: mockPayload });
        expect(error).toEqual(["Minuta template usada não compatível.", 400]);
      });
    });
  });

  describe('outorgado', () => {
    describe('when outorgado is not found', () => {
      it('throws an error', async () => {
        getOneFunciMock.mockResolvedValue(null);
        const { error } = await instantiateAndRun({ payload: mockPayload });
        expect(error).toEqual(["Outogado da minuta não encontrado.", 400]);
      });
    });

    describe('when getOneFunci throws', () => {
      it('throws an error', async () => {
        const err = 'mockError';
        getOneFunciMock.mockRejectedValue(err);
        const { error } = await instantiateAndRun({ payload: mockPayload });
        expect(error).toEqual([err, 400]);
      });
    });
  });

  describe('procuracaoOutorgante', () => {
    describe('when procuracaoOutorgante is not found', () => {
      it('throws an error', async () => {
        // função retorna empty array caso não ache procuração
        getProcuracaoMock.mockResolvedValue([]);
        const { error } = await instantiateAndRun({ payload: mockPayload });
        expect(error).toEqual(["Procuração do outorgante não encontrada.", 400]);
      });
    });

    describe('when getProcuracao throws', () => {
      it('throws an error', async () => {
        const err = 'mockError';
        getProcuracaoMock.mockRejectedValue(err);
        const { error } = await instantiateAndRun({ payload: mockPayload });
        expect(error).toEqual([err, 400]);
      });
    });
  });

  async function instantiateAndRun({
    payload,
  }) {
    return new UcRegenerateMinuta({
      repository: mockMinutaRepository,
      functions: {
        getOneFunci: getOneFunciMock,
        getProcuracao: getProcuracaoMock,
      }
    }).run(payload);
  }
});
