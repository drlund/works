import { screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { mockCartorios } from 'pages/procuracoes/__mocks__/mockCartorios';
import { tiposEtapa } from 'pages/procuracoes/innerComponents/FluxosProcuracao/Etapas/DadosProcuracao/tiposEtapa';
import { FETCH_METHODS } from 'services/apis/GenericFetch';

import { CadastrarContinue } from '..';
import { regenerateParticularMock, regeneratePublicaMock } from '../../__mocks__/regenerateMinutaMock';
import {
  finalStepSalvarProcuracao, preStepPreencherProcuracao,
  startRender, stepPreencherProcuracao, stepSelecionarCartorio
} from '../../tests/utils';
import { mockFormData } from '../../../../../test/antdTestUtils';

describe('<CadastrarContinue>', () => {
  it('regenerate minuta particular', async () => {
    await startRender(CadastrarContinue, {
      beforeRender: () => {
        globalThis.permissionHookMock.mockReturnValue(true);
        globalThis.fetchSpy.mockResolvedValue(regenerateParticularMock);
      },
      initialEntries: ['minutaID'],
      routePath: ':idMinuta',
      timesFetchIsCalled: 1,
    });

    // renders the helper header
    expect(screen.getByRole('heading', {
      name: 'Procuração Particular',
      level: 2
    })).toBeInTheDocument();

    // after moving to the last step
    await stepPreencherProcuracao(tiposEtapa.particular);

    // render the finalizar header
    screen.getByRole('heading', {
      name: /finalizar cadastramento/i,
      level: 2
    });

    // when clicking to save
    mockFormData();
    await finalStepSalvarProcuracao();

    // calls the api to register the procuração
    expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
      FETCH_METHODS.POST,
      'procuracoes/cadastro/cadastrar-procuracao',
      expect.objectContaining({
        formData: {
          matriculaOutorgado: regenerateParticularMock.outorgado.matricula,
          poderes: JSON.stringify(regenerateParticularMock.poderes.outorganteSelecionado),
          tipoFluxo: JSON.stringify(regenerateParticularMock.tipoFluxo),
          idMinutaCadastrada: regenerateParticularMock.minutaCadastrada.idMinuta,
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

  it('regenerate minuta pública', async () => {
    await startRender(CadastrarContinue, {
      beforeRender: () => {
        globalThis.permissionHookMock.mockReturnValue(true);
        globalThis.fetchSpy
          .mockResolvedValueOnce(regeneratePublicaMock)
          .mockResolvedValue(mockCartorios);
      },
      initialEntries: ['minutaID'],
      routePath: ':idMinuta',
      timesFetchIsCalled: 2,
    });

    // renders the cartorio header
    expect(screen.getByRole('heading', {
      name: 'Cartório',
      level: 2
    })).toBeInTheDocument();

    // after selecting a cartorio
    await stepSelecionarCartorio();
    await preStepPreencherProcuracao();

    // render the procuração header
    expect(screen.getByRole('heading', {
      name: 'Procuração Pública',
      level: 2
    })).toBeInTheDocument();

    // after moving to the last step
    await stepPreencherProcuracao();

    // render the finalizar header
    screen.getByRole('heading', {
      name: /finalizar cadastramento/i,
      level: 2
    });

    // when clicking to save
    mockFormData();
    await finalStepSalvarProcuracao();

    // calls the api to register the procuração
    expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(
      FETCH_METHODS.POST,
      'procuracoes/cadastro/cadastrar-procuracao',
      expect.objectContaining({
        formData: {
          matriculaOutorgado: regeneratePublicaMock.outorgado.matricula,
          poderes: JSON.stringify(regeneratePublicaMock.poderes.outorganteSelecionado),
          tipoFluxo: JSON.stringify(regeneratePublicaMock.tipoFluxo),
          idMinutaCadastrada: regeneratePublicaMock.minutaCadastrada.idMinuta,
          dadosProcuracao: JSON.stringify({
            dataEmissao: '2020-03-20',
            dataVencimento: '2023-03-20',
            custo: 1,
            custoCadeia: 1,
            cartorioCadeia: 1,
            superCusto: 1,
            zerarCusto: 0,
            prefixoCusto: 1,
            dataManifesto: '2023-03-20',
            folha: '1',
            livro: '1',
          }),
          // @ts-ignore
          idCartorio: String(mockCartorios[0].id),
          urlDocumento: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        }
      }),
      { headers: { 'Content-Type': 'multipart/form-data; boundary=12345678912345678;' } }
    );
  });

  it('when minuta not found', async () => {
    const mockError = 'my mockError';
    const basePath = '/mock';

    jest.useFakeTimers();

    await startRender(CadastrarContinue, {
      beforeRender: () => {
        globalThis.permissionHookMock.mockReturnValue(true);
        globalThis.fetchSpy.mockRejectedValue(mockError);
      },
      initialEntries: [`${basePath}/minutaID`],
      routePath: `${basePath}/:idMinuta`,
      timesFetchIsCalled: 1,
    });

    // renders 404 page
    expect(screen.getByText('404')).toBeInTheDocument();

    // renders error toast
    expect(screen.getByText(mockError)).toBeInTheDocument();

    // changes the page after few seconds
    await act(() => {
      jest.runAllTimers();
    });

    expect(globalThis.routerDomPushMock).toHaveBeenLastCalledWith(`${basePath}/`);

    jest.useRealTimers();
  });
});
