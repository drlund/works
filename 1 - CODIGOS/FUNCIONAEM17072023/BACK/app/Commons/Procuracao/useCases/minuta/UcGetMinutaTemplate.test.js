const UcGetMinutaTemplate = require('./UcGetMinutaTemplate');

describe('UcGetMinutaTemplate', () => {
  const mockRepository = {
    getMinutaTemplateByFluxo: jest.fn(),
  };

  describe('when passing a valid id', () => {
    const mockId = "mock id";
    const mockPayload = "mock payload minuta";

    beforeEach(() => {
      mockRepository.getMinutaTemplateByFluxo.mockResolvedValue(mockPayload);
    });

    it('returns the payload from repository', async () => {
      const { payload } = await instantiateAndRun({ payload: mockId });
      expect(payload).toBe(mockPayload);
    });

    it('calls the repository with the id', async () => {
      await instantiateAndRun({ payload: mockId });
      expect(mockRepository.getMinutaTemplateByFluxo).toHaveBeenCalledTimes(1);
      expect(mockRepository.getMinutaTemplateByFluxo).toHaveBeenCalledWith(mockId);
    });

    describe('when no template is found', () => {
      beforeEach(() => {
        mockRepository.getMinutaTemplateByFluxo.mockResolvedValue(null);
      });

      it('returns 404 error', async () => {
        const { error } = await instantiateAndRun({ payload: mockId });
        expect(error).toEqual(["Template não encontrado.", 404]);
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
    return new UcGetMinutaTemplate({
      repository: mockRepository
    }).run(payload);
  }
});
