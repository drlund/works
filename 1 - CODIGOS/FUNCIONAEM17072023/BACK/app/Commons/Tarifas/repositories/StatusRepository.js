"use strict";

const { caminhoModels } = use("App/Commons/Tarifas/constants");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const OcorrenciaStatusModel = use(`${caminhoModels}/OcorrenciaStatus`);

const {
  ACAO_RESERVA,
  ACAO_REGISTRO_PGTO,
  ACAO_CONFIRMA_REGISTRO_PGTO,
  ACAO_CANCELOU_REGISTRO_PGTO,
  ACAO_CANCELOU_RESERVA,
  STATUS_RESERVADA,
  STATUS_PENDENTE_RESERVA,
  STATUS_PGTO_REGISTRADO,
  STATUS_FINALIZADO,
} = use(`App/Commons/Tarifas/constants`);

const mapaAcoesStatus = {
  [ACAO_RESERVA]: STATUS_RESERVADA,
  [ACAO_REGISTRO_PGTO]: STATUS_PGTO_REGISTRADO,
  [ACAO_CONFIRMA_REGISTRO_PGTO]: STATUS_FINALIZADO,
  [ACAO_CANCELOU_REGISTRO_PGTO]: STATUS_RESERVADA,
  [ACAO_CANCELOU_RESERVA]: STATUS_PENDENTE_RESERVA,
};

class StatusRepository {
  constructor() {
    this.mapaAcoesStatus = mapaAcoesStatus;
  }

  getMapaAcoesStatus() {
    return this.mapaAcoesStatus;
  }

  async atualizarStatus(idOcorrencia, acao, trx) {
    const novoStatus = this.mapaAcoesStatus[acao];

    const status = await OcorrenciaStatusModel.findBy(
      "idPublicoAlvo",
      idOcorrencia
    );

    if (status) {
      status.idStatus = novoStatus;
      await status.save(trx);
    } else {
      await OcorrenciaStatusModel.create(
        {
          idPublicoAlvo: idOcorrencia,
          idStatus: novoStatus,
        },
        trx
      );
    }
  }
}

module.exports = StatusRepository;
