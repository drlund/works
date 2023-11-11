
const exception = require("../../Exceptions/Handler");

/**
 * Simples handler para erros do AbstractUserCase, se existir um erro, usa o exception do Adonis.
 * Se não houver erro, não faz nada.
 *
 * @param {[string, number] | undefined} error erro do AbstractUserCase que é [message,code]
 */
function handleAbstractUserCaseError(error) {
  if (error) {
    // default error do AbstractUserCase
    if (Array.isArray(error)) {
      const [message, code] = error;
      throw new exception(message, code);
    } else {
      if (error instanceof Error) {
        // não deveria acontecer, mas se acontecer, vamos tratar
        throw new exception(`${error.name}: ${error.message}`, 500);
      } else {
        // algo deu muito errado
        throw new exception(JSON.stringify(error), 500);
      }
    }
  }
}

module.exports = {
  handleAbstractUserCaseError
};
