"use strict";

const _ = require("lodash");

class UCOrcamentoPatrociniosBusca {
  constructor(GestaoDetalhePatrociniosRepository, ) {
    this.GestaoDetalhePatrociniosRepository = GestaoDetalhePatrociniosRepository;
    this.validated = false;
  }

  async validate(id) {
    this.idProjeto = this.idProjeto;
    this.id = id;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }

    const buscaOrcamento = await this.GestaoDetalhePatrociniosRepository.getOrcamento(this.id);

    return buscaOrcamento;
  }
}

module.exports = UCOrcamentoPatrociniosBusca;
