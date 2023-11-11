"use strict";

const MensagensRepository = use(
  "App/Commons/Emails/Repositories/MensagensRepository"
);

/** ----- Coletores ----- */

/**
 * Registre os coletores auxiliares aqui
 */
const ColetorMtn = use("App/Commons/Emails/ColetorMtn");
const COLETORES = {
  ColetorMtn: ColetorMtn,
};

/** ----- Constantes -----  */

/**
 * @type {number} Limite de mensagens que serão processadas por vez
 */
const LIMITE_MSGS_PROCESSADAS = 500;

/**
 *  Classe responsável por realizar a coleta de mensagens da fila global e
 *  executa os coletores auxiliares, que irão incluir mensagens na referida fila.
 */
class ColetorGlobal {
  constructor(
    receivedColetoresMensagem = null,
    ReceivedMensagensRepository = null
  ) {
    this.filaMensagens = [];
    this.mensagensRepository =
      ReceivedMensagensRepository === null
        ? new MensagensRepository()
        : new ReceivedMensagensRepository();

    this.coletoresMensagem =
      receivedColetoresMensagem === null
        ? COLETORES
        : receivedColetoresMensagem;
  }

  /**
   * Executa a coleta de mensagens. Primeiro inclui as mensagens dos coletores auxiliares na fila global e depois
   * carrega as mensagens da fila global.
   *
   */
  async run() {
    await this.coletarMensagens();
    await this.carregarFilaMensagens();
  }

  /**
   *  Carrega a fila global no atributo filaMensagens, sendo que a quantidade carregada
   *  é limitada pela constante LIMITE_MSGS_PROCESSADAS
   */

  async carregarFilaMensagens() {
    const mensagensFila = await this.mensagensRepository.getFilaGlobal(
      LIMITE_MSGS_PROCESSADAS
    );

    this.filaMensagens = mensagensFila;
  }

  /**
   *
   * Valida o formato da mensagem.
   *
   * @param {import("./ColetorBase").Mensagem} mensagem
   * @returns {boolean} Indica se o formato da mensagem está correto ou não
   *
   */
  async _validarFormatoMensagem(mensagem) {
    const camposObrigatorios = [
      "destinatarioEmail",
      "destinatarioMatricula",
      "txtMensagem",
      "remetenteEmail",
      "tituloMensagem",
    ];

    for (const campo of camposObrigatorios) {
      if (mensagem[campo] === undefined || mensagem[campo] === null) {
        return false;
      }
    }

    if (mensagem.avisoRecebimento === true && !mensagem.avisoRecebimentoEmail) {
      return false;
    }

    return true;
  }

  /**
   * Roda todos os coletores auxiliares, carregando as mensagens na fila global.
   * Os coletores são registrados na constante COLETORES, localizada no início deste arquivo.
   *
   */

  async coletarMensagens() {
    for (const nomeColetorMensagem in this.coletoresMensagem) {
      const coletorAuxiliar = new COLETORES[nomeColetorMensagem]();
      await coletorAuxiliar.coletar();
      await this._descarregarMsgsFilaGlobal(
        coletorAuxiliar.mensagensColetadas,
        nomeColetorMensagem
      );
    }
  }

  /**
   *  Método que tem como responsabilidade salvar um array de mensagens na fila global
   *
   * @param {import("./ColetorBase").Mensagem} msgsColetadas
   *
   */
  async _descarregarMsgsFilaGlobal(
    msgsColetadas = [],
    nomeColetorMensagem = null
  ) {
    const mensagensValidas = [];
    for (const mensagem of msgsColetadas) {
      const valido = await this._validarFormatoMensagem(mensagem);
      if (valido) {
        mensagensValidas.push({ ...mensagem, nomeColetorMensagem });
      }
    }
    await this.mensagensRepository.descarregarMensagensFilaGlobal(
      mensagensValidas
    );
  }
}

module.exports = ColetorGlobal;
