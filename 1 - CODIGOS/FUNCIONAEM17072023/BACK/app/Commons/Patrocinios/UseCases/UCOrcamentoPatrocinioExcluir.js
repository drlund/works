"use strict";

const moment = require ("moment");

class UCOrcamentoPatrocinioExcluir {
  constructor(GestaoDetalhePatrociniosRepository) {
    this.GestaoDetalhePatrociniosRepository = GestaoDetalhePatrociniosRepository;
  }

  async validate(idDataOrcamento) {
    if (!idDataOrcamento) {
      throw new exception(
        `Favor informar id do Orcamento`,
        500
      );
    }

    this.idDataOrcamento = idDataOrcamento;
  }

  async run() {
    const isOrcamentoExcluido = await this.GestaoDetalhePatrociniosRepository.deleteOrcamento(this.idDataOrcamento);

    return isOrcamentoExcluido;
  }
}

module.exports = UCOrcamentoPatrocinioExcluir;