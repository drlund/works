const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS } = EncantarConsts;

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const brindesModel = use(`${CAMINHO_MODELS}/Brindes`);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const brindesEstoqueModel = use(`${CAMINHO_MODELS}/BrindesEstoque`);

const strategy = {
  somenteComEstoque: (query, parametro) => {
    query.whereRaw("estoque - reserva > 0");
  },

  somenteAtivos: (query, parametro) => {
    query.where("ativo", 1);
  },

  valorMaximo: (query, valorMaximo) => {
    query.whereHas("brinde", (builder) => {
      builder.where("valorEstimado", "<=", valorMaximo);
      builder.where("excluido", 0);
    });
  },
};

/**
 *
 *   Retorna lista de brindes por gestor
 *
 *  @param {string[]} prefixo Array de prefixos dos gestores de brinde
 *  @param {object} parametros
 *  @param {boolean} params.somenteComEstoque Informa se deseja retornar somente os brindes que tem estoque disponível
 *  @param {boolean} params.somenteAtivos Informa se deseja retornar somente os brindes que tem estoque disponível
 *  @param {number} params.valorMaximo Valor maximo dos brindes retornados
 *
 *  @return {object[]} Array de brindes
 */
const getBrindesByGestor = async (prefixos, parametros) => {
  const query = brindesEstoqueModel
    .query()
    .whereIn("prefixo", prefixos)
    .whereHas("brinde", (builder) => {
      builder.where("excluido", 0);
    });

  for (const parametro in parametros) {
    if (strategy[parametro]) {
      strategy[parametro](query, parametros[parametro]);
    }
  }

  const estoques = await query
    .with("brinde", (builder) => {
      builder.with("imagens");
    })
    .fetch();

  return estoques;
};

module.exports = getBrindesByGestor;
