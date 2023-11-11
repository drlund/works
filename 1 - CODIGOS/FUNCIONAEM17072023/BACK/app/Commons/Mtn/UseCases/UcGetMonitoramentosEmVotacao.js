"use strict";
const visao = use("App/Commons/Mtn/ComiteMtn/Constants");
class UcGetMonitoramentosEmVotacao {
  constructor(Visoesrepository) {
    this.visoesRepository = Visoesrepository;
  }

  async run() {
    const visoes = await this.visoesRepository.filtrarVisoesPorStatus([
      visao.STATUS.EM_VOTACAO,
    ]);
    return visoes;
  }
}

module.exports = UcGetMonitoramentosEmVotacao;
