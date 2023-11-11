const { AbstractUserCase } = require('../../../AbstractUserCase');
const Diff = require('diff');

const notFoundError = 404;
const badRequestError = 400;

/**
 * @typedef {import('../../repositories/PesquisaRepository').CadeiaDeProcuracao} CadeiaDeProcuracao
 */

/**
 * @typedef {string} RunArgs
 *
 * @typedef {{
 *  Repository:{
 *    minuta: import('../../repositories/MinutaRepository'),
 *    pesquisa: import('../../repositories/PesquisaRepository'),
 *  },
 *  Functions: {
 *    getManyFuncis: getManyFuncis,
 *  },
 *  RunArguments: RunArgs,
 *  Payload: Awaited<ReturnType<UcRegenerateMassificadoMinuta['_action']>>,
 *  UseTrx: false
 * }} UcRegenerateMassificadoMinutaTypes
 *
 * @extends {AbstractUserCase<UcRegenerateMassificadoMinutaTypes>}
 */
class UcRegenerateMassificadoMinuta extends AbstractUserCase {
  /**
   * @override
   * @param {RunArgs} idMassificado
   */
  async _checks(idMassificado) {
    if (!idMassificado) {
      throw new Error("ID do massificado é necessário.");
    }
  }

  /**
   * @override
   * @param {RunArgs} idMassificado
   */
  async _action(idMassificado) {
    const minutasMassificado = await this.repository.minuta.getMinutasByIdMassificado(idMassificado);
    if (!minutasMassificado || minutasMassificado.length === 0) {
      this._throwExpectedError('Minutas não encontradas.', notFoundError);
    }

    // toda esta parte das informações deveriam ser iguais entre as minutas do mesmo massificado
    const {
      idFluxo,
      idTemplateBase,
      idTemplateDerivado,
      outorgante_idProcuracao: idProcuracao,
      outorgante_idProxy: idProxy,
      outorgante_subsidiariasSelected: subsidiariasSelected,
    } = minutasMassificado[0];
    const listaDeMatriculas = minutasMassificado.map((m) => m.matriculaOutorgado);

    const [
      tipoFluxoBase,
      dadosMassificado,
      outorgados,
      outorgante,
    ] = await Promise.all([
      this.#getFluxo(idFluxo),
      this.#getDadosMassificado(
        { idTemplateBase, idTemplateDerivado },
        minutasMassificado.map((m) =>
          /** @type {[string,string,string]} */([m.matriculaOutorgado, m.idMinuta, m.dadosMinuta_diffs])
        )
      ),
      this.#getOutorgado(listaDeMatriculas),
      this.#getOutorgante(idProxy, idProcuracao),
    ]);

