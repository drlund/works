const UcSaveMinuta = require('./UcSaveMinuta');
const Diff = require('diff');

describe('UcSaveMinuta', () => {
  const mockMinutaRepository = {
    getOneFluxoMinuta: jest.fn(),
    getMinutaTemplateByFluxo: jest.fn(),
    saveMinuta: jest.fn(),
  };

  const getOneFunciMock = jest.fn();
  const getProcuracaoMock = jest.fn();

  const returnMock = "mock return";
  const minutaMock = { minuta: "mock minuta" };
  const minutaTemplateMock = "mock minuta template";
  const customDataMock = "mock custom data";
  const diffsMock = Diff.createPatch('', minutaTemplateMock, "minuta template");
  const funciMock = "mock funci";
  const matriculaMock = "mock matricula";
  const procuracaoMock = ["mock procuracao"];
  const idMinutaMock = "00000000-0000-0000-0000-000000000000"
  const idTemplateMock = "mock idTemplate";
  const idTemplateDerivadoMock = "mock idTemplateDerivado";
  const idFluxoMock = "mock id fluxo";
  const idProcuracaoMock = "mock id procuracao";
  const idProxyMock = "mock id proxy";
  const subsidiariasSelectedMock = ["mock1", "mock2", "mock3"];
  const mockMatriculaRegistro = 'mock matricula registro';

  const mockPayload = ({
    idTemplate,
    idTemplateDerivado
  } = {}) => ({
    dadosMinuta: {
      diffs: diffsMock,
      customData: customDataMock,
      idMinuta: idMinutaMock,
      idTemplate,
      idTemplateDerivado,
    },
    outorgado: {
      matricula: matriculaMock,
    },
    poderes: {
      outorganteSelecionado: {
        idProcuracao: idProcuracaoMock,
        idProxy: idProxyMock,
        subsidiariasSelected: subsidiariasSelectedMock,
      }
    },
    tipoFluxo: {
      idFluxo: idFluxoMock,
      minuta: minutaMock.minuta,
    },
    matriculaRegistro: mockMatriculaRegistro
  });

  beforeEach(() => {
    mockMinutaRepository.saveMinuta.mockResolvedValue(returnMock);
    mockMinutaRepository.getOneFluxoMinuta.mockResolvedValue(minutaMock);
    mockMinutaRepository.getMinutaTemplateByFluxo.mockResolvedValue({ templateBase: minutaTemplateMock });
    getOneFunciMock.mockResolvedValue(funciMock);
    getProcuracaoMock.mockResolvedValue(procuracaoMock);
  });

  describe('with all fields', () => {
    describe('using dadosMinuta.idTemplateDerivado', () => {
      it('returns the saved minuta', async () => {
        const { payload } = await instantiateAndRun({
          payload: { ...mockPayload({ idTemplateDerivado: idTemplateDerivadoMock }), }
        });

        expect(payload).toEqual(returnMock);
      });
    });

    describe('using dadosMinuta.idTemplate', () => {
      it('returns the saved minuta', async () => {
        const { payload } = await instantiateAndRun({
          payload: { ...mockPayload({ idTemplate: idTemplateMock }), }
        });

        expect(payload).toEqual(returnMock);
      });
    });

    it('calls saveMinuta once', async () => {
      await instantiateAndRun({
        payload: { ...mockPayload({ idTemplate: idTemplateMock }), }
      });

      expect(mockMinutaRepository.saveMinuta).toHaveBeenCalledTimes(1);
      expect(mockMinutaRepository.saveMinuta).toHaveBeenCalledWith({
        dadosMinuta: {
          customData: mockPayload().dadosMinuta.customData,
          diffs: mockPayload().dadosMinuta.diffs,
          idMinuta: idMinutaMock,
          idTemplate: mockPayload({ idTemplate: idTemplateMock }).dadosMinuta.idTemplate,
          idTemplateDerivado: undefined,
        },
        idFluxo: mockPayload().tipoFluxo.idFluxo,
        matriculaOutorgado: mockPayload().outorgado.matricula,
        outorgante: {
          idProcuracao: mockPayload().poderes.outorganteSelecionado.idProcuracao,
          idProxy: mockPayload().poderes.outorganteSelecionado.idProxy,
          subsidiariasSelected: mockPayload().poderes.outorganteSelecionado.subsidiariasSelected,
        },
        matriculaRegistro: mockPayload().matriculaRegistro,
      });
    });

    it('calls getOneFluxoMinuta once', async () => {
      await instantiateAndRun({
        payload: { ...mockPayload({ idTemplate: idTemplateMock }), }
      });

      expect(mockMinutaRepository.getOneFluxoMinuta).toHaveBeenCalledTimes(1);
      expect(mockMinutaRepository.getOneFluxoMinuta).toHaveBeenCalledWith(mockPayload().tipoFluxo.idFluxo);
    });

    it('calls getMinutaTemplate once', async () => {
      await instantiateAndRun({
        payload: { ...mockPayload({ idTemplate: idTemplateMock }), }
      });

      expect(mockMinutaRepository.getMinutaTemplateByFluxo).toHaveBeenCalledTimes(1);
      expect(mockMinutaRepository.getMinutaTemplateByFluxo).toHaveBeenCalledWith(mockPayload().tipoFluxo.idFluxo);
    });

    it('calls getOneFunci once', async () => {
      await instantiateAndRun({
        payload: { ...mockPayload({ idTemplate: idTemplateMock }), }
      });

      expect(getOneFunciMock).toHaveBeenCalledTimes(1);
      expect(getOneFunciMock).toHaveBeenCalledWith(mockPayload().outorgado.matricula);
    });

    it('calls getProcuracao once', async () => {
      await instantiateAndRun({
        payload: { ...mockPayload({ idTemplate: idTemplateMock }), }
      });

      expect(getProcuracaoMock).toHaveBeenCalledTimes(1);
      expect(getProcuracaoMock).toHaveBeenCalledWith({
        idProcuracao: mockPayload().poderes.outorganteSelecionado.idProcuracao,
        idProxy: mockPayload().poderes.outorganteSelecionado.idProxy,
      });
    });
  });

  describe('without dadosMinuta.customData', () => {
    it('returns the saved minuta', async () => {
      const { payload } = await instantiateAndRun({
        payload: {
          ...mockPayload({ idTemplate: idTemplateMock }),
          dadosMinuta: {
            ...mockPayload({ idTemplate: idTemplateMock }).dadosMinuta,
            customData: undefined,
          },
        }
      });

      expect(payload).toEqual(returnMock);
    });
  });

  describe('without dadosMinuta.idMinuta', () => {
    it('throws an error', async () => {
      const { error } = await instantiateAndRun({
        payload: {
          ...mockPayload({ idTemplate: idTemplateMock }),
          dadosMinuta: {
            idMinuta: undefined,
          }
        }
      });

      expect(error).toEqual(["É necessário criar um ID da minuta.", 400]);
    });
  });

  describe('with invalid dadosMinuta.idMinuta', () => {
    it('throws an error', async () => {
      const { error } = await instantiateAndRun({
        payload: {
          ...mockPayload({ idTemplate: idTemplateMock }),
          dadosMinuta: {
            idMinuta: "invalid uuid",
          }
        }
      });

      expect(error).toEqual(["É necessário passar um ID da minuta válido.", 400]);
    });
  });

  describe('with both dadosMinuta.idTemplate e dadosMinuta.idTemplateDerivado', () => {
    it('throws an error', async () => {
      const { error } = await instantiateAndRun({
        payload: mockPayload({ idTemplate: idTemplateMock, idTemplateDerivado: idTemplateDerivadoMock }),
      });

      expect(error).toEqual(["Indicar apenas um template usado.", 400]);
    });
  });

  describe('with no template', () => {
    it('throws an error', async () => {
      const { error } = await instantiateAndRun({
        payload: mockPayload({ idTemplate: undefined, idTemplateDerivado: undefined }),
      });

      expect(error).toEqual(["É necessário passar qual o template utilizado.", 400]);
    });
  });

  describe('without tipoFluxo.idFluxo', () => {
    it('throws an error', async () => {
      const { error } = await instantiateAndRun({
        payload: {
          ...mockPayload({ idTemplate: idTemplateMock }),
          tipoFluxo: {
            idFluxo: undefined,
          }
        }
      });

      expect(error).toEqual(["É necessário passar o tipo do fluxo.", 400]);
    });
  });

  describe('without poderes.outorganteSelecionado.subsidiariasSelected', () => {
    it('throws an error', async () => {
      const { error } = await instantiateAndRun({
        payload: {
          ...mockPayload({ idTemplate: idTemplateMock }),
          poderes: {
            ...mockPayload().poderes,
            outorganteSelecionado: {
              ...mockPayload().poderes.outorganteSelecionado,
              subsidiariasSelected: undefined,
            }
          }
        }
      });

      expect(error).toEqual(["Subsidiarias precisa ser uma lista.", 400]);
    });
  });

  describe('with poderes.outorganteSelecionado.subsidiariasSelected being empty', () => {
    it('throws an error', async () => {
      const { error } = await instantiateAndRun({
        payload: {
          ...mockPayload({ idTemplate: idTemplateMock }),
          poderes: {
            ...mockPayload().poderes,
            outorganteSelecionado: {
              ...mockPayload().poderes.outorganteSelecionado,
              subsidiariasSelected: [],
            }
          }
        }
      });

      expect(error).toEqual(["É necessario selecionar algum poder.", 400]);
    });
  });

  describe('when minuta different than one from tipoFluxo.minuta', () => {
    it('throws an error', async () => {
      mockMinutaRepository.getOneFluxoMinuta.mockResolvedValue({ minuta: "other minuta" });
      const { error } = await instantiateAndRun({
        payload: { ...mockPayload({ idTemplate: idTemplateMock }), }
      });

      expect(error).toEqual(["Fluxo usado não foi encontrado.", 400]);
    });
  });

  describe('when minutaTemplate different than one from dadosMinuta.minutaTemplate is passed', () => {
    it('throws an error', async () => {
      mockMinutaRepository.getMinutaTemplateByFluxo.mockResolvedValue({ templateBase: "another template" });
      const { error } = await instantiateAndRun({
        payload: { ...mockPayload({ idTemplate: idTemplateMock }), }
      });

      expect(error).toEqual(["Minuta template usada não compatível.", 400]);
    });
  });

  describe('when minutaTemplate is not found', () => {
    it('throws an error', async () => {
      mockMinutaRepository.getMinutaTemplateByFluxo.mockResolvedValue(null);
      const { error } = await instantiateAndRun({
        payload: { ...mockPayload({ idTemplate: idTemplateMock }), }
      });

      expect(error).toEqual(["Template da minuta não foi encontrada.", 400]);
    });
  });

  describe('when no diffs are passed', () => {
    it('throws an error', async () => {
      const { error } = await instantiateAndRun({
        payload: {
          ...mockPayload({ idTemplate: idTemplateMock }),
          dadosMinuta: {
            ...mockPayload().dadosMinuta,
            diffs: undefined,
          },
        }
      });

      expect(error).toEqual(["Necessário haver diffs da minuta.", 400]);
    });
  });

  describe('when diffs is an empty string', () => {
    it('throws an error', async () => {
      const { error } = await instantiateAndRun({
        payload: {
          ...mockPayload({ idTemplate: idTemplateMock }),
          dadosMinuta: {
            ...mockPayload().dadosMinuta,
            diffs: '',
          },
        }
      });

      expect(error).toEqual(["Necessário haver diffs da minuta.", 400]);
    });
  });

  describe('when outorgado is not found', () => {
    it('throws an error', async () => {
      getOneFunciMock.mockResolvedValue(null);
      const { error } = await instantiateAndRun({
        payload: { ...mockPayload({ idTemplate: idTemplateMock }), }
      });

      expect(error).toEqual(["Outorgado não encontrado.", 400]);
    });
  });

  describe('when procuracao is not found', () => {
    it('throws an error', async () => {
      getProcuracaoMock.mockResolvedValue([]);
      const { error } = await instantiateAndRun({
        payload: { ...mockPayload({ idTemplate: idTemplateMock }), }
      });

      expect(error).toEqual(["Procuração do outorgante não encontrada.", 400]);
    });
  });

  describe('when saveMinuta throws', () => {
    it('throws an error for sql errors', async () => {
      mockMinutaRepository.saveMinuta.mockRejectedValue({
        errno: 'mock', sqlMessage: 'sql error message'
      });
      const { error } = await instantiateAndRun({
        payload: { ...mockPayload({ idTemplate: idTemplateMock }), }
      });

      expect(error).toEqual(["sql error message", 400]);
    });

    it('re throws other errors', async () => {
      mockMinutaRepository.saveMinuta.mockRejectedValue('any error');
      const { error } = await instantiateAndRun({
        payload: { ...mockPayload({ idTemplate: idTemplateMock }), }
      });

      expect(error).toEqual(["any error", 500]);
    });
  });

  describe('when matriculaRegistro is not passed', () => {
    it('throws an error', async () => {
      getProcuracaoMock.mockResolvedValue([]);
      const { error } = await instantiateAndRun({
        payload: { ...mockPayload(), matriculaRegistro: undefined }
      });

      expect(error).toEqual(["Usuário não está logado.", 400]);
    });
  });

  async function instantiateAndRun({
    payload,
  }) {
    return new UcSaveMinuta({
      repository: mockMinutaRepository,
      functions: {
        getOneFunci: getOneFunciMock,
        getProcuracao: getProcuracaoMock,
      }
    }).run(payload);
  }
});
