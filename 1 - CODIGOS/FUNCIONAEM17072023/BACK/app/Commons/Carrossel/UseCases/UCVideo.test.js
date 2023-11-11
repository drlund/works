const UCVideo = require('./UCVideo');

describe('UCVideos', () => {
  const mockRepository = {
    getVideo: jest.fn(),
    getVideoFallback: jest.fn(),
  };
  const mockVideo = 'mock video';
  const mockVideoFallback = 'mock video fallback';

  describe('quando existe um video hoje', () => {
    beforeEach(() => {
      mockRepository.getVideo.mockResolvedValue(mockVideo);
    });

    it('retorna o video', async () => {
      const { payload } = await new UCVideo({ repository: mockRepository }).run();
      expect(payload).toEqual(mockVideo);
    });
  });

  describe('quando não existe um video hoje', () => {
    beforeEach(() => {
      mockRepository.getVideo.mockResolvedValue(null);
      mockRepository.getVideoFallback.mockResolvedValue(mockVideoFallback);
    });

    it('retorna o video passado', async () => {
      const { payload } = await new UCVideo({ repository: mockRepository }).run();
      expect(payload).toEqual(mockVideoFallback);
    });
  });

  describe('tabela de videos esta vazia', () => {
    beforeEach(() => {
      mockRepository.getVideo.mockResolvedValue(null);
      mockRepository.getVideoFallback.mockResolvedValue(null);
    });

    it('retorna erro de videos not found', async () => {
      const { error } = await new UCVideo({ repository: mockRepository }).run();
      expect(error).toEqual(['Não existem videos', 404]);
    });
  });

  describe('query com problemas', () => {
    beforeEach(() => {
      mockRepository.getVideo.mockRejectedValue('mock error');
    });

    it('retorna erro de videos not found', async () => {
      const { error } = await new UCVideo({ repository: mockRepository }).run();
      expect(error).toEqual(['mock error', 500]);
    });
  });
});
