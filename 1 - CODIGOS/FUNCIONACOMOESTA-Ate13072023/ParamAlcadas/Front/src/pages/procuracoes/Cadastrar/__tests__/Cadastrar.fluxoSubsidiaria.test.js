import { screen } from '@testing-library/react';
import Cadastrar from '..';
import { mockFormData } from '../../../../../test/antdTestUtils/mockFormData';
import { FETCH_METHODS } from '../../../../services/apis/GenericFetch';
import { mockCartorios } from '../../__mocks__/mockCartorios';
import { getFluxoComIdFluxo, mockFluxoSubsidiaria } from '../../__mocks__/mockFluxos';
import { mockOutorgadoSuperintendente } from '../../__mocks__/mockOutorgado';
import { mockSubsidiarias } from '../../__mocks__/mockSubsidiarias';
import {
  finalStepSalvarProcuracao,
  initialStepSelecionarDadosBasicos,
  preStepPreencherProcuracao,
  preStepProcurarOutorgado,
  preStepSelecionarSubsidiarias,
  goToSecondStep,
  startRender,
  stepPreencherProcuracao,
  stepProcurarOutorgado,
  stepSelecionarCartorio,
  stepSelecionarSubsidiaria
} from '../../tests/utils';

describe('<Cadastrar> - after choosing fluxo subsidiaria', () => {
  describe('after filling the procuração form', () => {
    describe('after selecting outorgado', () => {
      describe('after selecting a subsidiaria', () => {
        describe('when clicking to finish the registration', () => {
          beforeEach(async () => {
            await startRender(Cadastrar);

            await initialStepSelecionarDadosBasicos(
              () => screen.getByTitle(mockFluxoSubsidiaria)
            );

            globalThis.fetchSpy.mockResolvedValue(mockCartorios);
            await goToSecondStep();

            await stepSelecionarCartorio();

            await preStepPreencherProcuracao();
            await stepPreencherProcuracao();

            await preStepProcurarOutorgado();
            await stepProcurarOutorgado('F8718628', mockOutorgadoSuperintendente);

            await preStepSelecionarSubsidiarias();
            await stepSelecionarSubsidiaria();

            mockFormData();
            await finalStepSalvarProcuracao();
          });

          it('calls the api to register the procuração', async () => {
            expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
              FETCH_METHODS.POST,
              'procuracoes/cadastro/cadastrar-procuracao',
              expect.objectContaining({
                formData: {
                  matriculaOutorgado: mockOutorgadoSuperintendente.matricula,
                  idSubsidiaria: String(mockSubsidiarias[0].id),
                  tipoFluxo: JSON.stringify(getFluxoComIdFluxo(mockFluxoSubsidiaria)),
                  idCartorio: String(mockCartorios[0].id),
                  dadosProcuracao: JSON.stringify({
                    dataEmissao: '2020-03-20',
                    dataVencimento: '2023-03-20',
                    custo: 1,
                    superCusto: 1,
                    zerarCusto: 0,
                    prefixoCusto: 1,
                    dataManifesto: '2023-03-20',
                    folha: '1',
                    livro: '1',
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
