const { AbstractUserCase } = require('../../../AbstractUserCase');
const MinutaRepository = require('../../repositories/MinutaRepository');

const notFoundErrorCode = 404;

/**
 * @typedef {{listaDeMinutas: string[]}} RunArgs
 *
 * @typedef {{
 *  Repository: {
 *    minutas: MinutaRepository
 *  },
 *  RunArguments: RunArgs,
 *  Functions: never,
 *  Payload: Awaited<ReturnType<UcDeleteManyMinutas['_action']>>,
 * }} UcGetListaOutorgadosTypes
 *
 * @extends {AbstractUserCase<UcGetListaOutorgadosTypes>}
 */
class UcDeleteManyMinutas extends AbstractUserCase {
  /**
   * @override
   * @param {RunArgs} args
   */
  _checks({ listaDeMinutas }) {
    if (!Array.isArray(listaDeMinutas) || listaDeMinutas.length === 0) {
      throw new Error('A lista de minutas deve ser informada.');
    }
  }

  /**
   * @override
   * @param {RunArgs} args
   */
  async _action({ listaDeMinutas }) {
    const result = await this.repository.minutas.softDeleteManyMinutaCadastrada(listaDeMinutas);

    if (result < 1) {
      this._throwExpectedError('Nenhuma minuta foi removida.', notFoundErrorCode);
    }

    return true;
  }
}

module.exports = UcDeleteManyMinutas;
