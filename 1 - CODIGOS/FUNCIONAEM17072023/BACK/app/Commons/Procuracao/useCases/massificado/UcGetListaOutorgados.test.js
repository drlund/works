const MinutaRepository = require('../../repositories/MinutaRepository');
const UcGetListaOutorgados = require("./UcGetListaOutorgados");
const badRequestError = 400;

describe('UcGetListaOutorgados', () => {
  const mockGetManyFuncis = jest.fn();
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
      await result.payloadToEqual({
        f9999999: {
          error: null,
          funci: mockResultFunci
        },
      });
    });

    it('return without error when fluxo dont have refOrganizacional', async () => {
      createMocks({
        getOneFluxoMinuta: { ok: mockFluxoWithoutRefOrg },
        getManyFuncis: { ok: [mockFunciWithOtherRefOrg] }
      });
      await instantiateAndRun({}).payloadToEqual({
        f9999999: {
          funci: mockFunciWithOtherRefOrg,
          error: null
        }
      });
    });

    it('return without error when fluxo dont have prefixo', async () => {
      createMocks({
        getOneFluxoMinuta: { ok: mockFluxoWithoutPrefixo },
        getManyFuncis: { ok: [mockFunciWithOtherPrefixo] }
      });
      await instantiateAndRun({}).payloadToEqual({
        f9999999: {
          funci: mockFunciWithOtherPrefixo,
          error: null
        }
      });
    });

    it('returns even if one matricula is valid', async () => {
      await instantiateAndRun({ listaDeMatriculas: ['f9999999', 'mock matricula', 'f1234567'] })
        .payloadToEqual({
          f9999999: {
            funci: mockResultFunci,
            error: null
          },
          f1234567: {
            error: 'Funci não encontrado.',
          },
          "mock matricula": {
            error: 'Matrícula inválida.',
          }
        });
    });
  });

  describe("error paths", () => {
    beforeEach(() => {
      createMocks({});
    });

    it('throws an error when the fluxo is not passed', async () => {
      await instantiateAndRun({
        idFluxo: null,
      }).errorToEqual(["O id do fluxo deve ser informado.", badRequestError]);
    });

    it('throws an error when the fluxo does not exist', async () => {
      createMocks({ getOneFluxoMinuta: { ok: null } });
      await instantiateAndRun({}).errorToEqual(["Fluxo não encontrado.", badRequestError]);
    });

    it('throws an error when the lista de matrículas is not passed', async () => {
      await instantiateAndRun({ listaDeMatriculas: null })
        .errorToEqual(["A lista de matrículas deve ser informada.", badRequestError]);
    });

    it('throws an error when the lista de matrículas is empty', async () => {
      await instantiateAndRun({ listaDeMatriculas: [] })
        .errorToEqual(["A lista de matrículas deve ser informada.", badRequestError]);
    });

    it('throws an error when the lista de matrículas contains invalid matrículas', async () => {
      await instantiateAndRun({ listaDeMatriculas: ['mock matricula'] })
        .errorToEqual(["A lista de matrículas deve conter matrículas válidas.", badRequestError]);
    });

    it('returns an error when the lista de matrículas only contains matrículas that do not exist', async () => {
      createMocks({ getManyFuncis: { ok: [] } });
      await instantiateAndRun({ listaDeMatriculas: ['f9999999'] })
        .payloadToEqual({
          f9999999: {
            error: 'Funci não encontrado.',
          }
        });
    });

    it('return error when the lista de matrículas contains matrículas that do not belong to the refOrganizacional', async () => {
      createMocks({ getManyFuncis: { ok: [mockFunciWithOtherRefOrg] } });
      await instantiateAndRun({}).payloadToEqual({
        f9999999: {
          funci: mockFunciWithOtherRefOrg,
          error: `Função do outorgado deve ser uma das seguintes: ${mockFluxo.outorgados.refOrganizacional[0]}`
        }
      });
    });

    it('return error when the lista de matrículas contains matrículas that do not belong to the prefixo', async () => {
      createMocks({ getManyFuncis: { ok: [mockFunciWithOtherPrefixo] } });
      await instantiateAndRun({}).payloadToEqual({
        f9999999: {
          funci: mockFunciWithOtherPrefixo,
          error: `Outorgado deve pertencer a um dos prefixos: ${mockFluxo.outorgados.prefixos[0]}`
        }
      });
    });
  });

  describe("DadosFunciDb2", () => {
    it('returns only the funci when funci is not found in db2', async () => {
      createMocks({ getDadosFunciDb2: { ok: [] } });
      await instantiateAndRun({}).payloadToEqual({
        f9999999: {
          error: null,
          funci: mockFunci,
        },
      });
    });

    it('returns the funci without RG when funci in db2 doesnt have RG', async () => {
      createMocks({ getDadosFunciDb2: { ok: [{ ...mockFunciDb2, rg: null }] } });
      await instantiateAndRun({}).payloadToEqual({
        f9999999: {
          error: null,
          funci: {
            ...mockFunci,
            nome: mockFunciDb2.nome
          },
        },
      });
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
   *  getManyFuncis?: {
   *    ok?: Partial<Funci>[],
   *    error?: string,
   *  },
   *  getOneFluxoMinuta?: {
   *    ok?: FluxoMinuta,
   *    error?: string,
   *  },
  *  getDadosFunciDb2?: {
  *    ok?: typeof mockFunciDb2[],
  *    error?: string,
  *  },
   * }} props
   */
  function createMocks({
    getManyFuncis = {
      ok: [mockFunci],
      error: null,
    },
    getOneFluxoMinuta = {
      ok: mockFluxo,
      error: null,
    },
    getDadosFunciDb2 = {
      ok: [mockFunciDb2],
      error: null,
    }
  }) {
    if (getManyFuncis.error) {
      mockGetManyFuncis.mockRejectedValue(getManyFuncis.error);
    } else {
      mockGetManyFuncis.mockResolvedValue(getManyFuncis.ok);
    }

    if (getOneFluxoMinuta.error) {
      mockMinutasRepository.getOneFluxoMinuta.mockRejectedValue(getOneFluxoMinuta.error);
    } else {
      mockMinutasRepository.getOneFluxoMinuta.mockResolvedValue(getOneFluxoMinuta.ok);
    }

    if (getDadosFunciDb2.error) {
      mockGetDadosFunciDb2.mockRejectedValue(getDadosFunciDb2.error);
    } else {
      mockGetDadosFunciDb2.mockResolvedValue(getDadosFunciDb2.ok);
    }
  }


  /**
   * @param {Partial<GetProps<UcGetListaOutorgados['run']>>} props
   */
  function instantiateAndRun({
    idFluxo = 'mock fluxo',
    listaDeMatriculas = ['f9999999'],
  }) {
    const result = new UcGetListaOutorgados({
      repository: {
        // @ts-ignore
        minutas: mockMinutasRepository
      },
      functions: {
        getManyFuncis: mockGetManyFuncis,
        getDadosFunciDb2: mockGetDadosFunciDb2,
      }
    }).run({
      idFluxo,
      listaDeMatriculas,
    });

    return {
      undefinedError: async () => expect((await result).error).toBeUndefined(),
      errorToEqual: async (expectedError) => expect((await result).error).toEqual(expectedError),
      undefinedPayload: async () => expect((await result).payload).toBeUndefined(),
      payloadToEqual: async (expectedPayload) => expect((await result).payload).toEqual(expectedPayload),
    };
  }
});
