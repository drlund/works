const UcGetFluxoMinuta = require('./UcGetFluxoMinuta');

describe('UcGetMinuta', () => {
  const mockRepository = {
    getOneFluxoMinuta: jest.fn(),
    getFluxosMinuta: jest.fn(),
  };

  const mockOneFluxo = "mock one fluxo";
  const mockFluxos = "mock fluxos";

  beforeEach(() => {
    mockRepository.getOneFluxoMinuta.mockResolvedValue(mockOneFluxo);
    mockRepository.getFluxosMinuta.mockResolvedValue(mockFluxos);
  });

  describe('when passing a valid id', () => {
    const mockId = "mock id";

    it('returns the payload from oneFLuxoMinuta', async () => {
      const { payload } = await instantiateAndRun({ payload: mockId });
      expect(payload).toBe(mockOneFluxo);
    });

    it('returns the payload from oneFLuxoMinuta', async () => {
      await instantiateAndRun({ payload: mockId });
      expect(mockRepository.getOneFluxoMinuta).toHaveBeenCalledTimes(1);
      expect(mockRepository.getOneFluxoMinuta).toHaveBeenCalledWith(mockId);
    });
  });

  describe('when not passing an id', () => {
    it('returns the payload from oneFLuxoMinuta', async () => {
      const { payload } = await instantiateAndRun({});
      expect(payload).toBe(mockFluxos);
    });

    it('returns the payload from oneFLuxoMinuta', async () => {
      await instantiateAndRun({});
      expect(mockRepository.getFluxosMinuta).toHaveBeenCalledTimes(1);
      expect(mockRepository.getFluxosMinuta).toHaveBeenCalledWith();
    });
  });

  describe('when passing a nullish id that isnt null or undefined', () => {
    it('throws an error', async () => {
      const { error } = await instantiateAndRun({ payload: "" });
      expect(error).toEqual(["ID é necessário.", 400]);
    });
  });

  async function instantiateAndRun({
    payload,
  }) {
    return new UcGetFluxoMinuta({
      repository: mockRepository
    }).run(payload);
  }
});
