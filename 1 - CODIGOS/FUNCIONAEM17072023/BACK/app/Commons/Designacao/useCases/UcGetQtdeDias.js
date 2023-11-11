"use strict";

const moment = require("moment");

const {
  dateDiff
} = use("App/Commons/DateUtils");
const { AbstractUserCase } = require("../../AbstractUserCase");

class UcGetQtdeDias extends AbstractUserCase {

  async _action({
    inicio,
    fim,
    prefixo
  }) {
    const {
      isFeriadoNacional,
      isFeriadoPrefixo,
      isFinalSemana,
    } = this.functions;

    let dtIni = moment(inicio).startOf("day");
    let dtFim = moment(fim).startOf("day");

    const qtdeDias = dateDiff(moment(dtIni), moment(dtFim)) + 1;

    let qtdeDiasUteis = 0;

    while (dtIni.isBefore(dtFim) || dtIni.isSame(dtFim)) {
      dtIni = dtIni.toISOString();

      const ferNac = await isFeriadoNacional(dtIni);
      const ferPref = await isFeriadoPrefixo(dtIni, parseInt(prefixo, 10));
      const fimSem = await isFinalSemana(dtIni);

      if (!ferNac && !ferPref && !fimSem) {
        qtdeDiasUteis += 1;
      }

      dtIni = moment(dtIni).startOf("day").add(1, "days");
    }

    return { qtdeDias, qtdeDiasUteis };
  }

  _checks({
    inicio,
    fim,
    prefixo
  }) {
    if (!inicio) throw { message: "A data inicial deve ser informada", status: 400 };
    if (!fim) throw { message: "A data final deve ser informada", status: 400 };
    if (!prefixo) throw { message: "O prefixo deve ser informado", status: 400 };
  }
}

module.exports = UcGetQtdeDias;
