/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const envolvidoModel = use("App/Models/Postgres/MtnEnvolvido");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const notificacaoModel = use("App/Models/Postgres/MtnNotificacao");
const getDadosFunci = use("App/Commons/Mtn/getDadosFunci");
/**
 *
 *  Função que cria entrada na tabela notificacoes com o campo fila_envio 'true' o
 *
 *  @param {Object} notificacao Dados da notificação a ser enviada.
 *
 *  @return {number} Id da notificação criada.
 *
 */

const criarNotificacaoEnvolvido = async (dadosNotificacao, trx) => {
  const { tipoNotificacao, idEnvolvido } = dadosNotificacao;
  
  const envolvido = await envolvidoModel
    .query()
    .transacting(trx)
    .where("id", idEnvolvido)
    .first();

  const dadosFunci = await getDadosFunci(envolvido.matricula);
  const emailFunci =
    dadosFunci && dadosFunci.email
      ? dadosFunci.email.trim().toLowerCase()
      : `${envolvido.matricula}@bb.com.br`;

  const notificacao = new notificacaoModel();
  notificacao.email = emailFunci;
  notificacao.tipo = tipoNotificacao.id;
  notificacao.sucesso = false;
  notificacao.fila_envio = true;
  notificacao.mensagem = null;
  notificacao.reenviar = false;
  notificacao.renotificado = false;
  notificacao.id_envolvido = idEnvolvido;

  await notificacao.save(trx);

  return notificacao.id;

};

module.exports = criarNotificacaoEnvolvido;
