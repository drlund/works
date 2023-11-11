"use strict";

const moment = require("moment");

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcGetDiasNaoUteis extends AbstractUserCase {

  async _action({prefixo}) {
    const {
      getFeriadosPrefixo,
      getFeriadosNacionais,
      getFeriadosFixos,
    } = this.functions;

    const feriadosPrefixo = await getFeriadosPrefixo(prefixo);
    const feriadosNacionais = await getFeriadosNacionais();
    const feriadosFixos = await getFeriadosFixos();

    const feriadosFixosFormatados = [];
    feriadosFixos.map((dia) => {
      const data = dia.split('-').map((elem) => elem.padStart(2, '0')).join('-');
      const ano = moment().year();
      const anos = [ano, ano+1];
      return anos.map((ano) => {
        const date = ano + '-' + data;
        feriadosFixosFormatados.push(moment(date));
        return ano;
      });
    });

    const datas = [];
    if (feriadosPrefixo.length) datas.push(...feriadosPrefixo);
    if (feriadosNacionais.length) datas.push(...feriadosNacionais);
    if (feriadosFixosFormatados.length) datas.push(...feriadosFixosFormatados.map((data) => ({data_feriado: moment(data).startOf('day').toString()})));

    return datas.map((elem) => moment(elem.data_feriado));
  }

  _checks({
    prefixo
  }) {
    if (!prefixo) throw new Error("O prefixo deve ser informado!", 400 );
  }
}

module.exports = UcGetDiasNaoUteis;
