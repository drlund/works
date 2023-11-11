"use strict";

const getResponsaveisEntregaBrindes = require("./Entrega/getResponsaveisEntregaBrindes");

/** @type {typeof import('../../../Commons/Constants')} */
const { EncantarConsts } = use("Constants");

const { getOneDependencia } = use("App/Commons/Arh");

const {
  TIPOS_NOTIFICACAO,
  CAMINHO_MODELS,
  CAMINHO_COMMONS,
  REMETENTE_NOTIFICACOES,
  LOCAL_ENTREGA,
} = EncantarConsts;

const { capitalize } = use("App/Commons/StringUtils");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const notificacoesModel = use(`${CAMINHO_MODELS}/Notificacoes`);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const notificacoesTipoDesativadosModel = use(
  `${CAMINHO_MODELS}/NotificacoesTiposDesativados`
);

const checaUnidadeNegocio = use(`App/Commons/Mst/checaUnidadeNegocio`);
const getPrimeiroGestorPorPrefixo = use(
  `App/Commons/Mst/getPrimeiroGestorPorPrefixo`
);
const getOneFunci = use("App/Commons/Arh/getOneFunci");
const exception = use("App/Exceptions/Handler");
const TemplateEmailEngine = use("App/Commons/TemplateEmailEngine");

/**
 * @typedef {Object} Notificacao
 * @property {number} idSolicitacao Id da solicitação a qual esta notificação está relacionada
 * @property {string} tipo
 * @property {string} remetente
 * @property {string} destinatario
 * @property {boolean} statusEnvio
 * @property {boolean} pendente
 * @property {string} dataEnvio
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 *  Verifica se um determinado tipo de notificação está ativa
 * @param {String} tipo
 */

async function verificarNotificacaoAtiva(tipo) {
  const tipoDesativado = await notificacoesTipoDesativadosModel
    .query()
    .where("tipoNotificacao", tipo)
    .where("ativo", 1)
    .first();

  return tipoDesativado ? true : false;
}

/**
 *  Gera as notificações a serem criadas no banco de dados
 *
 *  @param {DadosNotificacao} dadosNotificacao
 *
 *  @return {Object[]} Array de das notificacoes a serem gravadas
 */

async function gerarNotificacao({
  idSolicitacao,
  tipo,
  destinatario,
  parametros,
}) {
  /** @type {Notificacao} */
  const notificacao = {
    idSolicitacao,
    tipo,
    statusEnvio: false,
    pendente: true,
    parametros: parametros ? parametros : null,
    remetente: REMETENTE_NOTIFICACOES,
    destinatario,
  };

  return notificacao;
}

/**
 *
 * @typedef {Object} DadosAprovacaoFluxo
 * @property {number} idSolicitacao Id da soliciação a qual a notificação se refere
 * @property {number} sequenciaFluxoANotificar Sequencia do fluxo de aprovação a ser notificado.
 * @property {Object[]} fluxoAprovacao Array de objetos que representam os prefixos do fluxo de aprovação.
 *
 *  Gera um array de objeto com as notificações referentes a um determinado prefixo do fluxo de aprovação.
 *
 *  @param {DadosAprovacaoFluxo} DadosAprovacaoFluxo
 *
 */

async function gerarNotificacaoFluxo({
  fluxoAprovacao,
  idSolicitacao,
  sequenciaFluxoANotificar,
}) {
  const isTipoNotificacaoAtivo = await verificarNotificacaoAtiva(
    TIPOS_NOTIFICACAO.FLUXO_APROVACAO.tipo
  );

  if (!isTipoNotificacaoAtivo) {
    return [];
  }

  const fluxoANotificar = fluxoAprovacao.find(
    (fluxo) => fluxo.sequencia === sequenciaFluxoANotificar
  );

  if (!fluxoANotificar) {
    throw new exception(
      `NotificacaoService:_gerarNotificacaoFluxo: Sequência ${sequenciaFluxoANotificar} não encontrado no fluxo de aprovação da solicitação ${idSolicitacao}`,
      500
    );
  }

  const dadosDependencia = await getOneDependencia(
    fluxoANotificar.prefixoAutorizador
  );

  const notificacao = await gerarNotificacao({
    idSolicitacao,
    tipo: TIPOS_NOTIFICACAO.FLUXO_APROVACAO.tipo,
    destinatario: dadosDependencia.email,
  });

  return [notificacao];
}

