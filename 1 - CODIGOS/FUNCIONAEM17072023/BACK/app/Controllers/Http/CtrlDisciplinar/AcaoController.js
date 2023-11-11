'use strict'

const exception = use("App/Exceptions/Handler");
const Acao = use("App/Models/Mysql/CtrlDisciplinar/Acao")

class AcaoController {

    /**
   * Lista todas as Acões.
   * GET Acoes
   *
   * @param {object} ctx
   */

    async index () {
      try {
        const all = Acao.all();

        return all;
      } catch (error) {
        throw new exception("Problema ao recuperar todas as ações!", 400);
      }
    }
}

module.exports = AcaoController
