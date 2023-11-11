const typeDefs = require("../../../Types/TypeUsuarioLogado");

const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS, STATUS_SOLICITACAO } = EncantarConsts;
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);

/**
 *
 *  Função que retorna as solicitações que estão pendentes entrega ao cliente.
 *
 *
 *  @param {typeDefs.UsuarioLogado} usuarioLogado
 */

const getSolicitacoesPendentesParaEntrega = async () => {
  const solicitacoesParaRecebimento = await solicitacoesModel
    .query()
    .where("idSolicitacoesStatus", STATUS_SOLICITACAO.PENDENTE_ENTREGA)
    .with("envio")
    .with("status")
    .fetch();
  return solicitacoesParaRecebimento;
};

module.exports = getSolicitacoesPendentesParaEntrega;
