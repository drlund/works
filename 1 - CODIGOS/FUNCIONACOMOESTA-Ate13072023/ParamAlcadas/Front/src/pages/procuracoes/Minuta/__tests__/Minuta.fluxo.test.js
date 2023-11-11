// @ts-nocheck
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createPatch } from 'diff';
import cloneDeep from 'lodash.clonedeep';
import uuidModule from 'uuid/v4';

import {
  outorgadoComProcuracaoAgregada,
  outorgadoComProcuracaoCompleta,
  outorgadoComProcuracaoNaoAgregada,
  outorgadoSemProcuracao
} from 'pages/procuracoes/innerComponents/AcordeaoProcuracoes/__mocks__/mockData';
import { FETCH_METHODS } from 'services/apis/GenericFetch';

import { dateToBRTimezoneString } from 'utils/dateToBRTimezoneString';
import Minuta from '..';
import { getFluxoComIdFluxo, mockFluxoParticular } from '../../__mocks__/mockFluxos';
import { mockOutorgadoDemaisGerentes } from '../../__mocks__/mockOutorgado';
import {
  getButtonWithName,
  goToSecondStep,
  initialStepSelecionarDadosBasicos,
  preStepProcurarOutorgado,
  preStepSelecionarOutorgante,
  startRender,
  stepProcurarOutorgado,
  stepConfirmarSalvarMinuta,
  stepSelecionarOutorgante
} from '../../tests/utils';
import { doMockMinutaTemplate, templateAfterMock } from '../../innerComponents/MinutaTemplate/__mocks__/MinutaTemplateMock';
import { templateMock } from '../__mocks__/templateMock';

jest.mock('uuid/v4');
uuidModule.mockImplementation(() => 'randomUUID');

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

