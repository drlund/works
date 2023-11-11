/**
 * @typedef {Object} DadosEnvioSolicitacao
 *
 * @property {number} identificadorEntrega Identificador da entrega. Ex.: Nº do lacre, código dos correios, código da transportadora e etc.
 * @property {number} idSolicitacao Id da solicitação para a qual se está registrando o envio
 * @property {string} informacoes Informações adicionais referentes à entrega
 * @property {number} tipoEntrega Tipo da entrega, seguindo o disposto na tabela solicitacoesBrindesEnvioTipo
 * @property {moment} dataEnvio Data do envio dos ativos da solicitação
 */

const moment = require("moment");

/** @type {typeof import('../../../Commons/Constants')} */
const { EncantarConsts } = use("Constants");
const {
  CAMINHO_MODELS,
  CAMINHO_COMMONS,
  ACOES_HISTORICO_SOLICITACAO,
  STATUS_SOLICITACAO,
  LOCAL_ENTREGA,
} = EncantarConsts;

/** @type {typeof import('../../../Commons/Encantar/salvarAnexos')} */
const salvarAnexos = use(`${CAMINHO_COMMONS}/salvarAnexos`);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);

/**
 *
 *  Calcula o novo status da solicitação após o registro do envio da solicitação de acordo com o local de entrega do mesmo.
 *
 *  @param {*} solicitacao
 *
 *  @return
 *
 */

function calcStatusSolicitacao(localEntrega) {
  switch (localEntrega) {
    case LOCAL_ENTREGA.AGENCIA:
      return STATUS_SOLICITACAO.PENDENTE_RECEBIMENTO_PREFIXO;
    case LOCAL_ENTREGA.ENDERECO_CLIENTE:
      return STATUS_SOLICITACAO.PENDENTE_ENTREGA;
    default:
      break;
  }
}

/**
 *
 *  Registra o envio dos brindes de uma solicitacao
 *
 *   @param {DadosEnvioSolicitacao} dadosEnvioSolicitacao Dados referentes ao envio da solicitação
 */

const registrarEnvioSolicitacao = async (
  dadosEnvioSolicitacao,
  usuarioLogado,
  trx
) => {
  const solicitacao = await solicitacoesModel.find(
    dadosEnvioSolicitacao.idSolicitacao
  );

  //Caso a entrega seja na agência, deve-se gerar a pendênia de recebimento
  solicitacao.idSolicitacoesStatus = calcStatusSolicitacao(
    solicitacao.localEntrega
  );
  await solicitacao.save(trx);

  const entregaSolicitacao = await solicitacao.envio().create(
    {
      identificadorEntrega: dadosEnvioSolicitacao.identificadorEntrega,
      informacoesComplementaresEnvio: dadosEnvioSolicitacao.tipoEnvio,
      valorFrete: parseFloat(dadosEnvioSolicitacao.valorFrete),
      idTipoEnvio: dadosEnvioSolicitacao.tipoEntrega,
      dataRegistro: moment().format("YYYY-MM-DD HH:MM:ss"),
      matriculaEnvio: usuarioLogado.chave,
      nomeEnvio: usuarioLogado.nome_usuario,
      dataEnvio: dadosEnvioSolicitacao.dataEnvio,
    },
    trx
  );

  //Salvar os eventuais anexos
  await salvarAnexos(
    entregaSolicitacao,
    dadosEnvioSolicitacao.anexos,
    "entrega",
    usuarioLogado.chave,
    trx
  );

  await solicitacao.historico().create(
    {
      matriculaFunci: usuarioLogado.chave,
      nomeFunci: usuarioLogado.nome_usuario,
      prefixo: usuarioLogado.prefixo,
      nomePrefixo: usuarioLogado.dependencia,
      idAcao: ACOES_HISTORICO_SOLICITACAO.REGISTRAR_ENTREGA,
    },
    trx
  );
};

module.exports = registrarEnvioSolicitacao;
