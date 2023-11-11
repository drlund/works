const mockPermissoesFerramentasFindOne = jest.fn();

jest.mock('../../../Models/Mongo/PermissoesFerramentas', () => ({
  findOne: mockPermissoesFerramentasFindOne
}));

const mockConcessoesAcessos = jest.fn();

jest.mock('../../../Models/Mongo/ConcessoesAcessos', () => ({
  find: jest.fn(() => ({
    select: jest.fn(() => ({
      lean: mockConcessoesAcessos,
    }))
  })),
}));

const { abcHasPermission } = require('.');

describe('abcHasPermission()', () => {
  const mockUsuarioLogado = /** @type {UsuarioLogado} */ ({
    chave: 'mock chave',
    prefixo: 'mock prefixo',
    uor: 'mock uor',
    uor_trabalho: 'mock uor_trabalho',
  });
  const nomeFerramenta = 'mock ferramenta';
  const mockPermissoes = ['mock permission a', 'mock permission b', 'mock permission c'];

  beforeEach(() => {
    mockPermissoesFerramentasFindOne.mockReturnValue({});
    mockConcessoesAcessos.mockResolvedValue([{ permissoes: mockPermissoes }]);
  });

  describe('controller level function', () => {
    it('throws when no usuario is passed', () => {
      // @ts-ignore
      expect(abcHasPermission({})({})).rejects.toThrow('Usuário não encontrado');
    });

    it('throws when usuario is undefined', () => {
      // @ts-ignore
      expect(abcHasPermission({ usuarioLogado: undefined })({})).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('user case level function', () => {
    const controllerLevel = abcHasPermission({ usuarioLogado: mockUsuarioLogado });

    describe('happy cases', () => {
      it('returns true when has one permission', async () => {
        expect(await controllerLevel({
          nomeFerramenta,
          permissoesRequeridas: mockPermissoes[0]
        })).toEqual(true);
      });

      it('returns true when has two possible permissions', async () => {
        expect(await controllerLevel({
          nomeFerramenta,
          permissoesRequeridas: [mockPermissoes[0], mockPermissoes[1]]
        })).toEqual(true);
      });

      it('returns true when has two required permissions', async () => {
        expect(await controllerLevel({
          nomeFerramenta,
          permissoesRequeridas: [mockPermissoes[0], mockPermissoes[1]],
          verificarTodas: true,
        })).toEqual(true);
      });
    });

    describe('error cases', () => {
      it('throws when no ferramenta is passed', async () => {
        expect(async () => controllerLevel({
          nomeFerramenta: undefined,
          permissoesRequeridas: mockPermissoes,
        })).rejects.toThrow('Ferramenta não encontrada');
      });

      it('throws when no permissions', async () => {
        expect(async () => controllerLevel({
          nomeFerramenta,
          permissoesRequeridas: undefined
        })).rejects.toThrow('Problema ao verificar acesso.');
      });

      it('throws when verificarTodas isnt boolean', async () => {
        expect(async () => controllerLevel({
          nomeFerramenta,
          permissoesRequeridas: mockPermissoes,
          // @ts-ignore
          verificarTodas: 'error',
        })).rejects.toThrow('Problema ao verificar acesso.');
      });
    });

    describe('database related', () => {
      it('throws when ferramenta is not found', () => {
        mockPermissoesFerramentasFindOne.mockResolvedValue(undefined);

        expect(async () => controllerLevel({
          nomeFerramenta,
          permissoesRequeridas: mockPermissoes,
        })).rejects.toThrow('Ferramenta não encontrada: mock ferramenta');
      });

      it('throws when funci has no permissions', () => {
        mockConcessoesAcessos.mockResolvedValue([]);

        expect(async () => controllerLevel({
          nomeFerramenta,
          permissoesRequeridas: mockPermissoes,
        })).rejects.toThrow('Usuário mock chave sem permissão na ferramenta mock ferramenta');
      });

      describe('when funci has other permissions', () => {
        beforeEach(() => {
          mockConcessoesAcessos.mockResolvedValue(['OTHER']);
        });

        it('throws when dont have one permission', () => {
          expect(async () => controllerLevel({
            nomeFerramenta,
            permissoesRequeridas: mockPermissoes,
          }))
            .rejects
            .toThrow(
              'Usuário mock chave sem permissão na ferramenta mock ferramenta, precisa acesso em: mock permission a, mock permission b ou mock permission c'
            );
        });

        it('throws when dont have all permissions', () => {
          expect(async () => controllerLevel({
            nomeFerramenta,
            permissoesRequeridas: mockPermissoes,
            verificarTodas: true,
          }))
            .rejects
            .toThrow(
              'Usuário mock chave sem permissão na ferramenta mock ferramenta, precisa acesso em: mock permission a, mock permission b e mock permission c'
            );
        });
      });
    });
  });
});
