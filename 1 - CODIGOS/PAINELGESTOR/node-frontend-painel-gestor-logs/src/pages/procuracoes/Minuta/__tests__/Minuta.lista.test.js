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

  it('renders the lista component', async () => {
    expect(screen.getByRole('heading', {
      name: 'Consultar Minutas Emitidas',
      level: 2
    })).toBeInTheDocument();

    // renders the tabs
    expect(screen.getAllByRole('tab')).toHaveLength(3);

    expect(screen.getByText('Meu Prefixo')).toBeInTheDocument();
    expect(screen.getByText('Consultar por Matrícula')).toBeInTheDocument();
    expect(screen.getByText('Consultar por Prefixo')).toBeInTheDocument();

    // renders the table headers
    [
      'ID Minuta', 'Data', 'Outorgado', 'Tipo de Minuta', 'Ações'
    ].forEach((col) => {
      expect(screen.getByRole('columnheader', {
        name: col,
      })).toBeInTheDocument();
    });

    // renders no data in the table
    expect(screen.getByRole('cell', {
      name: /no data/i
    })).toBeInTheDocument();

    // dont render the search input
    expect(screen.queryByPlaceholderText('pesquisar por prefixo')).not.toBeInTheDocument();
  });

  describe('when changing to another tab', () => {
    beforeEach(async () => {
      await userEvent.click(screen.getByText('Consultar por Prefixo'));
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

      it('flows of searching in prefixo', async () => {

        // renders the search input
        expect(screen.getByPlaceholderText('pesquisar por prefixo')).toBeInTheDocument();

        // has focus on the input
        expect(screen.getByPlaceholderText('pesquisar por prefixo')).toHaveFocus();


      // calls the api
        expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
          FETCH_METHODS.GET,
          `procuracoes/minutas?matricula=&prefixo=${mockSearch}`
        );

        // renders the rows
        const headerRow = 1;
        const minutaRow = 1;
        expect(screen.getAllByRole('row')).toHaveLength(headerRow + minutaRow);

        // renders the data
        const { createdAt, idMinuta } = mockMinutaCadastrada;
        const { matricula, nome } = mockOutorgadoDemaisGerentes;

        [
          createdAt, idMinuta, matricula, nome, mockMinutaName
        ].forEach((col) => {
          expect(screen.getByRole('cell', {
            name: new RegExp(col, 'i')
          })).toBeInTheDocument();
        });

        // renders the action buttons
        expect(getButtonWithName('Cadastrar Procuração')).toBeInTheDocument();
        expect(getButtonWithName('Baixar Novamente')).toBeInTheDocument();
        expect(getButtonWithName('Excluir')).toBeInTheDocument();
      });

      it('when clicking to register new procuração', async () => {
        await userEvent.click(getButtonWithName('Cadastrar Procuração'));

        // changes the page
        expect(globalThis.routerDomPushMock).toHaveBeenCalledTimes(1);
        expect(globalThis.routerDomPushMock).toHaveBeenCalledWith(`/procuracoes/cadastrar/${mockMinutaCadastrada.idMinuta}`);
      });

      it('when clicking to download minuta again', async () => {
        await userEvent.click(getButtonWithName('Baixar Novamente'));

        // changes the page
        expect(globalThis.routerDomPushMock).toHaveBeenCalledTimes(1);
        expect(globalThis.routerDomPushMock).toHaveBeenCalledWith(`/procuracoes/minuta/${mockMinutaCadastrada.idMinuta}`);
      });

      it('when clicking to exclude minuta', async () => {
        await userEvent.click(getButtonWithName('Excluir'));

        // renders confirmation popup
        expect(screen.getByText('Tem certeza que quer deletar? (Ação não pode ser desfeita.)')).toBeInTheDocument();

        // when confirming the delete
        await userEvent.click(getButtonWithName('Confirmar'));

        // renders the was deleted message
        expect(screen.getByText('Minuta deletada com sucesso!')).toBeInTheDocument();

        // calls the api to delete
        expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(FETCH_METHODS.DELETE, `/procuracoes/minutas/${mockMinutaCadastrada.idMinuta}`);

        // preemptively deletes the minuta
        expect(screen.getByRole('cell', {
          name: /no data/i
        })).toBeInTheDocument();
      });
    });

    it('when searching a matricula', async () => {
      globalThis.fetchSpy.mockResolvedValue([]);
      await userEvent.click(screen.getByText('Consultar por Matrícula'));

      // dont call the api if not enough chars
      const mockSearch3 = '000';
      expect(globalThis.fetchSpy).toHaveBeenCalledTimes(timesFetchIsCalledInitially);
      await userEvent.type(screen.getByPlaceholderText('pesquisar por matrícula'), `${mockSearch3}{enter}`);
      expect(globalThis.fetchSpy).toHaveBeenCalledTimes(timesFetchIsCalledInitially);

      // calls the api with the matricula
      const mockSearch1 = 'f0000000';
      await userEvent.type(screen.getByPlaceholderText('pesquisar por matrícula'), `${mockSearch1}{enter}`);
      expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
        FETCH_METHODS.GET,
        `procuracoes/minutas?matricula=${mockSearch1}&prefixo=`
      );

      // calls the api after adding F to the matricula
      const mockSearch2 = '0000000';
      await userEvent.type(screen.getByPlaceholderText('pesquisar por matrícula'), `${mockSearch2}{enter}`);
      expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
        FETCH_METHODS.GET,
        `procuracoes/minutas?matricula=f${mockSearch2}&prefixo=`
      );
    });
  });
});
