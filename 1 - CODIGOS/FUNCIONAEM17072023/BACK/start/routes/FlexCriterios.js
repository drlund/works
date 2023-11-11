// @ts-nocheck
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.group(() => {
  Route.get("/solicitacoes", "FlexCriteriosController.listarSolicitacoes");
  Route.get(
    "/funcibymatricula",
    "FlexCriteriosController.obterFunciByMatricula"
  );
  Route.get("/dadosprefixo", "FlexCriteriosController.obterDadosPrefixo");
  Route.get("/dadosfuncao", "FlexCriteriosController.obterDadosFuncao");
  Route.get("/analisefunci", "FlexCriteriosController.obterAnaliseFunci");
  Route.get("/tipos", "FlexCriteriosController.listarTiposSolicitacoes");
  Route.get("/etapas", "FlexCriteriosController.listarEtapas");
  Route.get("/status", "FlexCriteriosController.listarStatus");
  Route.get("/localizacoes", "FlexCriteriosController.listarLocalizacoes");
  Route.get("/acoes", "FlexCriteriosController.listarAcoes");
  Route.get("/situacoes", "FlexCriteriosController.listarSituacoes");
  Route.get("/detalhar", "FlexCriteriosController.detalharSolicitacao");
  Route.get("/escaloes", "FlexCriteriosController.listarEscaloes");
  Route.get("/dadosescalao", "FlexCriteriosController.dadosEscalao");
  Route.get("/complementacao", "FlexCriteriosController.complementosPendentes");

  Route.get("anexos/download", "FlexCriteriosController.downloadAnexo");
  Route.post("anexos/novos", "FlexCriteriosController.vincularNovosAnexos");

  Route.post("/novasolicitacao", "FlexCriteriosController.incluirSolicitacao");
  Route.post("/manifestar", "FlexCriteriosController.manifestar");
  Route.post("/analisar", "FlexCriteriosController.analisar");
  //despachar serve pra criar os despachantes atraves de um objeto despacho
  Route.post("/despachar", "FlexCriteriosController.despachar");
  //deferir serve pra deferir os despachos criados do despachante
  Route.post("/deferir", "FlexCriteriosController.deferir");
  //finalizar serve pra finalizar depois de ter os votos dos diretores
  Route.post("/finalizar", "FlexCriteriosController.finalizar");
  Route.post("/finalizar", "FlexCriteriosController.finalizar");
  Route.post("/uploads", "FlexCriteriosController.postDocumento");
})

  .prefix("/flexcriterios")
  .middleware(["isTokenValid"]);
