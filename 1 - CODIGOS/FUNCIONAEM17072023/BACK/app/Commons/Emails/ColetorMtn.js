"use strict";

const ColetorBase = use("App/Commons/Emails/ColetorBase");
/** @type {import("./Repositories/MtnMensagensRepository.js")} */
const MtnMensagensRepository = use(
  "App/Commons/Emails/Repositories/MtnMensagensRepository"
);
/** @type {import("./Repositories/MtnMensagensRepository.js")} */
const MtnNotificacoesRepository = use(
  "App/Commons/Emails/Repositories/MtnNotificacoesRepository"
);

/** Tipos de notificação para questionário */
const RESPONDE_QUESTIONARIO = "RESPONDE_QUESTIONARIO";

class ColetorMtn extends ColetorBase {
  constructor(
    receivedMtnMensagensRepository = null,
    receivedNotificacoesRepository = null
  ) {
    super();
    /** @type {MtnMensagensRepository} */
    this.mtnMensagensRepository =
      receivedMtnMensagensRepository === null
        ? new MtnMensagensRepository()
        : new receivedMtnMensagensRepository();
    this.mtnNotificacoesRepository =
      receivedNotificacoesRepository === null
        ? new MtnNotificacoesRepository()
        : new receivedNotificacoesRepository();
  }

  async coletar() {
    const mensagensNaoColetadas =
      await this.mtnMensagensRepository.getMensagensNaoColetadas();
    for (const mensagem of mensagensNaoColetadas) {
      const transformedMsg = await this._transformMensagem(mensagem);
      this.mensagensColetadas.push(transformedMsg);
    }
  }

  /**
   *
   * Método que será executado após o envio da mensagem. Este método irá registrar logs e gravar dados do envio na tabela notificacoes.
   * @param {bool} sucessoEnvio
   * @param {Mensagem} payload
   *
   */

  async callback(sucessoEnvio, mensagem) {
    mensagem.tipo === RESPONDE_QUESTIONARIO
      ? await this.mtnNotificacoesRepository.registrarNotificacaoQuestionario({
          sucessoEnvio,
          ...mensagem,
        })
      : await this.mtnNotificacoesRepository.registrarNotificacao({
          sucessoEnvio,
          ...mensagem,
        });
  }

  _transformMensagem(mensagem) {
    return {
      tituloMensagem: mensagem.titulo_mensagem,
      remetenteEmail: mensagem.email_remetente,
      destinatarioEmail: mensagem.email_destinatario,
      destinatarioNome: mensagem.nome_destinatario,
      destinatarioMatricula: mensagem.matricula_destinatario,
      txtMensagem: mensagem.txt_mensagem
        ? mensagem.txt_mensagem.mensagem
        : null,
      avisoRecebimento: mensagem.aviso_recebimento,
      avisoRecebimentoEmail: mensagem.aviso_recebimento_email
        ? mensagem.aviso_recebimento_email
        : null,
      payload: JSON.stringify(mensagem),
    };
  }
}

module.exports = ColetorMtn;
