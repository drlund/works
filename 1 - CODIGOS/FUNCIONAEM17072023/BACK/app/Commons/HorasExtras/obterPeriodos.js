const exception = use("App/Exceptions/Handler");
const moment = require("moment");
const _ = require("lodash");
const {isPrefixoUT, isPrefixoUN} = use("App/Commons/Arh");
const Solicitacoes = use("App/Models/Mysql/HorasExtras/Solicitacoes");
const isPrefixoSuperAdm = use("App/Commons/HorasExtras/isPrefixoSuperAdm");

async function obterPeriodos(usuario) {
  try {

    const data = Solicitacoes.query()
      .select('data_evento')
      .groupByRaw('LEFT(data_evento, 7) desc');

    if (await isPrefixoUT(usuario.prefixo) && !await isPrefixoSuperAdm(usuario.prefixo)) {
      data.where(builder => {
        builder.where('pref_sup', usuario.pref_super);
      })
    }

    if (await isPrefixoUN(usuario.prefixo)) {
      data.where(builder => {
        builder.where('pref_dep', usuario.prefixo);
      })
    }

    const resultado = await data.fetch();

    const dataResult = resultado.toJSON();

    const periodos = dataResult.map(periodo => {
      const [mes, ano] = periodo.mesAno.split('/');
      return { periodo: `${mes + ano}`, mesAno: periodo.mesAno, dataCompleta: `${ano}-${mes}-01`}
    });

    if (_.isEmpty(periodos.filter(per => per.mesAno === moment().format("MM/YYYY")))) {
      periodos.unshift({periodo: moment().format('YYYYMM'), mesAno: moment().format('MM/YYYY'), dataCompleta: moment().startOf('month').format("YYYY-MM-DD")});
    }

    return periodos;
  } catch (err) {
    throw new exception(err, 404);
  }
}

module.exports = obterPeriodos;
