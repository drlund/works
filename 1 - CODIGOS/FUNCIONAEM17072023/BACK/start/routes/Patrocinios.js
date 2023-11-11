/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.group(() => {
  Route.get("/formulario", "PatrociniosController.getFormularioSolicitacao");
  Route.patch("/alteraSolic", "PatrociniosController.patchSolic");
  Route.get("/emVotacao", "PatrociniosController.getEmVotacao");
  Route.post("/gravaSolic", "PatrociniosController.postSolic");
  Route.post("/gravaVoto", "PatrociniosController.postVoto");
  Route.get("/arquivo", "PatrociniosController.getArquivo");
  Route.get("/respAnalise", "PatrociniosController.getRespAnalise");
  Route.get("/exportar", "PatrociniosController.exportarDados");
})
  .prefix("/patrocinios")
  .middleware([
    "isTokenValid",
    "allowed:OR,Patrocínios,USUARIO",
    "podeAcessar",
  ]);

Route.group(() => {
  Route.get("/tpLancto", "PatrociniosController.getTipoLancam");
  Route.get("/tpSolic", "PatrociniosController.getTipoSolic");
  Route.get("/prefAut", "PatrociniosController.getPrefAutorizados");
  Route.get("/recorrencia", "PatrociniosController.getListaRecorrencia");
  Route.get("/foraPrazo", "PatrociniosController.getForaPrazo");
  Route.get("/equipeComunicacao", "PatrociniosController.getEquipeComunicacao");
  Route.get("/historico", "PatrociniosController.getHistorico");
  Route.get("/solicitacoes", "PatrociniosController.getSolicitacao");
})
  .prefix("/patrocinios")
  .middleware(["isTokenValid", "allowed:OR,Patrocínios,USUARIO"]);

Route.group(() => {
  Route.get("/formReadOnly", "PatrociniosController.getFormularioSolicitacao");
  Route.get("/fileReadOnly", "PatrociniosController.getArquivo");
  Route.get("/fases", "PatrociniosController.getFases");
})
  .prefix("/patrocinios")
  .middleware([
    "isTokenValid",
    "allowed:OR,Patrocínios,USUARIO",
    "isEquipeComunicacao",
  ]);

Route.group(() => {
  Route.post("/gravaRespAnalise", "PatrociniosController.postRespAnalise");
})
  .prefix("/patrocinios")
  .middleware([
    "isTokenValid",
    "allowed:OR,Patrocínios,USUARIO",
    "isNivelGerencial",
    "isEquipeComunicacao",
  ]);

Route.group(() => {
  Route.get("/getOpcoesFormGestao", "GestaoPatrociniosController.getOpcoesFormGestao");
  Route.get("/getOpcoesFormProvisao", "GestaoPatrociniosController.getOpcoesFormProvisao");
  Route.get("/getOrcamento", "GestaoPatrociniosController.getOrcamento");
  Route.get("/getOrcamentoById", "GestaoPatrociniosController.getOrcamentoById");
  Route.get("/getPagamentos", "GestaoPatrociniosController.getPagamentos");
  Route.get("/getProjetos", "GestaoPatrociniosController.getProjetos");
  Route.get("/getProvisao", "GestaoPatrociniosController.getProvisao");
  Route.get("/getGestaoTotal", "GestaoPatrociniosController.getGestaoTotal");
  Route.patch("/patchOrcamento", "GestaoPatrociniosController.patchOrcamento" );
  Route.patch("/patchPagamento", "GestaoPatrociniosController.patchPagamento" );
  Route.patch("/patchProvisao", "GestaoPatrociniosController.patchProvisao" );
  Route.patch("/patchEditaGestao", "GestaoPatrociniosController.patchEditaGestao");
  Route.patch("/deleteProvisao", "GestaoPatrociniosController.deleteProvisao");
  Route.patch("/deletePagamento", "GestaoPatrociniosController.deletePagamento");
  Route.patch("/deleteOrcamento", "GestaoPatrociniosController.deleteOrcamento");
})
  .prefix("/patrocinios")
  .middleware(["isTokenValid", 
    "allowed:OR,Patrocínios,USUARIO",
    "isEquipeComunicacao",
  ]);

Route.group(() => {
  Route.post("/gravarGestao", "GestaoPatrociniosController.gravarGestao");
  Route.post("/gravarOrcamento", "GestaoPatrociniosController.gravarOrcamento");
  Route.post("/gravarProvisao", "GestaoPatrociniosController.gravarProvisao");
  Route.post("/gravarPagamento", "GestaoPatrociniosController.gravarPagamento");
})
  .prefix("/patrocinios")
  .middleware([
    "isTokenValid",
    "allowed:OR,Patrocínios,USUARIO",
    "isEquipeComunicacao",
  ]);
