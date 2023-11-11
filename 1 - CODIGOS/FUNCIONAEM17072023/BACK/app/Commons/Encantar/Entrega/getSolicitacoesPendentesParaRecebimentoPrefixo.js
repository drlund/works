const typeDefs = require("../../../Types/TypeUsuarioLogado");

const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS, STATUS_SOLICITACAO } = EncantarConsts;
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);

/**
 *
 *  Função que retorna as solicitações que foram enviadas para um prefixo e ainda não foi registrado o recebimento.
 *
 *
 *  @param {typeDefs.UsuarioLogado} usuarioLogado
 */

const getSolicitacoesParaRecebimento = async (usuarioLogado) => {
  const solicitacoesParaRecebimento = await solicitacoesModel
    .query()
    .where("idSolicitacoesStatus", STATUS_SOLICITACAO.PENDENTE_RECEBIMENTO_PREFIXO)
    .where("prefixoEntrega", usuarioLogado.prefixo)
    .with("envio")
    .with("status")
    .fetch();
  return solicitacoesParaRecebimento;
};

module.exports = getSolicitacoesParaRecebimento;
