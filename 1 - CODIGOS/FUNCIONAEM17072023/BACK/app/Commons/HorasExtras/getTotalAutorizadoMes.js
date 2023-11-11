const exception = use("App/Exceptions/Handler");
const Solicitacoes = use("App/Models/Mysql/HorasExtras/Solicitacoes");
const _ = require("lodash");
const moment = require("moment");
const inicioFimMes = use("App/Commons/HorasExtras/funcoesHora");

async function getTotalAutorizadoMes (prefixo, perBase) {
  try {

    const {inicioMes, fimMes} = await inicioFimMes(moment(perBase));

    const row = await Solicitacoes.query()
      .where('data_evento', '>=', inicioMes)
      .where('data_evento', '<=', fimMes)
      .where('pref_dep', prefixo)
      .sum("qtd_horas_aut as total_aut")

    const { total_aut } = _.head(row);

    if (_.isNil(total_aut)) {
      return 0;
    }

    return total_aut;
  } catch (err) {
    throw new exception(err, 404);
  }
}

module.exports = getTotalAutorizadoMes;