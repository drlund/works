const JurisdicoesSubordinadas = use('App/Models/Mysql/JurisdicoesSubordinadas');
const dependenciaModel = use('App/Models/Mysql/Dependencia');
const _ = require('lodash');

const exception = use('App/Exceptions/Handler');

/**
 * Método utilitário para consultar dados de prefixos, consultando por partes do nome ou do número do prefixo.
 *
 * @param {*} prefixo número do prefixo (pode ser incompleto) ou nome da dependência (pode ser incompleto)
 */

async function getDepESubord(prefixo, usuario) {

  try {
    if (usuario.uor === "000456778") {
      usuario.uor = "000018948"
    }

    let deps = await JurisdicoesSubordinadas.query()
      .where(function () {
        this
          .where('prefixo_subordinada', 'like', `%${prefixo}%`)
          .orWhere('nome_subordinada', 'like', `%${prefixo}%`)
      })
      .where("cd_subord_subordinada", "00")
      .where("uor", usuario.uor)
      .fetch();

    deps = deps.toJSON();

    deps = deps.map(elem => elem.prefixo_subordinada);

    let dependencias = await dependenciaModel.query().select("mstd503e.EmaildaUOR as email", "mst606.*").from("mst606")
      .innerJoin('mstd503e', 'mst606.uor_dependencia', 'mstd503e.CodigodaUOR')
      .where({ cd_subord: "00" }).where("IndEmailPrincipal", "S").where("dt_encerramento", ">", "NOW()")
      .whereIn('prefixo', deps)
      .fetch();

    return dependencias.toJSON();
  } catch (error) {
      throw new exception(error, 404);
    }
}

module.exports = getDepESubord;
