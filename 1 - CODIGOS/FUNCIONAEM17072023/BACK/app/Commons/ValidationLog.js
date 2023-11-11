const Logger = use('Logger');
const moment = use('App/Commons/MomentZoneBR');
/**
 * 
 *  Função que registra no log um erro de validação e retorna um erro para ser usado no front-end.
 * 
 * @param {*} errorMessages Mensagens de erro no formato retornado pelo validator
 */
async function validationLog(errorMessages) {

  let stringErro = "Erros de validação: ";
    const user = this.ctx.session.get('currentUserAccount');

    for(let message of errorMessages){
      Logger.transport("validation_errors").error({
        ...message,
        timestamp: moment().format(),        
        funci: user ? 
          `${user.chave} - ${user.nome_usuario}` : "Não se aplica"
      })

      stringErro += message.message + ", "
    }
  return stringErro;
}

module.exports = validationLog;