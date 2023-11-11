const UcGetListaMinuta = require('./UcGetListaMinuta');

describe('UcGetListaMinuta', () => {
  const mockRepository = {
    getMinutasMatricula: jest.fn(),
    getMinutasPrefixo: jest.fn(),
  };

  const mockPrefixo = 1234;
  const mockMatricula = "f1234567";
  const mockPayloadMatricula = "mock payload minuta matricula";
  const mockPayloadPrefixo = "mock payload minuta prefixo";

  beforeEach(() => {
    mockRepository.getMinutasMatricula.mockResolvedValue(mockPayloadMatricula);
    mockRepository.getMinutasPrefixo.mockResolvedValue(mockPayloadPrefixo);
  });

  describe('when passing a prefixo', () => {
    it('returns the payload from repository', async () => {
      const { payload } = await instantiateAndRun({ payload: { prefixo: mockPrefixo } });
      expect(payload).toBe(mockPayloadPrefixo);
    });

    it('calls the repository with the prefixo', async () => {
      await instantiateAndRun({ payload: { prefixo: mockPrefixo } });
      expect(mockRepository.getMinutasPrefixo).toHaveBeenCalledTimes(1);
      expect(mockRepository.getMinutasPrefixo).toHaveBeenCalledWith(mockPrefixo);
    });
  });

  describe('when passing a matricula', () => {
    it('returns the payload from repository', async () => {
      const { payload } = await instantiateAndRun({ payload: { matricula: mockMatricula } });
      expect(payload).toBe(mockPayloadMatricula);
    });

    it('calls the repository with the matricula', async () => {
      await instantiateAndRun({ payload: { matricula: mockMatricula } });
      expect(mockRepository.getMinutasMatricula).toHaveBeenCalledTimes(1);
      expect(mockRepository.getMinutasMatricula).toHaveBeenCalledWith(mockMatricula);
    });
  });

  describe('when passing both matricula and prefixo', () => {
    it('throws an error', async () => {
      const { error } = await instantiateAndRun({ payload: { matricula: mockMatricula, prefixo: mockPrefixo } });
      expect(error).toEqual(["É necessário passar apenas um de: matricula ou prefixo", 400]);
    });
  });

  describe('when not passing any of matricula or prefixo', () => {
    it('throws an error', async () => {
      const { error } = await instantiateAndRun({ payload: {} });
      expect(error).toEqual(["É necessário passar uma matricula ou prefixo", 400]);
    });
  });

  describe('when passing an invalid matricula', () => {
    it('throws an error', async () => {
      const { error } = await instantiateAndRun({ payload: { matricula: "invalid matricula" } });
      expect(error).toEqual(["Matrícula em formato inválido.", 400]);
    });
  });

  describe('when passing an invalid prefixo', () => {
    it('throws an error', async () => {
      const { error } = await instantiateAndRun({ payload: { prefixo: "invalid prefixo" } });
      expect(error).toEqual(["Prefixo em formato inválido.", 400]);
    });
  });

  async function instantiateAndRun({
    payload,
  }) {
    return new UcGetListaMinuta({
      repository: mockRepository
    }).run(payload);
  }
});
