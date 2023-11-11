/**
 * Classe utilitária para envio de emails.
 * @see https://nodemailer.com
 */

const nodemailer = require("nodemailer");
const { validate } = use("Validator");
const moment = use("App/Commons/MomentZoneBR");
const Logger = use("Logger");
const Env = use("Env");

module.exports = {
  /**
   *    Função que envia um e-mail. Retorna true caso tenha sucesso e falso caso negativo
   *
   */

  sendMail: async (params) => {
    const schema = {
      from: "required|string",
      to: "required|string",
      subject: "required|string",
      body: "required|string",
    };

    let { from, to, subject, body } = params;
    const validation = await validate({ from, to, subject, body }, schema);

    if (validation.fails()) {
      Logger.transport("mail_errors").error(
        moment().toDate() +
          " - Função SendMail.send() não recebeu todos os parâmetros obrigatórios"
      );
      return false;
    }

    //sanitiza os emails
    from = String(from).trim();
    to = String(to).trim();

    //parametros validados... seguindo em frente
    let transporter = nodemailer.createTransport({
      host: Env.get("MAILSERVER_URL", "localhost"),
      port: Env.get("MAILSERVER_PORT", 1025),
      secure: false,
      ignoreTLS: true,
      requireTLS: false,
    });

    let dadosEmail = {
      from, // sender address
      to, // list of receivers
      subject, // Subject line
      html: body, // html body
      attachDataUrls: true,
    };

    //emails de copia
    if (params.cc) {
      dadosEmail.cc = params.cc;
    }

    //copia oculta
    if (params.bcc) {
      dadosEmail.bcc = params.bcc;
    }

    //anexos
    if (params.attachments) {
      dadosEmail.attachments = params.attachments;
    }

    // Aviso de Recebimento
    if (params.confirmReading) {
      dadosEmail.headers = {
        "Disposition-Notification-To": from,
      };
    }

    try {
      //tenta o envio do e-mail
      await transporter.sendMail({
        ...dadosEmail,
      });

      //sucesso no envio
      return true;
    } catch (err) {
      Logger.transport("mail_errors").error(
        moment().toDate() +
          " - Função SendMail.send() - falha ao enviar o email de " +
          from +
          " para " +
          to +
          " com título: " +
          dadosEmail.subject
      );
      return false;
    }
  },
};
