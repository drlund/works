const _ = require("lodash");

const exception = use("App/Exceptions/Handler");

const Mstd501e = use("App/Models/Mysql/Arh/Mstd501e");
const GerenciasSuperAdm = use("App/Models/Mysql/Arh/GerenciasSuperAdm");
const Plataforma = use("App/Models/Mysql/Plataforma");

async function getGerevsPlataforma(user) {
  try {
    const plataforma = await Plataforma.query()
      .from('quadroPlataformas')
      .where('matricula', user.chave)
      .first();

    if (!_.isNil(plataforma) && !_.isEmpty(plataforma)) {
      const plataformas = plataforma.toJSON();
      const isPlataforma = true;
      const gerevsPlataforma = plataformas.gerev.split(',');
      return [isPlataforma, gerevsPlataforma];
    }
    return [false, []];
  } catch (err) {
    throw new exception(err);
  }
}

module.exports = getGerevsPlataforma;