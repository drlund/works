const MinutaRepository = require('../../repositories/MinutaRepository');
const UcPesquisarOutorgado = require("./UcPesquisarOutorgado");
const badRequestError = 400;

describe('UcPesquisarOutorgado', () => {
  const mockGetOneFunci = jest.fn();
  const mockGetDadosFunciDb2 = jest.fn();
  const mockMinutasRepository = {
    getOneFluxoMinuta: jest.fn(),
  };

  describe('happy path', () => {
    beforeEach(() => {
      createMocks({});
    });

    it('returns the payload when with all requirements', async () => {
      const result = instantiateAndRun({});

      await result.undefinedError();
      await result.payloadToEqual(mockResultFunci);
    });

    it('return without error when fluxo dont have refOrganizacional', async () => {
      createMocks({ getOneFluxoMinuta: { ok: mockFluxoWithoutRefOrg } });
      await instantiateAndRun({}).payloadToEqual(mockResultFunci);
    });

    it('return without error when fluxo dont have prefixo', async () => {
      createMocks({ getOneFluxoMinuta: { ok: mockFluxoWithoutPrefixo } });
      await instantiateAndRun({}).payloadToEqual(mockResultFunci);
    });
  });

  describe("error paths", () => {
    beforeEach(() => {
      createMocks({});
    });

    it('return error when matricula is not valid', async () => {
      await instantiateAndRun({ termoPesquisa: 'mock matricula' })
        .errorToEqual(['A pesquisa deve ser feita por uma matrícula.', badRequestError]);
    });

    it('return error when fluxo is not found', async () => {
      createMocks({ getOneFluxoMinuta: { ok: null } });
      await instantiateAndRun({}).errorToEqual(['Fluxo não encontrado.', badRequestError]);
    });

    it('return error when funci is not found', async () => {
      createMocks({ getOneFunci: { ok: null } });
      await instantiateAndRun({}).errorToEqual(['Funci não encontrado.', badRequestError]);
    });

    it('return error when funci dont have the correct refOrganizacional', async () => {
      createMocks({ getOneFunci: { ok: mockFunciWithOtherRefOrg } });
      await instantiateAndRun({}).errorToEqual(
        [`Função do outorgado deve ser uma das seguintes: ${mockFluxo.outorgados.refOrganizacional[0]}`, badRequestError]
      );
    });

    it('return error when funci dont have the correct prefixo', async () => {
      createMocks({ getOneFunci: { ok: mockFunciWithOtherPrefixo } });
      await instantiateAndRun({}).errorToEqual(
        [`Outorgado deve pertencer a um dos prefixos: ${mockFluxo.outorgados.prefixos[0]}`, badRequestError]
      );
    });
  });

  describe("DadosFunciDb2", () => {
    it('returns only the funci when funci is not found in db2', async () => {
      createMocks({ getDadosFunciDb2: { ok: null } });
      await instantiateAndRun({}).payloadToEqual(mockFunci);
    });

    it('returns the funci without RG when funci in db2 doesnt have RG', async () => {
      createMocks({ getDadosFunciDb2: { ok: { ...mockFunciDb2, rg: null } } });
      await instantiateAndRun({}).payloadToEqual({ ...mockFunci, nome: mockFunciDb2.nome });
    });
  });

  const mockFunci = {
    matricula: 'f9999999',
    refOrganizacionalFuncLotacao: 'mock1',
    prefixoLotacao: 'mock2',
  };
  const mockFunciDb2 = {
    matricula: 'f9999999',
    nome: 'mock nome db2',
    rg: 'mock rg db2',
  };
  const mockResultFunci = {
    ...mockFunci,
    ...mockFunciDb2,
  };
  const mockFunciWithOtherRefOrg = { ...mockResultFunci, refOrganizacionalFuncLotacao: 'not mock1' };
  const mockFunciWithOtherPrefixo = { ...mockResultFunci, prefixoLotacao: 'not mock2' };

  const mockFluxo = /** @type {FluxoMinuta} */ ({
    fluxo: 'PARTICULAR',
    minuta: 'mock minuta',
    outorgados: {
      refOrganizacional: ['mock1'],
      prefixos: ['mock2'],
    }
  });

  const mockFluxoWithoutRefOrg = /** @type {FluxoMinuta} */ ({ ...mockFluxo, outorgados: { refOrganizacional: null } });
  const mockFluxoWithoutPrefixo = /** @type {FluxoMinuta} */ ({ ...mockFluxo, outorgados: { prefixos: null } });

  /**
   * @typedef {Awaited<ReturnType<MinutaRepository['getOneFluxoMinuta']>>} FluxoMinuta
   */

  /**
   * @param {{
   *  getOneFunci?: {
   *    ok?: Partial<Funci>,
   *    error?: string,
   *  },
   *  getOneFluxoMinuta?: {
   *    ok?: FluxoMinuta,
   *    error?: string,
   *  },
   *  getDadosFunciDb2?: {
   *    ok?: typeof mockFunciDb2,
   *    error?: string,
   *  },
   * }} props
   */
  function createMocks({
    getOneFunci = {
      ok: mockFunci,
      error: null,
    },
    getOneFluxoMinuta = {
      ok: mockFluxo,
      error: null,
    },
    getDadosFunciDb2 = {
      ok: mockFunciDb2,
      error: null,
    }
  }) {
    if (getOneFunci.error) {
      mockGetOneFunci.mockRejectedValue(getOneFunci.error);
    } else {
      mockGetOneFunci.mockResolvedValue(getOneFunci.ok);
    }

    if (getOneFluxoMinuta.error) {
      mockMinutasRepository.getOneFluxoMinuta.mockRejectedValue(getOneFluxoMinuta.error);
    } else {
      mockMinutasRepository.getOneFluxoMinuta.mockResolvedValue(getOneFluxoMinuta.ok);
    }

    if (getDadosFunciDb2.error) {
      mockGetDadosFunciDb2.mockRejectedValue(getDadosFunciDb2.error);
    } else {
      mockGetDadosFunciDb2.mockResolvedValue([getDadosFunciDb2.ok]);
    }
  }


  /**
   * @param {Partial<GetProps<UcPesquisarOutorgado['run']>>} props
   */
  function instantiateAndRun({
    idFluxo = 'mock fluxo',
    termoPesquisa = 'f9999999',
  }) {
    const result = new UcPesquisarOutorgado({
      repository: {
        // @ts-ignore
        minutas: mockMinutasRepository
      },
      functions: {
        getOneFunci: mockGetOneFunci,
        getDadosFunciDb2: mockGetDadosFunciDb2,
      }
    }).run({
      idFluxo,
      termoPesquisa,
    });

    return {
      undefinedError: async () => expect((await result).error).toBeUndefined(),
      errorToEqual: async (expectedError) => expect((await result).error).toEqual(expectedError),
      undefinedPayload: async () => expect((await result).payload).toBeUndefined(),
      payloadToEqual: async (expectedPayload) => expect((await result).payload).toEqual(expectedPayload),
    };
  }
});
