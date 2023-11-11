import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProcuracoesContextWrapper from 'pages/procuracoes/contexts/ProcuracoesContext';
import { fluxosProcessos } from 'pages/procuracoes/innerComponents/SelecionarTipoFluxo/helpers/fluxosProcessos';
import { startRender } from 'pages/procuracoes/tests/utils';
import { FETCH_METHODS } from 'services/apis/GenericFetch';
import { ListaDeMassificado } from '.';

describe('<ListaDeMassificado>', () => {
  describe('when without data', () => {
    beforeEach(async () => {
      globalThis.fetchSpy.mockResolvedValue([]);
      render(<ListaDeMassificado />);
    });

    it('loads fetching the list', async () => {
      expect(
        screen.getByText('Carregando lista de massificados'),
      ).toBeInTheDocument();
    });

    describe('when loading completes', () => {
      it('renders that list is empty', async () => {
        await waitFor(() => {
          expect(
            screen.queryByText('Carregando lista de massificados'),
          ).not.toBeInTheDocument();
        });

        expect(
          screen.getByText('Nenhum massificado em aberto.'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('when with data', () => {
    const mockListaMassificado = [
      {
        ativos: 1,
        total: 2,
        idFluxo: 'b5dfd889-9196-4199-9706-2da7900c98b4',
        idMassificado: 'massificado1',
        idMinuta: 'minuta1.1',
        matriculaOutorgado: 'matriculaOutorgado1.1',
        nomeOutorgado: 'nomeOutorgado1.1',
      },
      {
        ativos: 2,
        total: 2,
        idFluxo: 'b5dfd889-9196-4199-9706-2da7900c98b4',
        idMassificado: 'massificado2',
        idMinuta: 'minuta2.1',
        matriculaOutorgado: 'matriculaOutorgado2.1',
        nomeOutorgado: 'nomeOutorgado2.1',
      },
      {
        ativos: 2,
        total: 2,
        idFluxo: 'b5dfd889-9196-4199-9706-2da7900c98b4',
        idMassificado: 'massificado2',
        idMinuta: 'minuta2.2',
        matriculaOutorgado: 'matriculaOutorgado2.2',
        nomeOutorgado: 'nomeOutorgado2.2',
      },
    ];

    const getTab = (/** @type {number} */ num) =>
      screen.getByRole('tab', { name: new RegExp(`massificado${num}`, 'i') });
    const withinMassificado = (/** @type {number} */ num) =>
      within(getTab(num));

    beforeEach(async () => {
      startRender(
        () => (
          <ProcuracoesContextWrapper
            fluxoProcesso={fluxosProcessos.massificadoMinuta}
          >
            <ListaDeMassificado />
          </ProcuracoesContextWrapper>
        ),
        {
          beforeRenderDefaultReturn: mockListaMassificado,
        },
      );
    });

    it('renders the list by massificado', async () => {
      const massificados = new Set(
        mockListaMassificado.map((l) => l.idMassificado),
      ).size;
      expect(screen.getAllByRole('tab')).toHaveLength(massificados);
    });

    describe('first massificado', () => {
      it('renders the first tab', async () => {
        expect(withinMassificado(1).getByText(/massificado1/i)).toBeInTheDocument();
        expect(withinMassificado(1).getByText(/1\/2/i)).toBeInTheDocument();
        expect(withinMassificado(1).getByRole('button', { name: /gerar arquivos novamente/i })).toBeInTheDocument();
        expect(withinMassificado(1).getByRole('button', { name: /deletar massificado/i })).toBeInTheDocument();
      });

      it('renders buttons enabled', async () => {
        expect(withinMassificado(1).getByRole('button', { name: /gerar arquivos novamente/i })).toBeEnabled();
        expect(withinMassificado(1).getByRole('button', { name: /deletar massificado/i })).toBeEnabled();
      });

      describe('on clicking to delete massificado', () => {
        beforeEach(async () => {
          await userEvent.click(withinMassificado(1).getByRole('button', { name: /deletar massificado/i }));
        });

        it('shows a confirmation modal', async () => {
          screen.getByRole('tooltip', {
            name: /exclamation-circle tem certeza que deseja deletar\? cancelar deletar/i
          });
        });

        it('calls the api to delete massificado', async () => {
          const tooltip = screen.getByRole('tooltip', {
            name: /exclamation-circle tem certeza que deseja deletar\? cancelar deletar/i
          });

          const deletarButton = within(tooltip).getByRole('button', {
            name: /deletar/i
          });

          await userEvent.click(deletarButton);

          expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
            FETCH_METHODS.DELETE,
            'procuracoes/massificado/listaMinutas',
            undefined,
            undefined,
            undefined,
            { "data": { "listaDeMinutas": ["minuta1.1"] } }
          );
        });
      });

      describe('inside tab', () => {
        beforeEach(async () => {
          await userEvent.click(getTab(1));
        });

        it('renders the list of minutas', async () => {
          screen.getByRole('checkbox', { name: /matriculaoutorgado1\.1 - nomeoutorgado1\.1/i });
        });

        describe('unchecking a minuta', () => {
          beforeEach(async () => {
            await userEvent.click(
              screen.getByRole('checkbox', { name: /matriculaoutorgado1\.1 - nomeoutorgado1\.1/i })
            );
          });

          it('disables the buttons', async () => {
            expect(withinMassificado(1).getByRole('button', { name: /gerar arquivos novamente/i })).toBeDisabled();
            expect(withinMassificado(1).getByRole('button', { name: /deletar massificado/i })).toBeDisabled();
          });
        });
      });
    });

    describe('second massificado, when partially checked', () => {
      beforeEach(async () => {
        await userEvent.click(getTab(2));

        await userEvent.click(
          screen.getByRole('checkbox', {
            name: /matriculaoutorgado2\.2 - nomeoutorgado2\.2/i
          })
        );
      });

      it('buttons are enabled with how many in the batch', async () => {
        expect(withinMassificado(2).getByRole('button', {
          name: /gerar arquivos novamente \(1 minuta\)/i
        })).toBeEnabled();

        expect(withinMassificado(2).getByRole('button', {
          name: /deletar massificado \(1 minuta\)/i
        })).toBeEnabled();
      });

      describe('on clicking to regenerate massificado', () => {
        beforeEach(async () => {
          await userEvent.click(withinMassificado(2).getByRole('button', {
            name: /gerar arquivos novamente \(1 minuta\)/i
          }));
        });

        it('changes the page', async () => {
          expect(globalThis.routerDomPushMock).toHaveBeenLastCalledWith(
            "/procuracoes/massificado/minuta/massificado2"
          );
        });

        it('saves the list into the session storage', async () => {
          expect(window.sessionStorage.getItem(`listaMinutas-${mockListaMassificado[1].idMassificado}`)).toEqual(
            JSON.stringify([mockListaMassificado[1].idMinuta])
          );
        });
      });
    });
  });
});
