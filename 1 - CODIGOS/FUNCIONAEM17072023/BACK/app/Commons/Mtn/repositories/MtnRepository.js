/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const MtnModel = use("App/Models/Postgres/Mtn");

class MtnRepository {
  async update(idMtn, dadosMtn, trx) {
    return await MtnModel
      .query()
      .transacting(trx)
      .where("id", idMtn)
      .update(dadosMtn);
  }
}

module.exports = MtnRepository;
