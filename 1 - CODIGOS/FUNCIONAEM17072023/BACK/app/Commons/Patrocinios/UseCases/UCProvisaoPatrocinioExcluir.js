"use strict";

const moment = require ("moment");

class UCProvisaoPatrocinioExcluir {
  constructor(GestaoDetalhePatrociniosRepository) {
    this.GestaoDetalhePatrociniosRepository = GestaoDetalhePatrociniosRepository;
  }

  async validate(idDataProvisao) {
    if (!idDataProvisao) {
      throw new exception(
        `Favor informar id da provisão`,
        500
      );
    }

    this.idDataProvisao = idDataProvisao;
  }

  async run() {
    const isProvisaoExcluida = await this.GestaoDetalhePatrociniosRepository.deleteProvisao(this.idDataProvisao);

    return isProvisaoExcluida;
  }
}

module.exports = UCProvisaoPatrocinioExcluir;