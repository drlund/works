"use strict";

const ExceptionHandler = require("../../../Exceptions/Handler");

class UcAlterarParametros {
  /**
   * @param {any} TestaParametrosRepository
   */
  constructor(TestaParametrosRepository) {
    this.testaParametrosRepository = TestaParametrosRepository;
    this.validated = false;
  }

  /**
   * @param {{ id: any; comite: any; nomeComite: any; observacao: string; }} novoParametro
   */
  async validate(novoParametro) {
    this.novoParametro = novoParametro;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }
  
    const { id, comite, nomeComite, observacao } = this.novoParametro;
  
    const novoParametro = {
      comite,
      nomeComite
    };
  
    await this.testaParametrosRepository.patchParametros(id, novoParametro);
    await this.testaParametrosRepository.patchParametrosObservacao(id, observacao);
  
    return true;
  }
  
}

module.exports = UcAlterarParametros;