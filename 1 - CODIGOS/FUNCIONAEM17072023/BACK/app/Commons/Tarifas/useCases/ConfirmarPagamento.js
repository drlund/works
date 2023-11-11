"use strict";

const PagamentoReservaRepository = use(
  "App/Commons/Tarifas/repositories/PagamentosRepository"
);

class ConfirmarPagamento {
  constructor(
    idPagamento,
    dadosUsuario,
    observacao,
    ReceivedPagamentoRepository = null
  ) {
    this.idPagamento = idPagamento;
    this.dadosUsuario = dadosUsuario;
    this.observacao =
      typeof observacao === "string" && observacao !== "" ? observacao : null;

    this.pagamentoRepository =
      ReceivedPagamentoRepository !== null
        ? new ReceivedPagamentoRepository()
        : new PagamentoReservaRepository();
  }

  async validarDados() {
    if (!this.idPagamento) {
      throw {
        message: `Id ${this.idPagamento} do pagamento inválido.`,
      };
    }
  }

  async run() {
    await this.validarDados();
    await this.pagamentoRepository.confirmarPagamento(
      this.idPagamento,
      this.observacao,
      this.dadosUsuario
    );
  }
}

module.exports = ConfirmarPagamento;
