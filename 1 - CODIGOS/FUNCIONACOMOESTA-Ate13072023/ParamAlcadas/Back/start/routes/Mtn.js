const { route } = require("@adonisjs/framework/src/Route/Manager");

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

//Formularios
Route.group(() => {
  Route.get("forms/pendentes", "MtnFormController.find").middleware([
    "injectParams:admin,true,pendentes,true",
  ]);
  Route.get("coletarEmails", "MtnController.coletarEmails");
  Route.get("logs/:idResposta", "MtnFormController.getLogs");
  Route.get("analisar/:idMtn", "MtnController.find").middleware([
    "routeLogger:MTN",
  ]);

  Route.get("/people-analitics", "MtnController.peopleAnalitics");
  Route.get("/questionario-view", "MtnController.questionarioView");
  Route.get("/notificacoes-analise", "MtnController.notificacoesAnalise");

  Route.get("status/:idMtn", "MtnController.getStatusMtn");
  Route.get(
    "envolvido/historicoMtn/:matricula",
    "MtnController.getHistoricoEnvolvido"
  );

  Route.post(
    "envolvido/devolver-medida/:idEnvolvido",
    "MtnController.devolverMedida"
  ).middleware(["routeLogger:MTN", "allowed:AND,MTN,MTN_APROVAR_MEDIDA"]);

  Route.post(
    "envolvido/aprovar-medidas-lote",
    "MtnController.aprovarMedidasLote"
  ).middleware(["routeLogger:MTN", "allowed:AND,MTN,MTN_APROVAR_MEDIDA"]);

  Route.post(
    "envolvido/aprovar-medida-individual",
    "MtnController.aprovarMedidaIndividual"
  ).middleware(["routeLogger:MTN", "allowed:AND,MTN,MTN_APROVAR_MEDIDA"]);

  Route.post(
    "envolvido/devolver-envolvido-para-analise/:idEnvolvido",
    "MtnController.devolverMedidaParaAprovacao"
  ).middleware(["routeLogger:MTN", "allowed:AND,MTN,MTN_APROVAR_MEDIDA"]);

  Route.post(
    "envolvido/versionar-ocorrencia",
    "MtnController.versionarOcorrencia"
  ).middleware(["allowed:AND,MTN,MTN_VERSIONAR_OCORRENCIA","routeLogger:MTN"]);

  Route.post(
    "envolvido/esclarecimento/:idEnvolvido",
    "MtnController.solicitarEsclarecimento"
  )
    .validator("ValidSaveEsclarecimento")
    .middleware(["routeLogger:MTN"]);

  Route.post(
    "envolvido/parecer/:idEnvolvido",
    "MtnController.salvarParecer"
  ).middleware(["routeLogger:MTN", "parseParecerParaAprovacao"]);

  Route.get(
    "anexos/download/:idAnexo",
    "MtnController.downloadAnexo"
  ).middleware("clearCache");
  Route.delete("anexos/:idAnexo", "MtnController.removeAnexo").middleware([
    "routeLogger:MTN",
  ]);
  Route.get(
    "envolvido/esclarecimentos/:idEnvolvido",
    "MtnController.getEsclarecimentos"
  ).validator("ValidGetEsclarecimentos");
  Route.get(
    "envolvido/timeline/:idEnvolvido",
    "MtnController.getTimelineAnalise"
  );

  Route.get("envolvido/:idEnvolvido", "MtnController.getEnvolvido").middleware([
    "routeLogger:MTN",
  ]);
  Route.get("envolvidos/:idMtn", "MtnController.getEnvolvidos").middleware([
    "routeLogger:MTN",
  ]);
  Route.post("/envolvido/", "MtnController.incluirEnvolvido").middleware([
    "routeLogger:MTN",
  ]);

  Route.patch(
    "/finalizar-sem-envolvido/:idMtn",
    "MtnController.finalizarMtnSemEnvolvido"
  ).middleware(["routeLogger:MTN"]);

  Route.get(
    "/ocorrencias-para-reversao/",
    "MtnController.ocorrenciasParaReversao"
  ).middleware(["allowed:AND,MTN,MTN_ALTERAR_MEDIDA", "routeLogger:MTN"]);

  Route.patch(
    "/alterar-medida/finalizar/:idSolicitacao",
    "MtnController.confirmarAlteracaoMedida"
  ).middleware(["allowed:AND,MTN,MTN_ALTERAR_MEDIDA", "routeLogger:MTN"]);
  Route.post(
    "/alterar-medida/solicitar/",
    "MtnController.solicitarAlterarMedida"
  ).middleware(["allowed:AND,MTN,MTN_ALTERAR_MEDIDA", "routeLogger:MTN"]);
  Route.delete(
    "alterar-medida/:idSolicitacao",
    "MtnController.excluirAlteracaoMedida"
  ).middleware(["allowed:AND,MTN,MTN_ALTERAR_MEDIDA", "routeLogger:MTN"]);
  Route.get(
    "/alterar-medidas/pendentes",
    "MtnController.getSolicitacoesAlteracaoMedidaPendentes"
  ).middleware(["allowed:AND,MTN,MTN_ALTERAR_MEDIDA", "routeLogger:MTN"]);
  Route.get(
    "/ocorrencias-finalizadas/",
    "MtnController.ocorrenciasParaReverter"
  ).middleware(["allowed:AND,MTN,MTN_ALTERAR_MEDIDA", "routeLogger:MTN"]);

  Route.post(
    "/foraAlcance/:idMtn",
    "MtnController.salvarForaAlcance"
  ).middleware(["routeLogger:MTN"]);

  Route.post("/lock/:idMtn", "MtnController.lockMtn").middleware([
    "routeLogger:MTN",
  ]);
  Route.patch("/lock/:idMtn", "MtnController.atualizaLock").middleware([
    "routeLogger:MTN",
  ]);
  Route.get("/lock/:idMtn", "MtnController.getLock");
  Route.delete("/lock/:idMtn", "MtnController.liberaLock").middleware([
    "routeLogger:MTN",
  ]);

  Route.get("medidas", "MtnController.getMedidas");
  Route.get("visoes", "MtnController.getVisoes");
  Route.get("status", "MtnController.getStatus");
  Route.get("acoes", "MtnController.getAcoes");
  Route.get("/pendentes-super", "MtnController.pendentesSuper");
  Route.get(
    "/notificacoes-fila-envio",
    "MtnController.getNotificacoesFilaEnvio"
  );

  Route.get(
    "/filtrar-envolvidos",
    "MtnController.filtrarEnvolvidos"
  ).middleware(["routeLogger:MTN"]);
  Route.get("/filtrar-visao-assessor", "MtnController.filtrarAcoes").middleware(
    ["routeLogger:MTN"]
  );
  Route.get("/getId/:nrMtn", "MtnController.getIdByNrMtn").middleware([
    "routeLogger:MTN",
  ]);
  Route.get(
    "/getIdByOcorrencia/:nrOcorrencia",
    "MtnController.getIdByOcorrencia"
  );
  Route.get("/get-config-prazos/", "MtnController.getConfigPrazos").middleware([
    "routeLogger:MTN",
  ]);
  Route.put(
    "/atualizar-config-prazos/",
    "MtnController.atualizarConfigPrazos"
  ).middleware(["routeLogger:MTN"]);
  Route.get(
    "/pareceres-para-aprovacao/",
    "MtnController.getPareceresParaAprovar"
  ).middleware(["routeLogger:MTN"]);
  Route.post("/", "MtnController.save").middleware(["routeLogger:MTN"]);

  Route.get(
    "/funci-ausencias/:matricula",
    "ArhController.findAusenciasByMatricula"
  );

  // Rotas para notas internas
  Route.get("/notas-internas", "MtnController.getNotasByEnvolvido");
  Route.post("/nova-nota", "MtnController.novaNotaInterna");
  Route.post("/leitura-nota", "MtnController.registrarLeituraNotaInterna");
  // fim das rotas para notas internas

  Route.get("/:tipo", "MtnController.index").middleware(["routeLogger:MTN"]);
})
  .prefix("/mtn/adm")
  .middleware(
    ["isTokenValid", "allowed:OR,MTN,MTN_ADM,MTN_READ_ONLY"],
    "checkReadOnly"
  );

