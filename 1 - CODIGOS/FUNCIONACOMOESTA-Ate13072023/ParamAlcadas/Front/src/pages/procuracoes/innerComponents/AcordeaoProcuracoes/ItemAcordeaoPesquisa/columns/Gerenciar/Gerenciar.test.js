import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment';
import { PesquisasContext } from 'pages/procuracoes/Pesquisar/PesquisaContext';
import { ProcuracaoFlags } from 'pages/procuracoes/hooks/ProcuracaoFlags';
import { MemoryRouter } from 'react-router-dom';
import { FETCH_METHODS } from 'services/apis/GenericFetch';
import { Gerenciar } from '.';
import { renderWithRedux } from '../../../../../../../../test/test-utils';
import { PesquisaItemAcordeaoContextWrapper } from '../../PesquisaItemAcordeaoContext';

describe('Pesquisa/<Gerenciar>', () => {
  const mockProcuracaoId = 99;
  const mockRecord = /** @type {import('../../../helpers/extractAcordeaoItemData').ExtractedDataSourceUnion} */({
    cartorioId: 999
  });
  const mockPrefixo = '9999';

  describe('with all permissions', () => {
    beforeEach(async () => {
      baseRender();
      await checkForModal();
    });

    it('renders manifesto form', async () => {
      expect(screen.getByRole('heading', {
        name: /certidão de procuração/i
      })).toBeInTheDocument();
    });

    it('renders copia autenticada form', async () => {
      expect(screen.getByRole('heading', {
        name: /cópia autenticada/i
      })).toBeInTheDocument();
    });

    describe('manifesto form', () => {
      it('renders data do manifesto de assinaturas', async () => {
        expect(screen.getByRole('textbox', {
          name: /data do manifesto de assinaturas/i
        })).toHaveValue(moment().format('DD/MM/YYYY'));
      });

      it('renders valor de emissão', async () => {
        // 0 -> manifesto, 1 -> cópia autenticada
        expect(screen.getAllByRole('spinbutton', { name: /valor/i })[0]).toBeInTheDocument();
      });

      it('renders prefixo de custo', async () => {
        expect(screen.getByRole('spinbutton', { name: /dependência/i })).toBeInTheDocument();
      });

      it('renders the super custo checkbox', async () => {
        // 0 -> manifesto, 1 -> cópia autenticada
        expect(screen.getAllByRole('checkbox', {
          name: /valores a serem gerenciados pela super/i
        })[0]).toBeInTheDocument();
      });

      it('renders upload button', async () => {
        expect(screen.getByText(/enviar procuração atualizada/i)).toBeInTheDocument();
      });

      it('has the confirmar button disabled', async () => {
        expect(screen.getByRole('button', {
          name: /confirmar atualização/i
        })).toBeDisabled();
      });

      describe('on filling the form', () => {
        beforeEach(async () => {
          await userEvent.upload(screen.getByTestId('uploadManifesto'), new File(['mock'], 'manifesto.pdf'));
          await waitFor(() => {
            expect(screen.getByRole('button', {
              name: /confirmar atualização/i
            })).toBeEnabled();
          });
          await userEvent.click(screen.getByRole('button', {
            name: /confirmar atualização/i
          }));
        });

        it('posts a manifesto', async () => {
          expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
            FETCH_METHODS.POST,
            'procuracoes/gerenciar/manifesto',
            expect.objectContaining({
              formData: {
                arquivoProcuracao: expect.objectContaining({
                  uid: expect.stringContaining("rc-upload"),
                }),
                cartorioId: String(mockRecord.cartorioId),
                custoManifesto: "10.5",
                dataManifesto: expect.stringContaining(moment().format('YYYY-MM-DD')),
                idProcuracao: String(mockProcuracaoId),
                prefixoCusto: mockPrefixo,
                superCusto: "1",
              }
            }),
            {
              headers: { "Content-Type": "multipart/form-data; boundary=12345678912345678;" }
            }
          );
        });
      });
    });

    describe('copia autenticada form', () => {
      it('renders data de emissao da cópia', async () => {
        expect(screen.getByRole('textbox', {
          name: /data de emissão da cópia/i
        })).toHaveValue(moment().format('DD/MM/YYYY'));
      });

      it('renders valor de emissão', async () => {
        // 0 -> manifesto, 1 -> cópia autenticada
        expect(screen.getAllByRole('spinbutton', { name: /valor/i })[1]).toBeInTheDocument();
      });

      it('renders prefixo de custo', async () => {
        expect(
          // por algum motivo o prefixo para o manifesto funciona ok
          // mas o prefixo para a cópia autenticada não
          // esta foi a maneira que consegui resolver
          within(screen.getByTestId('copia-autenticada-form'))
            .getAllByRole('spinbutton')[1]
        ).toBeInTheDocument();
      });

      it('renders the super custo checkbox', async () => {
        // 0 -> manifesto, 1 -> cópia autenticada
        expect(screen.getAllByRole('checkbox', {
          name: /valores a serem gerenciados pela super/i
        })[1]).toBeInTheDocument();
      });

      describe('on filling the form', () => {
        beforeEach(async () => {
          await userEvent.click(screen.getByRole('button', {
            name: /confirmar cópia/i
          }));
        });

        it('posts a copia', async () => {
          expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
            FETCH_METHODS.POST,
            'procuracoes/gerenciar/copia-autenticada',
            {
              cartorioId: mockRecord.cartorioId,
              custo: 5.41,
              dataEmissao: expect.stringContaining(moment().format('YYYY-MM-DD')),
              idProcuracao: mockProcuracaoId,
              prefixoCusto: mockPrefixo,
              superCusto: 1,
            },
          );
        });
      });
    });
  });

  it('renders the button disabled if not in a prefixo with access', async () => {
    baseRender({
      initialEntry: '/',
      prefixosComAcessoEspecial: [],
    });

    expect(screen.getByRole('button', { name: /gerenciar/i })).toBeDisabled();
  });

  describe('not super vision', () => {
    beforeEach(async () => {
      globalThis.permissionHookMock.mockReturnValue(false);

      baseRender({
        initialEntry: '/',
      });

      await checkForModal();
    });

    it('dont render the super custo checkboxes', async () => {
      const checkboxes = screen.queryAllByRole('checkbox', {
        name: /valores a serem gerenciados pela super/i
      });

      expect(checkboxes)
        // eslint-disable-next-line jest-dom/prefer-in-document
        .toHaveLength(0);
    });

    describe('manifesto form', () => {
      describe('on filling the form', () => {
        beforeEach(async () => {
          await userEvent.upload(screen.getByTestId('uploadManifesto'), new File(['mock'], 'manifesto.pdf'));
          await waitFor(() => {
            expect(screen.getByRole('button', {
              name: /confirmar atualização/i
            })).toBeEnabled();
          });
          await userEvent.click(screen.getByRole('button', {
            name: /confirmar atualização/i
          }));
        });

        it('posts a manifesto', async () => {
          expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
            FETCH_METHODS.POST,
            'procuracoes/gerenciar/manifesto',
            expect.objectContaining({
              formData: {
                arquivoProcuracao: expect.objectContaining({
                  uid: expect.stringContaining("rc-upload"),
                }),
                cartorioId: String(mockRecord.cartorioId),
                custoManifesto: "10.5",
                dataManifesto: expect.stringContaining(moment().format('YYYY-MM-DD')),
                idProcuracao: String(mockProcuracaoId),
                prefixoCusto: mockPrefixo,
                superCusto: "0",
              }
            }),
            {
              headers: { "Content-Type": "multipart/form-data; boundary=12345678912345678;" }
            }
          );
        });
      });
    });

    describe('copia autenticada form', () => {
      describe('on filling the form', () => {
        beforeEach(async () => {
          await userEvent.click(screen.getByRole('button', {
            name: /confirmar cópia/i
          }));
        });

        it('posts a copia', async () => {
          expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
            FETCH_METHODS.POST,
            'procuracoes/gerenciar/copia-autenticada',
            {
              cartorioId: mockRecord.cartorioId,
              custo: 5.41,
              dataEmissao: expect.stringContaining(moment().format('YYYY-MM-DD')),
              idProcuracao: mockProcuracaoId,
              prefixoCusto: mockPrefixo,
              superCusto: 0,
            },
          );
        });
      });
    });
  });

  function baseRender({
    prefixosComAcessoEspecial = [mockPrefixo],
    outorgadoPrefixo = mockPrefixo,
    usuarioPrefixo = mockPrefixo,
    initialEntry = `/?flag=${ProcuracaoFlags.controleCusto}`
  } = {}) {
    globalThis.fetchSpy.mockResolvedValue(prefixosComAcessoEspecial);

    renderWithRedux((
      // @ts-ignore
      <MemoryRouter initialEntries={[initialEntry]}>
        <PesquisasContext>
          <PesquisaItemAcordeaoContextWrapper
            outorgado={/** @type {Procuracoes.Outorgante} */({
              prefixo: outorgadoPrefixo,
              procuracao: [{
                // @ts-expect-error importante apenas checar se existe ou não
                procuracaoAgregada: /** @type {Procuracoes.Procuracao['procuracaoAgregada']} */(true),
              }],
            })}
          >
            <Gerenciar
              procuracaoId={mockProcuracaoId}
              record={mockRecord}
            />
          </PesquisaItemAcordeaoContextWrapper>
        </PesquisasContext>
      </MemoryRouter>
    ), {
      preloadedState: {
        app: {
          authState: {
            isLoggedIn: true,
            token: 'mock token',
            sessionData: /** @type {import('hooks/useUsuarioLogado').UsuarioLogado} */ ({
              prefixo: usuarioPrefixo,
            })
          }
        }
      }
    });
  }

  async function checkForModal() {
    await userEvent.click(screen.getByRole('button', { name: /gerenciar/i }));
    expect(screen.getByRole('dialog', { name: /gerenciar/i })).toBeInTheDocument();
  }
});
