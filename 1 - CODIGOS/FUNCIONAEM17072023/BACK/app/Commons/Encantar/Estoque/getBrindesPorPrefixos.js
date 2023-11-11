/**
 * @typedef {Object} PrefixoComPermissao
 * @property {number} id
 * @property {string} prefixo
 * @property {boolean} global
 */

const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS } = EncantarConsts;

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const estoquesModel = use(`${CAMINHO_MODELS}/BrindesEstoque`);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const permissaoEstoqueModel = use(`${CAMINHO_MODELS}/BrindesEstoquePermissao`);

/**
 *  Retorna os prefixos brindes dos prefixo descritos no array de brindes
 *
 *  @function
 *  @param {String[]} prefixos Prefixos detentores de brindes que se deseja consultar
 *  @returns {typeDefs.PrefixoComPermissao} Array de prefixos com permissão para possuir estoque
 *
 */

const getBrindesPorPrefixos = async (prefixos) => {
  const estoques = await permissaoEstoqueModel
    .query()
    .whereIn("prefixo", prefixos)
    .with("estoques", (builder) => {
      builder.with("brinde");
    })
    .fetch();

    return estoques;
};

module.exports = getBrindesPorPrefixos;