async function gerarNotificacaoReprovacaoFluxo({ idSolicitacao }) {
  const isTipoNotificacaoAtivo = await verificarNotificacaoAtiva(
    TIPOS_NOTIFICACAO.FLUXO_REPROVACAO.tipo
  );

  if (!isTipoNotificacaoAtivo) {
    return [];
  }

  const solicitacao = await solicitacoesModel.find(idSolicitacao);
  const funciSolicitante = await getOneFunci(solicitacao.matriculaSolicitante);

  const notificacao = await gerarNotificacao({
    idSolicitacao,
    tipo: TIPOS_NOTIFICACAO.FLUXO_REPROVACAO.tipo,
    destinatario: funciSolicitante.email,
    parametros: `["${capitalize(funciSolicitante.nomeGuerra)}"]`,
  });

  return [notificacao];
}

async function gerarNotificacaoResponsavelProduto(idSolicitacao) {
  const isTipoNotificacaoAtivo = await verificarNotificacaoAtiva(
    TIPOS_NOTIFICACAO.RESPONSAVEL_BRINDE.tipo
  );

  if (!isTipoNotificacaoAtivo) {
    return [];
  }

  const responsaveisEntregaBrindes = await getResponsaveisEntregaBrindes(
    idSolicitacao
  );

  const notificacoes = [];
  for (const destinatario of responsaveisEntregaBrindes) {
    const notificacao = await gerarNotificacao({
      idSolicitacao,
      tipo: TIPOS_NOTIFICACAO.RESPONSAVEL_BRINDE.tipo,
      destinatario: destinatario.email,
      parametros: `["${capitalize(destinatario.nomeGuerra)}"]`,
    });

    notificacoes.push(notificacao);
  }

  return notificacoes;
}

async function gerarNotificacaoEnvioPrefixo(solicitacao) {
  
  const isTipoNotificacaoAtivo = await verificarNotificacaoAtiva(
    TIPOS_NOTIFICACAO.ENVIO_PREFIXO.tipo
  );

  if (!isTipoNotificacaoAtivo) {
    return [];
  }

  //Caso o local de entrega não seja agência, não retorna nenhuma notificação
  if (solicitacao.localEntrega !== LOCAL_ENTREGA.AGENCIA) {
    return [];
  }

  //Verifica se o prefixo para o qual será enviado é Unidade de Negócios
  //Caso seja Unidade de Negócios, enviar o e-mail para o Primeiro Gestor e para o E-mail do prefixo
  const isUnidadeNegocio = await checaUnidadeNegocio(
    solicitacao.prefixoEntrega
  );
  //Caso não seja Unidade de Negócios, enviar o e-mail somente para o e-mail do prefixo
  const dadosDependencia = await getOneDependencia(solicitacao.prefixoEntrega);

  const notificacaoPrefixo = await gerarNotificacao({
    idSolicitacao: solicitacao.id,
    tipo: TIPOS_NOTIFICACAO.ENVIO_PREFIXO.tipo,
    destinatario: dadosDependencia.email,
    parametros: `["${capitalize(solicitacao.nomeCliente)}"]`,
  });

  const notificacoes = [notificacaoPrefixo];

  if (isUnidadeNegocio) {
    const dadosPrimeiroGestor = await getPrimeiroGestorPorPrefixo(
      solicitacao.prefixoEntrega
    );

    const notificacaoPrimeiroGestor = await gerarNotificacao({
      idSolicitacao: solicitacao.id,
      tipo: TIPOS_NOTIFICACAO.ENVIO_PREFIXO.tipo,
      destinatario: dadosPrimeiroGestor.email.trim(),
      parametros: `["${capitalize(solicitacao.nomeCliente)}"]`,
    });

    notificacoes.push(notificacaoPrimeiroGestor);
  }

  
  return notificacoes;
}

/**
 * Envia uma notificação que está gravada no banco de dado
 *
 *  @param arrayIds Array de ids das notificacoes a serem enviadas
 *
 */

async function enviarNotificacoes(arrayIdsNotificacoes) {
  for (const idNotificacao of arrayIdsNotificacoes) {
    const notificacao = await notificacoesModel.find(idNotificacao);
    const parametros =
      notificacao.parametros === null ? [] : JSON.parse(notificacao.parametros);

    const emailEngine = new TemplateEmailEngine(
      TIPOS_NOTIFICACAO[notificacao.tipo].template,
      {
        from: notificacao.remetente,
        subject: `Encantar - Solicitação pendente de curadoria`,
      }
    );

    const enviou = await emailEngine.sendMail(
      {
        to: notificacao.destinatario,
      },
      parametros
    );

    notificacao.pendente = false;
    notificacao.statusEnvio = enviou;
    await notificacao.save();
  }
}

/**
 *  Retornas quais os destinatarios de acordo com a solicitacao
 * @param {*} solicitacao
 * @param {*} tipo
 */

module.exports = {
  enviarNotificacoes,
  gerarNotificacaoFluxo,
  gerarNotificacaoResponsavelProduto,
  gerarNotificacaoEnvioPrefixo,
  gerarNotificacaoReprovacaoFluxo,
};
