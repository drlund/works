"use strict";

const _ = require("lodash");

class UCPagamentosPatrociniosBusca {
  constructor(GestaoDetalhePatrociniosRepository, ) {
    this.GestaoDetalhePatrociniosRepository = GestaoDetalhePatrociniosRepository;
    this.validated = false;
  }

  async validate(id) {
    this.idSolcitacao = this.idSolcitacao
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

    const buscaPagamentos = await this.GestaoDetalhePatrociniosRepository.getPagamentos(this.id);

    return buscaPagamentos;
  }
}

module.exports = UCPagamentosPatrociniosBusca;
