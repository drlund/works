const _ = require("lodash");

const MailLog = use("App/Models/Mysql/Designacao/MailLog");
const exception = use("App/Exceptions/Handler");

/** @type {typeof import('moment')} */
const moment = use("App/Commons/MomentZone");

const setDocumento = use("App/Commons/Designacao/setDocumento");
const { getOneDependencia } = use("App/Commons/Arh");
const { sendMail } = use("App/Commons/SendMail");
const { replaceVariable } = use("App/Commons/StringUtils");
const Env = use("Env");
const FRONTEND_URL = Env.get("FRONTEND_URL");
const getMainEmail = use("App/Commons/Designacao/getMainEmail");

async function _preencheCampos(dados) {

  try {
    const texto =
      `#interna<p>` +
      `Senhor Administrador,<p>` +
      `Informamos que existe(m) protocolo(s) pendente(s) de seu <strong>De Acordo</strong> digital na Ferramenta de Designação Interina.<p>` +
      `Para registrar a manifestação, gentileza seguir as instruções abaixo:<p>` +
      `<ul>` +
      `<li>Acesse o link <a href='{1}designacao/pendencias' noopener noref>{1}designacao/pendencias</a>, na aba <strong>'Pendências De Acordo'</strong>;</li>` +
      `<li>Cinza Claro - pendente de sua manifestação. Na respectiva demanda, clique no botão de ações e selecione "DE ACORDO";</li>` +
      `<li>Verde Claro - já consta sua manifestação. Pendente de manifestação de outras instâncias.</li>` +
      `</ul><p>` +
      `Informamos que todas as interações deverão ser feitas pelo link acima. Não haverá tratativas por e-mail.<p>` +
      `Atenciosamente,<p>` +
      `<strong>Gerência de Pessoas</strong><br>` +
      `<strong>9009 Superintendência Administrativa</strong>`;

    const subsTexto = [FRONTEND_URL];

    const assunto = "DESIGNAÇÃO INTERINA :: Aviso de Pendência \"De Acordo\" Digital";

    const corpo = replaceVariable(texto, subsTexto);

    let destination = [];

    for (let prefixo of dados.prefixos) {
      pref = await getOneDependencia(prefixo);
      const email = await getMainEmail(pref.uor);
      destination.push([email.EmaildaUOR.toLowerCase()]);
    }

    return [assunto, corpo, destination];
  } catch (err) {
    throw new exception(err, 400);
  }
};

async function enviarEmailCobranca(solicitacoes, user) {
  try {

    for (let solicitacao of solicitacoes) {

      const [assunto, corpo, destination] = await _preencheCampos({
        prefixos: solicitacao.prefixosPendentes,
      });

      const dadosEmail = {
        from: "superadm.pessoas@bb.com.br",
        to: destination.toString(),
        subject: assunto,
        body: corpo,
      };

      await sendMail(dadosEmail);

      let mail = new MailLog();

      mail.tipo_email = 5;
      mail.id_solicitacao = solicitacao.id;
      mail.campo_de = dadosEmail.from;
      mail.campo_para = dadosEmail.to;
      mail.dt_envio = moment().format("YYYY-MM-DD HH:mm:ss")

      await mail.save();

      await setDocumento(
        { id_solicitacao: solicitacao.id, id_historico: "35" },
        null,
        user
      );

    }
  } catch (err) {
    throw new exception(err, 400);
  }

}

module.exports = enviarEmailCobranca;
