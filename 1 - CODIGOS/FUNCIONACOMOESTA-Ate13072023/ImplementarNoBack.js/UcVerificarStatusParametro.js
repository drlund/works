"use strict";

class UcVerificarStatusParametro {
  /**
   * @param {any} TestaParametrosRepository
   */
  constructor(TestaParametrosRepository) {
    this.TestaParametrosRepository = TestaParametrosRepository;
  }

  /**
   * @param {any} idParametro
   */
  async validate(idParametro) {
    if (!idParametro) {
      // @ts-ignore
      throw new Exception(
        `Favor informar id do Parâmetro`,
        500
      );
    }

    this.idParametro = idParametro;
  }

  async run() {
    const isStatusVerificado = await this.TestaParametrosRepository.verificarStatusParametro(this.idParametro)

    return isStatusVerificado;
  }
}

module.exports = UcVerificarStatusParametro;