"use strict";

const _ = require("lodash");

class UcComites {
  /**
   * @param {import("../Repositories/ParametrosAlcadasRepository")} ParametrosAlcadasRepository
   */
  constructor(ParametrosAlcadasRepository, ) {
    this.ParametrosAlcadasRepository = ParametrosAlcadasRepository;
    this.validated = false;
  }

  /**
   * @param {string} prefixo
   */
  async validate(prefixo) {
    this.prefixo = prefixo;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }

    const buscaComites = await this.ParametrosAlcadasRepository.listaComiteParamAlcadas(this.prefixo);

    return buscaComites;
  }
}

module.exports = UcComites;