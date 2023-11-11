/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const timelineModel = use("App/Models/Postgres/MtnTimeline");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const envolvidoModel = use("App/Models/Postgres/MtnEnvolvido");
/** @type {typeof import('../Constants')} */
const { mtnConsts } = use("Constants");
const moment = use("App/Commons/MomentZone");
const { prefixoAnalise, acoesInstancias } = mtnConsts;
const { getDiasTrabalhadosPrefixo } = use("App/Commons/DateUtils");
const getDataBasePrazo = use("App/Commons/Mtn/getDataBasePrazo");

const mapTipoAcaoPrazo = {
  SOLICITA_ESCLARECIMENTO: "ESCLARECIMENTO",
  SALVAR_PARECER_RECURSO: "RECURSOS",
  ESCLARECIMENTO_INICIAL: "ESCLARECIMENTO",
};

const getDatabaseAcao = async (ultimaAcao) => {
  const acao = ultimaAcao.toJSON().acao;

  if (acao.instancia === null) {
    return moment();
  }

  if (acao.instancia === acoesInstancias.SUPER) {
    return moment(ultimaAcao.created_at.toISOString());
  }

  const data = await getDataBasePrazo(
    moment(ultimaAcao.created_at),
    mapTipoAcaoPrazo[acao.tipo]
  );
  return data;
};

/**
 *
 *    A Timeline é composta por todas as ações executadas para um determinado envolvido.
 *    Esta função retorna a quantidade de dias úteis (considerando inclusive feriados)
 *
 *    @param {*} idEnvolvido  Id do envolvido cuja prazo será retornado
 */

async function getPrazoDesdeUltimaAcao(idEnvolvido, criacao = false) {
  let dataReferencia = null;

  if (criacao) {
    const envolvido = await envolvidoModel.find(idEnvolvido);
    dataReferencia = envolvido.created_at.toISOString();
  } else {
    const ultimaAcao = await timelineModel
      .query()
      .where("id_envolvido", idEnvolvido)
      .with("acao")
      .orderBy("id", "desc")
      .first();

    dataReferencia = await getDatabaseAcao(ultimaAcao);
  }

  
  const qtdDiasTrabalhados = await getDiasTrabalhadosPrefixo(
    prefixoAnalise,
    dataReferencia
  );

  return qtdDiasTrabalhados;
}

module.exports = getPrazoDesdeUltimaAcao;
