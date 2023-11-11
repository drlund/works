import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import uuidModule from 'uuid/v4';

import {
  getFluxoComIdFluxo,
  mockFluxoPublica,
} from 'pages/procuracoes/__mocks__/mockFluxos';
import { outorgadoComProcuracaoAgregada } from 'pages/procuracoes/innerComponents/AcordeaoProcuracoes/__mocks__/mockData';
import { doMockMinutaTemplate } from 'pages/procuracoes/innerComponents/MinutaTemplate/__mocks__/MinutaTemplateMock';
import {
  getButtonWithName,
  goToSecondStep,
  initialStepSelecionarDadosBasicos,
  startRender,
  stepSelecionarOutorgante,
} from 'pages/procuracoes/tests/utils';
import { FETCH_METHODS } from 'services/apis/GenericFetch';

import Minuta from '.';

let num = 0;
jest.mock('uuid/v4');
// @ts-ignore
// eslint-disable-next-line no-plusplus
uuidModule.mockImplementation(() => `randomUUID${num++}`);

globalThis.URL.createObjectURL = jest.fn(() => 'mock-url');

jest.mock('@react-pdf/renderer', () => ({
  Document: () => <div>Document</div>,
  Image: () => <div>Image</div>,
  Page: () => <div>Page</div>,
  PDFViewer: () => <div>PDF Viewer</div>,
  PDFDownloadLink: () => <div>PDFDownloadLink</div>,
  StyleSheet: { create: () => { } },
  Text: () => <div>Text</div>,
  View: () => <div>View</div>
}));

doMockMinutaTemplate();

