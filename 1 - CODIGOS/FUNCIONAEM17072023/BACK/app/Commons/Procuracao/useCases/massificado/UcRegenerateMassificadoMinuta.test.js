const Diff = require('diff');
const UcRegenerateMassificadoMinuta = require('./UcRegenerateMassificadoMinuta');
const MinutaRepository = require('../../repositories/MinutaRepository');
const PesquisaRepository = require('../../repositories/PesquisaRepository');

jest.mock('../../repositories/MinutaRepository');
jest.mock('../../repositories/PesquisaRepository');

describe('UcRegenerateMassificadoMinuta', () => {
  const mockMinutaRepository = /** @type {jest.Mocked<MinutaRepository>} */(/** @type {unknown} */(new MinutaRepository()));
  const mockPesquisaRepository = /** @type {jest.Mocked<PesquisaRepository>} */(/** @type {unknown} */(new PesquisaRepository()));
  const mockGetManyFuncis = /** @type {jest.MockedFunction<getManyFuncis>} */(jest.fn());

  const fluxoMock = {
    minuta: "minuta | fluxo mock",
    fluxo: /** @type {Procuracoes.FluxoMinuta['fluxo']} */("fluxo | fluxo mock"),
    outorgados: /** @type {Procuracoes.FluxoMinuta['outorgados']} */("outorgados | fluxo mock"),
  };

  const minutaTemplateMock = /** @type {MinutaRepository.MinutaTemplate} */({ templateBase: "mock minuta template" });

  const idMassificadoMock = "mock id massificado";
  const idMinutaMock = "mock id minuta";

  const customDataMock = (/** @type {number} */ n) =>
    /** @type {{ outorgado: Procuracoes.CustomDataMassificado[string]} & Omit<Procuracoes.CustomData, 'massificado'>} */({
    cartorio: "mock cartorio custom data",
    blocoSubsidiarias: "mock blocoSubsidiarias custom data",
    outorgante: "mock outorgante custom data",
    outorgado: `mock outorgado ${n} custom data`,
  });

  const currentText = "minuta template";
  const diffsMock = Diff.createPatch('', minutaTemplateMock.templateBase, currentText);
  const matriculaOutorgadoMock = "mock matricula outorgado";
  const matriculaRegistroMock = "mock matricula registro";
  const idTemplateBaseMock = "mock idTemplateBase";
  const idTemplateDerivadoMock = "mock idTemplateDerivado";
  const idFluxoMock = "mock id fluxo";
  const idProcuracaoMock = "mock id procuracao";
  const idProxyMock = "mock id proxy";
  const subsidiariasSelectedMock = ["mock1", "mock2", "mock3"];

  const mockMinutaCadastrada = (/** @type {number} */ num) => /** @type {MinutaRepository.MinutaTabelaType} */({
    idFluxo: idFluxoMock,
    idMassificado: idMassificadoMock,
    idMinuta: idMinutaMock + num,
    idTemplateBase: idTemplateBaseMock,
    idTemplateDerivado: idTemplateDerivadoMock,
    matriculaOutorgado: matriculaOutorgadoMock + num,
    matriculaRegistro: matriculaRegistroMock,
    outorgante_idProcuracao: idProcuracaoMock,
    outorgante_idProxy: idProxyMock,
    outorgante_subsidiariasSelected: JSON.stringify(subsidiariasSelectedMock),
    dadosMinuta_diffs: diffsMock,
    dadosMinuta_customData: JSON.stringify(customDataMock(num)),
    mockNum: num,
  });

  const mockMassificado = [mockMinutaCadastrada(0), mockMinutaCadastrada(1)];

  const mockCadeiaProcuracaoOutorgante = /** @type {PesquisaRepository.CadeiaDeProcuracao} */([{
    procuracaoAgregada: null,
    outorgado: /** @type {PesquisaRepository.Outorgado} */ ({ matricula: "mockOutorgante" }),
    subsidiarias: /** @type {PesquisaRepository.SubsidiariasExplodido} */ (/** @type {unknown} */(["mock subsidiarias"])),
  }]);

  const mockProcuracaoPesquisa = /** @type {PesquisaRepository.ProcuracaoPesquisaBase} */([{
    idProcuracao: idProcuracaoMock,
    idProxy: idProxyMock,
    nome: "mock nome",
    matricula: "mock matricula",
  }]);

  beforeEach(() => {
    mockGetManyFuncis.mockImplementation(
      async (arr) => arr.map(m => /** @type {Funci} */(/** @type {unknown} */({ matricula: m, restoInfoFunci: null })))
    );
    mockMinutaRepository.getMinutasByIdMassificado.mockResolvedValue(mockMassificado);
    mockMinutaRepository.getMinutaTemplateById.mockResolvedValue(minutaTemplateMock);
    mockMinutaRepository.getOneFluxoMinuta.mockResolvedValue(fluxoMock);
    mockPesquisaRepository.getCadeiaDeProcuracaoById.mockResolvedValue(mockCadeiaProcuracaoOutorgante);
    mockPesquisaRepository.getIdsPorPesquisaPessoa.mockResolvedValue(mockProcuracaoPesquisa);
  });

  it('works in the happy path', async () => {
    await initiateAndRun().ok({
      dadosMinuta: {
        customData: {
          blocoSubsidiarias: customDataMock(0).blocoSubsidiarias,
          cartorio: customDataMock(0).cartorio,
          outorgante: customDataMock(0).outorgante,
          massificado: Object.fromEntries(mockMassificado.map(m => [
            m.matriculaOutorgado,
            customDataMock(/** @type {{ mockNum: number }} */(/** @type {unknown} */(m)).mockNum).outorgado,
          ])),
        },
        idFluxo: idFluxoMock,
        idMinuta: idMassificadoMock,
        idTemplate: idTemplateBaseMock,
        idTemplateDerivado: idTemplateDerivadoMock,
        massificado: {
          hasError: [],
          numberOfValid: 2,
          ...Object.fromEntries(mockMassificado.map(m => [
            m.matriculaOutorgado,
            {
              diffs: m.dadosMinuta_diffs,
              idMinuta: m.idMinuta,
              template: currentText,
            }
          ]))
        }
      },
      outorgadoMassificado: {
        listaDeMatriculas: mockMassificado.map(m => m.matriculaOutorgado),
        outorgados: Object.fromEntries(mockMassificado.map(m => [
          m.matriculaOutorgado,
          {
            error: null,
            matricula: m.matriculaOutorgado,
            restoInfoFunci: null,
          }
        ]))
        ,
        uuidMatriculas: Object.fromEntries(mockMassificado.map(m => [
          m.matriculaOutorgado,
          m.idMinuta
        ]))
      },
      poderes: {
        outorganteSelecionado: {
          ...mockProcuracaoPesquisa[0],
          subsidiariasSelected: subsidiariasSelectedMock
        },
        outorgantes: [{
          ...mockProcuracaoPesquisa[0],
          procuracao: mockCadeiaProcuracaoOutorgante[0]
        }],
      },
      tipoFluxo: {
        ...fluxoMock,
        idFluxo: idFluxoMock,
      },
    });
  });

  it('handles outorgados with errors', async () => {
    const massificadoError = /** @type {MinutaRepository.MinutaTabelaType} */({
      ...mockMinutaCadastrada(2),
      dadosMinuta_diffs: Diff.createPatch('', 'error', 'nope'),
    });
    const mockMassificadoWithError = mockMassificado.concat(massificadoError);
    mockMinutaRepository.getMinutasByIdMassificado.mockResolvedValue(mockMassificadoWithError);
    await initiateAndRun().ok({
      dadosMinuta: {
        customData: {
          blocoSubsidiarias: customDataMock(0).blocoSubsidiarias,
          cartorio: customDataMock(0).cartorio,
          outorgante: customDataMock(0).outorgante,
          massificado: Object.fromEntries(mockMassificadoWithError.map(m => [
            m.matriculaOutorgado,
            customDataMock(/** @type {{ mockNum: number }} */(/** @type {unknown} */(m)).mockNum).outorgado,
          ])),
        },
        idFluxo: idFluxoMock,
        idMinuta: idMassificadoMock,
        idTemplate: idTemplateBaseMock,
        idTemplateDerivado: idTemplateDerivadoMock,
        massificado: {
          hasError: [massificadoError.matriculaOutorgado],
          numberOfValid: 2,
          ...Object.fromEntries(mockMassificado.map(m => [
            m.matriculaOutorgado,
            {
              diffs: m.dadosMinuta_diffs,
              idMinuta: m.idMinuta,
              template: currentText,
            }
          ])),
          [massificadoError.matriculaOutorgado]: {
            diffs: massificadoError.dadosMinuta_diffs,
            idMinuta: massificadoError.idMinuta,
            template: false
          }
        }
      },
      outorgadoMassificado: {
        listaDeMatriculas: mockMassificadoWithError.map(m => m.matriculaOutorgado),
        outorgados: Object.fromEntries(mockMassificadoWithError.map(m => [
          m.matriculaOutorgado,
          {
            error: null,
            matricula: m.matriculaOutorgado,
            restoInfoFunci: null,
          }
        ]))
        ,
        uuidMatriculas: Object.fromEntries(mockMassificadoWithError.map(m => [
          m.matriculaOutorgado,
          m.idMinuta
        ]))
      },
      poderes: {
        outorganteSelecionado: {
          ...mockProcuracaoPesquisa[0],
          subsidiariasSelected: subsidiariasSelectedMock
        },
        outorgantes: [{
          ...mockProcuracaoPesquisa[0],
          procuracao: mockCadeiaProcuracaoOutorgante[0]
        }],
      },
      tipoFluxo: {
        ...fluxoMock,
        idFluxo: idFluxoMock,
      },
    });
  });

  it('fails without idMassificado', async () => {
    await initiateAndRun('').error('ID do massificado é necessário.');
  });

  it('fails if minutas not found', async () => {
    mockMinutaRepository.getMinutasByIdMassificado.mockResolvedValue(null);
    await initiateAndRun().error('Minutas não encontradas.', 404);
  });

  it('fails if minutas is empty', async () => {
    mockMinutaRepository.getMinutasByIdMassificado.mockResolvedValue([]);
    await initiateAndRun().error('Minutas não encontradas.', 404);
  });

  it('fails if cadeia do outorgante not found', async () => {
    mockPesquisaRepository.getCadeiaDeProcuracaoById.mockResolvedValue(/** @type {any} */([]));
    await initiateAndRun().error('Cadeia de procuração do outorgante não encontrada.', 404);
  });

  it('fails if procuracao do outorgante not found', async () => {
    mockPesquisaRepository.getIdsPorPesquisaPessoa.mockResolvedValue(/** @type {any} */([]));
    await initiateAndRun().error('Procuração do outorgante não encontrada.', 404);
  });

  it('fails if outorgados not found', async () => {
    mockGetManyFuncis.mockResolvedValue([]);
    await initiateAndRun().error('Outogado da minuta não encontrado.');
  });

  it('fails if template is not found', async () => {
    mockMinutaRepository.getMinutaTemplateById.mockResolvedValue(null);
    await initiateAndRun().error('Template utilizado na minuta não encontrado.');
  });

  it('fails if fluxo is not found', async () => {
    mockMinutaRepository.getOneFluxoMinuta.mockResolvedValue(null);
    await initiateAndRun().error('Fluxo de minuta não encontrado.');
  });

  it('it catches errors from async functions (#handleAsyncFunction)', async () => {
    mockMinutaRepository.getOneFluxoMinuta.mockRejectedValue('error');
    await initiateAndRun().error('error');
  });

  function initiateAndRun(id = idMassificadoMock) {
    const run = new UcRegenerateMassificadoMinuta({
      repository: {
        minuta: mockMinutaRepository,
        pesquisa: mockPesquisaRepository,
      },
      functions: {
        getManyFuncis: mockGetManyFuncis,
      },
    }).run(id);

    return {
      ok: async (/** @type {unknown} */ val) => expect((await run).payload).toEqual(val),
      error: async (/** @type {string} */ err, /** @type {number} */ code = 400) => expect((await run).error).toEqual([err, code]),
    };
  }
});