/**
 * Rotas para a votação
 *
 */
Route.group(() => {
  Route.get(
    "/pode-visualizar-votacoes/",
    "MtnMonitoramentosController.podeVisualizarVotacoes"
  );

  Route.get(
    "/para-votacao/:idMonitoramento",
    "MtnMonitoramentosController.getDadosMonitoramento"
  );

  Route.get(
    "/para-votacao/",
    "MtnMonitoramentosController.getMonitoramentosParaVotacao"
  );

  Route.post("/votar-parametro/:idVisao", "MtnMonitoramentosController.votar");
})
  .prefix("/mtn/monitoramentos")
  .middleware(["isTokenValid"]);

Route.group(() => {
  Route.get(
    "/alteracoes-para-tratamento/",
    "MtnMonitoramentosController.getAlteracoesParaTratamento"
  );

  Route.post(
    "/tratar-alteracao/:idVersao",
    "MtnMonitoramentosController.tratarAlteracao"
  );

  Route.get(
    "/parametro/para-alteracao/:idVersao",
    "MtnMonitoramentosController.getAlteracaoParaTratamento"
  );

  Route.get(
    "/para-nova-versao/",
    "MtnMonitoramentosController.getMonitoramentosParaNovaVersao"
  );

  Route.get(
    "/em-votacao/",
    "MtnMonitoramentosController.getMonitoramentosEmVotacao"
  );

  Route.post(
    "/incluir-monitoramento",
    "MtnMonitoramentosController.incluirMonitoramento"
  ).middleware(["routeLogger:MTN"]);

  Route.get(
    "/download-documento/:idDocumento/:hashDocumento",
    "MtnMonitoramentosController.downloadDocumentoVersao"
  );

  Route.get(
    "/:idMonitoramento",
    "MtnMonitoramentosController.getDadosMonitoramento"
  );

  Route.delete(
    "/votacao/:idMonitoramento",
    "MtnMonitoramentosController.excluirVotacao"
  );

  Route.post(
    "incluir-parametros-monitoramento/:idVisao",
    "MtnMonitoramentosController.incluirVersao"
  );
})
  .prefix("/mtn/monitoramentos")
  .middleware(["isTokenValid", "allowed:AND,MTN,MTN_GERENCIAR_MONITORAMENTOS"]);

