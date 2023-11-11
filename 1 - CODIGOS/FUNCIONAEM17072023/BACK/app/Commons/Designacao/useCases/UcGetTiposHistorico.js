"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcGetTiposHistorico extends AbstractUserCase {

  async _action() {
    const { tiposHistoricoRepository } = this.repository;

    const tiposHistorico = await tiposHistoricoRepository.getAll();

    return tiposHistorico;
  }

  _checks({ id }) {
    return id;
  }

}


module.exports = UcGetTiposHistorico;