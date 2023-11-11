"use strict";

const OcorrenciaTarifaRepository = use(
  "App/Commons/Tarifas/repositories/OcorrenciaTarifaRepository"
);
const { ESPECIE, CONTA_CORRENTE } = use("App/Commons/Tarifas/constants");

class IsPgtoConta {
  constructor(idOcorrencia, ReceivedOcorrenciaRepository = null) {
    this.idOcorrencia = idOcorrencia;
    this.ocorrenciaRepository = ReceivedOcorrenciaRepository
      ? new ReceivedOcorrenciaRepository()
      : new OcorrenciaTarifaRepository();
  }

  async run() {
    const ocorrencia = await this.ocorrenciaRepository.getOneOcorrencia(
      this.idOcorrencia
    );

    if (!ocorrencia.isOcorrenciaReservada) {
      throw { message: "Ocorrência não reservada" };
    }

    return ocorrencia.reservas[0].tipoPagamento === CONTA_CORRENTE;
  }
}

module.exports = IsPgtoConta;
