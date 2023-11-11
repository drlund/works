'use strict';

const ibmdb = require('ibm_db');
const Env = use('Env');
const Logger = use('Logger');
const moment = /** @type {import('moment')} */ (use('App/Commons/MomentZoneBR'));

module.exports = {

  /**
   * Metodo responsavel por executar uma query de consulta no DB2.
   *
   * @template {unknown} [TReturn=unknown]
   * @param {String} queryStr - query a ser executada (somente SELECT)
   * @param {unknown[]} [bindingParams] - lista dos parametros a serem vinculado na query.
   * @param {String} [connectionString] - string de conexao
   *
   * @returns {Promise<TReturn[]>}
   *
   * @example```js
   *  const queryStr = "Select * from tabela where id = ? and nome = ?;"
   *  const params = [5, "João da Silva"]
   *
   *  const result = await Db2Database.executeDB2Query(queryStr, params);
   * ```
   */
  executeDB2Query: (queryStr, bindingParams = [], connectionString = 'DB2_CONNECTION_STRING') => {
    return new Promise((resolve, reject) => {
      if (!queryStr.length) {
        reject("Consulta não informada!");
      }

      // @ts-expect-error Env não tipado
      const connStr = Env.get(connectionString);

      if (!connStr || connStr === "") {
        reject("DB2 - Sem informações da conexão!");
      }

      //abre a conexao
      ibmdb.open(connStr, function (err, conn) {

        if (err) {
          reject("Falha ao conectar na base de dados!");
        }

        //executa a query com bind params
        conn.queryResult(queryStr, bindingParams, function (err, result) {
          if (err) {
            // @ts-expect-error Logger não tipado
            Logger.transport('file').error({
              timestamp: moment().format(),
              origin: '',
              message: err,
              status: 500,
              name: "DB2 Query Error",
              stack: `${queryStr} - Parâmetros da Consulta: [${bindingParams.join(",")}]`,
            });

            reject("Falha ao executar a consulta na base de dados!");
          } else {
            const data = result.fetchAllSync();
            result.closeSync();
            conn.closeSync();

            resolve(data);
          }
        });
      });
    });
  }
};
