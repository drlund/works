"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcVincularNovosAnexos extends AbstractUserCase {
  async _checks() {}

  async _action(anexosArray, idFlex, trx) {
    const { anexos } = this.repository;

    anexosArray.forEach(async (anexo) => {
      await anexos.vincularAnexo(anexo, idFlex, this.trx);
    });
  }
}

module.exports = UcVincularNovosAnexos;
