const UcRevogarProcuracao = require('./UcRevogarProcuracao');

describe('UcRevogarProcuracao', () => {
  const mockTrx = {
    commit: jest.fn(),
    rollback: jest.fn(),
  };
  const mockGetUrlReturn = 'getUrlDocumento mock return';
  const mockUpdateRevogacaoReturn = 'updateRevogacaoProcuracao mock return';
  const mockUpdateManyRevogacaoReturn = 'updateManyRevogacaoProcuracao mock return';
  const mockCadastrarHistoricoReturn = 'cadastrarHistoricoDocumento mock return';
  const mockSaveEventoReturn = 'saveEventoWithTrx mock return';
  const mockMatriculaRegistro = 'mock matricula registro';
  const mockGetCadeia = [{ idProcuracao: 22 }, { idProcuracao: 23 }, { idProcuracao: 24 }];

  const mockProcuracoesRepository = {
    cadastrarHistoricoDocumento: jest.fn().mockResolvedValue(mockCadastrarHistoricoReturn),
    getUrlDocumento: jest.fn().mockResolvedValue(mockGetUrlReturn),
    updateRevogacaoProcuracao: jest.fn().mockResolvedValue(mockUpdateRevogacaoReturn),
    updateManyRevogacaoProcuracao: jest.fn().mockResolvedValue(mockUpdateManyRevogacaoReturn),
  };

  const mockEventosRepository = {
    saveEventoWithTrx: jest.fn().mockResolvedValue(mockSaveEventoReturn),
  };

  const mockPesquisaRepository = {
    getCadeiaAbaixoDeProcuracaoById: jest.fn().mockResolvedValue(mockGetCadeia),
  };

  const mockProcuracaoId = 999;
  const mockCartorioId = 888;
  const mockCusto = 111;
  const mockPrefixo = 1234;

  /** @type {UcRevogarProcuracao.RunArgs} */
  const mockArgs = {
    idProcuracao: mockProcuracaoId,
    dataRevogacao: new Date().toISOString(),
    nomeArquivo: 'mock arquivo',
    matriculaRegistro: mockMatriculaRegistro,
    cartorioId: mockCartorioId,
    custo: mockCusto,
    superCusto: 1,
    prefixoCusto: mockPrefixo,
  };

  describe('happy path', () => {
    it('runs the happy path', async () => {
      (await instantiateAndRun(mockArgs)).ok();
    });

    describe('procuracoes to inactivate', () => {
      it('calls updateMany with the correct params', async () => {
        await instantiateAndRun(mockArgs);

        expect(mockProcuracoesRepository.updateManyRevogacaoProcuracao).toHaveBeenCalledWith({
          idsProcuracao: [
            ...mockGetCadeia.map(c => c.idProcuracao), mockProcuracaoId
          ]
        }, mockTrx);
      });

      it('calls updateMany with only the one with nothing in the cadeia', async () => {
        mockPesquisaRepository.getCadeiaAbaixoDeProcuracaoById.mockResolvedValue([]);
        await instantiateAndRun(mockArgs);

        expect(mockProcuracoesRepository.updateManyRevogacaoProcuracao).toHaveBeenCalledWith({
          idsProcuracao: [mockProcuracaoId],
        }, mockTrx);
      });
    });
  });

  it('runs the happy path', async () => {
    (await instantiateAndRun(mockArgs)).ok();
  });

  describe('action errors', () => {
    const mockError = 'mock error';

    it('return error if update fails', async () => {
      mockProcuracoesRepository.updateRevogacaoProcuracao.mockRejectedValue(mockError);
      (await instantiateAndRun(mockArgs))
        .error(mockError, 500);
    });

    it('return error if cadastrar fails', async () => {
      mockProcuracoesRepository.cadastrarHistoricoDocumento.mockRejectedValue(mockError);
      (await instantiateAndRun(mockArgs))
        .error(mockError, 500);
    });
  });

  describe('validation errors', () => {
    it('returns error if idProcuracao is not passed', async () => {
      (await instantiateAndRun({ ...mockArgs, idProcuracao: null }))
        .error("Informar a procuração.");
    });

    it('returns error if dataRevogacao is not passed', async () => {
      (await instantiateAndRun({ ...mockArgs, dataRevogacao: null }))
        .error("Informar a data do revogação.");
    });

    it('returns error if dataRevogacao is not a date passed', async () => {
      (await instantiateAndRun({ ...mockArgs, dataRevogacao: 'invalid date' }))
        .error("Informar uma data do revogação válida.");
    });

    it('returns error if nomeArquivo is not passed', async () => {
      (await instantiateAndRun({ ...mockArgs, nomeArquivo: null }))
        .error("Erro ao salvar arquivo.");
    });

    it('returns error if matriculaRegistro is not passed', async () => {
      (await instantiateAndRun({ ...mockArgs, matriculaRegistro: null }))
        .error("Usuário não está logado.");
    });

    it('returns error if cartorio is not passed', async () => {
      (await instantiateAndRun({ ...mockArgs, cartorioId: null }))
        .error("Informar o cartório.");
    });

    it('returns error if custo do revogação is not passed', async () => {
      (await instantiateAndRun({ ...mockArgs, custo: null }))
        .error("Informar o custo do revogação.");
    });

    it('returns error if custo do revogação is less than 0.01', async () => {
      (await instantiateAndRun({ ...mockArgs, custo: 0.001 }))
        .error("Informar o custo do revogação.");
    });

    it('returns error if prefixo de custo is not passed', async () => {
      (await instantiateAndRun({ ...mockArgs, prefixoCusto: null }))
        .error("Informar o prefixo do custo do revogação.");
    });

    it('returns error if prefixo de custo is less than 1', async () => {
      (await instantiateAndRun({ ...mockArgs, prefixoCusto: -1 }))
        .error("Informar um prefixo válido do custo do revogação.");
    });

    it('returns error if prefixo de custo is more than 9999', async () => {
      (await instantiateAndRun({ ...mockArgs, prefixoCusto: 100001 }))
        .error("Informar um prefixo válido do custo do revogação.");
    });

    it('returns error if superCusto is null', async () => {
      (await instantiateAndRun({ ...mockArgs, superCusto: null }))
        .error("Informar se o custo do revogação é para controle da Super.");
    });
  });

  /**
   * @param {UcRevogarProcuracao.RunArgs} args
   */
  async function instantiateAndRun(
    args
  ) {
    const run = await new UcRevogarProcuracao({
      repository: {
        // @ts-expect-error
        procuracoes: mockProcuracoesRepository,
        // @ts-expect-error
        pesquisa: mockPesquisaRepository,
        eventos: mockEventosRepository,
      },
      trx: mockTrx
    }).run(args);

    return {
      ok: () => expect(run.payload).toEqual([
        mockUpdateManyRevogacaoReturn, mockUpdateRevogacaoReturn, mockCadastrarHistoricoReturn, mockSaveEventoReturn
      ]),
      /** @param {string} errorString */
      error: (errorString, errorCode = 400) => expect(run.error).toEqual([errorString, errorCode]),
    };
  }
});
