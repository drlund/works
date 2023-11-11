const _ = require("lodash");
const exception = use("App/Exceptions/Handler");
const Acessos = use("App/Models/Mysql/Acessos");
const moment = require('moment');

async function FunciPossuiPerfil(user, perfil_requerido) {
  try {
    if (_.isNil(user)) {
        return false;
    }

    const perfil = await Acessos.query()
      .table('acesso_temporario')
      .where('chave', user.chave)
      .where('perfil', perfil_requerido)
      .where((builder) => {
        builder.where('data_expiracao', null)
          .orWhere('data_expiracao', moment().format("YYYY-MM-DD"))
      })
      .count("* as qtdePerfis");

    return _.head(perfil).qtdePerfis > 0;
  } catch (error) {
    throw new exception("Não foi possível gravar os dados da solicitação!", 400);
  }
}

module.exports = FunciPossuiPerfil;