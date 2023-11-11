const UcSoftDeleteMinuta = require('./UcSoftDeleteMinuta');

describe('UcSoftDeleteMinuta', () => {
  const mockRepository = {
    softDeleteMinutaCadastradaNoTrx: jest.fn(),
  };

  const mockId = "mock id";

  const deleteOk = 1;
  const deleteFail = 0;

  const deletedPayload = 'ok';

  describe('when passing a valid id', () => {
    beforeEach(() => {
      mockRepository.softDeleteMinutaCadastradaNoTrx.mockResolvedValue(deleteOk);
    });

    it('deletes the minuta', async () => {
      const { payload } = await instantiateAndRun({ payload: mockId });
      expect(payload).toBe(deletedPayload);
    });

    it('calls the repository with the id', async () => {
      await instantiateAndRun({ payload: mockId });
      expect(mockRepository.softDeleteMinutaCadastradaNoTrx).toHaveBeenCalledTimes(1);
      expect(mockRepository.softDeleteMinutaCadastradaNoTrx).toHaveBeenCalledWith(mockId);
    });

    describe('when no minuta is found', () => {
      beforeEach(() => {
        mockRepository.softDeleteMinutaCadastradaNoTrx.mockResolvedValue(deleteFail);
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
    return new UcSoftDeleteMinuta({
      repository: mockRepository
    }).run(payload);
  }
});
