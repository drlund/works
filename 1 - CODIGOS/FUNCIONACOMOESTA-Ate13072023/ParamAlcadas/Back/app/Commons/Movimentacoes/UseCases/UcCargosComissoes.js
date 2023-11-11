"use strict";

const _ = require("lodash");

class UcCargosComissoes {
  /**
   * @param {import("../Repositories/ParametrosAlcadasRepository")} ParametrosAlcadasRepository
   */
  constructor(ParametrosAlcadasRepository, ) {
    this.ParametrosAlcadasRepository = ParametrosAlcadasRepository;
    this.validated = false;
  }

  /**
   * @param {string} cod_dependencia
   */
  async validate(cod_dependencia) {
    this.cod_dependencia = cod_dependencia;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }

    const buscaCargosComissoes = await this.ParametrosAlcadasRepository.getCargosComissoesFot09(this.cod_dependencia);

    return buscaCargosComissoes;
  }
}

module.exports = UcCargosComissoes;