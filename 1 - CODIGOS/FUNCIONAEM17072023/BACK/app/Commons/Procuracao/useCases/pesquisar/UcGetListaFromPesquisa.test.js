const UcGetListaFromPesquisa = require('./UcGetListaFromPesquisa');

describe('UcGetListaFromPesquisa', () => {
  const mockRepository = {
    getIdsPorPesquisaPessoa: jest.fn(),
    getIdsPorPesquisaPessoaMaisRecente: jest.fn(),
    getIdsPorPesquisaPrefixo: jest.fn(),
    getIdsPorPesquisaPrefixoMaisRecente: jest.fn(),
  };

  const repo = {
    pessoa: "Pessoa",
    pessoaMaisRecente: "PessoaMaisRecente",
    prefixo: "Prefixo",
    prefixoMaisRecente: "PrefixoMaisRecente",
  };

  beforeEach(() => {
    mockTothrowError('Wrong repo used', repo.pessoa);
    mockTothrowError('Wrong repo used', repo.pessoaMaisRecente);
    mockTothrowError('Wrong repo used', repo.prefixo);
    mockTothrowError('Wrong repo used', repo.prefixoMaisRecente);
  });

  describe('when pesquisa is a string', () => {
    const pesquisa = 'teste';

    it('should return an empty list', async () => {
      const returnValue = [];

      mockToResolveValue(returnValue, repo.pessoa);
      const result = instantiateAndRun({ pesquisa });

      expect(await result).toEqual({ payload: returnValue });
    });

    it('should return one representante', async () => {
      const returnValue = [{
        nome: 'nome1',
        matricula: 'matricula1',
        cargoNome: 'cargo1',
        lotacaoCodigo: 1111
      }];

      mockToResolveValue(returnValue, repo.pessoa);
      const result = instantiateAndRun({ pesquisa });

      expect(await result).toEqual({ payload: returnValue });
    });

    it('should return multiple representantes', async () => {
      const pesquisa = 'teste';
      const returnValue = [
        {
          nome: 'nome1',
          matricula: 'matricula1',
          cargoNome: 'cargo1',
          lotacaoCodigo: 1111
        },
        {
          nome: 'nome2',
          matricula: 'matricula2',
          cargoNome: 'cargo2',
          lotacaoCodigo: 2222
        }
      ];

      mockToResolveValue(returnValue, repo.pessoa);
      const result = instantiateAndRun({ pesquisa });

      expect(await result).toEqual({ payload: returnValue });
    });
  });

  describe('when pesquisa is a number string', () => {
    describe('when the number string is 4 digits or less', () => {
      const pesquisa = '1234';

      it('should return from prefixo repository', async () => {
        const returnValue = [{
          nome: 'nome1',
          matricula: 'matricula1',
          cargoNome: 'cargo1',
          lotacaoCodigo: 1111
        }];

        mockToResolveValue(returnValue, repo.prefixo);
        const result = instantiateAndRun({ pesquisa });

        expect(await result).toEqual({ payload: returnValue });
      });
    });

    describe('when the number string has more than 4 digits', () => {
      const pesquisa = '12345678';

      it('should return from pessoa repository', async () => {
        const returnValue = [{
          nome: 'nome1',
          matricula: 'matricula1',
          cargoNome: 'cargo1',
          lotacaoCodigo: 1111
        }];

        mockToResolveValue(returnValue, repo.pessoa);
        const result = instantiateAndRun({ pesquisa });

        expect(await result).toEqual({ payload: returnValue });
      });
    });
  });

  describe('when passing maisRecente as true', () => {
    const maisRecente = true;

    describe('when pesquisa is a string', () => {
      const pesquisa = 'teste';

      it('should return one representante', async () => {
        const returnValue = 'mock return';

        mockToResolveValue(returnValue, repo.pessoaMaisRecente);
        const result = instantiateAndRun({ pesquisa, maisRecente });

        expect(await result).toEqual({ payload: returnValue });
      });
    });

    describe('when pesquisa is a number string', () => {
      describe('when the number string is 4 digits or less', () => {
        const pesquisa = '1234';

        it('should return from prefixo repository', async () => {
          const returnValue = 'mock return';

          mockToResolveValue(returnValue, repo.prefixoMaisRecente);
          const result = instantiateAndRun({ pesquisa, maisRecente });

          expect(await result).toEqual({ payload: returnValue });
        });
      });

      describe('when the number string has more than 4 digits', () => {
        const pesquisa = '12345678';

        it('should return from pessoa repository', async () => {
          const returnValue = 'mock return';

          mockToResolveValue(returnValue, repo.pessoaMaisRecente);
          const result = instantiateAndRun({ pesquisa, maisRecente });

          expect(await result).toEqual({ payload: returnValue });
        });
      });
    });
  });

  describe('errors', () => {
    it('should return error without payload', async () => {
      const pesquisa = '';
      const returnValue = [];

      mockToRejectValue(returnValue, repo.pessoa);
      const result = instantiateAndRun({ pesquisa });

      expect(await result).toEqual({ error: ['O termo de pesquisa não pode ser vazio', 400] });
    });

    it('should return error if payload is not string', async () => {
      const pesquisa = ['arr', 'of', 'values'];
      const returnValue = [];

      mockToRejectValue(returnValue, repo.pessoa);
      const result = instantiateAndRun({ pesquisa });

      expect(await result).toEqual({ error: ['O termo de pesquisa precisa ser string', 400] });
    });

    it('should return error if repository throws', async () => {
      const pesquisa = 'any';
      const returnValue = 'error thrown';

      mockTothrowError(returnValue, repo.pessoa);
      const result = instantiateAndRun({ pesquisa });

      expect(await result).toEqual({ error: [returnValue, 500] });
    });
  });

  async function instantiateAndRun({
    pesquisa,
    maisRecente = false
  }) {
    const uc = new UcGetListaFromPesquisa({ repository: mockRepository });
    return uc.run(pesquisa, maisRecente);
  }

  function mockToResolveValue(value, repo) {
    mockRepository[`getIdsPorPesquisa${repo}`].mockResolvedValue(value);
  }
  function mockToRejectValue(value, repo) {
    mockRepository[`getIdsPorPesquisa${repo}`].mockRejectedValue(value);
  }
  function mockTothrowError(value, repo) {
    mockRepository[`getIdsPorPesquisa${repo}`].mockImplementation(() => {
      throw value;
    });
  }
});
