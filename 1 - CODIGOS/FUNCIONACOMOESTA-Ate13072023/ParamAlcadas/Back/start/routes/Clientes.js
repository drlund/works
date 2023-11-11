/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.group(() => {
  Route.get("/dados-basicos/:mci", "ClienteController.getDadosBasicos");
  Route.get("/classificacao/:mci", "ClienteController.getClassificacao");
})
  .prefix("/clientes")
  .middleware(["isTokenValid"]);
