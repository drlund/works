"use strict";

const moment = require("moment");

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcGetDiasUteis extends AbstractUserCase {

  async _action({
    data,
    quando,
    prefixo
  }) {
    const {
      isFeriadoNacional,
      isFeriadoPrefixo,
      isFinalSemana,
    } = this.functions;

    let date = moment(data).startOf("day");
    let util = false;

    while (!util) {
      date = date.toISOString();

      const ferNac = await isFeriadoNacional(date);
      const ferPref = await isFeriadoPrefixo(date, parseInt(prefixo));
      const fimSem = await isFinalSemana(date);

      if (!ferNac && !ferPref && !fimSem) {
        util = !util;
      } else {
        if (quando === 1) {
          date = moment(date).startOf("day").add(1, "days");
        }
        if (quando === 0) {
          date = moment(date).startOf("day").subtract(1, "days");
        }
      }
    }

    return moment(date);
  }

  _checks({
    data,
    quando,
    prefixo
  }) {
    if (!data) throw new Error("A data deve ser informada", 400 );
    if (!quando) throw new Error("A flag de dia útil anterior ou próximo deve ser informada", 400 );
    if (!prefixo) throw new Error("O prefixo deve ser informado", 400 );
  }
}

module.exports = UcGetDiasUteis;