// both particular and publico have the same fluxo
describe('<Minuta> - after choosing a fluxo', () => {
  const forFluxos = 1;
  const forListaMinuta = 1;

  beforeEach(async () => {
    await startRender(Minuta, {
      timesFetchIsCalled: forFluxos + forListaMinuta,
    });

    globalThis.fetchSpy.mockResolvedValue(templateMock);

    await initialStepSelecionarDadosBasicos(() => screen.getByTitle(mockFluxoParticular));

    await goToSecondStep();

    await preStepProcurarOutorgado();
  });

  it('renders the outorgado step', async () => {
    expect(screen.getByText(/utilize o campo abaixo para buscar o funcionário através do número da matrícula\./i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/matrícula/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  describe('after searching for a outorgado', () => {
    beforeEach(async () => {
      await stepProcurarOutorgado('F6173159', mockOutorgadoDemaisGerentes);
    });

    it('calls the search api', () => {
      expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(FETCH_METHODS.GET, 'procuracoes/cadastro/pesquisar-outorgado', {
        idFluxo: getFluxoComIdFluxo(mockFluxoParticular).idFluxo,
        termoPesquisa: 'F6173159'
      });
    });

    describe('after selecting a outorgado', () => {
      beforeEach(async () => {
        await preStepSelecionarOutorgante();
      });

      it('renders the outorgante step', async () => {
        expect(screen.getByText(/informe a matrícula, nome do funcionário ou prefixo desejado para pesquisar/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/número do prefixo, matrícula ou nome/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /search buscar/i })).toBeInTheDocument();
      });

      describe('after searching for a outorgante', () => {
        const { subsidiarias, procuracaoAgregada: { vencimento } } = outorgadoComProcuracaoAgregada.procuracao[0];
        const vencimentoBR = dateToBRTimezoneString(vencimento);

        beforeEach(async () => {
          await stepSelecionarOutorgante();
        });

        it('calls the api for the outorgante', () => {
          expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(FETCH_METHODS.POST, '/procuracoes/pesquisa', { pesquisa: 'F1690528', maisRecente: true });
        });

        it('renders the list of procuracoes of outorgante', async () => {
          expect(screen.getAllByRole('checkbox')).toHaveLength(subsidiarias.length);
          subsidiarias.forEach((sub) => {
            expect(screen.getByRole('checkbox', { name: `${sub.nome} (${vencimentoBR})` })).toBeInTheDocument();
          });
        });

        it('dont renders the proximo button', () => {
          expect(screen.queryByRole('button', { name: /próximo/i })).not.toBeInTheDocument();
        });

        describe('when the user clicks on the selecionar outorgante button', () => {
          beforeEach(async () => {
            await userEvent.click(screen.getAllByRole('button', { name: /confirmar seleção/i })[0]);
          });

          it('disables the checkboxes', () => {
            subsidiarias.forEach((sub) => {
              expect(screen.getByRole('checkbox', { name: `${sub.nome} (${vencimentoBR})` })).toBeDisabled();
            });
          });

          it('renders the proximo button', () => {
            expect(getButtonWithName(/próximo/i)).toBeInTheDocument();
          });

          describe('after selecting an outorgante', () => {
            beforeEach(async () => {
              await userEvent.click(getButtonWithName('Próximo'));

              await waitFor(() => {
                expect(screen.queryByRole('heading', { name: /poderes\(s\) selecionado\(s\)/i })).not.toBeInTheDocument();
              });
            });

            it('renders the minuta step', () => {
              expect(screen.getByRole('heading', { name: /Minuta/i })).toBeInTheDocument();

              expect(screen.getByTestId('minutaTemplateMock')).toBeInTheDocument();

              expect(getButtonWithName('Próximo')).toBeEnabled();
            });

            it('calls the MinutaTemplate with the correct parameters', () => {
              expect(screen.getByText('editable: true')).toBeInTheDocument();
              expect(screen.getByText('mock template')).toBeInTheDocument();
            });

            describe('after going to the finalizar minuta step', () => {
              beforeEach(async () => {
                await userEvent.click(getButtonWithName('Próximo'));
              });

              it('renders finalizar minuta', () => {
                expect(screen.getByRole('heading', { name: /finalizar minuta/i })).toBeInTheDocument();
                expect(getButtonWithName('Registrar Minuta')).toBeInTheDocument();
                expect(screen.getByRole('heading', { name: /outorgado/i, level: 3 })).toBeInTheDocument();
                expect(screen.getByRole('heading', { name: /outorgante/i, level: 3 })).toBeInTheDocument();
                expect(screen.getByRole('heading', { name: /minuta/i, level: 3 })).toBeInTheDocument();
              });

              it('calls the MinutaTemplate with the correct parameters', () => {
                expect(screen.getByText(templateAfterMock)).toBeInTheDocument();
              });

              describe('when clicking to finish the registration', () => {
                beforeEach(async () => {
                  await userEvent.click(getButtonWithName(/registrar minuta/i));
                });

                describe('confirmation modal', () => {
                  it('renders the confirm modal', async () => {
                    expect(screen.getByRole('dialog', { name: 'Atenção' })).toBeInTheDocument();
                  });

                  it('has a checkbox', async () => {
                    expect(screen.getByRole('checkbox', {
                      name: /estou de acordo com os termos acima e me comprometo a fazer o upload do substabelecimento de procuração assinado\./i
                    })).toBeInTheDocument();
                  });

                  it('renders confirm button disabled', async () => {
                    expect(screen.getByRole('button', {
                      name: /finalizar cadastro de minuta/i
                    })).toBeDisabled();
                  });

                  describe('when checking the checkbox', () => {
                    beforeEach(async () => {
                      await userEvent.click(screen.getByRole('checkbox', {
                        name: /estou de acordo com os termos acima e me comprometo a fazer o upload do substabelecimento de procuração assinado\./i
                      }));
                    });

                    it('renders confirm button enabled', async () => {
                      expect(screen.getByRole('button', {
                        name: /finalizar cadastro de minuta/i
                      })).toBeEnabled();
                    });
                  });
                });

                describe('when clicking confirmar in the modal', () => {
                  beforeEach(async () => {
                    await stepConfirmarSalvarMinuta();
                  });

                  it('calls the api to register the procuração', async () => {
                    expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
                      FETCH_METHODS.POST,
                      'procuracoes/minutas',
                      {
                        dadosMinuta: {
                          ...templateMock,
                          template: templateAfterMock,
                          idMinuta: 'randomUUID',
                          diffs: createPatch('diff', templateMock.templateBase, templateAfterMock),
                          customData: {
                            cartorio: {
                              monthToday: Intl.DateTimeFormat('pt-br', { month: 'long' }).format(new Date()),
                              dayToday: new Date().getDate(),
                              yearToday: new Date().getFullYear(),
                            }
                          }
                        },
                        outorgado: mockOutorgadoDemaisGerentes,
                        poderes: {
                          outorgantes: [outorgadoComProcuracaoAgregada],
                          outorganteSelecionado: {
                            idProcuracao: outorgadoComProcuracaoAgregada.idProcuracao,
                            idProxy: outorgadoComProcuracaoAgregada.idProxy,
                            nome: outorgadoComProcuracaoAgregada.nome,
                            matricula: outorgadoComProcuracaoAgregada.matricula,
                            subsidiariasSelected: subsidiarias.map((s) => s.id),
                          },
                        },
                        tipoFluxo: getFluxoComIdFluxo(mockFluxoParticular),
                      },
                      { 'Content-Type': 'application/json' }
                    );
                  });

                  it('renders the baixar minuta step', async () => {
                    expect(screen.getByRole('heading', {
                      name: /baixar minuta/i,
                      level: 2
                    })).toBeInTheDocument();
                    expect(screen.getByText('PDFDownloadLink')).toBeInTheDocument();
                    expect(screen.getByText('PDF Viewer')).toBeInTheDocument();
                  });
                });
              });
            });
          });
        });
      });

      describe('after searching for a outorgante with multiple results', () => {
        const { subsidiarias } = outorgadoComProcuracaoNaoAgregada.procuracao[0];
        const firstTabHeader = 'F1111140 - Teste4 (cargoNome teste4)';
        const secondTabHeader = 'F1111111 - Teste1 (cargoNome teste1)';

        beforeEach(async () => {
          await stepSelecionarOutorgante(cloneDeep([
            outorgadoComProcuracaoCompleta,
            outorgadoSemProcuracao
          ]));
        });

        it('renders two tabs', async () => {
          expect(screen.getAllByRole('tab')).toHaveLength(2);
        });

        it('renders one tabpanel', async () => {
          // eslint-disable-next-line jest-dom/prefer-in-document
          expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
        });

        it('renders the header for the first procuracao', async () => {
          expect(screen.getByText(firstTabHeader)).toBeInTheDocument();
        });

        it('renders the header for the second procuracao', async () => {
          expect(screen.getByText(secondTabHeader)).toBeInTheDocument();
        });

        it('dont renders the proximo button', () => {
          expect(screen.queryByRole('button', { name: /próximo/i })).not.toBeInTheDocument();
        });

        describe('when clicking the second tab', () => {
          beforeEach(async () => {
            globalThis.fetchSpy
              .mockResolvedValue(cloneDeep(outorgadoComProcuracaoNaoAgregada.procuracao));

            await userEvent.click(screen.getByText(secondTabHeader));
          });

          describe('when the user clicks on the selecionar button', () => {
            beforeEach(async () => {
              await userEvent.click(screen.getAllByRole('button', { name: /confirmar seleção/i })[0]);
            });

            it('disables the checkboxes', () => {
              subsidiarias.forEach((sub) => {
                expect(screen.getByRole('checkbox', { name: `${sub.nome} (${dateToBRTimezoneString(sub.vencimento)})` })).toBeDisabled();
              });
            });

            it('renders the proximo button', () => {
              expect(getButtonWithName(/próximo/i)).toBeInTheDocument();
            });
          });
        });
      });
    });
  });
});
