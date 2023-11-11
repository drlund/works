"use strict";

class UcAlterarParametros {
  /**
   * @param {any} ParametrosAlcadasRepository
   */
  constructor(ParametrosAlcadasRepository) {
    this.ParametrosAlcadasRepository = ParametrosAlcadasRepository;
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
      // @ts-ignore
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
  
    await this.ParametrosAlcadasRepository.patchParametros(id, novoParametro);
    await this.ParametrosAlcadasRepository.patchParametrosObservacao(id, observacao);
  
    return true;
  }
  
}

module.exports = UcAlterarParametros;