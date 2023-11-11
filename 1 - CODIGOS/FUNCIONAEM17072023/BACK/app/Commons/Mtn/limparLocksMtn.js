"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const lockModel = use("App/Models/Postgres/MtnLock");

async function limparLocksMtn(idMtn, trx) {
  await lockModel.query().where("id_mtn", idMtn).delete(trx);
}

module.exports = limparLocksMtn;
