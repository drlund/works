const UcSaveCopiaAutenticada = require('./UcSaveCopiaAutenticada');

describe('UcSaveCopiaAutenticada', () => {
  const mockSaveEventoReturn = 'saveEventoWithTrx mock return';
  const mockMatriculaRegistro = 'mock matricula registro';

  const mockEventosRepository = {
    saveEventoWithTrx: jest.fn().mockResolvedValue(mockSaveEventoReturn),
  };

  const mockProcuracaoId = 999;
  const mockCartorioId = 888;
  const mockCusto = 111;
  const mockPrefixo = 1234;

  /** @type {UcSaveCopiaAutenticada.RunArgs} */
  const mockArgs = {
    idProcuracao: mockProcuracaoId,
    matriculaRegistro: mockMatriculaRegistro,
    cartorioId: mockCartorioId,
    custo: mockCusto,
    superCusto: 1,
    prefixoCusto: mockPrefixo,
    dataEmissao: new Date().toISOString(),
  };

  it('runs the happy path', async () => {
    (await instantiateAndRun(mockArgs)).ok();
  });

  describe('validation errors', () => {
    it('returns error if idProcuracao is not passed', async () => {
      (await instantiateAndRun({ ...mockArgs, idProcuracao: null }))
        .error("Informar a procuração.");
    });

    it('returns error if dataEmissao is not passed', async () => {
      (await instantiateAndRun({ ...mockArgs, dataEmissao: null }))
        .error("Informar a data da emissão da cópia.");
    });

    it('returns error if dataEmissao is not a date passed', async () => {
      (await instantiateAndRun({ ...mockArgs, dataEmissao: 'invalid date' }))
        .error("Informar uma data de emissão válida.");
    });

    it('returns error if matriculaRegistro is not passed', async () => {
      (await instantiateAndRun({ ...mockArgs, matriculaRegistro: null }))
        .error("Usuário não está logado.");
    });

    it('returns error if cartorio is not passed', async () => {
      (await instantiateAndRun({ ...mockArgs, cartorioId: null }))
        .error("Informar o cartório.");
    });

    it('returns error if custo da cópia is not passed', async () => {
      (await instantiateAndRun({ ...mockArgs, custo: null }))
        .error("Informar o custo da cópia autenticada.");
    });

    it('returns error if custo da cópia is less than 0.01', async () => {
      (await instantiateAndRun({ ...mockArgs, custo: 0.001 }))
        .error("Informar o custo da cópia autenticada.");
    });

    it('returns error if prefixo de custo is not passed', async () => {
      (await instantiateAndRun({ ...mockArgs, prefixoCusto: null }))
        .error("Informar o prefixo do custo.");
    });

    it('returns error if prefixo de custo is less than 1', async () => {
      (await instantiateAndRun({ ...mockArgs, prefixoCusto: -1 }))
        .error("Informar um prefixo válido.");
    });

    it('returns error if prefixo de custo is more than 9999', async () => {
      (await instantiateAndRun({ ...mockArgs, prefixoCusto: 100001 }))
        .error("Informar um prefixo válido.");
    });

    it('returns error if superCusto is null', async () => {
      (await instantiateAndRun({ ...mockArgs, superCusto: null }))
        .error("Informar se o custo da cópia é para controle da Super.");
    });
  });

  /**
   * @param {UcSaveCopiaAutenticada.RunArgs} args
   */
  async function instantiateAndRun(
    args
  ) {
    const run = await new UcSaveCopiaAutenticada({
      repository: {
        eventos: mockEventosRepository,
      }
    }).run(args);

    return {
      ok: () => expect(run.payload).toEqual(mockSaveEventoReturn),
      /** @param {string} errorString */
      error: (errorString) => expect(run.error).toEqual([errorString, 400]),
    };
  }
});
