"use strict";

const exception = use("App/Exceptions/Handler");
const Database = use("Database");
const { STATUS_PARAMETROS, STATUS } = use(
  "App/Commons/Mtn/ComiteMtn/Constants"
);

class UcExcluirVotacao {
  constructor(visoesRepository, versaoRepository) {
    this.visoesRepository = visoesRepository;
    this.versaoRepository = versaoRepository;
  }

  async validate(idMonitoramento) {
    const existeMonitoramento = await
      this.visoesRepository.existeMonitoramento(idMonitoramento);
    if (!existeMonitoramento) {
      throw new exception("Monitoramento inválido!", 400);
    }

    this.idMonitoramento = idMonitoramento;
  }

  async run() {
    const trx = await Database.connection("pgMtn").beginTransaction();

    try {
      await this.versaoRepository.atualizarStatusVersaoByVisao(
        this.idMonitoramento,
        STATUS_PARAMETROS.EXCLUIDO,
        trx
      );

      await this.visoesRepository.atualizarStatusVisao(
        this.idMonitoramento,
        STATUS.PENDENTE_INCLUSAO_PARAMETROS,
        trx
      );

      await this.visoesRepository.atualizarVersaoAtual(
        this.idMonitoramento,
        null,
        trx
      );
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }
  }
}

module.exports = UcExcluirVotacao;
