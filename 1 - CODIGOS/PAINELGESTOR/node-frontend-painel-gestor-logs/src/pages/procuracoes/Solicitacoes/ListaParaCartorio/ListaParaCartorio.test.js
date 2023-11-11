import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import { SpinningContext } from '@/components/SpinningContext';
import { FETCH_METHODS } from '@/services/apis/GenericFetch';
import { renderWithRedux } from '@test-utils';
import { ListaParaCartorio } from '.';
import { CartorioContext } from '../../contexts/CartorioContext';

describe('<ListaParaCartorio>', () => {
  const mockLista = /** @type {Procuracoes.SolicitacoesListaCartorio.ListaReturn} */ ({
    1: {
      envelopes: {
        '9999': {
          dados: {
            municipio: 'mock municipio',
            nome: 'mock nome',
            prefixo: 'mock prefixo',
            uf: 'mock uf',
          },
          procuracoes: {
            1: {
              info: {
                folha: 'mock folha 1',
                livro: 'mock livro 1',
              },
              pedido: {
                copia: 1,
                manifesto: 0,
                revogacao: 1,
              },
            },
            2: {
              info: {
                folha: 'mock folha 2',
                livro: 'mock livro 2',
              },
              pedido: {
                copia: 0,
                manifesto: 1,
                revogacao: 0,
              },
            }
          },
        },
      },
      items: [1, 2, 3, 4, 5],
    }
  });

  beforeEach(() => {
    jest.useFakeTimers({ advanceTimers: true });
  });

  afterEach(() => {
    act(() => {
      jest.runAllTimers();
    });
    jest.useRealTimers();
  });

  it('renders a lista', async () => {
    await doRender();

    // has to which cartorio
    expect(screen.getByText(/para: mock cartorio/i)).toBeInTheDocument();

    // has the total of items
    expect(screen.getByText(new RegExp(`total: ${mockLista[1]?.items.length} itens`, 'i'))).toBeInTheDocument();

    // has a copy button
    expect(screen.getByRole('button', {
      name: /copiar email/i
    })).toBeInTheDocument();

    // has a disabled confirm button
    expect(screen.getByRole('button', {
      name: /confirmar envio/i
    })).toBeDisabled();

    // has a ver email button
    expect(screen.getByRole('button', {
      name: /ver email/i
    })).toBeInTheDocument();
  });

  it('runs the fluxo of email', async () => {
    await doRender();
    const user = userEvent.setup();

    // copy the email
    await user.click(screen.getByRole('button', {
      name: /copiar email/i
    }));

    // wait message dissapear
    await act(() => {
      jest.advanceTimersByTime(10000);
      jest.runAllTimers();
    });

    // has a enabled confirm button
    expect(screen.getByRole('button', {
      name: /confirmar envio/i
    })).toBeEnabled();

    // on clicking the confirm button
    await user.click(screen.getByRole('button', {
      name: /confirmar envio/i
    }));

    // check the popconfirm
    await act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => {
      expect(screen.getByRole('tooltip', { name: /confirma\?/i })).toBeInTheDocument();
    });

    // click confirm
    await user.click(screen.getByRole('button', {
      name: /sim/i
    }));

    await act(() => {
      jest.runAllTimers();
    });

    // called the api
    expect(globalThis.fetchSpy).toHaveBeenCalledWith(
      FETCH_METHODS.POST,
      '/procuracoes/solicitacoes/envio-cartorio',
      { items: mockLista[1]?.items }
    );

    // item is removed
    expect(screen.getByText(/nenhuma solicitação pendente\./i)).toBeInTheDocument();
  });

  async function doRender(lista = mockLista) {
    const mockCartorios = /** @type {Procuracoes.Cartorio[]} */ ([{
      id: 1,
      nome: 'mock cartorio',
    }]);

    globalThis.fetchSpy
      .mockImplementation((_, route) => {
        if (route === '/procuracoes/solicitacoes/cartorio') {
          return Promise.resolve({ ...lista });
        }
        if (route === '/procuracoes/cadastro/lista-cartorios') {
          return Promise.resolve(mockCartorios);
        }
        if (route === '/procuracoes/solicitacoes/envio-cartorio') {
          return Promise.resolve(true);
        }
        return Promise.resolve(route);
      });

    renderWithRedux(
      <CartorioContext>
        <SpinningContext>
          <ListaParaCartorio />
        </SpinningContext>
      </CartorioContext>
    );

    await waitFor(() => {
      expect(screen.queryByText('Carregando solicitações para envio...')).not.toBeInTheDocument();
    });
  }
});

