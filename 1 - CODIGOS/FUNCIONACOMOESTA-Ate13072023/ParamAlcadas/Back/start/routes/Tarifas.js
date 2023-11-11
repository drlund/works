/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

//Formularios
Route.group(() => {
  Route.get("/publico-alvo", "TarifasController.getPublicoAlvo");
  Route.get("/perm-pgto-conta", "TarifasController.getPermPgtoConta");
  Route.get(
    "/ocorrencia-reserva/:idOcorrencia",
    "TarifasController.getDadosOcorrencia"
  );

  Route.get(
    "/ocorrencia-pgto-especie/:idOcorrencia",
    "TarifasController.getDadosOcorrencia"
  ).middleware(["podePagarEspecie"]);

  Route.get(
    "/ocorrencia-pgto-conta/:idOcorrencia",
    "TarifasController.getDadosOcorrencia"
  ).middleware(["podePagarConta", "isPgtoConta"]);

  Route.get(
    "/ocorrencia-confirmar-pgto/:idOcorrencia",
    "TarifasController.getDadosOcorrencia"
  );

  Route.get(
    "/ocorrencia-finalizada/:idOcorrencia",
    "TarifasController.getDadosOcorrencia"
  );

  Route.get(
    "/pendentes-confirmacao-pgto/",
    "TarifasController.getPendentesConfirmacaoPgto"
  );

  Route.get(
    "/ocorrencia-confirma-pgto/:idOcorrencia",
    "TarifasController.getDadosOcorrencia"
  );

  Route.get(
    "/reservas/pendentes-pagamentos-especie/",
    "TarifasController.getReservasPendentesPagamentoEspecie"
  );

  Route.get("/finalizadas/", "TarifasController.getReservasFinalizadas");

  Route.get(
    "/reservas/pendentes-pagamentos-conta/",
    "TarifasController.getReservasPendentesPagamentoConta"
  ).middleware(["podePagarConta"]);

  Route.post("/reserva/:idOcorrencia", "TarifasController.reservarOcorrencia");

  Route.post(
    "/confirmacao-pgto/:idPagamento",
    "TarifasController.confirmarPgto"
  ).middleware(["podeConfirmarPagamento", "checaPgtoJaConfirmado"]);

  Route.delete(
    "/cancelar-pgto/:idPagamento",
    "TarifasController.cancelarPgto"
  ).middleware(["podeConfirmarPagamento", "checaPgtoJaConfirmado"]);

  Route.delete("/reserva/:idReserva", "TarifasController.cancelarReserva");

  Route.post(
    "/pagamento/:idOcorrencia",
    "TarifasController.registrarPagamento"
  );
})
  .prefix("/tarifas/")
  .middleware(["isTokenValid"]);
