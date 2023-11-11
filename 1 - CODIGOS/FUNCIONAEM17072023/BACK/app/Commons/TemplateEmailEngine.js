const {replaceVariable} = use('App/Commons/StringUtils');
const {sendMail} = use("App/Commons/SendMail");
const { getOneFunci, getOneDependencia } = use("App/Commons/Arh");
const exception = use('App/Exceptions/Handler');

class TemplateEmailEngine {
  
  constructor(templatePath, emissorData = null) {
    try {
      if (!templatePath || templatePath.trim() === "") {
        throw new exception("Necessário o template do e-mail!", 400);
      }

      if (templatePath.includes('App/Templates')) {
        this._templatePath = templatePath;
      } else {
        this._templatePath = `App/Templates/${templatePath}`;
      }
      
      this._templateString = use(this._templatePath);
      this._from = null;
      this._subject = null;

      if (emissorData) {
        let {from, subject} = emissorData;
        this._from = String(from).trim() || null;
        this._subject = String(subject).trim() || null;
      }
     } catch (err) {
       throw new exception(`Template ${templatePath} não encontrado!`)
     }
  }

  /**
   * 
   * @param {Object} sendParams - objeto com as configuracoes para o envio do email:
   *   to: email do destinatario (nao necessario caso passe a matricula do funci ou prefixo da dependencia).
   *   matricula: matricula do funcionario a ser enviado o email.
   *   prefixo: prefixo da dependencia a ser enviado o email.
   *   from: email do remetente, caso nao tenha sido fornecido no construtor.
   *   subject: titulo do email, caso nao tenha sido fornecido no construtor.
   * 
   * @param {Array} bindings - array com os parametros em sequencia a serem substituidos no template do e-mail.
   *                O template deve conter as chaves correspondentes. Ex.: {1} para o elemento 0 do array e assim
   *                sucessivamente.
   */
  async sendMail(sendParams, bindings = []) {
    let corpoMensagem = replaceVariable(this._templateString, bindings);
    let {to, matricula, prefixo, from, subject, attachments, confirmReading } = sendParams;

    if (!to && !matricula && !prefixo) {
      throw new exception("Necessário informar o e-mail, matrícula ou prefixo do destinatário!")
    } 
    
    if (to) {
      to = String(to).trim();
    } else if (matricula) {
      //obtem o email a partir da matricula do funci
      let funci = await getOneFunci(matricula);

      if (!funci) {
        return false;
      }

      to = funci.email;
    } else {
      //prefixo
      let dependencia = await getOneDependencia(prefixo);

      if (dependencia.email === "") {
        return false;
      }

      to = dependencia.email.toLowerCase();
    }

    if (from) {
      this._from = from;
    } else if (!this._from) {
      throw new exception("Necessário informar o e-mail do remetente!")
    }

    if (subject) {
      this._subject = subject;
    } else if (!this._subject) {
      throw new exception("Necessário informar o título do e-mail!")
    }

    let emailParams = {
      from: this._from,
      to,
      subject: this._subject,
      body: corpoMensagem,
      confirmReading: confirmReading ? confirmReading : false
    };

    if (attachments) {
      emailParams.attachments = attachments;
    }

    let enviouEmail = await sendMail(emailParams);

    return enviouEmail;
  }
  
}

module.exports = TemplateEmailEngine;