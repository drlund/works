"use strict";

const _ = require("lodash");

class UcJurisdicoesSubordinadas {
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

    const buscaJurisdicoes = await this.ParametrosAlcadasRepository.getJurisdicoesSubordinadas(this.prefixo);

    return buscaJurisdicoes;
  }
}

module.exports = UcJurisdicoesSubordinadas;