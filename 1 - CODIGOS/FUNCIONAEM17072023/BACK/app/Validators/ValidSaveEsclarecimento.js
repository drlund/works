'use strict'
const Logger = use('Logger');
const moment = use('App/Commons/MomentZone');
class ValidSaveEsclarecimento {
  get rules () {
    return {
      idEnvolvido: "number|required",
      txtEsclarecimento: "string|required",
    }
  }

  get data(){

    const requestBody = this.ctx.request.all()
    const {idEnvolvido, txtEsclarecimento} = {...this.ctx.request.params, ...this.ctx.request.all() };
    return Object.assign({}, requestBody, { idEnvolvido, txtEsclarecimento });

  }

  get messages () {
    return {
      'idEnvolvido.number': 'O id do envolvido deve ser um número.',
      'idEnvolvido.required': 'O id do envolvido é obrigatório.',
      'txtEsclarecimento.string': 'O texto do parecer deve ser um string.',
      'txtEsclarecimento.required': 'Obrigatório informar o texto do esclarecimento'
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

module.exports = ValidSaveEsclarecimento
