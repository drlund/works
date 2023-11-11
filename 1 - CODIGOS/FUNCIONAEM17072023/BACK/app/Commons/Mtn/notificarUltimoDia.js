const TemplateEmailEngine = use("App/Commons/TemplateEmailEngine");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const envolvidoModel = use("App/Models/Postgres/MtnEnvolvido");
const Logger = use("Logger");
const { mtnConsts } = use("Constants");
const { tiposNotificacao, tituloEmail } = mtnConsts;
const moment = use("App/Commons/MomentZone");
const getDadosFunci = use("App/Commons/Mtn/getDadosFunci");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const notificacaoModel = use("App/Models/Postgres/MtnNotificacao");

async function notificarUltimoDia(idEnvolvido, tipo, trx) {
  
  if (!tiposNotificacao[tipo]) {
    Logger.transport("file").error({
      timestamp: moment().format(),
      message: `notificarUltimoDia: Tipo de notificação ${tipo} não implementado`
    });
    return;
  }

  const envolvido = await envolvidoModel.find(idEnvolvido);

  if(!envolvido){
    Logger.transport("file").error({
      timestamp: moment().format(),
      message: `notificarUltimoDia: Envolvido ${idEnvolvido} não encontrado`
    });
    return;
  }


  const dadosFunci = await getDadosFunci(envolvido.matricula);

  if (!dadosFunci) {
    Logger.transport("file").error({
      timestamp: moment().format(),
      message: `notificarUltimoDia: Funcionário ${envolvido.matricula} não encontrado `
    });
    return;
  }


  const emailEngine = new TemplateEmailEngine(tiposNotificacao[tipo].template, {
    from: "mtn.naoresponder@bb.com.br",
    subject: tituloEmail
  });

  let enviou = await emailEngine.sendMail(
    { to: dadosFunci.email.trim().toLowerCase() },
    [envolvido.id_mtn]
  );

  const notificacao = new notificacaoModel();
  notificacao.email = dadosFunci.email.trim().toLowerCase();
  notificacao.tipo = tiposNotificacao[tipo].id;
  notificacao.sucesso = enviou;
  notificacao.mensagem = emailEngine._templateString;
  notificacao.id_envolvido = envolvido.id;

  await notificacao.save(trx);
}

module.exports = notificarUltimoDia;
