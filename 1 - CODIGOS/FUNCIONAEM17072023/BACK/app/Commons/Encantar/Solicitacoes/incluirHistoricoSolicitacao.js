//CONSTANTES
const { EncantarConsts } = use("Constants");
const { ACOES_HISTORICO_SOLICITACAO } = EncantarConsts;

/**
 *
 *  Função para incluir nova entrada no histórico de uma solicitação
 *
 *  @param {Object} solicitacao Instância do model da solicitação
 *
 */

const incluirHistoricoSolicitacao = async (
  solicitacao,
  usuarioLogado,
  acaoHistoricoSolicitacao,
  trx
) => {
  //Incluir no histórico
  await solicitacao.historico().create(
    {
      matriculaFunci: usuarioLogado.chave,
      nomeFunci: usuarioLogado.nome_usuario,
      prefixo: usuarioLogado.prefixo,
      nomePrefixo: usuarioLogado.dependencia,
      idAcao: acaoHistoricoSolicitacao,
    },
    trx
  );
};

module.exports = incluirHistoricoSolicitacao;
