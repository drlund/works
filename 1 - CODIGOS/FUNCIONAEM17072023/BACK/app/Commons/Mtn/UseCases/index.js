const UcGetMonitoramentosEmVotacao = use(
  "App/Commons/Mtn/UseCases/UcGetMonitoramentosEmVotacao"
);
const UcGetMonitoramentosFinalizados = use(
  "App/Commons/Mtn/UseCases/UcGetMonitoramentosFinalizados"
);
const UcGetMonitoramentosParaNovaVersao = use(
  "App/Commons/Mtn/UseCases/UcGetMonitoramentosParaNovaVersao"
);
const UcIncluirMonitoramento = use(
  "App/Commons/Mtn/UseCases/UcIncluirMonitoramento"
);
const UcGetDadosMonitoramento = use(
  "App/Commons/Mtn/UseCases/UcGetDadosMonitoramento"
);
const UcIncluirVotacaoVersao = use(
  "App/Commons/Mtn/UseCases/UcIncluirVotacaoVersao"
);
const UcGetMonitoramentosParaVotacao = use(
  "App/Commons/Mtn/UseCases/UcGetMonitoramentosParaVotacao"
);
const UcVotar = use("App/Commons/Mtn/UseCases/UcVotar");
const UcGetPermissaoVisualizarVotacoes = use(
  "App/Commons/Mtn/UseCases/UcGetPermissaoVisualizarVotacoes"
);
const UcGetAlteracoesParaTratamento = use(
  "App/Commons/Mtn/UseCases/UcGetAlteracoesParaTratamento"
);
const UcGetDadosVersao = use("App/Commons/Mtn/UseCases/UcGetDadosVersao");
const UcTratarAlteracao = use("App/Commons/Mtn/UseCases/UcTratarAlteracao");

module.exports = {
  UcGetAlteracoesParaTratamento,
  UcGetMonitoramentosEmVotacao,
  UcGetMonitoramentosFinalizados,
  UcGetMonitoramentosParaNovaVersao,
  UcIncluirMonitoramento,
  UcGetDadosMonitoramento,
  UcIncluirVotacaoVersao,
  UcGetMonitoramentosParaVotacao,
  UcVotar,
  UcGetPermissaoVisualizarVotacoes,
  UcGetDadosVersao,
  UcTratarAlteracao,
};
