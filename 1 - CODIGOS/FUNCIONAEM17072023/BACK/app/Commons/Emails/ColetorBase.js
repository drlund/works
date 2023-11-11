"use strict";


/**
 * @typedef {Object} Mensagem
 * @property {number} id
 * @property {string} tituloMensagem
 * @property {string} remetenteEmail
 * @property {string} destinatarioEmail
 * @property {string} destinatarioNome
 * @property {string} destinatarioMatricula
 * @property {string} destinatarioCargoNome
 * @property {string} destinatarioCargoCodigo
 * @property {string} destinatarioDepNome
 * @property {string} destinatarioDepPrefixo 
 * @property {string} txtMensagem
 * @property {boolean} avisoRecebimento
 * @property {string} avisoRecebimentoEmail
 * @property {Object} payload
 * @property {string} enviadoEm
 * @property {string} createdAt
 * 
*/

class ColetorBase {


  constructor(){
    /** @type {Array<Mensagem>} */
    this.mensagensColetadas = [];
  }

  /**
   *  Método responsável por efetuar a coleta dos dados referentes äs mensagens e carregá-las na propriedade mensagensColetadas, já no formato do tipo Mensagem
   */
  async coletar() {
    throw new Error("Implemente o método coletar()");
  }

  async callback() {
    return true;
  }
}

module.exports = ColetorBase;