describe('<MassificadoMinuta>', () => {
  const mockReturn = {
    F0000000: {
      test_matricula: 'F0000000',
      error: /** @type {string} */ (null),
      funci: {
        nome: 'mock funci ok',
        prefixoLotacao: 'mock prefixo ok',
        dependencia: {
          prefixo: 'mock dep prefixo ok',
          nome: 'mock dep nome ok',
          super: 'mock dep super ok',
          municipio: 'mock dep municipio ok',
          uf: 'mock dep uf ok'
        },
      },
    },
    F9999999: {
      test_matricula: 'F9999999',
      error: 'mock error no funci',
    },
    F1234567: {
      test_matricula: 'F1234567',
      error: 'mock error with funci',
      funci: {
        nome: 'mock funci error',
        prefixoLotacao: 'mock prefixo error',
        dependencia: {
          prefixo: 'mock dep prefixo error',
          nome: 'mock dep nome error',
          super: 'mock dep super error',
          municipio: 'mock dep municipio error',
          uf: 'mock dep uf error'
        },
      },
    },
    F1111111: {
      test_matricula: 'F1111111',
      error: /** @type {string} */ (null),
      funci: {
        nome: 'mock funci ok2',
        prefixoLotacao: 'mock prefixo ok2',
        dependencia: {
          prefixo: 'mock dep prefixo ok2',
          nome: 'mock dep nome ok2',
          super: 'mock dep super ok2',
          municipio: 'mock dep municipio ok2',
          uf: 'mock dep uf ok2'
        },
      },
    },
  };

  const mockFluxo = {
    idTemplate: 'mock id template',
    idFluxo: 'mock id fluxo',
    templateBase: 'mock template',
    createdAt: 'mock createdAt',
    ativo: 1,
  };

  beforeEach(async () => {
    await startRender(Minuta, { timesFetchIsCalled: 1 });

    globalThis.fetchSpy.mockResolvedValue(mockFluxo);

    await initialStepSelecionarDadosBasicos(() =>
      screen.getByTitle(mockFluxoPublica),
    );
    await goToSecondStep();
  });

  const stepNome = 1;
  const cardTitle = 1;
  const textAreaInput = 1;
  const textInput = 1;

  describe('the outorgado step', () => {
    it('render outorgado steps', async () => {
      expect(screen.getAllByText('Outorgado Massificado')).toHaveLength(
        stepNome + cardTitle,
      );
    });

    it('render the textarea and text input', async () => {
      expect(screen.getAllByRole('textbox')).toHaveLength(
        textAreaInput + textInput,
      );
    });

    it('render a card without outorgados', async () => {
      expect(
        screen.getByRole('heading', { name: /outorgados/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/nenhum outorgado ainda\.\.\./i),
      ).toBeInTheDocument();
    });

    it('render the proximo button disabled', async () => {
      expect(screen.getByRole('button', { name: /próximo/i })).toBeDisabled();
    });
  });

  describe('on adding a lista de matriculas', () => {
    beforeEach(async () => {
      // @ts-ignore
      globalThis.fetchSpy.mockResolvedValue(mockReturn);

      await userEvent.type(
        screen.getByPlaceholderText(/Lista de Matr/i),
        `funcionario ${Object.keys(mockReturn).join(' ')} {enter}`,
      );

      expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
        FETCH_METHODS.POST,
        'procuracoes/massificado/listaOutorgados',
        {
          idFluxo: getFluxoComIdFluxo(mockFluxoPublica).idFluxo,
          listaDeMatriculas: Object.keys(mockReturn).sort(),
        },
      );
    });

    const getRemoverButtons = () =>
      screen.getAllByRole('button', {
        name: /remover/i,
      });

    it('render remover buttons', async () => {
      expect(getRemoverButtons()).toHaveLength(Object.keys(mockReturn).length);
    });

    const funciOkHeader = `${mockReturn.F0000000.test_matricula} - ${mockReturn.F0000000.funci.nome}`;
    const getFunciOk = () => screen.queryByText(funciOkHeader);
    const funciErrorNoFunciHeader = `${mockReturn.F9999999.test_matricula}`;
    const getFunciErrorNoFunci = () =>
      screen.queryByText(funciErrorNoFunciHeader);
    const funciErrorComFunciHeader = `${mockReturn.F1234567.test_matricula} - ${mockReturn.F1234567.funci.nome}`;
    const getFunciErrorComFunci = () =>
      screen.queryByText(funciErrorComFunciHeader);

    it('render funcis', async () => {
      expect(getFunciOk()).toBeInTheDocument();
      expect(getFunciErrorNoFunci()).toBeInTheDocument();
      expect(getFunciErrorComFunci()).toBeInTheDocument();
    });

    it('render funcis in correct order', async () => {
      const removerButtonIsAlsoInItsOwnListMultiplier = 2;
      const listItems = screen
        .getAllByRole('listitem')
        .filter(
          (_, index) => index % removerButtonIsAlsoInItsOwnListMultiplier === 0,
        );
      expect(listItems).toHaveLength(Object.keys(mockReturn).length);

      expect(
        within(listItems[0]).getByText(funciErrorComFunciHeader),
      ).toBeInTheDocument();
      expect(
        within(listItems[1]).getByText(funciErrorNoFunciHeader),
      ).toBeInTheDocument();
      expect(within(listItems[2]).getByText(funciOkHeader)).toBeInTheDocument();
    });

    const totalFuncis = Object.keys(mockReturn).length;
    const funcisErr = Object.values(mockReturn).filter((f) =>
      Boolean(f.error),
    ).length;

    it('renders the correct totals', async () => {
      expect(
        screen.getByText(new RegExp(`total: ${totalFuncis}`, 'i')),
      ).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(`ok: ${totalFuncis - funcisErr}`, 'i')),
      ).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(`erro: ${funcisErr}`, 'i')),
      ).toBeInTheDocument();
    });

    const getProximoButton = () =>
      screen.getByRole('button', { name: /próximo/i });

    it('has the proximo button enabled', async () => {
      expect(getProximoButton()).toBeEnabled();
    });

    describe('on removing a funci', () => {
      const removedFunci = 1;

      beforeEach(async () => {
        await userEvent.click(getRemoverButtons()[1]);
      });

      it('renders one less funci', async () => {
        expect(getRemoverButtons()).toHaveLength(
          Object.keys(mockReturn).length - 1,
        );

        expect(getFunciOk()).toBeInTheDocument();
        expect(getFunciErrorComFunci()).toBeInTheDocument();
        expect(getFunciErrorNoFunci()).not.toBeInTheDocument();
      });

      it('updates the correct totals', async () => {
        expect(
          screen.getByText(
            new RegExp(`total: ${totalFuncis - removedFunci}`, 'i'),
          ),
        ).toBeInTheDocument();
        expect(
          screen.getByText(new RegExp(`ok: ${totalFuncis - funcisErr}`, 'i')),
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            new RegExp(`erro: ${funcisErr - removedFunci}`, 'i'),
          ),
        ).toBeInTheDocument();
      });

      describe('on moving to the next step', () => {
        beforeEach(async () => {
          await userEvent.click(getProximoButton());
        });

        it('moves to the next step', async () => {
          expect(screen.getAllByText('Outorgado Massificado')).toHaveLength(
            stepNome,
          );
        });

        describe('on selecting a outorgante', () => {
          beforeEach(async () => {
            await stepSelecionarOutorgante();
            await userEvent.click(
              screen.getByRole('button', { name: /confirmar seleção/i }),
            );
            await userEvent.click(getButtonWithName(/próximo/i));
          });

          it('renders the minuta step', async () => {
            expect(screen.getByRole('heading', { name: /minuta/i })).toBeInTheDocument();
            expect(screen.getByTestId('minutaTemplateMock')).toBeInTheDocument();
          });

          describe('on checking the minutas', () => {
            beforeEach(async () => {
              await userEvent.click(
                screen.getByRole('button', { name: /próximo/i }),
              );
            });

            it('renders the next step', async () => {
              expect(
                screen.getByRole('heading', {
                  name: /finalizar massificado de minuta/i,
                }),
              ).toBeInTheDocument();
            });

            describe('in the finalizar etapa', () => {
              it('renders the outorgante section', async () => {
                expect(screen.getByRole('heading', {
                  name: /outorgante/i
                })).toBeInTheDocument();

                screen.getByRole('heading', {
                  name: `${outorgadoComProcuracaoAgregada.matricula} - ${outorgadoComProcuracaoAgregada.nome}`
                });
              });

              it('renders the errors section', async () => {
                expect(screen.getByRole('heading', {
                  name: /outorgados ignorados \(com erros\)/i
                })).toBeInTheDocument();

                const errList = screen.getAllByRole('list')[0];
                const errListItems = within(errList).getAllByRole('listitem');
                expect(errListItems).toHaveLength(funcisErr - removedFunci);
              });

              it('renders the outorgados & minutas section', async () => {
                expect(screen.getByRole('heading', {
                  name: /outorgados & minutas/i
                })).toBeInTheDocument();

                expect(screen.getByTestId('minutaTemplateMock')).toBeInTheDocument();
              });
            });

            describe('on clicking to finish batch', () => {
              beforeEach(async () => {
                await userEvent.click(getButtonWithName(/registrar lote de minutas/i));
                await waitFor(() => {
                  expect(screen.queryByText(/registrando lote de minutas/i)).not.toBeInTheDocument();
                });
              });

              it('calls the api', async () => {
                expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
                  FETCH_METHODS.POST,
                  'procuracoes/massificado/minuta/finalizar',
                  expect.objectContaining({
                    dadosMinuta: {
                      ativo: 1,
                      createdAt: "mock createdAt",
                      customData: {
                        cartorio: {
                          monthToday: Intl.DateTimeFormat('pt-br', { month: 'long' }).format(new Date()),
                          dayToday: new Date().getDate(),
                          yearToday: new Date().getFullYear(),
                        }
                      },
                      idFluxo: "mock id fluxo",
                      idMinuta: expect.stringContaining("randomUUID"),
                      idTemplate: "mock id template",
                      massificado: {
                        F0000000: {
                          diffs: expect.stringContaining("Index: diff"),
                          idMinuta: expect.stringContaining("randomUUID"),
                          isValid: true,
                          template: "mock template"
                        },
                        F1111111: {
                          diffs: expect.stringContaining("Index: diff"),
                          idMinuta: expect.stringContaining("randomUUID"),
                          isValid: true,
                          template: "mock template"
                        },
                        hasError: [],
                        numberOfValid: 2
                      },
                      templateBase: "mock template"
                    },
                    outorgadoMassificado: {
                      fetchingMatriculas: {},
                      listaDeMatriculas: [
                        "F0000000",
                        "F1111111",
                        "F1234567"
                      ],
                      outorgados: {
                        F0000000: {
                          dependencia: {
                            prefixo: 'mock dep prefixo ok',
                            nome: 'mock dep nome ok',
                            super: 'mock dep super ok',
                            municipio: 'mock dep municipio ok',
                            uf: 'mock dep uf ok',
                          },
                          error: null,
                          matricula: "F0000000",
                          nome: "mock funci ok",
                          prefixoLotacao: "mock prefixo ok"
                        },
                        F1111111: {
                          dependencia: {
                            prefixo: 'mock dep prefixo ok2',
                            nome: 'mock dep nome ok2',
                            super: 'mock dep super ok2',
                            municipio: 'mock dep municipio ok2',
                            uf: 'mock dep uf ok2'
                          },
                          error: null,
                          matricula: "F1111111",
                          nome: "mock funci ok2",
                          prefixoLotacao: "mock prefixo ok2"
                        },
                        F1234567: {
                          dependencia: {
                            prefixo: 'mock dep prefixo error',
                            nome: 'mock dep nome error',
                            super: 'mock dep super error',
                            municipio: 'mock dep municipio error',
                            uf: 'mock dep uf error'
                          },
                          error: "mock error with funci",
                          matricula: "F1234567",
                          nome: "mock funci error",
                          prefixoLotacao: "mock prefixo error"
                        },
                        F9999999: {
                          error: "mock error no funci",
                          matricula: "F9999999"
                        }
                      },
                      uuidMatriculas: {
                        F0000000: expect.stringContaining("randomUUID"),
                        F1111111: expect.stringContaining("randomUUID"),
                        F1234567: expect.stringContaining("randomUUID"),
                        F9999999: expect.stringContaining("randomUUID"),
                      },
                    },
                    poderes: {
                      outorganteSelecionado: {
                        idProcuracao: 2,
                        idProxy: null,
                        matricula: "F1111112",
                        nome: "Teste2",
                        subsidiariasSelected: [1, 2, 3]
                      },
                      outorgantes: [{
                        ativo: 1,
                        cargoNome: "cargoNome teste2",
                        cpf: "cpf teste2",
                        dataNasc: "dataNasc teste2",
                        estadoCivil: "estadoCivil teste2",
                        idProcuracao: 2,
                        idProxy: null,
                        matricula: "F1111112",
                        municipio: "municipio teste2",
                        nome: "Teste2",
                        prefixo: "prefixo teste2",
                        procuracao: [{
                          outorgado: {
                            cargo: "cargo teste2.1",
                            cpf: "cpf teste2.1",
                            endereco: "endereço teste2.1",
                            estadoCivil: "estadoCivil teste2.1",
                            matricula: "F1111121",
                            municipio: "municipio teste2.1",
                            nome: "nome teste2.1",
                            prefixo: "prefixo teste2.1",
                            rg: "rg teste2.1",
                            uf: "uf teste2.1"
                          },
                          procuracaoAgregada: {
                            cartorio: "cartorio teste2",
                            cartorioId: 2,
                            doc: "teste2",
                            emissao: "2022-05-23",
                            folha: "folha teste2",
                            livro: "livro teste2",
                            manifesto: "2022-05-23",
                            procuracaoAtiva: 1,
                            procuracaoId: 40,
                            vencimento: "2021-12-01"
                          },
                          subsidiarias: [{
                            cnpj: "04740876000125",
                            id: 1,
                            nome: "BB",
                            nome_completo: "BANCO DO BRASIL S.A.",
                            subAtivo: 1
                          }, {
                            cnpj: "31591399000156",
                            id: 2,
                            nome: "BB CARTOES",
                            nome_completo: "BB ADMINISTRADORA DE CARTOES DE CREDITO S.A.",
                            subAtivo: 1
                          }, {
                            cnpj: "24933830000130",
                            id: 3,
                            nome: "BB CONSÓRCIOS",
                            nome_completo: "BB CONSÓRCIOS S.A.",
                            subAtivo: 1
                          }]
                        }],
                        rg: "rg teste2",
                        uf: "uf teste2"
                      }]
                    },
                    tipoFluxo: {
                      fluxo: "PUBLICA",
                      idFluxo: "9bca0a03-9b9e-454c-a6a1-b963942fc25c",
                      minuta: "2º Nível Gerencial UT (Gerente de Negócios ou Administração) | Pública"
                    }
                  }),
                  { 'Content-Type': 'application/json' },
                );
              });

              it('creates a different id for each of the massificado and outorgados', async () => {
                // eslint-disable-next-line no-unused-vars
                const [_method, _path, body, _header] = globalThis.fetchSpy.mock.lastCall;
                const massificadoId = body.dadosMinuta.idMinuta;
                const minutasId = Object.values(body.dadosMinuta.massificado)
                  .map(x => x?.idMinuta)
                  .filter(Boolean);

                const allIds = [massificadoId, ...minutasId];
                const idSet = new Set(allIds);
                expect(idSet.size).toEqual(allIds.length);
              });

              it('renders the baixar minuta step', async () => {
                await waitFor(() => {
                  expect(screen.getByRole('heading', {
                    name: /baixar minuta/i,
                    level: 2
                  })).toBeInTheDocument();
                });
                expect(screen.getByText('Download da Lista para Cartório')).toBeInTheDocument();
                expect(screen.getByText('PDFDownloadLink')).toBeInTheDocument();
                expect(screen.getByText('PDF Viewer')).toBeInTheDocument();
              });
            });
          });
        });
      });
    });
  });
});
