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

  it('fluxo até outorgante', async () => {
  // renders the procuracao step
    expect(screen.getByText(/data de emissão/i)).toBeInTheDocument();
    expect(screen.getByText(/data de vencimento/i)).toBeInTheDocument();
    expect(screen.queryByText(/livro/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/folha/i)).not.toBeInTheDocument();
    expect(screen.getByText('Arquivo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Link do documento')).toBeInTheDocument();

    // after filling the procuração form
    await stepPreencherProcuracao(tiposEtapa.particular);
    await preStepProcurarOutorgado();

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

  describe('after selecting a outorgado', () => {
    beforeEach(async () => {
      await stepPreencherProcuracao(tiposEtapa.particular);
      await preStepProcurarOutorgado();

      await stepProcurarOutorgado('F6173159', mockOutorgadoDemaisGerentes);

      await preStepSelecionarOutorgante();
    });

    it('after searching for a outorgante', async () => {
      const { subsidiarias, procuracaoAgregada: { vencimento } } = outorgadoComProcuracaoAgregada.procuracao[0];

      const vencimentoBR = dateToBRTimezoneString(vencimento);

      await stepSelecionarOutorgante();

      // calls the api for the outorgante
      expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(FETCH_METHODS.POST, '/procuracoes/pesquisa', { pesquisa: 'F1690528', maisRecente: false, ativo: 1 });

      // renders the list of procuracoes of outorgante
      expect(screen.getAllByRole('checkbox')).toHaveLength(subsidiarias.length);
      subsidiarias.forEach((sub) => {
        expect(screen.getByRole('checkbox', { name: `${sub.nome} (${vencimentoBR})` })).toBeInTheDocument();
      });

      // dont renders the proximo button
      expect(screen.queryByRole('button', { name: /próximo/i })).not.toBeInTheDocument();

      // when the user clicks on the selecionar button
      await userEvent.click(screen.getAllByRole('button', { name: /confirmar seleção/i })[0]);

      // disables the checkboxes
      subsidiarias.forEach((sub) => {
        expect(screen.getByRole('checkbox', { name: `${sub.nome} (${vencimentoBR})` })).toBeDisabled();
      });

      // renders the proximo button
      expect(getButtonWithName(/próximo/i)).toBeInTheDocument();

      // when moving to the final step
      await userEvent.click(getButtonWithName('Próximo'));

      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: /poderes\(s\) selecionado\(s\)/i })).not.toBeInTheDocument();
      });

      // renders the final step
      expect(screen.getByRole('heading', { name: /finalizar cadastramento/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /registrar cadastro/i })).toBeInTheDocument();

      // when clicking to finish the registration
      mockFormData();
      await finalStepSalvarProcuracao();

      // calls the api to register the procuração
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

      // when moving to the final step
      await userEvent.click(getButtonWithName('Próximo'));

      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: /poderes\(s\) selecionado\(s\)/i })).not.toBeInTheDocument();
      });

      // renders the final step
      expect(screen.getByRole('heading', { name: /finalizar cadastramento/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /registrar cadastro/i })).toBeInTheDocument();

      // when clicking to finish the registration
      mockFormData();
      await finalStepSalvarProcuracao();

      // calls the api to register the procuração
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
