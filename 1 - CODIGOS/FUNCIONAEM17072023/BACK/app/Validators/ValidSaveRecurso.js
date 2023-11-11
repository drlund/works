'use strict'
const Logger = use('Logger');
const moment = use('App/Commons/MomentZone');

class SaveRecurso {

  get rules () {
    return {
      idRecurso: "number|required",
      txtRecurso: "string|required"
    }
  }

  get data(){

    const requestBody = this.ctx.request.all()
    const {idRecurso, txtRecurso} = {...this.ctx.request.params, ...this.ctx.request.all() };
    return Object.assign({}, requestBody, { idRecurso, txtRecurso });

  }

  get messages () {
    return {
      'idRecurso.number': 'O id do recurso deve ser um número.',
      'idRecurso.required': 'O id do recurso é obrigatório.',
      'txtRecurso.string': 'O texto do parecer deve ser um string.',
      'txtRecurso.required': 'Obrigatório informar o texto do esclarecimento'
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

module.exports = SaveRecurso
