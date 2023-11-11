const UCCanais = require('./UCCanais');

describe('UCCanais', () => {
  const mockRepository = {
    getCanais: jest.fn(),
    countEpisodiosCanal: jest.fn(),
    countSeguidoresCanal: jest.fn(),
  };
  const mockCanais = [{}];
  const mockTotalEpisodiosCanal = 0;
  const mockTotalSeguidoresCanal = 0;


  describe('quando existem canais', () => {
    beforeEach(() => {
      mockRepository.getCanais.mockResolvedValue(mockCanais);
      mockRepository.countEpisodiosCanal.mockResolvedValue(mockTotalEpisodiosCanal);
      mockRepository.countSeguidoresCanal.mockResolvedValue(mockTotalSeguidoresCanal);
    });

    it('retorna os canais', async () => {
      const { payload } = await new UCCanais({
        repository: mockRepository,
      }).run();
      expect(payload).toEqual([{ totalEpisodios: mockTotalEpisodiosCanal, totalSeguidores: mockTotalSeguidoresCanal }]);
    });

  });

  describe('quando não existem canais', () => {
    beforeEach(() => {
      mockRepository.getCanais.mockResolvedValue(null);
    });

    it('erro quando retorno do array é null ou vazio', async () => {
      const { error } = await new UCCanais({ repository: mockRepository, }).run();
      expect(error).toEqual(['Nenhum canal encontrado', 404]);
    });
  });

});
