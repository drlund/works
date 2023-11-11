const UcGetProcuracao = require('./UcGetProcuracao');

describe('UcGetListaFromPesquisa', () => {
  const mockRepository = {
    getCadeiaDeProcuracaoById: jest.fn(),
  };

  it('should go through the database and return the result', async () => {
    const payload = { idProxy: 'something' };
    const returnValue = 'returnValue';

    mockToResolveValue(returnValue);
    const result = await instantiateAndRun({ payload });

    expect(mockRepository.getCadeiaDeProcuracaoById).toHaveBeenCalledTimes(1);
    expect(mockRepository.getCadeiaDeProcuracaoById).toHaveBeenCalledWith(payload);

    expect(await result).toEqual({ payload: returnValue });
  });

  it('should return an empty array if matricula has no procuracoes', async () => {
    const payload = { idProxy: 'something' };
    const returnValue = null;

    mockToResolveValue(returnValue);
    const result = instantiateAndRun({ payload });

    expect(await result).toEqual({ payload: [] });
  });

  describe('errors', () => {
    it('should return an error without payload', async () => {
      mockToRejectValue(null);
      const result = instantiateAndRun({ payload: {} });

      expect(await result).toEqual({ error: ['ID não pode ser vazio', 400] });
    });

    it('should return an error if passing both idProxy and idProcuracao', async () => {
      mockToRejectValue(null);
      const result = instantiateAndRun({
        payload: {
          idProxy: 'any',
          idProcuracao: 'any',
        }
      });

      expect(await result).toEqual({ error: ['Preencha apenas um dos ID', 400] });
    });

    it('should return an error if the database throws an error', async () => {
      const returnValue = 'error thrown';

      mockToThrowError(returnValue);
      const result = instantiateAndRun({ payload: { idProxy: 'any' } });

      expect(await result).toEqual({ error: [returnValue, 500] });
    });
  });

  async function instantiateAndRun({ payload }) {
    const uc = new UcGetProcuracao({ repository: mockRepository });
    return uc.run(payload);
  }

  async function mockToResolveValue(value) {
    mockRepository.getCadeiaDeProcuracaoById.mockReturnValue(value);
  }
  async function mockToRejectValue(value) {
    mockRepository.getCadeiaDeProcuracaoById.mockRejectedValue(value);
  }
  async function mockToThrowError(value) {
    mockRepository.getCadeiaDeProcuracaoById.mockImplementation(() => {
      throw value;
    });
  }
});