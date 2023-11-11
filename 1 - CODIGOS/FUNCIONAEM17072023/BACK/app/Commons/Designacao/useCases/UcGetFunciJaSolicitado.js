"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcGetFunciJaSolicitado extends AbstractUserCase {

  async _action({
    funci,
    dataInicial,
    dataFinal
  }) {
    const { solicitacaoRepository } = this.repository;
    const resultado = await solicitacaoRepository.isFunciJaSolicitado(funci, dataInicial, dataFinal);

    return !!resultado.length;
  }

  _checks({
    funci, dataInicial, dataFinal
  }) {
    if (!funci) throw { message: "O funcionário deve ser informado", status: 400 };
    if (!dataInicial) throw { message: "A data inicial deve ser informada", status: 400 };
    if (!dataFinal) throw { message: "A data final deve ser informada", status: 400 };
  }

}

module.exports = UcGetFunciJaSolicitado;
