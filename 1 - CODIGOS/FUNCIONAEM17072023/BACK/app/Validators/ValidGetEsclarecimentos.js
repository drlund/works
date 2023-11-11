'use strict'

const validationLog = use("App/Commons/ValidationLog");

class ValidGetEsclarecimentos {
  get rules () {
    return {
      idEnvolvido: "number|required"
    }
  }

  get data(){
    const requestBody = this.ctx.request.all()
    const {idEnvolvido} = {...this.ctx.request.params, ...this.ctx.request.all() };
    return Object.assign({}, requestBody, { idEnvolvido });
  }

  get messages () {
    return {
      'idEnvolvido.number': 'O id do envolvido deve ser um número.',
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.badRequest(getValidationLog(errorMessages));
  }

}

module.exports = ValidGetEsclarecimentos
