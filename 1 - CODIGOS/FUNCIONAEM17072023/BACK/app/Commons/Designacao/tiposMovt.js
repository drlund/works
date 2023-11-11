const exception = use('App/Exceptions/Handler');
const Designacao = use('App/Models/Mysql/Designacao');
const _ = require('lodash');

async function tiposMovt(funcao) {
  try {
    let tipos = await Designacao.query()
      .from('tipos')
      .where('valido', 1)
      .fetch();

    tipos = tipos.toJSON();

    return tipos;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = tiposMovt;
