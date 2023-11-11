const exception = use("App/Exceptions/Handler");
const { EncantarConsts } = use("Constants");
const { TIPOS_APROVACAO, ACOES_HISTORICO_SOLICITACAO } = EncantarConsts;

const getAcaoHistoricoPorTipoAprovacao = (tipo) => {
  switch (tipo) {
    case TIPOS_APROVACAO.DEFERIR:
      return ACOES_HISTORICO_SOLICITACAO.APROVACAO_FLUXO;

    case TIPOS_APROVACAO.INDEFERIR:
      return ACOES_HISTORICO_SOLICITACAO.REPROVACAO_FLUXO;

    default:
      throw new exception(
        `Função getAcaoHistoricoPorTipoAprovacao: Tipo de aprovação ${tipo} não implementada`,
        500
      );
      break;
  }
};

module.exports = getAcaoHistoricoPorTipoAprovacao;
