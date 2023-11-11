import { createPatch } from 'diff';
import { outorgadoComProcuracaoAgregada } from 'pages/procuracoes/innerComponents/AcordeaoProcuracoes/__mocks__/mockData';
import { getFluxoComIdFluxo, mockFluxoParticular, mockFluxoPublica } from 'pages/procuracoes/__mocks__/mockFluxos';
import { mockOutorgadoDemaisGerentes } from 'pages/procuracoes/__mocks__/mockOutorgado';
import { templateAfterMock } from '../innerComponents/MinutaTemplate/__mocks__/MinutaTemplateMock';
import { templateMock } from '../Minuta/__mocks__/templateMock';

const { subsidiarias } = outorgadoComProcuracaoAgregada.procuracao[0];

const diffs = createPatch('diff', templateMock.templateBase, templateAfterMock);

const subsidiariasSelected = subsidiarias.map((s) => s.id);

const idMinutaCadastradaMock = 'idMinuta cadastrada mock';

export const regenerateParticularMock = {
  dadosMinuta: {
    ...templateMock,
    template: templateAfterMock,
    diffs,
  },
  outorgado: mockOutorgadoDemaisGerentes,
  poderes: {
    outorgantes: [outorgadoComProcuracaoAgregada],
    outorganteSelecionado: {
      idProcuracao: outorgadoComProcuracaoAgregada.idProcuracao,
      idProxy: outorgadoComProcuracaoAgregada.idProxy,
      nome: outorgadoComProcuracaoAgregada.nome,
      matricula: outorgadoComProcuracaoAgregada.matricula,
      subsidiariasSelected,
    },
  },
  tipoFluxo: getFluxoComIdFluxo(mockFluxoParticular),
  minutaCadastrada: {
    idMinuta: idMinutaCadastradaMock,
    dadosMinuta_customData: {},
    dadosMinuta_diffs: diffs,
    dadosMinuta_idTemplate: templateMock.idTemplate,
    dadosMinuta_idTemplateDerivado: undefined,
    idFluxo: templateMock.idFluxo,
    idTemplateBase: templateMock.idTemplate,
    matriculaOutorgado: mockOutorgadoDemaisGerentes.matricula,
    outorgante_idProcuracao: outorgadoComProcuracaoAgregada.idProcuracao,
    outorgante_idProxy: outorgadoComProcuracaoAgregada.idProxy,
    outorgante_subsidiariasSelected: subsidiariasSelected
  },
};

export const regeneratePublicaMock = {
  dadosMinuta: {
    ...templateMock,
    template: templateAfterMock,
    diffs,
  },
  outorgado: mockOutorgadoDemaisGerentes,
  poderes: {
    outorgantes: [outorgadoComProcuracaoAgregada],
    outorganteSelecionado: {
      idProcuracao: outorgadoComProcuracaoAgregada.idProcuracao,
      idProxy: outorgadoComProcuracaoAgregada.idProxy,
      nome: outorgadoComProcuracaoAgregada.nome,
      matricula: outorgadoComProcuracaoAgregada.matricula,
      subsidiariasSelected,
    },
  },
  tipoFluxo: getFluxoComIdFluxo(mockFluxoPublica),
  minutaCadastrada: {
    idMinuta: idMinutaCadastradaMock,
    dadosMinuta_customData: {},
    dadosMinuta_diffs: diffs,
    dadosMinuta_idTemplate: templateMock.idTemplate,
    dadosMinuta_idTemplateDerivado: undefined,
    idFluxo: templateMock.idFluxo,
    idTemplateBase: templateMock.idTemplate,
    matriculaOutorgado: mockOutorgadoDemaisGerentes.matricula,
    outorgante_idProcuracao: outorgadoComProcuracaoAgregada.idProcuracao,
    outorgante_idProxy: outorgadoComProcuracaoAgregada.idProxy,
    outorgante_subsidiariasSelected: subsidiariasSelected
  },
};
