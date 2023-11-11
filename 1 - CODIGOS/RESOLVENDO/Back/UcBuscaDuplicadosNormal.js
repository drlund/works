"use strict";

class UcBuscaDuplicados {
  /**
   * @param {import("../Repositories/ParametrosAlcadasRepository")} ParametrosAlcadasRepository
   */
  constructor(ParametrosAlcadasRepository, ) {
    this.ParametrosAlcadasRepository = ParametrosAlcadasRepository;
    this.validated = false;
  }

  /**
   * @param {string} prefixoDestino
   * @param {string} comissaoDestino
   */
  async validate(prefixoDestino, comissaoDestino) {
    this.prefixoDestino = prefixoDestino;
    this.comissaoDestino = comissaoDestino;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }

    const buscaDuplicados = await this.ParametrosAlcadasRepository.getDuplicados(this.prefixoDestino, this.comissaoDestino);

    return buscaDuplicados;
  }
}

module.exports = UcBuscaDuplicados;