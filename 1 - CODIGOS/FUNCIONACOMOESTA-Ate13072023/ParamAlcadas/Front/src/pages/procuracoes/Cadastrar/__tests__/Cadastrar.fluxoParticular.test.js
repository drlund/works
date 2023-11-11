// @ts-nocheck
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import cloneDeep from 'lodash.clonedeep';
import {
  outorgadoComProcuracaoAgregada,
  outorgadoComProcuracaoCompleta,
  outorgadoComProcuracaoNaoAgregada,
  outorgadoSemProcuracao
} from 'pages/procuracoes/innerComponents/AcordeaoProcuracoes/__mocks__/mockData';
import { dateToBRTimezoneString } from 'utils/dateToBRTimezoneString';
import Cadastrar from '..';
import { mockFormData } from '../../../../../test/antdTestUtils/mockFormData';
import { FETCH_METHODS } from '../../../../services/apis/GenericFetch';
import { getFluxoComIdFluxo, mockFluxoParticular } from '../../__mocks__/mockFluxos';
import { mockOutorgadoDemaisGerentes } from '../../__mocks__/mockOutorgado';
import { tiposEtapa } from '../../innerComponents/FluxosProcuracao/Etapas/DadosProcuracao/tiposEtapa';
import {
  finalStepSalvarProcuracao,
  getButtonWithName,
  goToSecondStep,
  initialStepSelecionarDadosBasicos,
  preStepProcurarOutorgado,
  preStepSelecionarOutorgante,
  startRender,
  stepPreencherProcuracao,
  stepProcurarOutorgado,
  stepSelecionarOutorgante,
} from '../../tests/utils';

describe('<Cadastrar> - after choosing fluxo particular', () => {
  beforeEach(async () => {
    await startRender(Cadastrar);

    await initialStepSelecionarDadosBasicos(() => screen.getByTitle(mockFluxoParticular));

    await goToSecondStep();

    await waitFor(() => {
      expect(screen.getByText('Enviar arquivo')).toBeInTheDocument();
    });
  });

  it('renders the procuracao step', async () => {
    expect(screen.getByText(/data de emissão/i)).toBeInTheDocument();
    expect(screen.getByText(/data de vencimento/i)).toBeInTheDocument();
    expect(screen.queryByText(/livro/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/folha/i)).not.toBeInTheDocument();
    expect(screen.getByText('Arquivo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Link do documento')).toBeInTheDocument();
  });

  describe('after filling the procuração form', () => {
    beforeEach(async () => {
      await stepPreencherProcuracao(tiposEtapa.particular);
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

          const vencimentoBR = dateToBRTimezoneString(vencimento)

          beforeEach(async () => {
            await stepSelecionarOutorgante();
          });

          it('calls the api for the outorgante', () => {
            expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(FETCH_METHODS.POST, '/procuracoes/pesquisa', { pesquisa: 'F1690528', maisRecente: false });
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

          describe('when the user clicks on the selecionar button', () => {
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

            describe('when moving to the final step', () => {
              beforeEach(async () => {
                await userEvent.click(getButtonWithName('Próximo'));

                await waitFor(() => {
                  expect(screen.queryByRole('heading', { name: /poderes\(s\) selecionado\(s\)/i })).not.toBeInTheDocument();
                });
              });

              it('renders the final step', () => {
                expect(screen.getByRole('heading', { name: /finalizar cadastramento/i })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: /registrar cadastro/i })).toBeInTheDocument();
              });

              describe('when clicking to finish the registration', () => {
                beforeEach(async () => {
                  mockFormData();
                  await finalStepSalvarProcuracao();
                });

                it('calls the api to register the procuração', async () => {
                  expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
                    FETCH_METHODS.POST,
                    'procuracoes/cadastro/cadastrar-procuracao',
                    expect.objectContaining({
                      formData: {
                        matriculaOutorgado: mockOutorgadoDemaisGerentes.matricula,
                        poderes: JSON.stringify({
                          matricula: outorgadoComProcuracaoAgregada.matricula,
                          nome: outorgadoComProcuracaoAgregada.nome,
                          idProcuracao: outorgadoComProcuracaoAgregada.idProcuracao,
                          idProxy: outorgadoComProcuracaoAgregada.idProxy,
                          subsidiariasSelected: subsidiarias.map((s) => s.id)
                        }),
                        tipoFluxo: JSON.stringify(getFluxoComIdFluxo(mockFluxoParticular)),
                        dadosProcuracao: JSON.stringify({
                          dataEmissao: '2020-03-20',
                          dataVencimento: '2023-03-20',
                          custo: 1,
                          superCusto: 1,
                          zerarCusto: 0,
                          prefixoCusto: 1,
                        }),
                        urlDocumento: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
                      }
                    }),
                    { headers: { 'Content-Type': 'multipart/form-data; boundary=12345678912345678;' } }
                  );
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

              describe('when moving to the final step', () => {
                beforeEach(async () => {
                  await userEvent.click(getButtonWithName('Próximo'));

                  await waitFor(() => {
                    expect(screen.queryByRole('heading', { name: /poderes\(s\) selecionado\(s\)/i })).not.toBeInTheDocument();
                  });
                });

                it('renders the final step', () => {
                  expect(screen.getByRole('heading', { name: /finalizar cadastramento/i })).toBeInTheDocument();
                  expect(screen.getByRole('button', { name: /registrar cadastro/i })).toBeInTheDocument();
                });

                describe('when clicking to finish the registration', () => {
                  beforeEach(async () => {
                    mockFormData();
                    await finalStepSalvarProcuracao();
                  });

                  it('calls the api to register the procuração', async () => {
                    expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
                      FETCH_METHODS.POST,
                      'procuracoes/cadastro/cadastrar-procuracao',
                      expect.objectContaining({
                        formData: {
                          matriculaOutorgado: mockOutorgadoDemaisGerentes.matricula,
                          poderes: JSON.stringify({
                            matricula: outorgadoSemProcuracao.matricula,
                            nome: outorgadoSemProcuracao.nome,
                            idProcuracao: outorgadoSemProcuracao.idProcuracao,
                            idProxy: outorgadoSemProcuracao.idProxy,
                            subsidiariasSelected: subsidiarias.map((s) => s.id)
                          }),
                          tipoFluxo: JSON.stringify(getFluxoComIdFluxo(mockFluxoParticular)),
                          dadosProcuracao: JSON.stringify({
                            dataEmissao: '2020-03-20',
                            dataVencimento: '2023-03-20',
                            custo: 1,
                            superCusto: 1,
                            zerarCusto: 0,
                            prefixoCusto: 1,
                          }),
                          urlDocumento: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
                        }
                      }),
                      { headers: { 'Content-Type': 'multipart/form-data; boundary=12345678912345678;' } }
                    );
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
