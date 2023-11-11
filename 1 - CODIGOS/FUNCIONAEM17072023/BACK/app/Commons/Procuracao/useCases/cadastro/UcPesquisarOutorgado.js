const { AbstractUserCase } = require('../../../AbstractUserCase');
const { REGEX_MATRICULA } = require('../../../Regex');
const MinutaRepository = require('../../repositories/MinutaRepository');

/**
 * @param {string[]} list
 */
function toStringDisjunction(list) {
  return new Intl
    .ListFormat("pt-BR", { type: 'disjunction' })
    .format(list);
}

/**
 * @typedef {{termoPesquisa: string, idFluxo: string}} RunArgs
 *
 * @typedef {{
 *  Repository: {
 *    minutas: MinutaRepository
 *  },
 *  RunArguments: RunArgs,
 *  Functions: {
 *    getOneFunci: getOneFunci,
 *    getDadosFunciDb2: getDadosFunciDb2,
 *  },
 *  Payload: Funci,
 * }} UcPesquisarOutorgadoTypes
 *
 * @extends {AbstractUserCase<UcPesquisarOutorgadoTypes>}
 */
class UcPesquisarOutorgado extends AbstractUserCase {
  /**
   * @param {RunArgs} args
   */
  async _checks({ termoPesquisa }) {
    if (!REGEX_MATRICULA.test(termoPesquisa)) {
      throw new Error("A pesquisa deve ser feita por uma matrícula.");
    }
  }

  /**
   * @param {RunArgs} args
   */
  async _action({ idFluxo, termoPesquisa }) {
    const [fluxo, dadosFunci, [dadosFunciDb2]] = await Promise.all([
      this.repository.minutas.getOneFluxoMinuta(idFluxo),
      this.functions.getOneFunci(termoPesquisa),
      this.functions.getDadosFunciDb2([termoPesquisa]),
    ]);

    if (!fluxo) {
      this._throwExpectedError("Fluxo não encontrado.");
    }

    if (!dadosFunci) {
      this._throwExpectedError("Funci não encontrado.");
    }

    const { refOrganizacional, prefixos } = fluxo.outorgados;

    const isPrefixoValido = prefixos?.some(prefixo => prefixo === dadosFunci.prefixoLotacao) ?? true;
    if (!isPrefixoValido) {
      this._throwExpectedError(
        `Outorgado deve pertencer a um dos prefixos: ${toStringDisjunction(prefixos)}`
      );
    }

    const isFuncaoValida = refOrganizacional?.some(funcao => funcao === dadosFunci.refOrganizacionalFuncLotacao) ?? true;
    if (!isFuncaoValida) {
      this._throwExpectedError(
        `Função do outorgado deve ser uma das seguintes: ${toStringDisjunction(refOrganizacional)}`
      );
    }

    return /** @type {Funci} */({
      ...dadosFunci,
      // se houver dados do db2, usar dados do db2, fallback para os dados do ARH
      nome: dadosFunciDb2?.nome || dadosFunci.nome,
      rg: dadosFunciDb2?.rg || dadosFunci.rg,
    });
  }
}

module.exports = UcPesquisarOutorgado;
