const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS } = EncantarConsts;

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const fluxoModel = use(`${CAMINHO_MODELS}/Fluxo`);

/**
 *
 *  Verifica se um prefixo tem permissão para incluir uma solicitação de brinde
 *
 *
 *  @param {string} prefixo Prefixo que deseja-se checar se tem a permissão para incluir uma nova solicitação.
 *
 *  @return {boolean}
 */

const podeIncluirSolicitacao = async (prefixo) => {
  const fluxos = await fluxoModel
    .query()
    .where("prefixo", prefixo)
    .where("ativo", true)
    .fetch();
  return fluxos.toJSON().length > 0 ? true : false;
};

module.exports = podeIncluirSolicitacao;
