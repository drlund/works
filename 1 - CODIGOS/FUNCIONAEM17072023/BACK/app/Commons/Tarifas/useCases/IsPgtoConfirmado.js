"use strict";

const PagamentoReservaRepository = use(
  "App/Commons/Tarifas/repositories/PagamentosRepository"
);

class IsPgtoConfirmado {
  constructor(idPagamento, ReceivedPagamentoRepository = null) {
    this.idPagamento = idPagamento;
    this.pagamentoRepository =
      ReceivedPagamentoRepository !== null
        ? new ReceivedPagamentoRepository()
        : new PagamentoReservaRepository();
  }

  async run() {
    const jaConfirmado = await this.pagamentoRepository.isPagamentoConfirmado(
      this.idPagamento
    );
    return jaConfirmado;
  }
}

module.exports = IsPgtoConfirmado;
