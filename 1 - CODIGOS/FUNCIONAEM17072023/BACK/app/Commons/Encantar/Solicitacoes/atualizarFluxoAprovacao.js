const { EncantarConsts } = use("Constants");
const { TIPOS_APROVACAO, CAMINHO_MODELS, CAMINHO_COMMONS } = EncantarConsts;
const moment = use("moment");

/** @type {typeof import('../../../Commons/Encantar/salvarAnexos')} */
const salvarAnexos = use(`${CAMINHO_COMMONS}/salvarAnexos`);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const fluxoUtilizadoModel = use(`${CAMINHO_MODELS}/SolicitacoesFluxoUtilizado`);

/**
 *  Verifica se o parecer do fluxo atual é por indeferimento e fecha todos os outros caso positivo
 */
const finalizaFluxosPosterioresCasoIndeferimento = async (
  tipo,
  idSolicitacao,
  sequenciaFluxoAtual,
  trx
) => {
  if (tipo === TIPOS_APROVACAO.INDEFERIR) {
    await fluxoUtilizadoModel
      .query()
      .where("idSolicitacao", idSolicitacao)
      .where("sequencia", ">", sequenciaFluxoAtual)
      .transacting(trx)
      .update({
        finalizadoEm: moment().format("YYYY-MM-DD HH:mm"),
        tipoFinalizacao: TIPOS_APROVACAO.REVELIA,
      });
  }
};

/**
 *
 * Atualiza os dados de um fluxo atual, já incluindo os seus eventuais anexos
 *
 */

const atualizarFluxoAprovacao = async (dadosAprovacao, fluxoAtual, trx) => {
  const {
    idSolicitacao,
    avaliacao,
    justificativa,
    tipo,
    arquivos,
    finalizadoEm,
    usuarioLogado,
  } = dadosAprovacao;

  fluxoAtual.finalizadoEm = finalizadoEm;
  fluxoAtual.justificativa = justificativa;
  fluxoAtual.avaliacao = avaliacao;
  fluxoAtual.tipoFinalizacao = tipo;
  fluxoAtual.matriculaFinalizacao = usuarioLogado.chave;
  fluxoAtual.nomeFinalizacao = usuarioLogado.nome_usuario;
  await fluxoAtual.save(trx);

  await salvarAnexos(
    fluxoAtual,
    arquivos,
    "fluxoAprovacao",
    usuarioLogado.chave,
    trx
  );

  await finalizaFluxosPosterioresCasoIndeferimento(
    tipo,
    idSolicitacao,
    fluxoAtual.sequencia,
    trx
  );
};

module.exports = atualizarFluxoAprovacao;