    return /** @satisfies {Procuracoes.MassificadoMinuta} */({
      dadosMinuta: {
        idFluxo,
        idTemplateDerivado,
        idMinuta: idMassificado,
        idTemplate: idTemplateBase,
        massificado: dadosMassificado,
        customData: this.#getCustomData(minutasMassificado),
      },
      outorgadoMassificado: {
        outorgados: Object.fromEntries(outorgados.map((o) => [o.matricula, { ...o, error: null }])),
        uuidMatriculas: Object.fromEntries(minutasMassificado.map((o) => [o.matriculaOutorgado, o.idMinuta])),
        listaDeMatriculas,
      },
      poderes: {
        outorganteSelecionado: {
          idProcuracao,
          idProxy,
          subsidiariasSelected: /** @type {number[]} */(JSON.parse(subsidiariasSelected)),
          matricula: outorgante.matricula,
          nome: outorgante.nome,
        },
        outorgantes: [
          outorgante
        ],
      },
      tipoFluxo: {
        ...tipoFluxoBase,
        idFluxo,
      },
    });
  }

  /**
   * @param {import('../../repositories/MinutaRepository').MinutaTabelaType[]} minutasMassificado
   */
  #getCustomData(minutasMassificado) {
    const customOutorgados = minutasMassificado.map((m) => {
      const outorgadoCustom = /** @type {{ outorgado?: unknown }} */(JSON.parse(m.dadosMinuta_customData).outorgado);

      return /** @type {[string, Procuracoes.CustomDataMassificado[string]]} */([m.matriculaOutorgado, outorgadoCustom]);
    });

    // essa parte do customData é igual para todos
    const { blocoSubsidiarias, cartorio, outorgante } = /** @type {Omit<Procuracoes.CustomData, 'massificado'>} */(
      JSON.parse(minutasMassificado[0].dadosMinuta_customData)
    );

    return /** @satisfies {Required<Procuracoes.CustomData>} */({
      massificado: Object.fromEntries(customOutorgados),
      blocoSubsidiarias,
      cartorio,
      outorgante,
    });
  }

  /**
   * @param {string} idProxy
   * @param {string|number} idProcuracao
   */
  async #getOutorgante(idProxy, idProcuracao) {
    const [cadeia] = await this.repository.pesquisa.getCadeiaDeProcuracaoById({ idProxy, idProcuracao });

    if (!cadeia) {
      this._throwExpectedError("Cadeia de procuração do outorgante não encontrada.", notFoundError);
    }

    const pesquisa = await this.repository.pesquisa.getIdsPorPesquisaPessoa(cadeia.outorgado.matricula);
    const [procuracaoOutorgante] = pesquisa.filter((id) => id.idProcuracao === idProcuracao && id.idProxy === idProxy);

    if (!procuracaoOutorgante) {
      this._throwExpectedError("Procuração do outorgante não encontrada.", notFoundError);
    }

    return {
      ...procuracaoOutorgante,
      procuracao: cadeia,
    };
  }

  /**
   * @param {string[]} listaOutorgados
   */
  async #getOutorgado(listaOutorgados) {
    return this.#handleAsyncFunction(
      this.functions.getManyFuncis(listaOutorgados),
      (funci) => {
        if (!funci || funci.length !== listaOutorgados.length) {
          return "Outogado da minuta não encontrado.";
        }
      }
    );
  }

  /**
   * @param {{idTemplateBase: string, idTemplateDerivado: string}} idsTemplate
   * @param {[string, string, string][]} matriculaIdDiffs
   */
  async #getDadosMassificado({ idTemplateBase, idTemplateDerivado }, matriculaIdDiffs) {
    // neste ponto precisaria ver qual dos ids foram usados e buscar o template correspondente
    return this.#handleAsyncFunction(
      this.repository.minuta.getMinutaTemplateById(idTemplateBase),
      (mt) => {
        if (!mt?.templateBase) {
          return "Template utilizado na minuta não encontrado.";
        }
      }
    ).then(({ templateBase }) => {
      // diff applyPatch retorna false se o source for incompatível
      const data = matriculaIdDiffs.map(([m, id, diff]) => [m, id, Diff.applyPatch(templateBase, diff), diff]);

      const hasError = /** @type {string[]} */(data.map(([m, _, diff]) => diff ? false : m).filter(Boolean));

      const massificadoPorMatricula = data.map(([matricula, idMinuta, template, diffs]) =>
       /** @type {[string, Procuracoes.DadosMinutaMassificadoPorMatricula]} */([
        matricula,
        {
          idMinuta,
          template,
          diffs,
        }
      ]));

      return /** @type {Procuracoes.MassificadoMinuta['dadosMinuta']['massificado']} */({
        hasError,
        numberOfValid: massificadoPorMatricula.length - hasError.length,
        ...Object.fromEntries(massificadoPorMatricula),
      });
    });
  }

  /**
   * @param {string} idFluxo
   */
  async #getFluxo(idFluxo) {
    return this.#handleAsyncFunction(
      this.repository.minuta.getOneFluxoMinuta(idFluxo),
      (fluxo) => {
        if (!fluxo) {
          return "Fluxo de minuta não encontrado.";
        }
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
      this._throwExpectedError(error, badRequestError);
    }

    return value;
  }
}

module.exports = UcRegenerateMassificadoMinuta;
