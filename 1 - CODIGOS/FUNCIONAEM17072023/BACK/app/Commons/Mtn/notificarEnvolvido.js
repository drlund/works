const getPrazoDesdeUltimaAcao = use("App/Commons/Mtn/getPrazoDesdeUltimaAcao");
const getDadosFunci = use("App/Commons/Mtn/getDadosFunci");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const envolvidoModel = use("App/Models/Postgres/MtnEnvolvido");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const notificacaoModel = use("App/Models/Postgres/MtnNotificacao");
const acaoModel = use("App/Models/Postgres/MtnTiposAcao");
const { mtnConsts } = use("Constants");
const { acoes, tituloEmail, medidas } = mtnConsts;
const TemplateEmailEngine = use("App/Commons/TemplateEmailEngine");

async function notificarEnvolvido(
  tipoNotificacao,
  idEnvolvido,
  acao,
  idNotificacao,
  isCommand
) {
  if (acao.notifica_envolvido === "0") {
    return;
  }

  const envolvido = await envolvidoModel.find(idEnvolvido);
  await envolvido.load("mtn");

  //Quando a medida for alerta ético e já for a finalização do parecer, deve-se enviar com aviso de recebimento
  const avisoRecebimento =
    envolvido.id_medida === medidas.ALERTA_ETICO_NEGOCIAL &&
    acao.id === acoes.FINALIZAR_ANALISE;

  const dadosFunci = await getDadosFunci(envolvido.matricula);
  const emailFunci =
    dadosFunci && dadosFunci.email
      ? dadosFunci.email.trim().toLowerCase()
      : `${envolvido.matricula}@bb.com.br`;
  const emailEngine = new TemplateEmailEngine(tipoNotificacao.template, {
    from: avisoRecebimento
      ? "mtn.alertaetico@bb.com.br"
      : "mtn.naoresponder@bb.com.br",
    subject: tituloEmail + ` - MTN - ${envolvido.toJSON().mtn.nr_mtn}`,
    confirmReading: avisoRecebimento,
  });

  let enviou = await emailEngine.sendMail(
    {
      confirmReading: avisoRecebimento,
      to: emailFunci,
    },

    [envolvido.id_mtn, envolvido.toJSON().mtn.nr_mtn]
  );

  const notificacao = await notificacaoModel.find(idNotificacao);
  notificacao.sucesso = enviou;
  notificacao.mensagem = emailEngine._templateString;
  notificacao.reenviar = !enviou;
  notificacao.fila_envio = false;
  await notificacao.save();

  if (isCommand) {
    Database.close();
  }
}

module.exports = notificarEnvolvido;
