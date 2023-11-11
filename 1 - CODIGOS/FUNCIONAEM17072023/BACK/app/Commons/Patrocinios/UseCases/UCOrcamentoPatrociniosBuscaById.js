"use strict";

const _ = require("lodash");

class UCOrcamentoPatrociniosBuscaById {
  constructor(GestaoDetalhePatrociniosRepository, ) {
    this.GestaoDetalhePatrociniosRepository = GestaoDetalhePatrociniosRepository;
    this.validated = false;
  }

  async validate(id) {
    this.idProjeto = this.id;
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

    const buscaOrcamentoById = await this.GestaoDetalhePatrociniosRepository.getOrcamentoById(this.id);

    return buscaOrcamentoById;
  }
}

module.exports = UCOrcamentoPatrociniosBuscaById;
