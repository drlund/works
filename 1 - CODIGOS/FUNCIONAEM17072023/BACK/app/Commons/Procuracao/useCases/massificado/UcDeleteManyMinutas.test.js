const UcDeleteManyMinutas = require('./UcDeleteManyMinutas');

describe('UcDeleteManyMinutas', () => {
  const mockMinutaRepository = {
    softDeleteManyMinutaCadastrada: jest.fn((l) => l.length),
  };

  it('works in the happy path', async () => {
    await instantiateAndRun().ok();
  });

  it('fails if the array is empty', async () => {
    await instantiateAndRun([]).error('A lista de minutas deve ser informada.');
  });

  it('fails if the lista is not an array', async () => {
    // @ts-expect-error string is not string[]
    await instantiateAndRun('lista').error('A lista de minutas deve ser informada.');
  });

  it('fails if no changes were made', async () => {
    // o retorno é o numero de rows afetadas, 0 seria nenhuma row afetada
    mockMinutaRepository.softDeleteManyMinutaCadastrada.mockResolvedValue(0);

    await instantiateAndRun().error('Nenhuma minuta foi removida.', 404);
  });

  /** @param {string[]} lista */
  function instantiateAndRun(lista = ['mockMinuta1', 'mockMinuta2']) {
    const run = new UcDeleteManyMinutas({
      repository: {
        // @ts-ignore
        minutas: mockMinutaRepository
      }
    }).run({ listaDeMinutas: lista });

    return {
      ok: async () => expect((await run).payload).toBe(true),
      error: async (/** @type {string} */ err, /** @type {number} */ code = 400) => expect((await run).error).toEqual([err, code]),
    };
  }
});
