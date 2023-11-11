"use strict";

const moment = require ("moment");

class UCPagamentoPatrocinioExcluir {
  constructor(GestaoDetalhePatrociniosRepository) {
    this.GestaoDetalhePatrociniosRepository = GestaoDetalhePatrociniosRepository;
  }

  async validate(idDataPagamento) {
    if (!idDataPagamento) {
      throw new exception(
        `Favor informar id do pagamento`,
        500
      );
    }

    this.idDataPagamento = idDataPagamento;
  }

  async run() {
    const isPagamentoExcluido = await this.GestaoDetalhePatrociniosRepository.deletePagamento(this.idDataPagamento);

    return isPagamentoExcluido;
  }
}

module.exports = UCPagamentoPatrocinioExcluir;