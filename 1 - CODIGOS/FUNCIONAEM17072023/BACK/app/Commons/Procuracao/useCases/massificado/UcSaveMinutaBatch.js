const { AbstractUserCase } = require('../../../AbstractUserCase');
const Diff = require('diff');
const { isUUID } = require('../utils');

/**
 * @typedef {Procuracoes.MassificadoMinuta & {
 *  matriculaRegistro: string
 * }} RunArgs
 *
 * @typedef {{
 *  Repository: {
 *    minuta: import('../../repositories/MinutaRepository')
 *    pesquisa: import('../../repositories/PesquisaRepository')
 *  },
 *  Functions: {
 *    getManyFuncis: getManyFuncis,
 *  },
 *  RunArguments: RunArgs,
 *  Payload: Awaited<ReturnType<UcSaveMinutaBatch['_action']>>,
 *  UseTrx: false
 * }} SaveMinutaBatchType
 *
 * @extends {AbstractUserCase<SaveMinutaBatchType>}
 */
class UcSaveMinutaBatch extends AbstractUserCase {
  /** @param {RunArgs} props */
  async _action({
    dadosMinuta,
    outorgadoMassificado,
    poderes,
    tipoFluxo,
    matriculaRegistro,
  }) {
    /**
     * @typedef {import('../../repositories/MinutaRepository').MinutaTabelaType} Minuta
     */

    const { massificado, ...customDataBase } = dadosMinuta.customData;

    function createMinutaData(matricula) {
      return /** @type {Minuta} */ ({
        idMassificado: dadosMinuta.idMinuta,
        idMinuta: dadosMinuta.massificado[matricula].idMinuta,
        idFluxo: tipoFluxo.idFluxo,
        matriculaOutorgado: matricula,
        outorgante_idProcuracao: poderes.outorganteSelecionado.idProcuracao,
        outorgante_idProxy: poderes.outorganteSelecionado.idProxy,
        outorgante_subsidiariasSelected: JSON.stringify(poderes.outorganteSelecionado.subsidiariasSelected),
        idTemplateBase: dadosMinuta.idTemplate,
        idTemplateDerivado: dadosMinuta.idTemplateDerivado,
        dadosMinuta_customData: JSON.stringify({
          ...customDataBase,
          ...massificado?.[matricula] ?? {},
        }),
        dadosMinuta_diffs: dadosMinuta.massificado[matricula].diffs,
        matriculaRegistro,
      });
    }

    const lote = /** @type {Minuta[]} */ (
      outorgadoMassificado.listaDeMatriculas.map((matricula) => {
        if (outorgadoMassificado.outorgados[matricula].error !== null) {
          return false;
        }

        return createMinutaData(matricula);
      }).filter(Boolean)
    );

    return this.repository.minuta.saveLoteMinuta(lote);
  }

  /** @param {RunArgs} props */
  async _checks({
    dadosMinuta,
    outorgadoMassificado,
    poderes,
    tipoFluxo,
    matriculaRegistro,
  }) {
    if (!matriculaRegistro) {
      throw new Error('Usuário não está logado.');
    }
    this.#checkDadosMinuta(dadosMinuta);

    const { hasError, numberOfValid, ...matriculasMassificado } = dadosMinuta.massificado;

    const [{ templateBase }] = await Promise.all([
      this.#checkFluxo(tipoFluxo),
      this.#checkPoderes(poderes),
      this.#checkOutorgados(outorgadoMassificado, numberOfValid),
    ]);

    this.#checkMatriculasMassificado(/** @type {Procuracoes.DadosMinutaMassificado} */(matriculasMassificado), templateBase);
  }

  /**
   * @param {RunArgs['dadosMinuta']} dadosMinuta
   */
  #checkDadosMinuta(dadosMinuta) {
    if (!dadosMinuta.idMinuta) {
      throw new Error("É necessário criar um ID para o lote de minutas.");
    }

    if (!dadosMinuta.idTemplate && !dadosMinuta.idTemplateDerivado) {
      throw new Error("É necessário passar qual o template utilizado.");
    }

    if (dadosMinuta.idTemplate && dadosMinuta.idTemplateDerivado) {
      throw new Error("Indicar apenas um template usado.");
    }
  }

  /**
   * @param {RunArgs['outorgadoMassificado']} outorgadoMassificado
   * @param {number} numberOfValid
   */
  async #checkOutorgados(outorgadoMassificado, numberOfValid) {
    const outorgadosValidos = outorgadoMassificado.listaDeMatriculas.filter((m) => outorgadoMassificado.outorgados[m].error === null);

    if (outorgadosValidos.length !== numberOfValid) {
      throw new Error("Diferença no número de outorgados válidos.");
    }

    const outorgadoEncontrado = await this.functions.getManyFuncis(outorgadosValidos);

    if (!outorgadoEncontrado || outorgadoEncontrado.length !== numberOfValid) {
      throw new Error("Outorgados não encontrados.");
    }
  }

  /**
   * @param {RunArgs['poderes']} poderes
   */
  async #checkPoderes(poderes) {
    const { subsidiariasSelected } = poderes.outorganteSelecionado;
    if (!Array.isArray(subsidiariasSelected)) {
      throw new Error("Subsidiarias precisa ser uma lista.");
    }

    if (subsidiariasSelected.length === 0) {
      throw new Error("É necessario selecionar algum poder.");
    }

    const cadeia = await this.repository.pesquisa.getCadeiaDeProcuracaoById({
      idProcuracao: poderes.outorganteSelecionado.idProcuracao,
      idProxy: poderes.outorganteSelecionado.idProxy,
    });

    if (!cadeia) {
      throw new Error("Procuração do outorgante não encontrada.");
    }
  }

  /**
   * @param {RunArgs['tipoFluxo']} tipoFluxo
   */
  async #checkFluxo(tipoFluxo) {
    if (!tipoFluxo.idFluxo) {
      throw new Error("É necessário passar o tipo do fluxo.");
    }

    const [fluxo, minutaTemplate] = await Promise.all([
      this.repository.minuta.getOneFluxoMinuta(tipoFluxo.idFluxo),
      this.repository.minuta.getMinutaTemplateByFluxo(tipoFluxo.idFluxo),
    ]);

    if (tipoFluxo.minuta !== fluxo.minuta) {
      throw new Error("Fluxo usado não foi encontrado.");
    }

    if (!minutaTemplate) {
      throw new Error("Template da minuta não foi encontrada.");
    }

    return { templateBase: minutaTemplate.templateBase };
  }

  /**
   * @param {Omit<RunArgs['dadosMinuta']['massificado'], number|never>} matriculasMassificado
   * @param {string} templateBase
   */
  #checkMatriculasMassificado(matriculasMassificado, templateBase) {
    Object
      .values(matriculasMassificado)
      .forEach(({ diffs, idMinuta }) => {
        if (!diffs || diffs.length === 0) {
          throw new Error("Necessário haver diffs da minuta.");
        }

        // diff applyPatch retorna false se o source for incompatível
        if (!Diff.applyPatch(templateBase, diffs)) {
          throw new Error("Minuta template usada não compatível.");
        }

        if (!idMinuta || !isUUID(idMinuta)) {
          throw new Error("É necessário criar um ID válido para cada matricula.");
        }
      });
  }
}

module.exports = UcSaveMinutaBatch;
