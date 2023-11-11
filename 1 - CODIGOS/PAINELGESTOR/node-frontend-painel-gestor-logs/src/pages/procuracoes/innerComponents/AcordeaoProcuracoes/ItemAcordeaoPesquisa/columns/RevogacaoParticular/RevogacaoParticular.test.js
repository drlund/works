import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PesquisasContext } from '@/pages/procuracoes/Pesquisar/PesquisaContext';
import { FETCH_METHODS } from '@/services/apis/GenericFetch';
import { renderWithRedux } from '@test-utils';

import { ItemAcordeao } from '../..';

jest.setTimeout(60000);

describe('<RevogacaoParticular>', () => {
  const mockProcuracaoId = 1;
  const mockProcuracaoParticularId = 2;
  const mockProcuracaoSubsidiariaId = 3;
  const mockCartorioId = null;
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

  it('revogacao flow', async () => {
    expect(screen.getByRole('button', { name: /revogação de procuração particular/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /revogação de procuração particular/i })).toBeEnabled();

    // on click trigger
    const getDialog = () => screen.getByRole('dialog', {
      name: /revogação de procuração particular/i
    });
    const inDialog = () => within(getDialog());

    await userEvent.click(screen.getByRole('button', { name: /revogação de procuração particular/i }));

    expect(getDialog()).toBeVisible();

    // the modal

    // has the instructions
    screen.getByText(/todo: avisos sobre a revogação/i);

    // has a observacao input
    expect(inDialog().getByRole('textbox')).toBeInTheDocument();
    expect(inDialog().getByPlaceholderText(/razão da revogação desta procuração/i)).toBeInTheDocument();

    // has a disabled confirm button
    expect(inDialog().getByRole('button', { name: /confirmar/i })).toBeDisabled();

    // on filling observacao
    await userEvent.type(inDialog().getByRole('textbox'), mockObservacao);

    // has a enabled confirm button
    expect(inDialog().getByRole('button', { name: /confirmar/i })).toBeEnabled();

    // on confirming
    await userEvent.click(inDialog().getByRole('button', { name: /confirmar/i }));

    const getPopover = (/** @type {import('@testing-library/react').ByRoleOptions['name']} */ name) => (
      screen.getByRole('tooltip', { name })
    );

    // shows a confirmation popover
    expect(getPopover(/confirma querer a revogação desta procuração\?/i)).toBeInTheDocument();

    // on confirming in the popover
    await userEvent.click(
      // @ts-ignore
      within(getPopover(/confirma querer a revogação desta procuração\?/i))
        .getByRole('button', { name: /sim/i })
    );

    // calls the api
    expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
      FETCH_METHODS.POST,
      `/procuracoes/solicitacoes/revogacao-particular/${mockProcuracaoId}`,
      {
        observacao: mockObservacao
      }
    );
  });
});
