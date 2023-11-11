"use strict";

const LogsEnvioModel = use("App/Models/Mysql/FilaEmails/LogsEnvio");
const MensagensRepository = use(
  "App/Commons/Emails/Repositories/MensagensRepository"
);
const { sendMail } = use("App/Commons/SendMail");

const ACOES = {
  CARREGAR_MENSAGEM_PARA_ENVIO: "CARREGAR_MENSAGEM_PARA_ENVIO",
  MENSAGEM_ENVIADA_SUCESSO: "CARREGAR_MENSAGEM_PARA_ENVIO",
  FALHA_ENVIO: "FALHA_ENVIO",
  ENVIO_EMAIL: "ENVIO_EMAIL",
};

/**
 *
 *  Classe responsável por disparar os e-mails da fila global
 */

class DisparadorEmails {
  /**
   *
   *  Classe responsável por disparar uma lista de mensagens coletadas por uma instância da classe Coletor Global.
   *
   * @param {Object} coletorGlobal Instância da classe Coletor Global, já preenchida com lista de mensagens a serem disparadas.
   *
   */
  constructor(coletorGlobal) {
    this.coletorGlobal = coletorGlobal;
    this.mensagensRepository = new MensagensRepository();
  }

  /**
   *
   *  Método responsável por disparar as mensagens coletadas pelo Coletor Global, no atributo filaMensagens.
   *  Além disso, os coletores que tenham callback registado irão executar as funções.
   * 
   */
  async dispararEmails() {
    for (const mensagem of this.coletorGlobal.filaMensagens) {
      await this.mensagensRepository.marcarMensagemComoProcessada(mensagem.id);
      await this._registrarLogEnvioMensagem(
        mensagem.id,
        ACOES.CARREGAR_MENSAGEM_PARA_ENVIO
      );

      const sucessoEnvio = await sendMail({
        from: mensagem.remetenteEmail,
        to: mensagem.destinatarioEmail,
        subject: mensagem.tituloMensagem,
        body: mensagem.txtMensagem,
      });

      const acao = sucessoEnvio ? ACOES.ENVIO_EMAIL : ACOES.FALHA_ENVIO;
      await this._registrarLogEnvioMensagem(mensagem.id, acao);
      const existeCallback =
        mensagem.nomeColetorMensagem &&
        this.coletorGlobal.coletoresMensagem[mensagem.nomeColetorMensagem];

      if (existeCallback) {
        const payload = JSON.parse(mensagem.payload);
        const Coletor =
          this.coletorGlobal.coletoresMensagem[mensagem.nomeColetorMensagem];

        const coletorAuxiliar = new Coletor();
        await coletorAuxiliar.callback(sucessoEnvio, payload);
      }
    }
  }

  async _registrarLogEnvioMensagem(idFila, acao) {
    await LogsEnvioModel.create({ idFila, acao });
  }
}

module.exports = DisparadorEmails;
