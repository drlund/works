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
import { mockMinutaCadastrada } from '../../__mocks__/mockMinutaCadastrada';

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

  it('flow until outorgante', async () => {
    // renders the outorgado step
    expect(screen.getByText(/utilize o campo abaixo para buscar o funcionário através do número da matrícula\./i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/matrícula/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();

    // after searching for a outorgado
    await stepProcurarOutorgado('F6173159', mockOutorgadoDemaisGerentes);

    // calls the search api
    expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(FETCH_METHODS.GET, 'procuracoes/cadastro/pesquisar-outorgado', {
      idFluxo: getFluxoComIdFluxo(mockFluxoParticular).idFluxo,
      termoPesquisa: 'F6173159'
    });

    // after selecting a outorgado
    await preStepSelecionarOutorgante();

    // renders the outorgante step
    expect(screen.getByText(/informe a matrícula, nome do funcionário ou prefixo desejado para pesquisar/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/número do prefixo, matrícula ou nome/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search buscar/i })).toBeInTheDocument();
  });

  describe('after searching for a outorgado', () => {
    beforeEach(async () => {
      await stepProcurarOutorgado('F6173159', mockOutorgadoDemaisGerentes);
    });

    describe('after selecting a outorgado', () => {
      beforeEach(async () => {
        await preStepSelecionarOutorgante();
      });

      it('after searching for a outorgante', async () => {
        const { subsidiarias, procuracaoAgregada: { vencimento } } = outorgadoComProcuracaoAgregada.procuracao[0];
        const vencimentoBR = dateToBRTimezoneString(vencimento);

        await stepSelecionarOutorgante();

        // calls the api for the outorgante
        expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(FETCH_METHODS.POST, '/procuracoes/pesquisa', { pesquisa: 'F1690528', maisRecente: true, ativo: 1 });

        // renders the list of procuracoes of outorgante
        expect(screen.getAllByRole('checkbox')).toHaveLength(subsidiarias.length);
        subsidiarias.forEach((sub) => {
          expect(screen.getByRole('checkbox', { name: `${sub.nome} (${vencimentoBR})` })).toBeInTheDocument();
        });

        // dont renders the proximo button
        expect(screen.queryByRole('button', { name: /próximo/i })).not.toBeInTheDocument();

        // when the user clicks on the selecionar outorgante button
        await userEvent.click(screen.getAllByRole('button', { name: /confirmar seleção/i })[0]);

        // disables the checkboxes
        subsidiarias.forEach((sub) => {
          expect(screen.getByRole('checkbox', { name: `${sub.nome} (${vencimentoBR})` })).toBeDisabled();
        });

        // renders the proximo button
        expect(getButtonWithName(/próximo/i)).toBeInTheDocument();

        // after selecting an outorgante
        await userEvent.click(getButtonWithName('Próximo'));

        await waitFor(() => {
          expect(screen.queryByRole('heading', { name: /poderes\(s\) selecionado\(s\)/i })).not.toBeInTheDocument();
        });

        // renders the minuta step
        expect(screen.getByRole('heading', { name: /Minuta/i })).toBeInTheDocument();

        expect(screen.getByTestId('minutaTemplateMock')).toBeInTheDocument();

        expect(getButtonWithName('Próximo')).toBeEnabled();

        // calls the MinutaTemplate with the correct parameters
        expect(screen.getByText('editable: true')).toBeInTheDocument();
        expect(screen.getByText('mock template')).toBeInTheDocument();

        // after going to the finalizar minuta step
        await userEvent.click(getButtonWithName('Próximo'));

        // renders finalizar minuta
        expect(screen.getByRole('heading', { name: /finalizar minuta/i })).toBeInTheDocument();
        expect(getButtonWithName('Registrar Minuta')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /outorgado/i, level: 3 })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /outorgante/i, level: 3 })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /minuta/i, level: 3 })).toBeInTheDocument();

        // calls the MinutaTemplate with the correct parameters
        expect(screen.getByText(templateAfterMock)).toBeInTheDocument();

        // when clicking to finish the registration
        await userEvent.click(getButtonWithName(/registrar minuta/i));

        // confirmation modal
        // renders the confirm modal
        expect(screen.getByRole('dialog', { name: 'Atenção' })).toBeInTheDocument();

        // has a checkbox
        expect(screen.getByRole('checkbox', {
          name: /estou de acordo com os termos acima e me comprometo a fazer o upload do substabelecimento de procuração assinado\./i
        })).toBeInTheDocument();

        // renders confirm button disabled
        expect(screen.getByRole('button', {
          name: /finalizar cadastro de minuta/i
        })).toBeDisabled();

        // when checking the checkbox
        await userEvent.click(screen.getByRole('checkbox', {
          name: /estou de acordo com os termos acima e me comprometo a fazer o upload do substabelecimento de procuração assinado\./i
        }));

        // renders confirm button enabled
        expect(screen.getByRole('button', {
          name: /finalizar cadastro de minuta/i
        })).toBeEnabled();

        // when clicking confirmar in the modal
        globalThis.fetchSpy.mockResolvedValue(mockMinutaCadastrada);

        await userEvent.click(screen.getByRole('button', {
          name: /finalizar cadastro de minuta/i
        }));

        await waitFor(() => {
          expect(screen.queryByRole('heading', { name: /finalizar minuta/i })).not.toBeInTheDocument();
        });

        // calls the api to register the procuração
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

        // renders the baixar minuta step
        expect(screen.getByRole('heading', {
          name: /baixar minuta/i,
          level: 2
        })).toBeInTheDocument();
        expect(screen.getByText('PDFDownloadLink')).toBeInTheDocument();
        expect(screen.getByText('PDF Viewer')).toBeInTheDocument();
      });

      it('after searching for a outorgante with multiple results', async () => {
        const { subsidiarias } = outorgadoComProcuracaoNaoAgregada.procuracao[0];
        const firstTabHeader = 'F1111140 - Teste4 (cargoNome teste4)';
        const secondTabHeader = 'F1111111 - Teste1 (cargoNome teste1)';

        await stepSelecionarOutorgante(cloneDeep([
          outorgadoComProcuracaoCompleta,
          outorgadoSemProcuracao
        ]));

        // renders two tabs
        expect(screen.getAllByRole('tab')).toHaveLength(2);

        // renders one tabpanel
        // eslint-disable-next-line jest-dom/prefer-in-document
        expect(screen.getAllByRole('tabpanel')).toHaveLength(1);

        // renders the header for the first procuracao
        expect(screen.getByText(firstTabHeader)).toBeInTheDocument();

        // renders the header for the second procuracao
        expect(screen.getByText(secondTabHeader)).toBeInTheDocument();

        // dont renders the proximo button
        expect(screen.queryByRole('button', { name: /próximo/i })).not.toBeInTheDocument();

        // when clicking the second tab
        globalThis.fetchSpy
          .mockResolvedValue(cloneDeep(outorgadoComProcuracaoNaoAgregada.procuracao));

        await userEvent.click(screen.getByText(secondTabHeader));

        // when the user clicks on the selecionar button
        await userEvent.click(screen.getAllByRole('button', { name: /confirmar seleção/i })[0]);

        // disables the checkboxes
        subsidiarias.forEach((sub) => {
          expect(screen.getByRole('checkbox', { name: `${sub.nome} (${dateToBRTimezoneString(sub.vencimento)})` })).toBeDisabled();
        });

        // renders the proximo button
        expect(getButtonWithName(/próximo/i)).toBeInTheDocument();
      });
    });
  });
});
