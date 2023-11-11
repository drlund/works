const UcGetMinuta = require('./UcGetMinuta');

describe('UcGetMinuta', () => {
  const mockRepository = {
    getOneMinuta: jest.fn(),
  };

  describe('when passing a valid id', () => {
    const mockId = "mock id";
    const mockPayload = "mock payload minuta";

    beforeEach(() => {
      mockRepository.getOneMinuta.mockResolvedValue(mockPayload);
    });
    it('returns the payload from repository', async () => {
      const { payload } = await instantiateAndRun({ payload: mockId });
      expect(payload).toBe(mockPayload);
    });

    it('calls the repository with the id', async () => {
      await instantiateAndRun({ payload: mockId });
      expect(mockRepository.getOneMinuta).toHaveBeenCalledTimes(1);
      expect(mockRepository.getOneMinuta).toHaveBeenCalledWith(mockId);
    });

    describe('when no minuta is found', () => {
      beforeEach(() => {
        mockRepository.getOneMinuta.mockResolvedValue(null);
      });

      it('returns 404 error', async () => {
        const { error } = await instantiateAndRun({ payload: mockId });
        expect(error).toEqual(["Minuta não encontrada.", 404]);
      });
    });
  });

  describe('when not passing an id', () => {
    it('throws an error', async () => {
      const { error } = await instantiateAndRun({});
      expect(error).toEqual(["O id não pode ser vazio", 400]);
    });
  });

  describe('when passing a nullish id', () => {
    it('throws an error', async () => {
      const { error } = await instantiateAndRun({ payload: "" });
      expect(error).toEqual(["O id não pode ser vazio", 400]);
    });
  });

  describe('when passing a non string id', () => {
    it('throws an error', async () => {
      const { error } = await instantiateAndRun({ payload: 1 });
      expect(error).toEqual(["O id precisa ser string", 400]);
    });
  });

  async function instantiateAndRun({
    payload,
  }) {
    return new UcGetMinuta({
      repository: mockRepository
    }).run(payload);
  }
});
