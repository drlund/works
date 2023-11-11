const _ = require('lodash');

const JurisdicoesSubordinadas = use('App/Models/Mysql/JurisdicoesSubordinadas');
const isPrefixoUN = use('App/Commons/Arh/isPrefixoUN');
const Constants = use('App/Commons/Designacao/Constants');

const exception = use('App/Exceptions/Handler');

/**
 * Método utilitário para consultar dados de prefixos, consultando por partes do nome ou do número do prefixo.
 *
 * @param {*} prefixo número do prefixo (pode ser incompleto) ou nome da dependência (pode ser incompleto)
 */

const tipDepAgencias = [
  Constants.TIP_DEP.AGENCIA,
  Constants.TIP_DEP.PAA,
  Constants.TIP_DEP.ESTILO,
  Constants.TIP_DEP.POSTO,
  Constants.TIP_DEP.ESCRITORIO,
];

async function getPrefixoMadrinha(prefixo) {
  try {
    let prefixos = [];

    const sup = await JurisdicoesSubordinadas.query()
      .whereHas("prefixo_mst", (builder) => {
        builder.whereIn("tip_dep", tipDepAgencias)
          .where("cd_subord", '00')
      })
      .where("cd_subord_subordinada", "00")
      .where("prefixo_subordinada", prefixo)
      .first();

    if (_.isNull(sup)) return sup;

    const madrinha = sup.toJSON();

    return { prefixo: madrinha.prefixo, nome: madrinha.nome, uor: madrinha.uor };
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getPrefixoMadrinha;
