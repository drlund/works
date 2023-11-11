const Diff = require('diff');
const UcSaveMinutaBatch = require('./UcSaveMinutaBatch');

const badRequestError = 400;

describe('UcSaveMinutaBatch', () => {
  const mockFuncis = async (funcis) => /** @type {Funci[]} */([{
    dependencia: {
      prefixo: 'mock dep prefixo ok',
      nome: 'mock dep nome ok',
      super: 'mock dep super ok',
      municipio: 'mock dep municipio ok',
      uf: 'mock dep uf ok',
    },
    matricula: "F0000000",
    nome: "mock funci ok",
    prefixoLotacao: "mock prefixo ok"
  },
  {
    dependencia: {
      prefixo: 'mock dep prefixo ok2',
      nome: 'mock dep nome ok2',
      super: 'mock dep super ok2',
      municipio: 'mock dep municipio ok2',
      uf: 'mock dep uf ok2'
    },
    matricula: "F1111111",
    nome: "mock funci ok2",
    prefixoLotacao: "mock prefixo ok2"
  },
  {
    dependencia: {
      prefixo: 'mock dep prefixo error',
      nome: 'mock dep nome error',
      super: 'mock dep super error',
      municipio: 'mock dep municipio error',
      uf: 'mock dep uf error'
    },
    matricula: "F1234567",
    nome: "mock funci error",
    prefixoLotacao: "mock prefixo error"
  }]).filter(f => funcis.includes(f.matricula));
  const mockGetManyFuncis = jest.fn(mockFuncis);

  const mockMinutaRepository = {
    saveLoteMinuta: jest.fn((args) => args),
    getOneFluxoMinuta: jest.fn(),
    getMinutaTemplateByFluxo: jest.fn(),
  };
  const mockPesquisaRepository = {
    getCadeiaDeProcuracaoById: jest.fn(),
  };

  const idMinutaMock = "00000000-0000-0000-0000-000000000000";
  const minutaTemplateMock = "mock minuta template";
  const diffsMock = Diff.createPatch('', minutaTemplateMock, "minuta template");

  const makeArgs = () => /** @type {UcSaveMinutaBatch.RunArgs} */({
    matriculaRegistro: 'mock matricula registro',
    dadosMinuta: {
      ativo: 1,
      createdAt: "mock createdAt",
      customData: {
        cartorio: {
          monthToday: Intl.DateTimeFormat('pt-br', { month: 'long' }).format(new Date()),
          dayToday: new Date().getDate().toString(),
          yearToday: new Date().getFullYear().toString(),
        }
      },
      idFluxo: "mock id fluxo",
      idMinuta: "mock id massificado",
      idTemplate: "mock id template",
      idTemplateDerivado: null,
      massificado: {
        F0000000: {
          diffs: diffsMock,
          idMinuta: idMinutaMock,
          template: minutaTemplateMock,
        },
        F1111111: {
          diffs: diffsMock,
          idMinuta: idMinutaMock,
          template: minutaTemplateMock,
        },
        hasError: /** @type {never} */([]),
        numberOfValid: 2
      },
      templateBase: "mock template"
    },
    outorgadoMassificado: {
      listaDeMatriculas: [
        "F0000000",
        "F1111111",
        "F1234567"
      ],
      outorgados: {
        F0000000: {
          error: null,
          matricula: "F0000000",
        },
        F1111111: {
          error: null,
          matricula: "F1111111",
        },
        F1234567: {
          error: "mock error with funci",
          matricula: "F1234567",
        },
        F9999999: {
          error: "mock error no funci",
          matricula: "F9999999"
        }
      }
    },
    poderes: {
      outorganteSelecionado: {
        idProcuracao: '2',
        idProxy: null,
        matricula: "F1111112",
        subsidiariasSelected: [1, 2, 3]
      },
    },
    tipoFluxo: {
      fluxo: "PUBLICA",
      idFluxo: "9bca0a03-9b9e-454c-a6a1-b963942fc25c",
      minuta: "2º Nível Gerencial UT (Gerente de Negócios ou Administração) | Pública"
    }
  });

  beforeEach(() => {
    mockMinutaRepository.getMinutaTemplateByFluxo.mockResolvedValue({ templateBase: minutaTemplateMock });
    mockMinutaRepository.getOneFluxoMinuta.mockResolvedValue({ minuta: makeArgs().tipoFluxo.minuta });
    mockPesquisaRepository.getCadeiaDeProcuracaoById.mockResolvedValue(true);
  });

  it('saves the batch in the happy path', async () => {
    (await instantiateAndRun()).expectPayloadToEqual([
      {
        dadosMinuta_customData: JSON.stringify(makeArgs().dadosMinuta.customData),
        dadosMinuta_diffs: diffsMock,
        idFluxo: makeArgs().tipoFluxo.idFluxo,
        idMinuta: idMinutaMock,
        idMassificado: makeArgs().dadosMinuta.idMinuta,
        idTemplateBase: makeArgs().dadosMinuta.idTemplate,
        idTemplateDerivado: makeArgs().dadosMinuta.idTemplateDerivado,
        matriculaOutorgado: makeArgs().outorgadoMassificado.listaDeMatriculas[0],
        matriculaRegistro: makeArgs().matriculaRegistro,
        outorgante_idProcuracao: makeArgs().poderes.outorganteSelecionado.idProcuracao,
        outorgante_idProxy: makeArgs().poderes.outorganteSelecionado.idProxy,
        outorgante_subsidiariasSelected: JSON.stringify(makeArgs().poderes.outorganteSelecionado.subsidiariasSelected),
      },
      {
        dadosMinuta_customData: JSON.stringify(makeArgs().dadosMinuta.customData),
        dadosMinuta_diffs: diffsMock,
        idFluxo: makeArgs().tipoFluxo.idFluxo,
        idMinuta: idMinutaMock,
        idMassificado: makeArgs().dadosMinuta.idMinuta,
        idTemplateBase: makeArgs().dadosMinuta.idTemplate,
        idTemplateDerivado: makeArgs().dadosMinuta.idTemplateDerivado,
        matriculaOutorgado: makeArgs().outorgadoMassificado.listaDeMatriculas[1],
        matriculaRegistro: makeArgs().matriculaRegistro,
        outorgante_idProcuracao: makeArgs().poderes.outorganteSelecionado.idProcuracao,
        outorgante_idProxy: makeArgs().poderes.outorganteSelecionado.idProxy,
        outorgante_subsidiariasSelected: JSON.stringify(makeArgs().poderes.outorganteSelecionado.subsidiariasSelected),
      }
    ]);
  });

  describe('error paths', () => {
    it('throws if user not logged', async () => {
      (await instantiateAndRun({
        ...makeArgs(),
        matriculaRegistro: null,
      })).expectErrorToEqual('Usuário não está logado.');
    });

    it('throws if one minuta dont have an id', async () => {
      const mock = makeArgs();
      delete mock.dadosMinuta.massificado['F0000000'].idMinuta;

      (await instantiateAndRun(mock))
        .expectErrorToEqual('É necessário criar um ID válido para cada matricula.');
    });

    it('throws if one minuta isnt a valid uuid', async () => {
      const mock = makeArgs();
      mock.dadosMinuta.massificado['F0000000'].idMinuta = 'not a valid uuid';

      (await instantiateAndRun(mock))
        .expectErrorToEqual('É necessário criar um ID válido para cada matricula.');
    });

    it('throws if one minuta dont use the same template', async () => {
      mockMinutaRepository.getMinutaTemplateByFluxo.mockResolvedValue({ templateBase: 'another template' });
      (await instantiateAndRun())
        .expectErrorToEqual('Minuta template usada não compatível.');
    });

    it('throws if one minuta dont have diffs', async () => {
      const mock = makeArgs();
      delete mock.dadosMinuta.massificado['F0000000'].diffs;

      (await instantiateAndRun(mock))
        .expectErrorToEqual('Necessário haver diffs da minuta.');
    });

    it('throws if fluxo is not passed', async () => {
      const mock = makeArgs();
      delete mock.tipoFluxo.idFluxo;

      (await instantiateAndRun(mock))
        .expectErrorToEqual('É necessário passar o tipo do fluxo.');
    });

    it('throws if the minuta is different from returned one', async () => {
      const mock = makeArgs();
      mock.tipoFluxo.minuta = 'another minuta';

      (await instantiateAndRun(mock))
        .expectErrorToEqual('Fluxo usado não foi encontrado.');
    });

    it('throws if the minuta is different from returned one', async () => {
      mockMinutaRepository.getMinutaTemplateByFluxo.mockResolvedValue(null);
      (await instantiateAndRun())
        .expectErrorToEqual('Template da minuta não foi encontrada.');
    });

    it('throws if the cadeia not found', async () => {
      mockPesquisaRepository.getCadeiaDeProcuracaoById.mockResolvedValue(null);
      (await instantiateAndRun())
        .expectErrorToEqual('Procuração do outorgante não encontrada.');
    });

    it('throws if the subsidiarias isnt an array', async () => {
      const mock = makeArgs();
      // @ts-expect-error
      mock.poderes.outorganteSelecionado.subsidiariasSelected = 'not an array';

      (await instantiateAndRun(mock))
        .expectErrorToEqual('Subsidiarias precisa ser uma lista.');
    });

    it('throws if the subsidiarias is empty', async () => {
      const mock = makeArgs();
      mock.poderes.outorganteSelecionado.subsidiariasSelected = [];

      (await instantiateAndRun(mock))
        .expectErrorToEqual('É necessario selecionar algum poder.');
    });

    it('throws if valid outorgados dont match', async () => {
      const mock = makeArgs();
      mock.dadosMinuta.massificado.numberOfValid = 0;

      (await instantiateAndRun(mock))
        .expectErrorToEqual('Diferença no número de outorgados válidos.');
    });

    it('throws if funcis not found', async () => {
      mockGetManyFuncis.mockResolvedValue(null);

      (await instantiateAndRun())
        .expectErrorToEqual('Outorgados não encontrados.');
    });

    it('throws if number of funcis found is different', async () => {
      mockGetManyFuncis.mockResolvedValue([]);

      (await instantiateAndRun())
        .expectErrorToEqual('Outorgados não encontrados.');
    });

    it('throws if batch dont have id', async () => {
      const mock = makeArgs();
      delete mock.dadosMinuta.idMinuta;

      (await instantiateAndRun(mock))
        .expectErrorToEqual('É necessário criar um ID para o lote de minutas.');
    });

    it('throws if batch dont have the template id', async () => {
      const mock = makeArgs();
      delete mock.dadosMinuta.idTemplate;

      (await instantiateAndRun(mock))
        .expectErrorToEqual('É necessário passar qual o template utilizado.');
    });

    it('throws if batch has both template and derivado id', async () => {
      const mock = makeArgs();
      mock.dadosMinuta.idTemplateDerivado = 'mock idTemplateDerivado';

      (await instantiateAndRun(mock))
        .expectErrorToEqual('Indicar apenas um template usado.');
    });
  });

  async function instantiateAndRun(args = makeArgs()) {
    const { error, payload } = await new UcSaveMinutaBatch({
      functions: {
        getManyFuncis: mockGetManyFuncis,
      },
      repository: {
        // @ts-ignore
        minuta: mockMinutaRepository,
        // @ts-ignore
        pesquisa: mockPesquisaRepository
      }
    }).run(args);

    return {
      error,
      payload,
      expectErrorToEqual: (thisError, code = badRequestError) => expect(error).toEqual([thisError, code]),
      expectPayloadToEqual: (thisPayload) => expect(payload).toEqual(thisPayload),
    };
  }
});
