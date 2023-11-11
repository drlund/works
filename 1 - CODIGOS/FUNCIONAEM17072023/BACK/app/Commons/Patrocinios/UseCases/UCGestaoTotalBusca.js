"use strict";

const _ = require("lodash");

class UCGestaoTotalBusca {
  constructor(GestaoDetalhePatrociniosRepository, ) {
    this.GestaoDetalhePatrociniosRepository = GestaoDetalhePatrociniosRepository;
    this.validated = false;
  }

  async validate(id) {
    this.idSolicitacao = this.idSolicitacao;
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

    const buscaGestaoTotal = await this.GestaoDetalhePatrociniosRepository.getGestaoTotal(this.id);

    return buscaGestaoTotal;
  }
}

module.exports = UCGestaoTotalBusca;
