"use strict";

const _ = require("lodash");

class UcPrefixoBySubordinada {

  /**
   * @param {import("../Repositories/ParametrosAlcadasRepository")} ParametrosAlcadasRepository
   */
  constructor(ParametrosAlcadasRepository, ) {
    this.ParametrosAlcadasRepository = ParametrosAlcadasRepository;
    this.validated = false;
  }

  /**
   * @param {string} prefixo_subordinada
   */
  async validate(prefixo_subordinada) {
    this.prefixo_subordinada = prefixo_subordinada;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }

    const buscaPrefixo = await this.ParametrosAlcadasRepository.getJurisdicoesSubordinadas(this.prefixo_subordinada);

    return buscaPrefixo;
  }
}

module.exports = UcPrefixoBySubordinada;