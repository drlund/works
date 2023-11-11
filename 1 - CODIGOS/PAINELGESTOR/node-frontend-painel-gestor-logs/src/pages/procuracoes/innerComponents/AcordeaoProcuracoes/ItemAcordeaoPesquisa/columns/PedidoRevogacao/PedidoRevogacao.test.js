import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PesquisasContext } from '@/pages/procuracoes/Pesquisar/PesquisaContext';
import { FETCH_METHODS } from '@/services/apis/GenericFetch';
import { renderWithRedux } from '@test-utils';

import { ItemAcordeao } from '../..';

describe('<PedidoRevogacao>', () => {
  const mockProcuracaoId = 1;
  const mockProcuracaoParticularId = 2;
  const mockProcuracaoSubsidiariaId = 3;
  const mockCartorioId = 1;
  const outorgadoPrefixo = '9009';
  const outorgadoNome = 'mock nome';
  const mockObservacao = 'observacao mock para revogação';
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

  beforeEach(async () => {
    globalThis.permissionHookMock.mockReturnValue(true);
    globalThis.fetchSpy
      .mockResolvedValueOnce(
        /** @type {import('../shared/SolicitacoesContext').SolicitacoesContext['solicitacoes']} */({
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
  });

  it('renders the trigger button', async () => {
    expect(screen.getByRole('button', { name: /pedir revogação/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pedir revogação/i })).toBeEnabled();
  });

  describe('on click trigger', () => {
    const getDialog = () => screen.getByRole('dialog', {
      name: /pedir revogação de procuração/i
    });
    const inDialog = () => within(getDialog());

    beforeEach(async () => {
      await userEvent.click(screen.getByRole('button', { name: /pedir revogação/i }));

      expect(getDialog()).toBeVisible();
    });

    describe('the modal', () => {
      it('has a observacao input', async () => {
        expect(inDialog().getByRole('textbox')).toBeInTheDocument();
        expect(inDialog().getByPlaceholderText(/pedido de revogação/i)).toBeInTheDocument();
      });

      it('has a disabled confirm button', async () => {
        expect(inDialog().getByRole('button', { name: /confirmar/i })).toBeDisabled();
      });
    });

    describe('on filling observacao', () => {
      beforeEach(async () => {
        await userEvent.type(inDialog().getByRole('textbox'), mockObservacao);
      });

      it('has a enabled confirm button', async () => {
        expect(inDialog().getByRole('button', { name: /confirmar/i })).toBeEnabled();
      });

      describe('on confirming', () => {
        beforeEach(async () => {
          await userEvent.click(inDialog().getByRole('button', { name: /confirmar/i }));
        });

        // o "popover" é renderizado como uma div em um portal
        const getPopover = (/** @type {import('@testing-library/react').Matcher} */ id) => (
          // @ts-ignore
          screen.getByText(id)
            // do texto, navega dois parents para achar o "popover"
            // eslint-disable-next-line
            .parentElement.parentElement
        );

        it('shows a confirmation popover', async () => {
          expect(getPopover(/confirma querer a revogação desta procuração\?/i)).toBeInTheDocument();
        });

        describe('on confirming in the popover', () => {
          beforeEach(async () => {
            await userEvent.click(
              // @ts-ignore
              within(getPopover(/confirma querer a revogação desta procuração\?/i))
                .getByRole('button', { name: /sim/i })
            );
          });

          it('calls the api', async () => {
            expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
              FETCH_METHODS.POST,
              `/procuracoes/solicitacoes/revogacao/${mockProcuracaoId}`,
              {
                observacao: mockObservacao
              }
            );
          });
        });
      });
    });
  });
});
