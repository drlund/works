'use strict'

const exception = use('App/Exceptions/Handler');
const StatusGedip = use("App/Models/Mysql/CtrlDisciplinar/StatusGedip");

class StatusGedipController {

    /**
   * Lista todos os status dos registros de Gedip.
   * GET statusgedips
   *
   * @param {object} ctx
   */

    async index () {
      try {
        const all = StatusGedip.all();

        return all;
      } catch (error) {
        throw new exception("Problema ao recuperar todos os Status!", 400);
      }
    }
}

module.exports = StatusGedipController
