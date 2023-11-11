const exception = use('App/Exceptions/Handler');
const Dipes = use("App/Models/Mysql/Dipes");
const _ = require('lodash');
const Constantes = use("App/Templates/Designacao/Constantes");

//Private methods
async function isFunciIncorporado(funci) {
  const incorp = await Dipes.query()
    .select("data_posse_incorp")
    .from("arhfot01")
    .where("matricula", funci)
    .whereNotNull("data_posse_incorp")
    .fetch();

  if (!incorp) {
    throw new exception("Dados da consulta se Funci é Incorporado não encontrados.", 404);
  }

  if (incorp.rows.length) {
    const regul = await Dipes.query()
      .select("desc_evento")
      .from("arhfot02")
      .where("matricula", funci)
      .where("desc_evento", Constantes.REGULAMENTO_BB)
      .fetch();

    if (!regul) {
      throw new exception("Dados da consulta sobre funci assinou regulamento não encontrados.", 404);
    }

    const regulamento = regul.rows.length ? Constantes.REGULAMENTO_SIM_BB : Constantes.REGULAMENTO_NAO_BB;

    return ({ incorporado: true, regulamento: regulamento, regulamentoBB: regulamento !== Constantes.REGULAMENTO_NAO_BB ? true: false });
  }

  return ({ incorporado: false, regulamento: Constantes.REGULAMENTO_FUNCI_BB, regulamentoBB: true });
}

module.exports = isFunciIncorporado;