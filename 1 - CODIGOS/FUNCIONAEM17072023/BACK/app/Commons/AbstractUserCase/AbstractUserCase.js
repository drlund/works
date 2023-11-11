const { ExpectedAbstractError } = require('./ExpectedError');

const BAD_REQUEST_ERROR_CODE = 400;
const INTERNAL_SERVER_ERROR_CODE = 500;
const checksErrorMessage = "Checks must be implemented";

/**
 * @typedef {{
 *  [x: string]: unknown | Promise<unknown>
 * }| unknown | Promise<unknown>} RepositoryBase Type of the repository that will be used
 *
 * @typedef {{
 *  [x: string]: Function | Promise<Function>
 * }| Function | Promise<Function>} FunctionsBase Type of the functions that will be used
 */

/**
 * @typedef {Object} AbcBase
 * @property {RepositoryBase} AbcBase.Repository Type of the repository that will be used
 * @property {FunctionsBase} AbcBase.Functions Type of the functions that will be used
 * @property {unknown} AbcBase.RunArguments Type of the arguments that will be passed to `.run`
 * @property {unknown} AbcBase.Payload Type of the `payload` returned
 * @property {boolean} [AbcBase.UseTrx=false] true if using `trx` (transactions)
 */

/**
 * @template {AbcBase} AbcTypes
 * @typedef {AbcTypes['UseTrx'] extends true ? {
 *  trx: Adonis.Trx;
 * } : {
 *  trx?: null;
 * }} MaybeTrx
 */

/**
 * @template {AbcBase} AbcTypes
 * @typedef {AbcTypes['Functions'] extends null ? {
 *    functions?: null
 *  } : {
 *    functions: AbcTypes['Functions']
 *  }} MaybeFunctions
 */

/**
 * @template {AbcBase} AbcTypes
 * @typedef {{
 *  repository: AbcTypes['Repository'];
 *  autoCommitTrx?: boolean
 * } & MaybeFunctions<AbcTypes> & MaybeTrx<AbcTypes>
 * } AbstractConstructorProps
 */

/**
 * @abstract
 * @class
 * @template {AbcBase} AbcTypes
 */
class AbstractUserCase {
  /**
   * @type {AbcTypes['Repository']} repository
   */
  #repository;
  /**
   * @type {AbcTypes['Functions']} functions
   */
  #functions;
  /**
   * @type {Adonis.Trx} Trx
   */
  #trx;

  /**
   * @type {Array<string>} errors
   */
  #error = [];
  #useChecks = true;
  #usePayload = true;
  #autoCommitTrx = true;

  /**
   * @param {AbstractConstructorProps<AbcTypes>} props
   */
  constructor({
    repository,
    functions = null,
    trx = null,
    autoCommitTrx = true,
  }) {
    if (this.constructor === AbstractUserCase) {
      throw new Error("Abstract classes can't be instantiated.");
    }

    if (repository === null || repository === undefined) {
      throw new Error("Repository must be passed");
    }

    this.#repository = repository;

    this.#functions = functions;

    if (trx && !this.#validTransationObject(trx)) {
      throw new Error("Transaction doesn't comply with the interface.");
    }

    this.#trx = trx;
    this.#autoCommitTrx = autoCommitTrx;

    if (this.run !== AbstractUserCase.prototype.run) {
      throw new Error('Dont override the "run" method');
    }

    if (this._config !== AbstractUserCase.prototype._config) {
      throw new Error('Dont override the "_config" method');
    }

    if (this._action === AbstractUserCase.prototype._action) {
      throw new Error("Action must be implemented");
    }
  }

