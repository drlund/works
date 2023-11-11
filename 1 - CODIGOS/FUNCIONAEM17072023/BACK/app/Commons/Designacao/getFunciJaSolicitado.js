const exception = use('App/Exceptions/Handler');
const Solicitacao = use('App/Models/Mysql/Designacao');
const _ = require('lodash');

async function getFunciJaSolicitado(funci, iniDesig, fimDesig) {
  try {
    let pendentes = await Solicitacao
      .query()
      .from('solicitacoes')
      .where('matr_orig', funci)
      .where((builder) => {
        builder
        .where('dt_ini', '<=', iniDesig)
        .orWhere('dt_fim', '>=', fimDesig);
      })
      .fetch();

    pendentes = pendentes.toJSON();

    return pendentes;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getFunciJaSolicitado;