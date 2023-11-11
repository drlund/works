'use strict'

// const BaseExceptionHandler = use('BaseExceptionHandler')
const { LogicalException } = require('@adonisjs/generic-exceptions')
const Logger = use('Logger');
const moment = use('App/Commons/MomentZoneBR');

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends LogicalException {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, { response }) {
    if (process.env.NODE_ENV === 'development' && error.status === 500) {
      console.error('\n');
      console.error(error);
      console.error('\n');

      return response.status(500).json({
        error: String(error),
        stack: error.stack,
      });
    }

    let msg = error.message;
    switch (error.status) {
      case 500:
        msg = "Erro interno. Caso o mesmo persista, favor contatar o administrador do sistema.";
        break;
    }

    response.status(error.status).send(msg);
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, {request }) {
    let origin = "";

    try {
      let caller = error.stack.split(" at ")[1].trim();
      origin = caller.split(" ")[0];
      origin += caller.split(".js")[1].replace(")","");
    } catch (err) {
      origin = error.message;
    }

    let transportType = 'console';
    switch (error.status) {
      case 500:
        transportType = 'file'
        break;
      case 401:
        transportType = 'http_errors'
        break;
      case 404:
        transportType = 'http_errors'
        break;
      case 400:
        transportType = 'http_errors'
        break;
      default:
        transportType = 'http_errors'
    }


    Logger.transport(transportType).error({
      timestamp: moment().format(),
      origin,
      matricula: request.matriculaRequisicao ? request.matriculaRequisicao : 'Matrícula não informada',
      message: error.message,
      status: error.status,
      name: error.name,
      ip: request.ip(),
      stack: error.stack
    })

  }
}

module.exports = ExceptionHandler
