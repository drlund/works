"use strict";
/** @type {typeof import('../../../Commons/Constants')} */
const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS, STATUS_SOLICITACAO, CAMINHO_COMMONS } = EncantarConsts;

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);

/** @type {typeof import('../../../Commons/Encantar/NotificacoesService/')} */
const notificacoesService = use(`${CAMINHO_COMMONS}/NotificacoesService`);

const { Command } = require("@adonisjs/ace");

class NotificarResponsaveisBrinde extends Command {
  static get signature() {
    return "encantar:notificarResponsaveisBrindes";
  }

  static get description() {
    return "Notifica os responsáveis pelo envio dos brindes";
  }

  async handle(args, options) {
    const solicitacoes = await solicitacoesModel
      .query()
      .where("idSolicitacoesStatus", STATUS_SOLICITACAO.DEFERIDA)
      .with("fluxoUtilizado")
      .fetch();
    for (const solicitacao of solicitacoes.rows) {
      const dadosNotificacao = await notificacoesService.gerarNotificacaoResponsavelProduto(
        solicitacao.id
      );
      const notificacoesCriadas = await solicitacao
        .notificacoes()
        .createMany(dadosNotificacao);
      await notificacoesService.enviarNotificacoes(
        notificacoesCriadas.map((notificacao) => notificacao.id)
      );
    }
  }
}

module.exports = NotificarResponsaveisBrinde;
