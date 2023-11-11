'use strict'

const exception = use("App/Exceptions/Handler");
const AcoesGestores = use("App/Models/Mysql/CtrlDisciplinar/AcoesGestores");

class AcoesGestoresController {


    /**
   * Lista todos as ações dos gestores.
   * GET acoesgestores
   *
   * @param {object} ctx
   */

    async index () {
      try {
        const all = AcoesGestores.all();

        return all;
      } catch (error) {
        throw new exception("Problema ao recuperar todas as ações!", 400);
      }
    }
}

module.exports = AcoesGestoresController
