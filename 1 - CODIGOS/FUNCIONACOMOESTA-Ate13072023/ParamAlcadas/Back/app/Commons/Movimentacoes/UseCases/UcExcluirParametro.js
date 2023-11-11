"use strict";

class UcExcluirParametro {
  /**
   * @param {import("../Repositories/ParametrosAlcadasRepository")} ParametrosAlcadasRepository
   */
  constructor(ParametrosAlcadasRepository) {
    this.ParametrosAlcadasRepository = ParametrosAlcadasRepository;
  }

  /**
   * @param {string} idParametro
   */
  async validate(idParametro) {
    if (!idParametro) {
      throw new exception(
        `Favor informar id do Parâmetro`,
        500
      );
    }

    this.idParametro = idParametro;
  }

  async run() {
    const isParametroExcluido = await this.ParametrosAlcadasRepository.delParametro(this.idParametro)

    return isParametroExcluido;
  }
}

module.exports = UcExcluirParametro;