  /**
   * @param {Adonis.Trx} trx
   * @returns {trx is Adonis.Trx} if valid trx object
   */
  #validTransationObject(trx) {
    return (
      trx.commit &&
      trx.rollback &&
      typeof trx.commit === "function" &&
      typeof trx.rollback === "function"
    );
  }

  get repository() {
    return this.#repository;
  }

  get functions() {
    return this.#functions;
  }

  get autoCommitTrx() {
    return this.#autoCommitTrx;
  }

  get trx() {
    return this.#trx;
  }

  /**
   * Config if should use checks and payload
   * @param {{
   *  useChecks?: boolean;
   *  usePayload?: boolean;
   * }?} props
   */
  _config({ useChecks = null, usePayload = null } = {}) {
    if (useChecks !== null) {
      this.#useChecks = useChecks;
    }
    if (usePayload !== null) {
      this.#usePayload = usePayload;
    }
  }

  /**
   * Helper function to throw an error with the class ExpectedAbstractError
   *
   * Errors with the class ExpectedAbstractError
   * will return an error object containing
   * the message and the status code 400.
   * @param {string} message
   * @param {number} code
   * @throws {ExpectedAbstractError} ExpectedAbstractError
   */
  _throwExpectedError(message, code = BAD_REQUEST_ERROR_CODE) {
    throw new ExpectedAbstractError(message, code);
  }

  /**
   * @abstract
   * Implement and throw error if checks don't pass
   *
   * _checks can be async
   * @param {AbcTypes['RunArguments']} args will be provided
   * @returns {void|Promise<void>}
   */
  _checks(args) {
    if (this.#useChecks) {
      throw new Error(checksErrorMessage);
    }
  }

  /**
   * @abstract
   * Implement and return a result
   *
   * _action can be async
   * @param {AbcTypes['RunArguments']} args will be provided
   * @returns {AbcTypes['Payload']|Promise<AbcTypes['Payload']>}
   */
  _action(args) {
    // if extending but for some reason calling super._action()
    // istanbul ignore next
    throw new Error("Override _action");
  }

  /**
   * @param {AbcTypes['RunArguments']} args
   */
  // @ts-ignore
  async #validate(...args) {
    // @ts-ignore
    if (this.#usePayload && (args.length === 0 || args === null || args === undefined)) {
      this.#error.push("Payload não pode ser vazio");
    }

    try {
      // @ts-ignore
      await this._checks(...args);
    } catch (error) {
      // case of not implementing checks
      if (error.message === checksErrorMessage) {
        throw new Error(checksErrorMessage);
      }

      // case of errors with code other than 400
      if (error instanceof ExpectedAbstractError) {
        // just rethrows error
        throw error;
      }

      // these cases, rethrow the error with the stack for more context as internal error
      if (error instanceof TypeError || error instanceof SyntaxError || error instanceof ReferenceError) {
        throw new ExpectedAbstractError(
          JSON.stringify({ name: error.name, message: error.message, stack: error.stack }),
          INTERNAL_SERVER_ERROR_CODE
        );
      }

      // other cases, add to errors
      this.#error.push(
        // normal error has a message
        error.message ??
        // possible sql message
        error.sqlMessage ??
        // possible custom error or something else that doesn't have a message
        JSON.stringify(error)
      );
    }
  }

  /**
   * @typedef {{
   *  error?: undefined;
   *  payload: AbcTypes['Payload'];
   * }} RunPayload
   * @typedef {{
   *  error: [string, number];
   *  payload?: undefined;
   * }} RunError
   */

  /**
   * Recebe o valor que será repassado para o `_checks` e `_action`
   *
   * @param {...AbcTypes['RunArguments']} args aceita qualquer tipo de valor
   * @returns {Promise<RunPayload|RunError>} sendo o `payload` o retorno de `_action` e `error` caso exista erros
   */
  async run(...args) {
    try {
      await this.#validate(...args);
    } catch (error) {
      // return error with code other than 400
      if (error instanceof ExpectedAbstractError) {
        return { error: [error.message, error.code] };
      }

      // rethrows other errors
      throw error;
    }

    // neste ponto, seria tudo erros de validação, então status 400
    if (this.#error.length > 0) {
      if (this.trx) {
        await this.trx.rollback();
      }

      return { error: [this.#error.join(','), BAD_REQUEST_ERROR_CODE] };
    }

    try {
      // @ts-ignore
      const actionResult = await this._action(...args);

      if (this.trx && this.autoCommitTrx) {
        await this.trx.commit();
      }

      return { payload: actionResult };
    } catch (error) {
      if (this.trx) {
        await this.trx.rollback();
      }

      if (error instanceof ExpectedAbstractError) {
        return { error: [error.message, error.code] };
      }

      // these cases, pass the error with the stack for more context
      if (error instanceof TypeError || error instanceof SyntaxError || error instanceof ReferenceError) {
        return { error: [JSON.stringify({ name: error.name, message: error.message, stack: error.stack }), INTERNAL_SERVER_ERROR_CODE] };
      }

      // aqui seria erro de banco de dados
      return {
        error: [
          // normal error has a message
          error.message ??
          // possible sql message
          error.sqlMessage ??
          // possible custom error or something else that doesn't have a message
          error,
          INTERNAL_SERVER_ERROR_CODE
        ]
      };
    }
  }
}

module.exports = {
  AbstractUserCase
};
