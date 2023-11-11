'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const esclarecimentoModel = use("App/Models/Postgres/MtnEsclarecimento");

class ProrrogarEsclarecimento {

  get rules (){
    return {
      idEsclarecimento: "number|required",
    }
  }

  get data(){

    const requestBody = this.ctx.request.all()
    const {idEsclarecimento} = {...this.ctx.request.params, ...this.ctx.request.all() };
    return Object.assign({}, requestBody, { idEsclarecimento});

  }

  get messages () {
    return {
      'idEsclarecimento.number': 'O id do esclarecimento é obrigatório e deve ser um número.',
    }
  }

  async fails (errorMessages) {
    let stringErro = "Erros de validação: ";
    const user = this.ctx.session.get('currentUserAccount');

    for(let message of errorMessages){
      Logger.transport("validation_errors").info({
        ...message,
        timestamp: moment().format(),        
        funci: user ? 
          `${user.chave} - ${user.nome_usuario}` : "Não se aplica"
      })

      stringErro += message.message + ", "
    }

    return this.ctx.response.badRequest(stringErro);
  }
}

module.exports = ProrrogarEsclarecimento
