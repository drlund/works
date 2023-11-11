"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcGetPrefixosTeste extends AbstractUserCase {

  async _action() {
    const { prefsTesteRepository } = this.repository;
    const resultado = await prefsTesteRepository.getSupersTeste();

    return resultado.map((item) => item.super);
  }

  _checks() {
  }
}

module.exports = UcGetPrefixosTeste;
