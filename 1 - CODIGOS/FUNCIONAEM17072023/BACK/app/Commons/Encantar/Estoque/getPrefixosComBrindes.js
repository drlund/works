/**
 * @typedef {Object} PrefixoComPermissao
 * @property {number} id
 * @property {string} prefixo
 * @property {boolean} global
 */

const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS } = EncantarConsts;

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const permissaoEstoqueModel = use(`${CAMINHO_MODELS}/BrindesEstoquePermissao`);
const typeDefs = require("../../Arh/getHierarquiaDependencia.typedef");

/**
 *  Retorna os prefixos dentro da hieraquia do prefixo que possuem brindes
 *
 *  @function
 *  @param {typeDefs.Hierarquia} hierarquia Indica se deseja que retorne somente os prefixos com permissão e que tenham brindes
 *  @param {Boolean} somenteAtivos Indica se deseja considerar somente os estoques de brindes que estão ativos
 *  @returns {typeDefs.PrefixoComPermissao} Array de prefixos com permissão para possuir estoque
 *
 */

const getPrefixosComBrindes = async (hierarquia, somenteAtivos) => {
  let prefixosComBrindes = [];
  const queryComum = permissaoEstoqueModel
    .query()
    .whereHas("estoques", (builder) => {
      builder.where("estoque", ">", 0);
    })
    .withCount("estoques");

  for (const tipoHierarquia of ["subordinadas", "subordinantes"]) {
    if (hierarquia[tipoHierarquia].length > 0) {
      const prefixos = await queryComum
        .clone()
        .whereIn("prefixo", hierarquia[tipoHierarquia])
        .fetch();
      prefixosComBrindes = [...prefixosComBrindes, ...prefixos.toJSON()];
    }
  }

  const prefixos = await queryComum
    .clone()
    .where("global", true)
    .withCount("estoques")
    .fetch();

  prefixosComBrindes = [...prefixosComBrindes, ...prefixos.toJSON()];

  return prefixosComBrindes.map((prefixo) => {
    return {
      id: prefixo.id,      
      prefixo: prefixo.prefixo,
      nomePrefixo: prefixo.nomePrefixo,
      global: prefixo.global,
      qtdEstoques: prefixo.__meta__.estoques_count,
    };
  });
};

module.exports = getPrefixosComBrindes;
