/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const notificacaoModel = use("App/Models/Postgres/MtnNotificacao");
const moment = require("moment");
/**
 *
 *  Retorna os e-mails cuja notificação foi criada no banco de dados.
 *
 *
 */

const getNotificacoes = async (dataNotificacao, incluirComSucesso) => {
  const data = moment(dataNotificacao);

  const query = notificacaoModel
    .query()
    .where(
      "created_at",
      ">=",
      data.startOf("day").format("YYYY-MM-DD HH:mm:ss")
    )
    .where("created_at", "<=", data.endOf("day").format("YYYY-MM-DD HH:mm:ss"));

  if (incluirComSucesso === true) {
    query.where("sucesso", true);
  } else {
    query.where("sucesso", false);
  }

  const notificacoes = await query
    .with("envolvido", (builder) => {
      builder.with("mtn");
    })
    .fetch();

  return notificacoes.toJSON();
};

module.exports = getNotificacoes;
