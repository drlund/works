'use strict'

const MailLog = use("App/Models/Mysql/CtrlDisciplinar/MailLog");
const { sendMail } = use('SendMail');
const exception = use("App/Exceptions/Handler");
const { replaceVariable } = use('App/Commons/StringUtils');
const Gedip = use("App/Models/Mysql/CtrlDisciplinar/CtrlDiscp");
const moment = require('moment');
const { tiposEmailsCtrlDiscp } = use("Constants");
const { ENVIO_NORMAL, ENVIO_COBRANCA, ENVIO_DOCUMENTO } = tiposEmailsCtrlDiscp;
const Env = use('Env');
const FRONTEND_URL = Env.get('FRONTEND_URL',);
const generos = {
  MASC: 1,
  FEM: 2
}


const _FunciRespMail = async ({ gedip, tipoEmail, anexo = null }) => {
  try {

    if (!gedip.funcionario_gedip_nome || (!gedip.nome_funci_resp && tipoEmail === 3)) return false;

    let { subject, body } = await _getEmailSubjBody({ medida: gedip.id_medida, tipoEmail: tipoEmail });

    const sexo_resp = gedip.sexo_funci_resp;
    const sexo_funci = gedip.sexo_funci;

    let sex_resp = {}
    let sex_funci = {}

    switch (sexo_resp) {
      case generos.MASC:
        sex_resp.trat = "Sr.";
        sex_resp.ref = "ao";
        sex_resp.suf = "o";
        break;
      case generos.FEM:
        sex_resp.trat = "Sra.";
        sex_resp.ref = "à";
        sex_resp.suf = "a";
        break;
      default:
        break;
    }

    switch (sexo_funci) {
      case generos.MASC:
        sex_funci.trat = "Sr.";
        sex_funci.ref = "ao";
        sex_funci.suf = "o";
        break;
      case generos.FEM:
        sex_funci.trat = "Sra.";
        sex_funci.ref = "à";
        sex_funci.suf = "a";
        break;
      default:
        break;
    }

    const subjSubs = [
      gedip.nm_gedip, // 1
      gedip.funcionario_gedip, // 2
      gedip.funcionario_gedip_nome.trim(), // 3
      sex_funci.suf // 4
    ];

    let bodySubs;
    switch (tipoEmail) {
      case ENVIO_NORMAL:
        if (parseInt(gedip.id_medida) === 6) {
          bodySubs = [
            gedip.nm_comite, // 1
            moment(gedip.dt_julgamento_gedip).format("DD/MM/YYYY"), // 2
            gedip.funcionario_gedip, // 3
            gedip.funcionario_gedip_nome.trim(), // 4
            FRONTEND_URL, // 5
            sex_resp.trat, // 6
            gedip.comissao_funci_resp, // 7
            sex_funci.ref, // 8
            sex_funci.suf // 9
          ];
        } else {
          bodySubs = [
            gedip.funcionario_gedip, // 1
            gedip.funcionario_gedip_nome.trim(), // 2
            FRONTEND_URL, // 3
            sex_resp.trat, // 4
            gedip.comissao_funci_resp, // 5
            sex_funci.ref, // 6
            sex_funci.suf, // 7
            gedip.abrangido_de // 8
          ];
        }
        break;
      case ENVIO_COBRANCA:
        if (parseInt(gedip.id_medida) === 6) {
          bodySubs = [
            moment(gedip.dt_limite_execucao).format("DD/MM/YYYY"), // 1
            gedip.nm_comite, // 2
            moment(gedip.dt_julgamento_gedip).format("DD/MM/YYYY"),  // 3
            gedip.funcionario_gedip, // 4
            gedip.funcionario_gedip_nome.trim(), // 5
            FRONTEND_URL, // 6
            sex_resp.trat, // 7
            gedip.comissao_funci_resp, // 8
            sex_funci.ref, // 9
            sex_funci.suf // 10
          ];
        } else {
          bodySubs = [
            moment(gedip.dt_limite_execucao).format("DD/MM/YYYY"), // 1
            gedip.funcionario_gedip, // 2
            gedip.funcionario_gedip_nome.trim(), // 3
            FRONTEND_URL, // 4
            sex_resp.trat, // 5
            gedip.comissao_funci_resp, // 6
            sex_funci.ref, // 7
            sex_funci.suf, // 8
            gedip.abrangido_de // 8
          ];
        }
        break;
      case ENVIO_DOCUMENTO:
        bodySubs = [
          gedip.nm_gedip, // 1
          gedip.funcionario_gedip, // 2
          gedip.funcionario_gedip_nome.trim(), // 3
          gedip.chave_funci_resp, // 4
          gedip.nome_funci_resp.trim(), // 5
          sex_funci.ref, // 6
          sex_funci.suf, // 7
          gedip.comissao_funci_resp // 8
        ];
        break;
      default:
        break;
    }

    subject = replaceVariable(subject, subjSubs);
    body = replaceVariable(body, bodySubs);

    const dadosEmail = {
      from: tipoEmail === ENVIO_DOCUMENTO ? gedip.email_funci_resp.trim() : 'gepes.gedip.pr@bb.com.br',
      to: tipoEmail === ENVIO_DOCUMENTO ? 'gepes.gedip.pr@bb.com.br' : gedip.email_funci_resp.trim(),
      subject: subject,
      body: body,
      attachments: anexo ? [anexo] : anexo,
      confirmReading: true
    }

    const envioEmail = await sendMail(dadosEmail);

    let enviado = false;

    if (envioEmail) {

      let mail = new MailLog();

      mail.id_gedip = gedip.id_gedip;
      mail.campo_de = dadosEmail.from;
      mail.campo_para = dadosEmail.to;

      await mail.save();

      if (!mail) {
        response.notFound('Falha ao salvar o log!');
      }

      enviado = !!mail.id;
    }

    return enviado;
  } catch(err) {
    throw new exception(err);
  }

}

const _getEmailSubjBody = async ({ medida, tipoEmail }) => {
  const getTextoEmail = await Gedip.query()
    .from('mail_content')
    .where('medida', medida)
    .andWhere('tipo_email', tipoEmail)
    .fetch();

  const texto = getTextoEmail.toJSON();

  return texto[0];
}

module.exports = {
  FunciRespMail: _FunciRespMail
}