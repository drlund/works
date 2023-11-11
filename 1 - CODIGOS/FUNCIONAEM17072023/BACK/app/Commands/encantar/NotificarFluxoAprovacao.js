"use strict";

/** @type {typeof import('../../../Commons/Constants')} */
const { EncantarConsts } = use("Constants");
const { getOneDependencia } = use("App/Commons/Arh");
const { CAMINHO_MODELS, STATUS_SOLICITACAO, CAMINHO_COMMONS } = EncantarConsts;

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);

/** @type {typeof import('../../../Commons/Encantar/NotificacoesService/')} */
const notificacoesService = use(`${CAMINHO_COMMONS}/NotificacoesService`);

const { Command } = require("@adonisjs/ace");

class NotificarFluxoAprovacao extends Command {
  static get signature() {
    return "encantar:notificarFluxoAprovacao";
  }

  static get description() {
    return "Tell something helpful about this command";
  }

  async handle(args, options) {
    const solicitacoes = await solicitacoesModel
      .query()
      .where("idSolicitacoesStatus", STATUS_SOLICITACAO.PENDENTE_APROVACAO)
      .with("fluxoUtilizado")
      .fetch();
    for (const solicitacao of solicitacoes.rows) {
      const dadosNotificacao = await notificacoesService.gerarNotificacaoFluxo({
        fluxoAprovacao: solicitacao.toJSON().fluxoUtilizado,
        idSolicitacao: solicitacao.id,
        sequenciaFluxoANotificar: solicitacao.sequenciaFluxoAtual,
      });
      const notificacoesCriadas = await solicitacao
        .notificacoes()
        .createMany(dadosNotificacao);
      await notificacoesService.enviarNotificacoes(
        notificacoesCriadas.map((notificacao) => notificacao.id)
      );
    }
  }
}

module.exports = NotificarFluxoAprovacao;
