'use strict';

class UcAlterarParametros {
  constructor(TestaParametrosRepository) {
    this.testaParametrosRepository = TestaParametrosRepository;
    this.validated = false;
  }

  async validate(novoParametro) {
    this.novoParametro = novoParametro;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new Exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }

    const { id, novoParametro, novoTextoObservacao } = this.novoParametro;

    await this.testaParametrosRepository.patchParametros(id, novoParametro);
    await this.testaParametrosRepository.patchParametrosObservacao(id, novoTextoObservacao);

    return true;
  }

  async run() {
    if (this.validated === false) {
      throw new Error(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }
  
    const { id, novoParametro, novoTextoObservacao } = this.novoParametro;
  
    await this.testaParametrosRepository.patchParametros(id, novoParametro);
    await this.testaParametrosRepository.patchParametrosObservacao(id, novoTextoObservacao);
  
    return true;
  }
}

module.exports = UcAlterarParametros;