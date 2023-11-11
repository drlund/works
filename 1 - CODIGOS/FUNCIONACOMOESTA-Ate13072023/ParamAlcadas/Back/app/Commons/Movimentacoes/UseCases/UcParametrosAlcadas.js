"use strict";

class UcParametrosAlcadas {

  /**
   * @param {any} ParametrosAlcadasRepository
   */
  constructor(ParametrosAlcadasRepository, ) {
    this.ParametrosAlcadasRepository = ParametrosAlcadasRepository;
    this.validated = false;
  }

  /**
   * @param {number} id
   */
  async validate(id) {
    this.id = id;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }

    const buscaParametros = await this.ParametrosAlcadasRepository.getParametros(this.id);

    return buscaParametros;
  }
}

module.exports = UcParametrosAlcadas;