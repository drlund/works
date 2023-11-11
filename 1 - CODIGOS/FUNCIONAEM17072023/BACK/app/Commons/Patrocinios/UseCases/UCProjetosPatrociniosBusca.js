"use strict";

const _ = require("lodash");

class UCProjetosPatrociniosBusca {
  constructor(GestaoDetalhePatrociniosRepository, ) {
    this.GestaoDetalhePatrociniosRepository = GestaoDetalhePatrociniosRepository;
    this.validated = false;
  }

  async validate(id, idSolicitacao) {
    this.id = id;
    this.idSolicitacao = idSolicitacao;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }

    const buscaProjetos = await this.GestaoDetalhePatrociniosRepository.getProjetos(this.idSolicitacao);

    return buscaProjetos;
  }
}

module.exports = UCProjetosPatrociniosBusca;
