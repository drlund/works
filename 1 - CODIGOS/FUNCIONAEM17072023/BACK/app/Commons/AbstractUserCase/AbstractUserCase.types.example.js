const { AbstractUserCase, handleAbstractUserCaseError } = require('.');
const FuncionarioRepository = require('../Arh/Funcionario/FuncionarioRepository');
const getOneFunci = require('../Arh/getOneFunci');
const { abcHasPermission } = require('./abcHasPermission');

/**
 * @typedef {{
 *  nome: string;
 *  number: number;
 * }} RunArgs
 *
 * @typedef {{
 *  Repository: {
 *    arh: FuncionarioRepository,
 *  },
 *  Functions: {
 *    getOneFunci: getOneFunci,
 *    hasPermission: import('./abcHasPermission').abcHasPermissionUCLevel
 *  },
 *  RunArguments: RunArgs,
 *  Payload: Awaited<ReturnType<MyExample['_action']>>,
 *  UseTrx: false
 * }} MyExampleTypes
 *
 * @extends {AbstractUserCase<MyExampleTypes>}
 */
class MyExample extends AbstractUserCase {
  /**
   * @override
   * @param {RunArgs} props
   */
  async _action({ number }) {
    this.repository.arh.getAusencias(number, new Date(), new Date());

    return {
      a: number,
      b: 1,
    };
  }

  /**
   * @override
   * @param {RunArgs} props
   */
  async _checks({ nome }) {
    this.functions.getOneFunci(nome);
    this.functions.hasPermission({
      nomeFerramenta: 'minha ferramenta',
      permissoesRequeridas: 'permissão necessária'
    });
  }
}


class ControllerExample {
  /**
   * @param {ControllerRouteProps<{something: string, plus: number}>} props
   */
  async example({ request, usuarioLogado }) {
    const { something, plus } = request.allParams();

    const { error, payload: { a, b } } = await new MyExample({
      repository: {
        arh: new FuncionarioRepository()
      },
      functions: {
        getOneFunci,
        hasPermission: abcHasPermission({ usuarioLogado }),
      },
    }).run({
      nome: something,
      number: plus,
    });

    handleAbstractUserCaseError(error);

    return `${a}: ${b}`;
  }
}
