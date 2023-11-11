
"use strict";

const _ = require("lodash");

class UcAtualizarStatusParametro {
  /**
   * @param {import("../Repositories/TestaParametrosRepository")} TestaParametrosRepository
   */
  constructor(TestaParametrosRepository) {
    this.TestaParametrosRepository = TestaParametrosRepository;
    this.validated = false;
  }

  /**
   * @param {any} prefixoDestino
   * @param {any} comissaoDestino
   * @param {any} ativo
   */
  async validate(prefixoDestino, comissaoDestino, ativo) {
    this.prefixoDestino = prefixoDestino;
    this.comissaoDestino = comissaoDestino;
    this.ativo = ativo;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }

    const ativo = "0";
    const atualizacao =
      await this.TestaParametrosRepository.atualizarStatusParametro(
        this.prefixoDestino,
        this.comissaoDestino,
        ativo
      );

    return atualizacao;
  }
}

module.exports = UcAtualizarStatusParametro;