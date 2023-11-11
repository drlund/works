"use strict";

const _ = require("lodash");

class UCProvisaoPatrociniosBusca {
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

    const buscaProvisao = await this.GestaoDetalhePatrociniosRepository.getProvisao(this.id);

    return buscaProvisao;
  }
}

module.exports = UCProvisaoPatrociniosBusca;
