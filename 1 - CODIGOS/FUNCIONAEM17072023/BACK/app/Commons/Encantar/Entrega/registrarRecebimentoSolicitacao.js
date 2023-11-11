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
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const entregasModel = use(`${CAMINHO_MODELS}/SolicitacoesEnvio`);

/**
 *
 *  Registra o recebimento dos brindes de uma solicitacao quando enviado para o prefixo
 *
 *   @param {DadosEnvioSolicitacao} dadosEnvioSolicitacao Dados referentes ao envio da solicitação
 */

const registrarRecebimentoSolicitacao = async (
  dadosRecebimentoSolicitacao,
  usuarioLogado,
  trx
) => {
  const solicitacao = await solicitacoesModel.find(
    dadosRecebimentoSolicitacao.idSolicitacao
  );

  solicitacao.idSolicitacoesStatus = STATUS_SOLICITACAO.ENTREGUE;
  await solicitacao.save(trx);

  const entrega = await entregasModel.findBy(
    "idSolicitacao",
    dadosRecebimentoSolicitacao.idSolicitacao
  );
  entrega.dataRecebimento = dadosRecebimentoSolicitacao.dataRecebimento;
  entrega.observacaoRecebimento = dadosRecebimentoSolicitacao.observacoes;
  entrega.problemaRecebimento = dadosRecebimentoSolicitacao.problemaNaEntrega;
  entrega.matriculaRecebimento = usuarioLogado.chave;
  entrega.nomeRecebimento = usuarioLogado.nome_usuario;
  entrega.prefixoRecebimento = usuarioLogado.prefixo;
  entrega.nomePrefixoRecebimento = usuarioLogado.dependencia;

  await entrega.save(trx);

  //Salva os eventuais anexos
  await salvarAnexos(
    entrega,
    dadosRecebimentoSolicitacao.anexos,
    "recebimento",
    usuarioLogado.chave,
    trx,
    "anexosRecebimento"
  );

  await solicitacao.historico().create(
    {
      matriculaFunci: usuarioLogado.chave,
      nomeFunci: usuarioLogado.nome_usuario,
      prefixo: usuarioLogado.prefixo,
      nomePrefixo: usuarioLogado.dependencia,
      idAcao: ACOES_HISTORICO_SOLICITACAO.REGISTRAR_RECEBIMENTO,
    },
    trx
  );

  return true;
};

module.exports = registrarRecebimentoSolicitacao;
