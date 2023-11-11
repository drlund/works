import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment';
import { PesquisasContext } from 'pages/procuracoes/Pesquisar/PesquisaContext';
import { ProcuracaoFlags } from 'pages/procuracoes/hooks/ProcuracaoFlags';
import { MemoryRouter } from 'react-router-dom';
import { FETCH_METHODS } from 'services/apis/GenericFetch';
import { Gerenciar } from '.';
import { mockFormData, renderWithRedux } from '../../../../../../../../test/test-utils';
import { PesquisaItemAcordeaoContextWrapper } from '../../PesquisaItemAcordeaoContext';

jest.setTimeout(60000);

describe('Pesquisa/<Gerenciar>', () => {
  const mockProcuracaoId = 99;
  const mockRecord = /** @type {import('../../../helpers/extractAcordeaoItemData').ExtractedDataSourceUnion} */({
    cartorioId: 999
  });
  const mockPrefixo = '9999';

  beforeEach(() => {
    jest.useFakeTimers({ advanceTimers: true });
  });

  afterEach(async () => {
    await act(() => {
      jest.runAllTimers();
    });
    jest.useRealTimers();
  });

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
                idSolicitacao: String(null),
                prefixoCusto: mockPrefixo,
                superCusto: "1",
                zerarCusto: "0",
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
              idSolicitacao: null,
              prefixoCusto: mockPrefixo,
              superCusto: 1,
              zerarCusto: 0,
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
                idSolicitacao: String(null),
                prefixoCusto: mockPrefixo,
                superCusto: "0",
                zerarCusto: "0",
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
              idSolicitacao: null,
              prefixoCusto: mockPrefixo,
              superCusto: 0,
              zerarCusto: 0,
            },
          );
        });
      });
    });
  });

  describe('super vision/<RevogacaoForm>', () => {
    beforeEach(async () => {
      baseRender({
        usuarioPrefixo: '9009',
      });

      await checkForModal();
    });

    it('renders the revogacao form', async () => {
      expect(screen.getByRole('heading', {
        name: /revogação/i
      })).toBeInTheDocument();
    });

    describe('revogacao form', () => {
      const inRevogacaoForm = () => within(screen.getByTestId('revogacao-form'));

      it('renders data do revogacao de assinaturas', async () => {
        expect(inRevogacaoForm().getByRole('textbox', {
          name: /data da revogação/i
        })).toHaveValue(moment().format('DD/MM/YYYY'));
      });

      it('renders valor de emissão', async () => {
        expect(inRevogacaoForm().getByRole('spinbutton', { name: /valor/i })).toBeInTheDocument();
      });

      it('renders prefixo de custo', async () => {
        expect(screen.getByRole('spinbutton', { name: /dependência/i })).toBeInTheDocument();
      });

      it('renders the super custo checkbox', async () => {
        expect(inRevogacaoForm().getByRole('checkbox', {
          name: /valores a serem gerenciados pela super/i
        })).toBeInTheDocument();
      });

      it('renders upload button', async () => {
        expect(inRevogacaoForm().getByText(/enviar revogação/i)).toBeInTheDocument();
      });

      it('has the confirmar button disabled', async () => {
        expect(inRevogacaoForm().getByRole('button', {
          name: /confirmar revogação/i
        })).toBeDisabled();
      });

      describe('on filling the form', () => {
        beforeEach(async () => {
          await userEvent.upload(inRevogacaoForm().getByTestId('uploadRevogacao'), new File(['mock'], 'manifesto.pdf'));

          await waitFor(() => {
            expect(inRevogacaoForm().getByRole('button', {
              name: /confirmar revogação/i
            })).toBeEnabled();
          });

          await userEvent.click(inRevogacaoForm().getByRole('button', {
            name: /confirmar revogação/i
          }));
        });

        it('posts a revogacao', async () => {
          expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
            FETCH_METHODS.POST,
            'procuracoes/gerenciar/revogacao',
            expect.objectContaining({
              formData: {
                arquivoProcuracao: expect.objectContaining({
                  uid: expect.stringContaining("rc-upload"),
                }),
                cartorioId: String(mockRecord.cartorioId),
                custo: "31.4",
                dataRevogacao: expect.stringContaining(moment().format('YYYY-MM-DD')),
                idProcuracao: String(mockProcuracaoId),
                idSolicitacao: String(null),
                prefixoCusto: mockPrefixo,
                superCusto: "1",
                zerarCusto: "0",
              }
            }),
            {
              headers: { "Content-Type": "multipart/form-data; boundary=12345678912345678;" }
            }
          );
        });
      });
    });
  });

  function baseRender({
    prefixosComAcessoEspecial = [mockPrefixo, '9009'],
    outorgadoPrefixo = mockPrefixo,
    usuarioPrefixo = mockPrefixo,
    initialEntry = `/?flag=${ProcuracaoFlags.controleCusto}`
  } = {}) {
    mockFormData();
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
