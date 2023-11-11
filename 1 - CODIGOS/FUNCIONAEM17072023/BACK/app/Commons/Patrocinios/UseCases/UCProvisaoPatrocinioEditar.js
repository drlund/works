"use strict";

const moment = require ("moment");

class UCProvisaoPatrocinioEditar {
  constructor(GestaoDetalhePatrociniosRepository) {
    this.GestaoDetalhePatrociniosRepository = GestaoDetalhePatrociniosRepository;
    this.validated = false;
  }

  async validate(dataProvisao) {
    this.dataProvisao = dataProvisao;
    // this.usuario= usuario;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }

    // const dadosEditados = this.dataProvisao;
    // dadosEditados = JSON.parse(dadosEditados)
    const isProvisaoEditada = await this.GestaoDetalhePatrociniosRepository.patchProvisao(this.dataProvisao);

    return isProvisaoEditada;
  }
}

module.exports = UCProvisaoPatrocinioEditar;
