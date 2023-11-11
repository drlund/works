import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment';
import { act } from 'react-dom/test-utils';

import { SpinningContext } from '@/components/SpinningContext';
import { FETCH_METHODS } from '@/services/apis/GenericFetch';
import { renderWithRedux } from '@test-utils';

import { ListaSolicitacoes } from '.';
import { CartorioContext } from '../../contexts/CartorioContext';
import * as SolicitacaoEditarModule from '../../innerComponents/AcordeaoProcuracoes/ItemAcordeaoPesquisa/columns/Solicitacoes/SolicitacoesEditarInner';

const editarSpy = jest.spyOn(
  SolicitacaoEditarModule,
  // @ts-ignore
  SolicitacaoEditarModule.SolicitacoesEditarInner.name,
);

jest.setTimeout(60000);

describe('<ListaSolicitacoes>', () => {
  const makeFunci = (extra = '') =>
    /** @type {Procuracoes.SolicitacoesLista.FunciSolicitacoes} */({
    cargo: `mock cargo ${extra}`,
    matricula: `mock matricula ${extra}`,
    nome: `mock nome ${extra}`,
    dependencia: {
      nome: `mock nome ${extra}`,
      municipio: `mock municipio ${extra}`,
      prefixo: `mock prefixo ${extra}`,
      uf: `mock uf ${extra}`,
      super: `mock super ${extra}`,
    },
  });
  const makeProcuracaoPedido = (n = 1, particular = false) =>
    /** @type {Procuracoes.SolicitacoesLista.ProcuracaoPedido} */({
    dataEmissao: moment().subtract(n, 'day').toISOString(),
    dataManifesto: particular
      ? null
      : moment().subtract(n, 'day').toISOString(),
    dataVencimento: moment().subtract(n, 'day').toISOString(),
    dataRevogacao: moment().subtract(n, 'day').toISOString(),
    id: n,
    idCartorio: particular ? null : n,
    outorgado: makeFunci(`outorgado procuracao pedido ${n}`),
  });

  const makePedidoItem = (
    n = 1,
    { copia = 0, manifesto = 0, revogacao = 0 } = {},
    particular = false,
  ) =>
    /** @type {Procuracoes.SolicitacoesLista.SolicitacaoItem} */({
    copia,
    manifesto,
    revogacao,
    id: n,
    matriculaRegistro: `mock matriculaRegistro ${n}`,
    registroAt: `mock registroAt ${n}`,
    procuracao: {
      id: n,
      dataEmissao: moment().subtract(n, 'day').toISOString(),
      dataManifesto: particular
        ? null
        : moment().subtract(n, 'day').toISOString(),
      dataVencimento: moment().subtract(n, 'day').toISOString(),
      dataRevogacao: moment().subtract(n, 'day').toISOString(),
      cartorio: particular
        ? null
        : {
          id: n,
          nome: `mock cartorio ${n}`,
        },
      folha: `mock folha ${n}`,
      livro: `mock livro ${n}`,
      subsidiarias: [`mock subsidiarias ${n}`],
      outorgado: {
        matricula: `mock matricula ${n}`,
        nome: `mock nome ${n}`,
      },
    },
  });

  const mockLista = /** @type {Procuracoes.SolicitacoesLista.Pedido[]} */ ([
    {
      funciRegistro: makeFunci('pedido 1'),
      id: 1,
      observacao: 'mock observacao 1',
      registroAt: 'mock registroAt 1',
      procuracao: makeProcuracaoPedido(1),
      solicitacaoItems: [
        makePedidoItem(1, { copia: 1 }),
        makePedidoItem(2, { manifesto: 1 }),
      ],
    },
    {
      funciRegistro: makeFunci('pedido 2'),
      id: 2,
      observacao: 'mock observacao 2',
      registroAt: 'mock registroAt 2',
      procuracao: makeProcuracaoPedido(2),
      solicitacaoItems: [makePedidoItem(3, { revogacao: 1 })],
    },
    {
      funciRegistro: makeFunci('pedido 3'),
      id: 3,
      observacao: 'mock observacao 3',
      registroAt: 'mock registroAt 3',
      procuracao: makeProcuracaoPedido(3, true),
      solicitacaoItems: [makePedidoItem(4, { revogacao: 1 }, true)],
    },
  ]);

  beforeEach(() => {
    jest.useFakeTimers({ advanceTimers: true });
  });

  afterEach(async () => {
    await act(() => {
      jest.advanceTimersByTime(10000);
      jest.runAllTimers();
    });

    jest.useRealTimers();
  });

  it('create 3 items', async () => {
    await doRender();

    expect(screen.getAllByTestId('solicitacao-item')).toHaveLength(
      mockLista.length,
    );
  });

  describe('the items', () => {
    beforeEach(async () => {
      await doRender();
    });

    it('pedido normal', async () => {
      const pedidoNormal = screen.getAllByTestId('solicitacao-item')[0];
      const itemsPedido = /** @type {[HTMLElement,HTMLElement]} */(within(
        // @ts-ignore
        within(pedidoNormal).getAllByRole('list')[0],
      ).getAllByRole('listitem'));

      // has the items
      // @ts-ignore
      expect(itemsPedido).toHaveLength(mockLista[0].solicitacaoItems.length);

      expect(within(itemsPedido[0]).getByText(/mock nome 1/i)).toBeInTheDocument();
      expect(within(itemsPedido[0]).getByText(/mock subsidiarias 1/i)).toBeInTheDocument();
      expect(within(itemsPedido[0]).getByText(/Cópia/i)).toBeInTheDocument();

      expect(within(itemsPedido[1]).getByText(/mock nome 2/i)).toBeInTheDocument();
      expect(within(itemsPedido[1]).getByText(/mock subsidiarias 2/i)).toBeInTheDocument();
      expect(within(itemsPedido[1]).getByText(/Certidão/i)).toBeInTheDocument();
    });

    it('pedido revogacao', async () => {
      const pedidoRevogacao = screen.getAllByTestId('solicitacao-item')[1];
      const itemsPedido = /** @type {[HTMLElement]} */(within(
        // @ts-ignore
        within(pedidoRevogacao).getAllByRole('list')[0],
      ).getAllByRole('listitem'));

      // has the items
      // @ts-ignore
      expect(itemsPedido).toHaveLength(mockLista[1].solicitacaoItems.length);

      expect(within(itemsPedido[0]).getByText(/mock nome 3/i)).toBeInTheDocument();
      expect(within(itemsPedido[0]).getByText(/mock subsidiarias 3/i)).toBeInTheDocument();
      expect(within(itemsPedido[0]).getByText(/Revogação/i)).toBeInTheDocument();
    });

    it('pedido revogacao particular', async () => {
      const pedidoRevogacaoParticular =
        screen.getAllByTestId('solicitacao-item')[2];
      const itemsPedido = /** @type {[HTMLElement]} */(within(
        // @ts-ignore
        within(pedidoRevogacaoParticular).getAllByRole('list')[0],
      ).getAllByRole('listitem'));

      // has the items
      // @ts-ignore
      expect(itemsPedido).toHaveLength(mockLista[2].solicitacaoItems.length);

      expect(within(itemsPedido[0]).getByText(/mock nome 4/i)).toBeInTheDocument();
      expect(within(itemsPedido[0]).getByText(/mock subsidiarias 4/i)).toBeInTheDocument();
      expect(within(itemsPedido[0]).getByText(/Revogação - Procuração Particular/i)).toBeInTheDocument();
    });
  });

  // @ts-ignore
  const getInPedidoNormal = () => within(screen.getAllByTestId('solicitacao-item')[0]);
  // @ts-ignore
  const getInRevogacao = () => within(screen.getAllByTestId('solicitacao-item')[1]);
  // @ts-ignore
  const getInRevogacaoParticular = () => within(screen.getAllByTestId('solicitacao-item')[2]);

  it('cancels one item', async () => {
    await doRender();

    // click trigger
    await userEvent.click(getInPedidoNormal().getByRole('button', { name: /cancelar/i }));
    // por algum motivo não funciona sem esse segundo click
    await userEvent.click(getInPedidoNormal().getByRole('button', { name: /cancelar/i }));

    const popover = screen.getByRole('tooltip', {
      name: /confirma cancelamento do pedido\?/i
    });

    // popover to confirm appears
    expect(popover).toBeVisible();

    // confirm is disabled
    expect(
      within(popover).getByRole('button', { name: /excluir pedido/i })
    ).toBeDisabled();

    // on typing a observacao
    await userEvent.type(
      within(popover).getByRole('textbox'),
      'minha mock observacao',
      // por algum motivo existe um pointer-events: none acima na tree
      { pointerEventsCheck: 0 }
    );

    // confirm is enabled
    expect(
      within(popover).getByRole('button', { name: /excluir pedido/i })
    ).toBeEnabled();

    // click confirm
    await userEvent.click(
      within(popover).getByRole(
        'button',
        { name: /excluir pedido/i },
      ),
      { pointerEventsCheck: 0 }
    );

    // item was removed
    expect(screen.getAllByTestId('solicitacao-item')).toHaveLength(mockLista.length - 1);

    // api was called
    expect(globalThis.fetchSpy).toBeCalledWith(
      FETCH_METHODS.DELETE,
      `procuracoes/solicitacoes/pedido/${mockLista[0]?.id}`,
      undefined,
      undefined,
      undefined,
      { "data": { "justificativa": "minha mock observacao" } }
    );
  });

  it('confirms one item', async () => {
    await doRender();

    // click trigger
    await userEvent.click(getInRevogacao().getByRole('button', { name: /confirmar/i }));
    await userEvent.click(getInRevogacao().getByRole('button', { name: /confirmar/i }));

    const popover = screen.getByRole('tooltip', {
      name: /confirma este pedido\?/i
    });

    // popover to confirm appears
    expect(popover).toBeVisible();

    // click confirm
    await userEvent.click(
      within(popover).getByRole('button', { name: /confirmar/i }),
      { pointerEventsCheck: 0 }
    );

    // item was removed
    expect(screen.getAllByTestId('solicitacao-item')).toHaveLength(mockLista.length - 1);

    // api was called
    expect(globalThis.fetchSpy).toBeCalledWith(
      FETCH_METHODS.PATCH,
      `procuracoes/solicitacoes/pedido/${mockLista[1]?.id}`,
      { isRevogacaoParticular: false },
    );
  });

  it('revoga procuracao particular', async () => {
    await doRender();

    // click trigger
    await userEvent.click(getInRevogacaoParticular().getByRole('button', { name: /revogar procuração particular/i }));
    await userEvent.click(getInRevogacaoParticular().getByRole('button', { name: /revogar procuração particular/i }));

    const popover = screen.getByRole('tooltip', {
      name: /revogar procuração particular\?/i
    });

    // popover to confirm appears
    expect(popover).toBeVisible();

    // click confirm
    await userEvent.click(
      within(popover).getByRole('button', { name: /confirmar/i }),
      { pointerEventsCheck: 0 }
    );

    // item was removed
    expect(screen.getAllByTestId('solicitacao-item')).toHaveLength(mockLista.length - 1);

    // api was called
    expect(globalThis.fetchSpy).toBeCalledWith(
      FETCH_METHODS.PATCH,
      `procuracoes/solicitacoes/pedido/${mockLista[2]?.id}`,
      { isRevogacaoParticular: true },
    );
  });

  it('edits one item', async () => {
    await doRender();

    // click trigger
    await userEvent.click(getInPedidoNormal().getByRole('button', { name: /preparar edição/i }));

    // neste ponto, ele carregaria as informações e abriria o modal de edição
    // o modal é o mesmo do pedido, a diferença é só que ele já vem com o cart cheio
    // e envia as edições para outra rota

    // dados para edição
    expect(JSON.parse(getInPedidoNormal().getByTestId('props').innerHTML)).toEqual({
      idProcuracao: mockLista[0]?.id,
      idPedido: mockLista[0]?.procuracao.id,
      copia: mockLista[0]?.solicitacaoItems.map(i => i.copia ? i.id : null).filter(Boolean),
      manifesto: mockLista[0]?.solicitacaoItems.map(i => i.manifesto ? i.id : null).filter(Boolean),
    });

    // verificando o callback
    await userEvent.click(
      getInPedidoNormal().getByRole('button', {
        name: /handlecallback/i
      })
    );

    // item é removido da lista
    expect(screen.getAllByTestId('solicitacao-item')).toHaveLength(mockLista.length - 1);
  });

  async function doRender(lista = mockLista) {
    const mockCartorios = /** @type {Procuracoes.Cartorio[]} */ ([{
      id: 1,
      nome: 'mock cartorio',
    }]);

    globalThis.fetchSpy.mockImplementation((_, route) => {
      if (route === 'procuracoes/solicitacoes') {
        return Promise.resolve(lista);
      }
      if (route === '/procuracoes/cadastro/lista-cartorios') {
        return Promise.resolve(mockCartorios);
      }
      return Promise.resolve([]);
    });

    // @ts-ignore
    editarSpy.mockImplementation(mockComponent);

    renderWithRedux(
      <CartorioContext>
        <SpinningContext>
          <ListaSolicitacoes />
        </SpinningContext>
      </CartorioContext>,
    );
  }
});

// @ts-ignore
function mockComponent({ handleCallback, ...props }) {
  return (
    <div>
      <div data-testid="props">{JSON.stringify(props)}</div>
      <button type="button" onClick={handleCallback}>
        handleCallback
      </button>
    </div>
  );
}
