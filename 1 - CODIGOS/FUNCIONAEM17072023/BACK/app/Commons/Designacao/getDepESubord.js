const JurisdicoesSubordinadas = use('App/Models/Mysql/JurisdicoesSubordinadas');
const _ = require('lodash');
const getAcessoSuperadm = use('App/Commons/Designacao/getAcessoSuperadm');

const exception = use('App/Exceptions/Handler');

/**
 * Método utilitário para consultar dados de prefixos, consultando por partes do nome ou do número do prefixo.
 *
 * @param {*} prefixo número do prefixo (pode ser incompleto) ou nome da dependência (pode ser incompleto)
 */

async function getDepESubord(usuario) {
  try {
    if (usuario.uor === "000456778") {
      usuario.uor = await getAcessoSuperadm(usuario);
    }

    let deps = await JurisdicoesSubordinadas.query()
      .where("cd_subord_subordinada", "00")
      .where("uor", usuario.uor)
      .fetch();


    deps = deps.toJSON();

    deps = deps.map(elem => elem.prefixo_subordinada);

    return deps;
  } catch (err) {
    throw new exception(err, 404);
  }
}

module.exports = getDepESubord;
