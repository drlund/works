'use strict'

const Comite = use("App/Models/Mysql/CtrlDisciplinar/Comite");
const exception = use("App/Exceptions/Handler");

class ComiteController {
     /**
   * Lista todos os Comitês.
   * GET comites
   *
   * @param {object} ctx
   */

  async index () {
    try {
      const active = await Comite.query()
        .where('ativo', 1)
        .fetch();

      return active;
    } catch (error) {
      throw new exception('Não foi possível recuperar a lista de comitês!', 400);
    }
}
}

module.exports = ComiteController
