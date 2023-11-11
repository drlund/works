const UcSaveManifesto = require('./UcSaveManifesto');

describe('UcSaveManifesto', () => {
  const mockTrx = {
    commit: jest.fn(),
    rollback: jest.fn(),
  };
  const mockGetUrlReturn = 'getUrlDocumento mock return';
  const mockUpdateManifestoReturn = 'updateManifestoProcuracao mock return';
  const mockCadastrarHistoricoReturn = 'cadastrarHistoricoDocumento mock return';
  const mockSaveEventoReturn = 'saveEventoWithTrx mock return';
  const mockMatriculaRegistro = 'mock matricula registro';

  const mockProcuracoesRepository = {
    getUrlDocumento: jest.fn().mockResolvedValue(mockGetUrlReturn),
    updateManifestoProcuracao: jest.fn().mockResolvedValue(mockUpdateManifestoReturn),
    cadastrarHistoricoDocumento: jest.fn().mockResolvedValue(mockCadastrarHistoricoReturn),
  };

  const mockEventosRepository = {
    saveEventoWithTrx: jest.fn().mockResolvedValue(mockSaveEventoReturn),
  };

  const mockProcuracaoId = 999;
  const mockCartorioId = 888;
  const mockCusto = 111;
  const mockPrefixo = 1234;

  /** @type {UcSaveManifesto.RunArgs} */
  const mockArgs = {
    idProcuracao: mockProcuracaoId,
    dataManifesto: new Date().toISOString(),
    nomeArquivo: 'mock arquivo',
    matriculaRegistro: mockMatriculaRegistro,
    cartorioId: mockCartorioId,
    custoManifesto: mockCusto,
    superCusto: 1,
    prefixoCusto: mockPrefixo,
  };

  it('runs the happy path', async () => {
    (await instantiateAndRun(mockArgs)).ok();
  });

  describe('action errors', () => {
    const mockError = 'mock error';
    const stringfiedError = JSON.stringify(mockError);

    it('return error if update fails', async () => {
      mockProcuracoesRepository.updateManifestoProcuracao.mockRejectedValue(mockError);
      (await instantiateAndRun(mockArgs))
        .error(stringfiedError);
    });

    it('return error if cadastrar fails', async () => {
      mockProcuracoesRepository.cadastrarHistoricoDocumento.mockRejectedValue(mockError);
      (await instantiateAndRun(mockArgs))
        .error(stringfiedError);
    });
  });

  describe('validation errors', () => {
    it('returns error if idProcuracao is not passed', async () => {
      (await instantiateAndRun({ ...mockArgs, idProcuracao: null }))
        .error("Informar a procuração.");
    });

    it('returns error if dataManifesto is not passed', async () => {
      (await instantiateAndRun({ ...mockArgs, dataManifesto: null }))
        .error("Informar a data do manifesto.");
    });

    it('returns error if dataManifesto is not a date passed', async () => {
      (await instantiateAndRun({ ...mockArgs, dataManifesto: 'invalid date' }))
        .error("Informar uma data do manifesto válida.");
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

    it('returns error if custo do manifesto is not passed', async () => {
      (await instantiateAndRun({ ...mockArgs, custoManifesto: null }))
        .error("Informar o custo do manifesto.");
    });

    it('returns error if custo do manifesto is less than 0.01', async () => {
      (await instantiateAndRun({ ...mockArgs, custoManifesto: 0.001 }))
        .error("Informar o custo do manifesto.");
    });

    it('returns error if prefixo de custo is not passed', async () => {
      (await instantiateAndRun({ ...mockArgs, prefixoCusto: null }))
        .error("Informar o prefixo do custo do manifesto.");
    });

    it('returns error if prefixo de custo is less than 1', async () => {
      (await instantiateAndRun({ ...mockArgs, prefixoCusto: -1 }))
        .error("Informar um prefixo válido do custo do manifesto.");
    });

    it('returns error if prefixo de custo is more than 9999', async () => {
      (await instantiateAndRun({ ...mockArgs, prefixoCusto: 100001 }))
        .error("Informar um prefixo válido do custo do manifesto.");
    });

    it('returns error if superCusto is null', async () => {
      (await instantiateAndRun({ ...mockArgs, superCusto: null }))
        .error("Informar se o custo do manifesto é para controle da Super.");
    });
  });

  /**
   * @param {UcSaveManifesto.RunArgs} args
   */
  async function instantiateAndRun(
    args
  ) {
    const run = await new UcSaveManifesto({
      repository: {
        // @ts-ignore
        procuracoes: mockProcuracoesRepository,
        eventos: mockEventosRepository,
      },
      trx: mockTrx,
    }).run(args);

    return {
      ok: () => expect(run.payload).toEqual([mockUpdateManifestoReturn, mockCadastrarHistoricoReturn, mockSaveEventoReturn]),
      /** @param {string} errorString */
      error: (errorString) => expect(run.error).toEqual([errorString, 400]),
    };
  }
});
