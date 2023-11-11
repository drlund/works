const exception = use('App/Exceptions/Handler');
const Situacao = use('App/Models/Mysql/Designacao/Situacao');
const _ = require('lodash');

async function getSituacoes() {

  try {
    let situacoes = await Situacao.all();

    situacoes = situacoes.toJSON();

    return situacoes;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getSituacoes;
