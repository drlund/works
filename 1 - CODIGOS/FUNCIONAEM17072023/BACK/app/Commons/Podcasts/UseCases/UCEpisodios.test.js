const UCEpisodios = require('./UCEpisodios');

describe('UCEpisodios', () => {
  const mockRepository = {
    getEpisodios: jest.fn(),
    countLikesEpisodio: jest.fn(),
    episodioIsLiked: jest.fn(),
  };
  const mockEpisodios = [{}];
  const mockTotalLikesEpisodio = 0;
  const mockEpisodioIsLiked = false;
  const mockUser = 'mock usuario';

  describe('quando existem episódios', () => {
    beforeEach(() => {
      mockRepository.getEpisodios.mockResolvedValue(mockEpisodios);
      mockRepository.countLikesEpisodio.mockResolvedValue(mockTotalLikesEpisodio);
      mockRepository.episodioIsLiked.mockResolvedValue(mockEpisodioIsLiked);
    });

    it('retorna os episodios', async () => {
      const { payload } = await new UCEpisodios({
        repository: mockRepository,
      }).run(mockUser);

      expect(payload).toEqual([{ likesCount: mockTotalLikesEpisodio, matriculaLiked: mockEpisodioIsLiked }]);
    });

  });

  describe('quando não existem episódios', () => {
    beforeEach(() => {
      mockRepository.getEpisodios.mockResolvedValue(null);
    });

    it('erro quando retorno do array é null ou vazio', async () => {
      const { error } = await new UCEpisodios({ repository: mockRepository, }).run();
      expect(error).toEqual(['Nenhum episódio encontrado', 404]);
    });
  });

});
