const _ = require("lodash");

const exception = use("App/Exceptions/Handler");
const Prefixo = use("App/Models/Mysql/Prefixo");
const Solicitacao = use("App/Models/Mysql/Designacao/Solicitacao");

const getDepESubord = use("App/Commons/Designacao/getDepESubord");
const {SITUACOES} = use("App/Commons/Designacao/Constants");

async function isPrefixoAcionado(prefixo) {
  try {
    // verifica se o prefixo foi acionado em algum protocolo ATIVO
    const dadosPrefixo = await Prefixo.query()
      .select('uor_dependencia')
      .where('prefixo', prefixo)
      .where('cd_subord', '00')
      .first();

    const subordSuper = await getDepESubord({uor: dadosPrefixo.uor_dependencia});

    const acionado = await Solicitacao.query()
      .where((subWhere) => {
        subWhere
          .where("pref_orig", prefixo)
          .orWhereIn("pref_dest", [prefixo, ...subordSuper])
      })
      .whereNotIn("id_situacao", [SITUACOES.CONCLUIDO, SITUACOES.CANCELADO])
      .first();

    if (!_.isNil(acionado)) {
      const prefixoAcionado = acionado.toJSON();
      if (!_.isEmpty(prefixoAcionado)) return true;
    }

    return false;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = isPrefixoAcionado;