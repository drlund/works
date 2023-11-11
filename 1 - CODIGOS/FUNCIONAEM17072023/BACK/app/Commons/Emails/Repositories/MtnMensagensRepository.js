"use strict";

const notificacaoModel = use("App/Models/Postgres/MtnNotificacao");
const filaMensagensSasModel = use("App/Models/Postgres/FilaMensagensSas");

const PENDENTE_COLETA = "PENDENTE_COLETA";
const COLETADO = "COLETADO";
const PROCESSADO = "PROCESSADO";
const LIMITE_COLETA_MSGS = 500;

class MtnMensagensRepository {
  /**
   *
   *  Método que retorna as mensagens não coletadas
   *
   * @returns {<import("../ColetorBase").Mensagem>}
   */

  async getMensagensNaoColetadas() {
    const mensagensNaoColetadasDB = await filaMensagensSasModel
      .query()
      .where("status", PENDENTE_COLETA)
      .with("envolvido")
      .with("txt_mensagem")
      .with("mtn")
      .limit(LIMITE_COLETA_MSGS)
      .fetch();

    const mensagensNaoColetadas = mensagensNaoColetadasDB.toJSON();

    const idsMensagens = mensagensNaoColetadas.map((msg) => msg.id);
    await filaMensagensSasModel
      .query()
      .whereIn("id", idsMensagens)
      .update({ status: COLETADO });

    return mensagensNaoColetadas;
  }

  /**
   *
   * @param {import("../ColetorBase").Mensagem} mensagem
   */

  async marcarMensagemComoProcessada(mensagem) {
    await filaMensagensSasModel
      .query()
      .where("id", mensagem.id)
      .update({ status: PROCESSADO });
  }
}

module.exports = MtnMensagensRepository;
