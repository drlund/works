"use strict";

const BaseUseCase = use("App/Commons/Tarifas/useCases/BaseUseCase");

const ReservaRepository = use(
  "App/Commons/Tarifas/repositories/ReservaRepository"
);
const PagamentosRepository = use(
  "App/Commons/Tarifas/repositories/PagamentosRepository"
);

class GetReservasPendentesPgtoEspecie extends BaseUseCase {
  constructor(
    usuarioLogado,
    ReceivedReservasRepository = null,
    ReceivedPagamentoRepository = null
  ) {
    super();

    this.usuarioLogado = usuarioLogado;

    this.reservasRepository = ReceivedReservasRepository
      ? new ReceivedReservasRepository()
      : new ReservaRepository();

    this.pagamentosRepository = ReceivedPagamentoRepository
      ? new ReceivedPagamentoRepository()
      : new PagamentosRepository();
  }

  async run() {
    const prefixosComAcessoParaPagamento =
      await this.pagamentosRepository.getPrefixosComAcessoParaPagamento(
        this.usuarioLogado.prefixo
      );

    if (prefixosComAcessoParaPagamento.length === 0) {
      return [];
    }

    const reservas = await this.reservasRepository.pendentesPagamentoEspecie(
      prefixosComAcessoParaPagamento
    );
    return reservas;
  }
}

module.exports = GetReservasPendentesPgtoEspecie;
