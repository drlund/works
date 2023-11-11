const UCTags = require('./UCTags');

describe('UCTags', () => {
  const mockRepository = {
    getTags: jest.fn(),
  };
  const mockTags = [{}];

  describe('quando existem tags', () => {
    beforeEach(() => {
      mockRepository.getTags.mockResolvedValue(mockTags);
    });

    it('retorna relação de tags', async () => {
      const { payload } = await new UCTags({
        repository: mockRepository,
      }).run();

      expect(payload).toEqual(mockTags);
    });
  });

  describe('quando não existem tags', () => {
    beforeEach(async () => {
      mockRepository.getTags.mockResolvedValue(null);
    });

    it('erro quando retorno do array é null ou vazio', async () => {
      const { error } = await new UCTags({ repository: mockRepository, }).run();
      expect(error).toEqual(['Nenhuma tag encontrada', 404]);
    });

  });

});
