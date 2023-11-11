import { FETCH_METHODS } from '@/services/apis/GenericFetch';
import { renderWithRedux } from '@test-utils';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PesquisasContext } from '@/pages/procuracoes/Pesquisar/PesquisaContext';
import { ItemAcordeao } from '../..';

describe('<Solicitacoes>', () => {
  const mockProcuracaoId = 1;
  const mockProcuracaoParticularId = 2;
  const mockProcuracaoSubsidiariaId = 3;
  const mockCartorioId = 1;
  const outorgadoPrefixo = '9009';
  const outorgadoNome = 'mock nome';
  const mockObservacao = 'observacao mock';
  const mockNomeParticular = 'mock nome2';

  const mockOutorgado = /** @type {Procuracoes.Outorgante} */({
    prefixo: outorgadoPrefixo,
    cargoNome: 'mock cargo',
    nome: outorgadoNome,
    matricula: 'F9999999',
    idProcuracao: mockProcuracaoId,
    ativo: 1,
    procuracao: [{
      outorgado: {
        nome: outorgadoNome,
        matricula: "F9999999",
        cargo: "mock cargo",
      },
      // @ts-expect-error não precisa todos os fields
      procuracaoAgregada: /** @type {Procuracoes.Procuracao['procuracaoAgregada']} */ ({
        procuracaoId: mockProcuracaoId,
        cartorioId: mockCartorioId,
        revogacao: null,
        procuracaoAtiva: 1,
        vencimento: "2020-12-01",
        manifesto: "2020-12-02",
        emissao: "2020-12-03",
        doc: 'mock doc',
      }),
      subsidiarias: [{ id: 1, nome: 'BB', subAtivo: 1 }],
    }, {
      outorgado: {
        nome: mockNomeParticular,
        matricula: "F2222222",
        cargo: "mock cargo2",
      },
      procuracaoAgregada: {
        procuracaoId: mockProcuracaoParticularId,
        cartorioId: null,
        revogacao: null,
        procuracaoAtiva: 1,
        vencimento: "2020-12-01",
        emissao: "2020-12-03",
        doc: 'mock doc2',
      },
      subsidiarias: [{ id: 1, nome: 'BB', subAtivo: 1 }],
    }, {
      outorgado: {
        nome: 'nome3',
        matricula: "F3333333",
        cargo: "mock cargo3",
      },
      procuracaoAgregada: null,
      subsidiarias: [{
        id: 1,
        nome: 'BB',
        subAtivo: 1,
        cartorioId: 1,
        procuracaoAtiva: 1,
        procuracaoId: mockProcuracaoSubsidiariaId,
        revogacao: null,
        doc: 'mock doc3',
      }]
    }],
  });

  const getSolicitacoesModal = () => screen.getByRole('dialog', {
    name: /solicitações/i
  });

  const withinModal = () => within(getSolicitacoesModal());
  const getCheckboxFromLabel = (/** @type {import('@testing-library/react').Matcher} */ id) => within(
    // @ts-ignore
    withinModal()
      .getByText(id)
      // implementacao do antd não consegui um label que seja para "aria" only
      // então, criei um label com style invisible
      // talvez isso ou o antd, mas o teste não reconhece como label
      // então busco pela label, vejo o parent e de la busco o checkbox
      // eslint-disable-next-line
      .parentElement
  ).getByRole('checkbox');

  beforeEach(() => {
    jest.useFakeTimers({
      now: new Date('2020-12-02').getTime(),
      advanceTimers: true,
    });
  });

  afterEach(() => {
    jest.runAllTimers();
    jest.useRealTimers();
  });

  beforeEach(async () => {
    globalThis.permissionHookMock.mockReturnValue(true);
    globalThis.fetchSpy
      .mockResolvedValueOnce(
        /** @type {import('../shared/SolicitacoesContext').SolicitacoesContext['solicitacoes']} */({
          [mockProcuracaoId]: {
            copia: 0,
            manifesto: new Date('2020-11-01').getTime(),
            pedido: false,
            revogacao: false,
          },
          [mockProcuracaoParticularId]: {
            copia: 0,
            manifesto: 0,
            pedido: true,
            revogacao: false,
          },
          [mockProcuracaoSubsidiariaId]: {
            copia: new Date('2020-12-01').getTime(),
            manifesto: 0,
            pedido: false,
            revogacao: false,
          }
        })
      )
      // acessos/gerenciar
      .mockResolvedValue([]);

    renderWithRedux((
      <PesquisasContext>
        <ItemAcordeao
          outorgado={mockOutorgado}
          isShowing
          // @ts-ignore
          isActive
        />
      </PesquisasContext>
    ), { withMemoryRouter: true });

    jest.runAllTimers();

    const getSolicitacoesButton = () => screen.getByRole('button', {
      name: /solicitações/i
    });

    await waitFor(() => {
      expect(getSolicitacoesButton()).toBeInTheDocument();
    });

    await userEvent.click(getSolicitacoesButton());

    jest.runAllTimers();

    await waitFor(() => {
      expect(getSolicitacoesModal()).toBeVisible();
    });
  });

  describe('modal solicitações', () => {
    it('has a title', async () => {
      expect(withinModal().getByText(/solicitações/i)).toBeInTheDocument();
    });

    it("has a observacao input", async () => {
      expect(withinModal().getByRole('textbox', {
        name: /observação/i
      })).toBeInTheDocument();
    });

    it('has checkboxes for first procuracao', async () => {
      expect(getCheckboxFromLabel(/adicionar certidão para mock nome/i)).toBeInTheDocument();
      expect(getCheckboxFromLabel(/adicionar cópia para mock nome/i)).toBeInTheDocument();
    });

    it('has warning about already having a solicitacao', async () => {
      const procuracaoReferenteCell = within(
        // na célula com o nome, abaixo fica o warning (se existir pedido em aberto)
        // alternativa seria criar um componente com algum tipo de matcher específico
        // @ts-ignore
        // eslint-disable-next-line
        withinModal().getByText(mockNomeParticular).parentElement.parentElement
      );
      expect(procuracaoReferenteCell.getByText(/atenção/i)).toBeInTheDocument();
      expect(procuracaoReferenteCell.getByText(/existe pedido em andamento/i)).toBeInTheDocument();
    });

    it('has only a text for the procuracao particular', async () => {
      expect(withinModal().getByText(
        /não é possível fazer o pedido para procurações particulares\./i)
      ).toBeInTheDocument();
    });

    it('has checkboxes for the last procuracao', async () => {
      expect(getCheckboxFromLabel(/adicionar certidão para bb - nome3/i)).toBeInTheDocument();
      expect(getCheckboxFromLabel(/adicionar cópia para bb - nome3/i)).toBeInTheDocument();
    });

    /**
     * @param {import('@testing-library/react').Matcher} idCheckbox
     * @param {import('@testing-library/react').Matcher} idText
     */
    const getLastPedidoFromCheckbox = (idCheckbox, idText) => within(
      // alternativa seria criar um componente com algum tipo de matcher
      // que possa retornar o elemento onde fica o checkbox e labels
      // @ts-ignore
      // eslint-disable-next-line
      getCheckboxFromLabel(idCheckbox).parentElement.parentElement.parentElement
    ).getByText(idText);

    it('has last time it had a solicitacao', async () => {
      expect(
        getLastPedidoFromCheckbox(/adicionar certidão para mock nome/i, /\(há um mês\)/i)
      ).toBeInTheDocument();
      expect(
        getLastPedidoFromCheckbox(/adicionar cópia para bb - nome3/i, /\(há um dia\)/i)
      ).toBeInTheDocument();
    });

    it('has the totals selected', async () => {
      expect(withinModal().getByText(/cópias: 0/i)).toBeInTheDocument();
      expect(withinModal().getByText(/certidões: 0/i)).toBeInTheDocument();
    });

    it('has a disabled confirmar button', async () => {
      expect(withinModal().getByRole('button', {
        name: /confirmar 0 item/i
      })).toBeDisabled();
    });
  });

  describe('on adding solicitações and observacão', () => {
    beforeEach(async () => {
      await userEvent.click(getCheckboxFromLabel(/adicionar certidão para mock nome/i));
      await userEvent.click(getCheckboxFromLabel(/adicionar cópia para mock nome/i));
      await userEvent.type(withinModal().getByRole('textbox', {
        name: /observação/i
      }), mockObservacao);
    });

    it('changed the totals', async () => {
      expect(withinModal().getByText(/cópias: 1/i)).toBeInTheDocument();
      expect(withinModal().getByText(/certidões: 1/i)).toBeInTheDocument();
    });

    it('enabled the button', async () => {
      expect(withinModal().getByRole('button', {
        name: /confirmar 2 itens/i
      })).toBeEnabled();
    });

    describe('on clicking to send the solicitacao', () => {
      beforeEach(async () => {
        await userEvent.click(withinModal().getByRole('button', {
          name: /confirmar 2 itens/i
        }));
      });

      // o "popover" é renderizado como uma div em um portal
      const getPopover = () => within(
        // @ts-ignore
        screen.getByText(/confirma este pedido\?/i)
          // do texto, navega dois parents para achar o "popover"
          // eslint-disable-next-line
          .parentElement.parentElement
      );

      it('opens a popover', async () => {
        expect(getPopover().getByText(/confirma este pedido\?/i)).toBeInTheDocument();
        expect(getPopover().getByRole('button', { name: /sim/i })).toBeInTheDocument();
      });

      describe('on confirming the solicitacao', () => {
        beforeEach(async () => {
          await userEvent.click(getPopover().getByRole('button', { name: /sim/i }));
        });

        it('calls the api', async () => {
          expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
            FETCH_METHODS.POST,
            `/procuracoes/solicitacoes/nova/${mockProcuracaoId}`,
            {
              cart: {
                copia: [mockProcuracaoId],
                manifesto: [mockProcuracaoId],
                observacao: mockObservacao,
              }
            }
          );
        });
      });

    });
  });
});