Route.group(() => {
  Route.put(
    "prorrogar-esclarecimento/:idEsclarecimento",
    "MtnController.prorrogarEsclarecimento"
  ).middleware(["isEnvolvidoEsclarecimento", "routeLogger:MTN"]);
  Route.get("/painelDicoi", "MtnController.painelDicoi").middleware([
    "allowed:AND,MTN,MTN_READ_ONLY",
  ]);
  Route.get("/:idMtn", "MtnController.getMeuMtn").middleware(
    "isUserEnvolvido",
    "routeLogger:MTN"
  );
  Route.get("/", "MtnController.getMeusMtns").middleware(["routeLogger:MTN"]);
  Route.post(
    "/esclarecimento/:idEsclarecimento",
    "MtnController.salvarEsclarecimento"
  ).middleware(["routeLogger:MTN"]);
  Route.patch("/recurso/:idRecurso", "MtnController.salvarRecurso")
    .validator("ValidSaveRecurso")
    .middleware(["routeLogger:MTN"]);
})
  .prefix("/mtn")
  .middleware(["isTokenValid"]);

Route.group(() => {
  Route.get("emAndamento", "MtnFormController.find").middleware([
    "injectParams:admin,false,pendentes,true",
  ]);
  Route.get("finalizadas", "MtnFormController.find").middleware([
    "injectParams:admin,false,pendentes,false",
  ]);
  Route.post("salvarRespostas", "MtnFormController.saveRespostas");
  Route.get(":idResposta", "MtnFormController.getQuestionario").middleware([
    "funciPodeResponder",
    "logVisualizarQuestionario",
  ]);
})
  .prefix("/mtnForm")
  .middleware(["isTokenValid"]);

Route.group(() => {
  Route.get("/", "MtnComiteVotacaoController.getComiteVotacao");
  Route.post("/", "MtnComiteVotacaoController.incluirMembroComite");
  Route.patch("/", "MtnComiteVotacaoController.alterarMembroComite");
  Route.delete("/", "MtnComiteVotacaoController.excluirMembroComite");
})
  .prefix("/mtn-gerenciar-comite-extendido")
  .middleware(["isTokenValid", "allowed:AND,MTN,MTN_GERENCIAR_MONITORAMENTOS"]);
