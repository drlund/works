"use strict";
const visao = use("App/Commons/Mtn/ComiteMtn/Constants");
class UcGetMonitoramentosParaNovaVersao {
  constructor(Visoesrepository) {
    this.visoesRepository = Visoesrepository;
  }

  async run() {
    const STATUS_PERMITEM_NOVA_VERSAO = [
      visao.STATUS.COM_PARAMETROS_APROVADOS,
      visao.STATUS.PENDENTE_INCLUSAO_PARAMETROS,
      visao.STATUS.SUSPENSO,
    ];

    const visoes = await this.visoesRepository.filtrarVisoesPorStatus(
      STATUS_PERMITEM_NOVA_VERSAO
    );
    return visoes;
  }
}

module.exports = UcGetMonitoramentosParaNovaVersao;
