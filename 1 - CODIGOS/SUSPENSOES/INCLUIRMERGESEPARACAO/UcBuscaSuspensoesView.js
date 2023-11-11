"use strict";

const exception = use("App/Exceptions/Handler");

class UcBuscaSuspensoesView {

  /**
   * @param {import("../Repositories/ParametroSuspensaoRepository")} ParametroSuspensaoRepository
   */
  constructor(ParametroSuspensaoRepository, ) {
    this.ParametroSuspensaoRepository = ParametroSuspensaoRepository;
    this.validated = false;
  }

  /**
   * @param {string} tipoSuspensao
   */
  async validate(tipoSuspensao) {
    this.tipoSuspensao = tipoSuspensao;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }

    const buscaSuspensoes = await this.ParametroSuspensaoRepository.getSuspensoesView();

    return buscaSuspensoes;
  }
}

module.exports = UcBuscaSuspensoesView;