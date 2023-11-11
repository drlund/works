/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.group(() => {
  Route.get("/subordinadas/:prefixo", "MestreController.getSubordinadas");
  Route.get("/diretorias/", "MestreController.getDiretorias");

})
  .prefix("/mestre")
  .middleware(["isTokenValid"]);
