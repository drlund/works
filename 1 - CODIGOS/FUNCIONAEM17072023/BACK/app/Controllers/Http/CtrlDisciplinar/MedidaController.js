'use strict'

const exception = use('App/Exceptions/Handler');
const Medida = use("App/Models/Mysql/CtrlDisciplinar/Medida");

class MedidaController {

     /**
   * Lista todos as Medidas
   * GET medidas
   *
   * @param {object} ctx
   */

  async index () {
    try {
      const all = await Medida.all();

      return all.toJSON();
    } catch (error) {
      throw new exception("Problema ao recuperar todas as medidas!", 400);
    }
  }
}

module.exports = MedidaController
