const { AbstractUserCase } = require('../../../AbstractUserCase');
const { REGEX_MATRICULA } = require('../../../Regex');
const MinutaRepository = require('../../repositories/MinutaRepository');

const notFoundErrorCode = 404;

/**
 * @param {string[]} list
 */
function toStringDisjunction(list) {
  return new Intl
    .ListFormat("pt-BR", { type: 'disjunction' })
    .format(list);
}

/**
 * @typedef {{listaDeMatriculas: string[], idFluxo: string}} RunArgs
 *
 * @typedef {{
 *  Repository: {
 *    minutas: MinutaRepository
 *  },
 *  RunArguments: RunArgs,
 *  Functions: {
 *    getManyFuncis: getManyFuncis,
 *    getDadosFunciDb2: getDadosFunciDb2,
 *  },
 *  Payload: Awaited<ReturnType<UcGetListaOutorgados['_action']>>,
 * }} UcGetListaOutorgadosTypes
 *
 * @extends {AbstractUserCase<UcGetListaOutorgadosTypes>}
 */
class UcGetListaOutorgados extends AbstractUserCase {
  /**
   * @param {RunArgs} args
   */
  _checks({ idFluxo, listaDeMatriculas }) {
    if (!idFluxo) {
      throw new Error('O id do fluxo deve ser informado.');
    }

    if (!Array.isArray(listaDeMatriculas) || listaDeMatriculas.length === 0) {
      throw new Error('A lista de matrículas deve ser informada.');
    }

    if (listaDeMatriculas.every(matricula => !REGEX_MATRICULA.test(matricula))) {
      throw new Error('A lista de matrículas deve conter matrículas válidas.');
    }
  }

  /**
   * @param {RunArgs} args
   */
  async _action({ idFluxo, listaDeMatriculas }) {
    const [fluxo, dadosFunci, dadosFunciDb2] = await Promise.all([
      this.repository.minutas.getOneFluxoMinuta(idFluxo),
      this.functions.getManyFuncis(listaDeMatriculas),
      this.functions.getDadosFunciDb2(listaDeMatriculas),
    ]);

    if (!fluxo) {
      this._throwExpectedError("Fluxo não encontrado.");
    }

    return listaDeMatriculas.reduce((output, matricula) => {
      if (REGEX_MATRICULA.test(matricula)) {
        const funci = dadosFunci.find((f) => f.matricula.toUpperCase() === matricula.toUpperCase());
        const funciDb2 = dadosFunciDb2.find((f) => f.matricula.toUpperCase() === matricula.toUpperCase());

        if (!funci) {
          output[matricula] = {
            error: "Funci não encontrado.",
          };
        } else {
          const error = this.#checkFunci(fluxo, funci);
          output[matricula] = {
            error,
            funci: /** @type {Funci} */ ({
              ...funci,
              // caso exista valores no db2, os valores serão substituidos
              // fallback para os dados do ARH
              nome: funciDb2?.nome || funci.nome,
              rg: funciDb2?.rg || funci.rg,
            }),
          };
        }
      } else {
        output[matricula] = {
          error: "Matrícula inválida.",
        };
      }

      return output;
    }, /** @type {Record<string,{ error: string|null, funci?: Funci}>} */({}));
  }

  /**
   * @param {import('../__mocks__/FluxosProcuracao').FluxoMinuta} fluxo
   * @param {Funci} dadosFunci
   */
  #checkFunci({ outorgados: { refOrganizacional, prefixos } }, dadosFunci) {
    const isPrefixoValido = prefixos?.some(prefixo => prefixo === dadosFunci.prefixoLotacao) ?? true;
    if (!isPrefixoValido) {
      return `Outorgado deve pertencer a um dos prefixos: ${toStringDisjunction(prefixos)}`;
    }

    const isFuncaoValida = refOrganizacional?.some(funcao => funcao === dadosFunci.refOrganizacionalFuncLotacao) ?? true;
    if (!isFuncaoValida) {
      return `Função do outorgado deve ser uma das seguintes: ${toStringDisjunction(refOrganizacional)}`;
    }

    return null;
  }
}

module.exports = UcGetListaOutorgados;
