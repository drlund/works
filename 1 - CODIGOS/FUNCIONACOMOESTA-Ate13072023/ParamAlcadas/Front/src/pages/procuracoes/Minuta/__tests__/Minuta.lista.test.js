// eslint-disable-next-line import/no-unresolved
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FETCH_METHODS } from 'services/apis/GenericFetch';
import Minuta from '..';
import {
  getButtonWithName, startRender
} from '../../tests/utils';
import { mockMinutaCadastrada } from '../../__mocks__/mockMinutaCadastrada';
import { mockOutorgadoDemaisGerentes } from '../../__mocks__/mockOutorgado';

const mockListaMinutaItem = {
  ...mockMinutaCadastrada,
  outorgado: mockOutorgadoDemaisGerentes,
};
const mockMinutaName = 'mock minuta name';

describe('<Minuta>/<ListaDeMinutas>', () => {
  const forFluxos = 1;
  const forListaMinuta = 1;
  const mockListaMinutas = [
    mockListaMinutaItem
  ];
  const timesFetchIsCalledInitially = forFluxos + forListaMinuta;

  const mockFetchImplementation = ({
    lista = () => mockListaMinutas
  }) => async (/** @type {[any, string]} */ ...args) => {
    const [, path] = args;
    if (path.includes('fluxos')) {
      return {
        [mockMinutaCadastrada.idFluxo]: {
          minuta: mockMinutaName,
          fluxo: 'anyFluxo'
        }
      };
    }
    return lista();
  };

  beforeEach(async () => {
    await startRender(Minuta, {
      beforeRender: () => {
        globalThis.permissionHookMock.mockReturnValue(true);
        globalThis.fetchSpy.mockImplementation(
          mockFetchImplementation({
            lista: () => [],
          })
        );
      },
      timesFetchIsCalled: timesFetchIsCalledInitially,
    });
  });

  it('renders the lista component', () => {
    expect(screen.getByRole('heading', {
      name: 'Consultar Minutas Emitidas',
      level: 2
    })).toBeInTheDocument();
  });

  it('renders the tabs', () => {
    expect(screen.getAllByRole('tab')).toHaveLength(3);

    expect(screen.getByText('Meu Prefixo')).toBeInTheDocument();
    expect(screen.getByText('Consultar por Matrícula')).toBeInTheDocument();
    expect(screen.getByText('Consultar por Prefixo')).toBeInTheDocument();
  });

  it('renders the table headers', () => {
    [
      'ID Minuta', 'Data', 'Outorgado', 'Tipo de Minuta', 'Ações'
    ].forEach((col) => {
      expect(screen.getByRole('columnheader', {
        name: col,
      })).toBeInTheDocument();
    });
  });

  it('renders no data in the table', () => {
    expect(screen.getByRole('cell', {
      name: /no data/i
    })).toBeInTheDocument();
  });

  it('dont render the search input', () => {
    expect(screen.queryByPlaceholderText('pesquisar por prefixo')).not.toBeInTheDocument();
  });

  describe('when changing to another tab', () => {
    beforeEach(async () => {
      await userEvent.click(screen.getByText('Consultar por Prefixo'));
    });

    it('renders the search input', () => {
      expect(screen.getByPlaceholderText('pesquisar por prefixo')).toBeInTheDocument();
    });

    it('has focus on the input', () => {
      expect(screen.getByPlaceholderText('pesquisar por prefixo')).toHaveFocus();
    });

    describe('when searching a prefixo', () => {
      const mockSearch = '0000';
      beforeEach(async () => {
        globalThis.fetchSpy.mockResolvedValue(mockListaMinutas);
        await userEvent.type(screen.getByPlaceholderText('pesquisar por prefixo'), `${mockSearch}{enter}`);

        await waitFor(() => {
          expect(screen.queryByRole('cell', {
            name: /no data/i
          })).not.toBeInTheDocument();
        });
      });

      it('calls the api', () => {
        expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
          FETCH_METHODS.GET,
          `procuracoes/minutas?matricula=&prefixo=${mockSearch}`
        );
      });

      it('renders the rows', async () => {
        const headerRow = 1;
        const minutaRow = 1;
        expect(screen.getAllByRole('row')).toHaveLength(headerRow + minutaRow);
      });

      it('renders the data', () => {
        const { createdAt, idMinuta } = mockMinutaCadastrada;
        const { matricula, nome } = mockOutorgadoDemaisGerentes;

        [
          createdAt, idMinuta, matricula, nome, mockMinutaName
        ].forEach((col) => {
          expect(screen.getByRole('cell', {
            name: new RegExp(col, 'i')
          })).toBeInTheDocument();
        });
      });

      it('renders the action buttons', () => {
        expect(getButtonWithName('Cadastrar Procuração')).toBeInTheDocument();
        expect(getButtonWithName('Baixar Novamente')).toBeInTheDocument();
        expect(getButtonWithName('Excluir')).toBeInTheDocument();
      });

      describe('when clicking to register new procuração', () => {
        beforeEach(async () => {
          await userEvent.click(getButtonWithName('Cadastrar Procuração'));
        });

        it('changes the page', async () => {
          expect(globalThis.routerDomPushMock).toHaveBeenCalledTimes(1);
          expect(globalThis.routerDomPushMock).toHaveBeenCalledWith(`/procuracoes/cadastrar/${mockMinutaCadastrada.idMinuta}`);
        });
      });

      describe('when clicking to download minuta again', () => {
        beforeEach(async () => {
          await userEvent.click(getButtonWithName('Baixar Novamente'));
        });

        it('changes the page', async () => {
          expect(globalThis.routerDomPushMock).toHaveBeenCalledTimes(1);
          expect(globalThis.routerDomPushMock).toHaveBeenCalledWith(`/procuracoes/minuta/${mockMinutaCadastrada.idMinuta}`);
        });
      });

      describe('when clicking to exclude minuta', () => {
        beforeEach(async () => {
          await userEvent.click(getButtonWithName('Excluir'));
        });

        it('renders confirmation popup', () => {
          expect(screen.getByText('Tem certeza que quer deletar? (Ação não pode ser desfeita.)')).toBeInTheDocument();
        });

        describe('when confirming the delete', () => {
          beforeEach(async () => {
            await userEvent.click(getButtonWithName('Confirmar'));
          });

          it('renders the was deleted message', () => {
            expect(screen.getByText('Minuta deletada com sucesso!')).toBeInTheDocument();
          });

          it('calls the api to delete', () => {
            expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(FETCH_METHODS.DELETE, `/procuracoes/minutas/${mockMinutaCadastrada.idMinuta}`);
          });

          it('preemptively deletes the minuta', async () => {
            expect(screen.getByRole('cell', {
              name: /no data/i
            })).toBeInTheDocument();
          });
        });
      });
    });

    describe('when searching a matricula', () => {
      beforeEach(async () => {
        globalThis.fetchSpy.mockResolvedValue([]);
        await userEvent.click(screen.getByText('Consultar por Matrícula'));
      });

      it('calls the api with the matricula', async () => {
        const mockSearch = 'f0000000';
        await userEvent.type(screen.getByPlaceholderText('pesquisar por matrícula'), `${mockSearch}{enter}`);
        expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
          FETCH_METHODS.GET,
          `procuracoes/minutas?matricula=${mockSearch}&prefixo=`
        );
      });

      it('calls the api after adding F to the matricula', async () => {
        const mockSearch = '0000000';
        await userEvent.type(screen.getByPlaceholderText('pesquisar por matrícula'), `${mockSearch}{enter}`);
        expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
          FETCH_METHODS.GET,
          `procuracoes/minutas?matricula=f${mockSearch}&prefixo=`
        );
      });

      it('dont call the api if not enough chars', async () => {
        const mockSearch = '000';
        expect(globalThis.fetchSpy).toHaveBeenCalledTimes(timesFetchIsCalledInitially);
        await userEvent.type(screen.getByPlaceholderText('pesquisar por matrícula'), `${mockSearch}{enter}`);
        expect(globalThis.fetchSpy).toHaveBeenCalledTimes(timesFetchIsCalledInitially);
      });
    });
  });
});
