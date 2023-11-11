const { AbstractUserCase } = require('../../../AbstractUserCase');
const Diff = require('diff');

/**
 * @typedef {import('../../repositories/PesquisaRepository').CadeiaDeProcuracao} CadeiaDeProcuracao
 */

/**
 * @typedef {string} RunArgs
 *
 * @typedef {{
 *  Repository: import('../../repositories/MinutaRepository'),
 *  Functions: {
 *    getOneFunci: getOneFunci,
 *    getProcuracao: ({idProxy, idProcuracao}: {idProxy: string, idProcuracao: number}) => Promise<CadeiaDeProcuracao>
 *  },
 *  RunArguments: RunArgs,
 *  Payload: Awaited<ReturnType<UcRegenerateMinuta['_action']>>,
 *  UseTrx: false
 * }} UcRegenerateMinutaTypes
 *
 * @extends {AbstractUserCase<UcRegenerateMinutaTypes>}
 */
class UcRegenerateMinuta extends AbstractUserCase {
  /**
   * @override
   * @param {RunArgs} idMinuta
   */
  async _checks(idMinuta) {
    if (!idMinuta) {
      throw new Error("ID da Minuta é necessário.");
    }
  }

  /**
   * @override
   * @param {RunArgs} idMinuta
   */
  async _action(idMinuta) {
    const minutaCadastrada = /** @type {import('../../repositories/MinutaRepository').MinutaTabelaType} */(
      await this.repository.getOneMinuta(idMinuta)
        .catch((err) => this._throwExpectedError(err, 400))
    );
    if (!minutaCadastrada) {
      this._throwExpectedError('Minuta não encontrada', 404);
    }

    const {
      idFluxo,
      idTemplateBase,
      matriculaOutorgado,
      outorgante_idProcuracao: idProcuracao,
      outorgante_idProxy: idProxy,
      outorgante_subsidiariasSelected,
      dadosMinuta_customData,
      dadosMinuta_diffs,
    } = minutaCadastrada;

    const [
      tipoFluxoBase,
      { templateBase, template },
      outorgado,
      procuracaoOutorgante,
    ] = await Promise.all([
      this.#getFluxo(idFluxo),
      this.#getTemplates(idTemplateBase, dadosMinuta_diffs),
      this.#getOutorgado(matriculaOutorgado),
      this.#getProcuracao(idProxy, idProcuracao),
    ]);

    const dadosMinuta = {
      customData: JSON.parse(dadosMinuta_customData),
      diffs: dadosMinuta_diffs,
      idFluxo,
      idTemplate: idTemplateBase,
      template,
      templateBase,
    };

    const poderes = {
      outorgantes: [{ idProcuracao, idProxy, procuracao: procuracaoOutorgante }],
      outorganteSelecionado: {
        idProcuracao,
        idProxy,
        matricula: procuracaoOutorgante[0].outorgado.matricula,
        nome: procuracaoOutorgante[0].outorgado.nome,
        subsidiariasSelected: /** @type {number[]} */(JSON.parse(outorgante_subsidiariasSelected)),
      }
    };

    return {
      dadosMinuta,
      outorgado,
      poderes,
      tipoFluxo: {
        ...tipoFluxoBase,
        idFluxo,
      },
      minutaCadastrada,
    };
  }

  /**
   * @param {string} idProxy
   * @param {number} idProcuracao
   */
  async #getProcuracao(idProxy, idProcuracao) {
    return this.#handleAsyncFunction(
      // from pesquisa controller, retorna '[]' quando não encontrado
      this.functions.getProcuracao({ idProxy, idProcuracao }),
      ([procuracao]) => {
        if (!procuracao) {
          return "Procuração do outorgante não encontrada.";
        }
      }
    );
  }

  /**
   * @param {string} matriculaOutorgado
   */
  async #getOutorgado(matriculaOutorgado) {
    return this.#handleAsyncFunction(
      this.functions.getOneFunci(matriculaOutorgado),
      (funci) => {
        if (!funci) {
          return "Outogado da minuta não encontrado.";
        }
      }
    );
  }

  /**
   * @param {string} idTemplateBase
   * @param {string} dadosMinuta_diffs
   */
  async #getTemplates(idTemplateBase, dadosMinuta_diffs) {
    return this.#handleAsyncFunction(
      this.repository.getMinutaTemplateById(idTemplateBase),
      (mt) => {
        if (!mt?.templateBase) {
          return "Template utilizado na minuta não encontrado.";
        }
      }
    ).then(({ templateBase }) => {
      // diff applyPatch retorna false se o source for incompatível
      const template = Diff.applyPatch(templateBase, dadosMinuta_diffs);

      if (!template) {
        this._throwExpectedError("Minuta template usada não compatível.", 400);
      }

      return { templateBase, template };
    });
  }

  /**
   * @param {string} idFluxo
   */
  async #getFluxo(idFluxo) {
    return this.#handleAsyncFunction(
      this.repository.getOneFluxoMinuta(idFluxo),
      (fluxo) => {
        if (!fluxo)
          return "Fluxo de minuta não encontrado.";
      }
    );
  }

  /**
   * @template [T=unknown]
   * @param {Promise<T>} asyncFunction
   * @param {(error: T) => string|undefined} errorCheck
   */
  async #handleAsyncFunction(asyncFunction, errorCheck) {
    const { error, value } = await asyncFunction
      .then((value) => {
        const error = errorCheck(value);
        if (error) {
          return { error };
        }

        return { value };
      })
      .catch((/** @type {string} */ error) => {
        return { error, value: /** @type {T} */(null) };
      });


    if (error) {
      this._throwExpectedError(error, 400);
    }

    return value;
  }
}

module.exports = UcRegenerateMinuta;
