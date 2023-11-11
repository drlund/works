/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

const NOME_FERRAMENTA = "Chaves de API";

Route.group(() => {
  Route.post(
    "/gerar-nova-chave",
    "ChavesApiController.generateNewKey"
  );
  Route.get(
    "/",
    "ChavesApiController.findAll"
  );
  Route.delete(
    "/",
    "ChavesApiController.removeKeys"
  );
}).prefix("/api-keys")
.middleware(["isTokenValid", `allowed:AND,${NOME_FERRAMENTA},GERENCIAR_CHAVES`, `routeLogger:${NOME_FERRAMENTA}`]);