/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const fluxoModel = use("App/Models/Mysql/Encantar/Fluxo");

/**
 *
 * Função que recebe um prefixo e devolve o fluxo de aprovação do mesmo, conforme descrito na tabela 'fluxo' do banco de dados 'encantar'
 *
 *  @param {String} prefixo
 *  @param {Boolean} somenteAtivos
 *  @return {Array}
 */

const getFluxoAprovacao = async (prefixo, somenteAtivos = true) => {
  const fluxo = await fluxoModel
    .query()
    .select(
      "prefixo",
      "prefixoAutorizador",
      "sequencia",
      "ativo",
      "uor",
      "nomePrefixo",
      "nomePrefixoAutorizador"
    )
    .where("prefixo", prefixo)
    .where("ativo", somenteAtivos)
    .orderBy("sequencia", "asc")
    .fetch();

  // Caso seja somente os ativos, o campo sequencia é corrigido
  return somenteAtivos
    ? fluxo.toJSON().map((prefixo, indice) => {
        return { ...prefixo, sequencia: indice + 1 };
      })
    : fluxo;
};

module.exports = getFluxoAprovacao;
