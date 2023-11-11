const exception = use("App/Exceptions/Handler");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const timelineModel = use("App/Models/Postgres/MtnTimeline");
const acaoModel = use("App/Models/Postgres/MtnTiposAcao");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const envolvidoModel = use("App/Models/Postgres/MtnEnvolvido");

const criarNotificacaoEnvolvido = use(
  "App/Commons/Mtn/criarNotificacaoEnvolvido"
);

/** @type {typeof import('../../Commons/Constants')} */
const { mtnConsts } = use("Constants");
const { tiposNotificacao } = mtnConsts;
const Database = use("Database");

async function insereTimeline(
  idEnvolvido,
  idAcao,
  dadosRespAcao,
  tipoNotificacao = tiposNotificacao.INTERACAO,
  isCommand = false,
  trx
) {
  if (!trx) {
    throw new exception(
      "Transaction obrigatória na função insereTimeLine",
      500
    );
  }

  if (!dadosRespAcao) {
    dadosRespAcao = {};
    dadosRespAcao.chave = "F0000000";
    dadosRespAcao.nome_usuario = "Sistema";
    dadosRespAcao.prefixo = "0000";
    dadosRespAcao.dependencia = "Sistema";
  }

  const newTimelineEntry = new timelineModel();
  newTimelineEntry.id_envolvido = idEnvolvido;
  newTimelineEntry.id_acao = idAcao;
  newTimelineEntry.mat_resp_acao = dadosRespAcao.chave;
  newTimelineEntry.nome_resp_acao = dadosRespAcao.nome_usuario;
  newTimelineEntry.prefixo_resp_acao = dadosRespAcao.prefixo;
  newTimelineEntry.nome_prefixo_resp_acao = dadosRespAcao.dependencia;

  // Verifica se a ação recebida acumula o prazo com a anterior. Como a nova entrada está sendo criada agora
  // replica a data da úlima ação
  const acao = await acaoModel.find(idAcao);

  if (acao.acumula_prazo) {
    const ultimaAcao = await timelineModel
      .query()
      .where("id_envolvido", idEnvolvido)
      .orderBy("id", "desc")
      .first();

    newTimelineEntry.prazo_desde_ultima_acao = ultimaAcao
      ? ultimaAcao.prazo_desde_ultima_acao
      : 0;
  } else {
    //Como está sendo craido agora, o prazo será 0
    newTimelineEntry.prazo_desde_ultima_acao = 0;
  }
  await newTimelineEntry.save(trx);

  if (acao.notifica_envolvido === '1' || acao.notifica_envolvido ) {
    const dadosNotificacao = { tipoNotificacao, idEnvolvido, acao };
    const idNotificacao = await criarNotificacaoEnvolvido(dadosNotificacao, trx);
    return { ...dadosNotificacao, idNotificacao };
  }

  if (isCommand) {
    Database.close();
  }

  return null;
}

module.exports = insereTimeline;
