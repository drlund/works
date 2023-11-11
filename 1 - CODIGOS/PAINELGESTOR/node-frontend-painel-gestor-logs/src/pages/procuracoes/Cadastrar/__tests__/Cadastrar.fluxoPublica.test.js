// @ts-nocheck
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { outorgadoComProcuracaoAgregada } from 'pages/procuracoes/innerComponents/AcordeaoProcuracoes/__mocks__/mockData';
import { dateToBRTimezoneString } from 'utils/dateToBRTimezoneString';
import Cadastrar from '..';
import { mockFormData } from '../../../../../test/antdTestUtils/mockFormData';
import { FETCH_METHODS } from '../../../../services/apis/GenericFetch';
import { mockCartorios } from '../../__mocks__/mockCartorios';
import { getFluxoComIdFluxo, mockFluxoPublica } from '../../__mocks__/mockFluxos';
import { mockOutorgadoGG } from '../../__mocks__/mockOutorgado';
import {
  finalStepSalvarProcuracao,
  getButtonWithName,
  goToSecondStep,
  initialStepSelecionarDadosBasicos,
  preStepPreencherProcuracao,
  preStepProcurarOutorgado,
  preStepSelecionarOutorgante,
  startRender,
  stepPreencherProcuracao,
  stepProcurarOutorgado,
  stepSelecionarCartorio,
  stepSelecionarOutorgante,
} from '../../tests/utils';

it('<Cadastrar> - after choosing fluxo publica', async () => {
  await startRender(Cadastrar);

  await initialStepSelecionarDadosBasicos(() => screen.getByTitle(mockFluxoPublica));

  globalThis.fetchSpy.mockResolvedValue(mockCartorios);
  await goToSecondStep();

  await stepSelecionarCartorio();
  await preStepPreencherProcuracao();

  // renders the procuracao step
  expect(screen.getByText(/data de emissão/i)).toBeInTheDocument();
  expect(screen.getByText(/data de vencimento/i)).toBeInTheDocument();
  expect(screen.getByText(/data manifesto de assinaturas/i)).toBeInTheDocument();
  expect(screen.getByText(/livro/i)).toBeInTheDocument();
  expect(screen.getByText(/folha/i)).toBeInTheDocument();
  expect(screen.getByText('Arquivo')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Link do documento')).toBeInTheDocument();

  // after filling the procuração form
  await stepPreencherProcuracao();
  await preStepProcurarOutorgado();

  // renders the outorgado step
  expect(screen.getByText(/utilize o campo abaixo para buscar o funcionário através do número da matrícula\./i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/matrícula/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();

  // after searching for a outorgado
  await stepProcurarOutorgado('F6154379', mockOutorgadoGG);

  // calls the search api
  expect(globalThis.fetchSpy).toHaveBeenLastCalledWith(FETCH_METHODS.GET, 'procuracoes/cadastro/pesquisar-outorgado', {
    idFluxo: getFluxoComIdFluxo(mockFluxoPublica).idFluxo,
    termoPesquisa: 'F6154379'
  });

  // after selecting a outorgado
  await preStepSelecionarOutorgante();

  // renders the outorgante step
  expect(screen.getByText(/informe a matrícula, nome do funcionário ou prefixo desejado para pesquisar/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/número do prefixo, matrícula ou nome/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /search buscar/i })).toBeInTheDocument();

  // after searching for a outorgante
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
        matriculaOutorgado: mockOutorgadoGG.matricula,
        poderes: JSON.stringify({
          matricula: outorgadoComProcuracaoAgregada.matricula,
          nome: outorgadoComProcuracaoAgregada.nome,
          idProcuracao: outorgadoComProcuracaoAgregada.idProcuracao,
          idProxy: outorgadoComProcuracaoAgregada.idProxy,
          subsidiariasSelected: subsidiarias.map((s) => s.id)
        }),
        tipoFluxo: JSON.stringify(getFluxoComIdFluxo(mockFluxoPublica)),
        idCartorio: String(mockCartorios[0].id),
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
        urlDocumento: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      }
    }),
    { headers: { 'Content-Type': 'multipart/form-data; boundary=12345678912345678;' } }
  );
});
