/**
 * @typedef {Object} DadosEnvioSolicitacao
 *
 * @property {number} idSolicitacao,
 * @property {string} resultadoEntregaCliente,
 * @property {string} informacoes,
 * @property {Object} dataResultadoEntrega,
 * @property {Array} anexos,
 *
 */

const exception = use("App/Exceptions/Handler");

const { EncantarConsts } = use("Constants");
const {
  CAMINHO_MODELS,
  STATUS_SOLICITACAO,
  CAMINHO_COMMONS,
  RESULTADO_ENTREGA_CLIENTE,
  ACOES_HISTORICO_SOLICITACAO,
} = EncantarConsts;

const {
  ENTREGA_MAL_SUCEDIDA,
  ENTREGUE,
  PENDENTE_DEVOLVIDA,
} = STATUS_SOLICITACAO;
const {
  ENTREGUE_COM_SUCESSO,
  DEVOLVIDO,
  EXTRAVIADO,
} = RESULTADO_ENTREGA_CLIENTE;

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);

/** @type {typeof import('../../../Commons/Encantar/salvarAnexos')} */
const salvarAnexos = use(`${CAMINHO_COMMONS}/salvarAnexos`);

/**
 *   Função que recebe um resultado de entrega para cliente e
 *   devolve qual o status
 *
 *
 */

const mapearResultadoEntregaParaAcaoHistorico = (resultadoEntregaCliente) => {
  switch (resultadoEntregaCliente) {
    case ENTREGUE_COM_SUCESSO:
      return ACOES_HISTORICO_SOLICITACAO.REGISTRAR_RECEBIMENTO_CLIENTE;
    case DEVOLVIDO:
      return ACOES_HISTORICO_SOLICITACAO.REGISTRAR_ENTREGA_DEVOLVIDA;
    case EXTRAVIADO:
      return ACOES_HISTORICO_SOLICITACAO.REGISTRAR_ENTREGA_MAL_SUCEDIDA;
    default:
      throw new exception("Resultado de entrega inválido", 400);
  }
};

const mapearResultadoEntregaParaStatusSolicitacao = (
  resultadoEntregaCliente
) => {
  switch (resultadoEntregaCliente) {
    case ENTREGUE_COM_SUCESSO:
      return ENTREGUE;
    case DEVOLVIDO:
      return PENDENTE_DEVOLVIDA;
    case EXTRAVIADO:
      return ENTREGA_MAL_SUCEDIDA;
    default:
      throw new exception("Resultado de entrega inválido", 400);
  }
};

/**
 *
 *  Função que registra a entrega de uma solicitação para o cliente final, finalizando a mesma.
 *
 *  @param {DadosEntregaCliente} dadosEntregaCliente
 * 	@param {Object} usuarioLogado
 * 	@param {Object} trx
 */

const registrarEntregaCliente = async (
  {
    idSolicitacao,
    resultadoEntregaCliente,
    informacoes,
    dataResultadoEntrega,
    anexos,
  },
  usuarioLogado,
  trx
) => {
  const solicitacao = await solicitacoesModel.find(idSolicitacao);
  solicitacao.idSolicitacoesStatus = mapearResultadoEntregaParaStatusSolicitacao(
    resultadoEntregaCliente
  );
  const entregaSolicitacao = await solicitacao.entregaCliente().create(
    {
      resultadoEntregaCliente: resultadoEntregaCliente,
      informacoes,
      dataResultadoEntrega,
      matriculaRegistroEntrega: usuarioLogado.chave,
      nomeRegistroEntrega: usuarioLogado.nome_usuario,
      prefixoRegistroEntrega: usuarioLogado.prefixo,
      nomePrefixoRegistroEntrega: usuarioLogado.dependencia,
    },
    trx
  );

  await salvarAnexos(
    entregaSolicitacao,
    anexos,
    "entregaCliente",
    usuarioLogado.chave,
    trx
  );

  const idAcao = mapearResultadoEntregaParaAcaoHistorico(
    resultadoEntregaCliente
  );

  await solicitacao.historico().create(
    {
      matriculaFunci: usuarioLogado.chave,
      nomeFunci: usuarioLogado.nome_usuario,
      prefixo: usuarioLogado.prefixo,
      nomePrefixo: usuarioLogado.dependencia,
      idAcao,
    },
    trx
  );

  await solicitacao.save(trx);
};

module.exports = registrarEntregaCliente;
