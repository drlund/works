/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.group(() => {
  Route.get("/funci/checa-funcao-gerencial", "ArhController.isNivelGerencial");
  Route.get("/funci/:matricula", "ArhController.findFunci");
  Route.get("/funcis", "ArhController.findFuncis");  
  Route.get("/dependencia/:prefixo", "ArhController.findDependencia");
  Route.get("/dependencias", "ArhController.findDependencias");
  Route.get("/matcheddependencias/", "ArhController.findMatchedDependencias");
  Route.get("/depesubord/", "ArhController.findDepESubord");
  Route.get("/matchedfuncis/", "ArhController.findMatchedFuncis");
  Route.get("/dotacao/", "ArhController.findDotacaoDependencia");
  Route.get("/funcislotados/", "ArhController.findMatchedFuncisLotados");
  Route.get("/comissoes/:prefixo", "ArhController.findComissoesByPrefixo");
  Route.get("/comissoes", "ArhController.findComissoes");
  Route.get("/comites", "ArhController.findComites");
  Route.get("/membros-comite", "ArhController.findFunciComites");
  Route.get("/comites-funci/", "ArhController.findComitesFunci");
}).middleware(["isTokenValid"]);
