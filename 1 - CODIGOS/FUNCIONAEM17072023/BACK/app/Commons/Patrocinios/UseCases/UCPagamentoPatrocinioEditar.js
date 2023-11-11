"use strict";

const moment = require ("moment");

class UCPagamentoPatrocinioEditar {
  constructor(GestaoDetalhePatrociniosRepository) {
    this.GestaoDetalhePatrociniosRepository = GestaoDetalhePatrociniosRepository;
    this.validated = false;
  }

  async validate(dataPagamento) {
    this.dataPagamento = dataPagamento;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }

    const pagamentoEditado = await this.GestaoDetalhePatrociniosRepository.patchPagamento(this.dataPagamento);

    return pagamentoEditado;
  }
}

module.exports = UCPagamentoPatrocinioEditar;
