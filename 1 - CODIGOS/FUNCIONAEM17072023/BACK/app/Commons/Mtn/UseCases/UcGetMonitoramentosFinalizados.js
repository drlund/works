"use strict";
const visao = use("App/Commons/Mtn/ComiteMtn/Constants");
class UcGetMonitoramentosPendentesVotacao {
  constructor(Visoesrepository) {
    this.visoesRepository = Visoesrepository;
  }

  async run() {
    const visoes = await this.visoesRepository.filtrarVisoesPorStatus(
      visao.STATUS.FINALIZADA
    );
    return visoes;
  }
}

module.exports = UcGetMonitoramentosPendentesVotacao;
