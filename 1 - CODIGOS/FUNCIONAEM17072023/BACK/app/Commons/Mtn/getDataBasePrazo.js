/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const prazosModel = use("App/Models/Postgres/MtnConfigPrazos");
const moment = require("moment");

const getDatabasePrazo = async (data_criacao, tipoPrazo) => {
  const prazosDB = await prazosModel.last();
  if (!prazosDB) {
    return moment(data_criacao);
  }

  const prazos = {};
  for (const tipoPrazoAlterado in prazosDB.toJSON().config) {
    //Pega somente as configurações que dizem respeito a prazos
    if (moment(prazosDB.toJSON().config[tipoPrazoAlterado]).isValid()) {
      prazos[tipoPrazoAlterado] = moment(
        prazosDB.toJSON().config[tipoPrazoAlterado]
      )
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
    }
  }

  if (
    prazos[tipoPrazo] &&
    moment(prazos[tipoPrazo]).isSameOrAfter(moment(data_criacao))
  ) {
    return moment(prazos[tipoPrazo]);
  }

  return moment(data_criacao).startOf("day").format("YYYY-MM-DD HH:mm:ss");
};

module.exports = getDatabasePrazo;
