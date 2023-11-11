"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const notificacaoModel = use("App/Models/Postgres/MtnNotificacao");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const notificacaoQuestionarioModel = use(
  "App/Models/Postgres/MtnQuestionarioNotificacao"
);

class MtnNotificacoesRepository {
  async registrarNotificacaoQuestionario(dadosNotificacao) {
    await notificacaoQuestionarioModel.create({
      email: dadosNotificacao.email_destinatario,
      sucesso: dadosNotificacao.sucessoEnvio,
      mensagem: dadosNotificacao.txt_mensagem.mensagem,
    });
  }

  async registrarNotificacao(dadosNotificacao) {
    await notificacaoModel.create({
      email: dadosNotificacao.email_destinatario,
      tipo: dadosNotificacao.tipo,
      sucesso: dadosNotificacao.sucessoEnvio,
      mensagem: dadosNotificacao.txt_mensagem.mensagem,
      id_envolvido: dadosNotificacao.id_envolvido,
      renotificado: false,
      reenviar: false,
      fila_envio: false,
    });
  }
}

module.exports = MtnNotificacoesRepository;
