"use strict";

const MinutasEmitidasModel = use("App/Models/Mysql/Procuracao/MinutasEmitidas");
const MinutasTemplateModel = use("App/Models/Mysql/Procuracao/MinutasTemplate");
const MinutasTemplateDerivadoModel = use("App/Models/Mysql/Procuracao/MinutasTemplateDerivado");
const Database = use('Database');

const { getOneFluxoMinuta, getAllFluxosMinutas } = require('../useCases/__mocks__/FluxosProcuracao');

/**
 * @typedef {{
 *  idMassificado: string;
 *  idMinuta: string;
 *  idFluxo: string;
 *  matriculaOutorgado: string;
 *  outorgante_idProcuracao: number|string;
 *  outorgante_idProxy: string;
 *  outorgante_subsidiariasSelected: string;
 *  idTemplateBase: string;
 *  idTemplateDerivado: string;
 *  dadosMinuta_customData: string;
 *  dadosMinuta_diffs: string;
 *  matriculaRegistro: string;
 * }} MinutaTabelaType
 */

/**
 * @typedef {{
 * idTemplate: string,
 * idFluxo: string,
 * templateBase: string,
 * createdAt: string,
 * ativo: 1|0,
 * }} MinutaTemplate
 */


class MinutaRepository {
  /**
   * @param {string} id
   * @returns {Promise<MinutaTabelaType>}
   */
  async getOneMinuta(id) {
    return /** @type {any} */(MinutasEmitidasModel
      .query()
      .where("idMinuta", id)
      .first());
  }

  /**
   * @param {string} id
   * @returns {Promise<MinutaTabelaType[]>}
   */
  async getMinutasByIdMassificado(id) {
    return /** @type {any} */((await MinutasEmitidasModel
      .query()
      .where("idMassificado", id)
      .andWhere('ativo', 1)
      .fetch()
    ).toJSON());
  }

  /**
   * @param {string} matricula
   */
  async getMinutasMatricula(matricula) {
    return MinutasEmitidasModel
      .query()
      .where("matriculaOutorgado", matricula)
      .with('outorgado')
      .where("ativo", 1)
      .fetch();
  }

  /**
   * @param {string} prefixo
   */
  async getMinutasPrefixo(prefixo) {
    return MinutasEmitidasModel
      .query()
      .whereHas('outorgado', (b) => {
        b.where('prefixo_lotacao', prefixo);
      })
      .with('outorgado')
      .where("ativo", 1)
      .fetch();
  }

  async saveMinutaTemplate() {
    //! TODO:
    /**
     * - use trx
     * 1. update all with same id to ativo = 0
     * 2. save minuta template
     */
  }

  /**
   * com base no fluxo, pega o ultimo template disponível
   * @param {string} idFluxo
   */
  async getMinutaTemplateByFluxo(idFluxo) {
    return /** @type {{ idTemplate: string, idFluxo: string, templateBase: string, ativo: 1 | 0 }} */(/** @type {unknown} */(
      MinutasTemplateModel
        .query()
        .where("idFluxo", idFluxo)
        .orderBy("createdAt", "desc")
        .first())
    );
  }

  /**
   * @param {string} idTemplate
   * @returns {Promise<MinutaTemplate>}
   */
  async getMinutaTemplateById(idTemplate) {
    return /** @type {any} */(MinutasTemplateModel
      .query()
      .where("idTemplate", idTemplate)
      .first());
  }

  /**
   * @param {string} idTemplateDerivado
   */
  async getMinutaTemplateDerivado(idTemplateDerivado) {
    return MinutasTemplateDerivadoModel
      .query()
      .where("idTemplateDerivado", idTemplateDerivado)
      .with("templateBase")
      .fetch();
  }

  /**
   * @param {string} id
   */
  async getOneFluxoMinuta(id) {
    return getOneFluxoMinuta(id);
  }

  async getFluxosMinuta() {
    return getAllFluxosMinutas();
  }

  async saveMinuta({
    dadosMinuta: {
      customData,
      diffs,
      idMinuta,
      idTemplate,
      idTemplateDerivado,
    },
    idFluxo,
    matriculaOutorgado,
    outorgante: {
      idProcuracao,
      idProxy,
      subsidiariasSelected,
    },
    matriculaRegistro,
  }) {
    return (
      await MinutasEmitidasModel.create({
        idMinuta,
        idFluxo,
        matriculaOutorgado,
        outorgante_idProcuracao: idProcuracao,
        outorgante_idProxy: idProxy,
        outorgante_subsidiariasSelected: JSON.stringify(subsidiariasSelected),
        idTemplateBase: idTemplate,
        idTemplateDerivado,
        dadosMinuta_customData: JSON.stringify(customData),
        dadosMinuta_diffs: diffs,
        matriculaRegistro,
      })
    ).toJSON();
  }

  /**
   * @param {MinutaTabelaType[]} lote
   * @returns {Promise<MinutaTabelaType[]>}
   */
  async saveLoteMinuta(lote) {
    return MinutasEmitidasModel.createMany(lote);
  }

  /**
   * @param {string[]} listaDeMinutas
   */
  async softDeleteManyMinutaCadastrada(listaDeMinutas) {
    return /** @type {Promise<number>} */(MinutasEmitidasModel
      .query()
      .whereIn("idMinuta", listaDeMinutas)
      .update({ ativo: 0 }));
  }

  /**
   * @param {string} idMinutaCadastrada
   */
  async softDeleteMinutaCadastradaNoTrx(idMinutaCadastrada) {
    return MinutasEmitidasModel
      .query()
      .where("idMinuta", idMinutaCadastrada)
      .update({ ativo: 0 });
  }

  /**
   * @param {string} idMinutaCadastrada
   * @param {Adonis.Trx} trx
   */
  async softDeleteMinutaCadastrada(idMinutaCadastrada, trx) {
    return MinutasEmitidasModel
      .query()
      .where("idMinuta", idMinutaCadastrada)
      .transacting(trx)
      .update({ ativo: 0 });
  }

  /**
   * Retorna uma lista de minutas relacionadas a um massificado que possui pelo menos um ativo
   *
   * Se não tiver ativos, retorna uma lista vazia.
   */
  async getListaMinutaMassificadoWithAtivos() {
    /**
     * @type {{
     *  idMinuta: string,
     *  idMassificado: string,
     *  idFluxo: string,
     *  matriculaOutorgado: string,
     *  nomeOutorgado: string,
     *  prefixoOutorgado: string,
     *  createdAt: Date,
     *  ativos: number,
     *  total: number,
     * }[][]}
     */
    const [result] = await Database.connection('procuracao').raw(/* sql */`
      SELECT
        minutas.idMinuta,
        minutas.idMassificado,
        minutas.idFluxo,
        minutas.matriculaOutorgado,
        TRIM(arh.nome) AS nomeOutorgado,
        arh.prefixo_lotacao AS prefixoOutorgado,
        minutas.createdAt,
        counters.ativos,
        counters.total
      FROM app_procuracao.minutas_emitidas minutas
      INNER JOIN DIPES.arhfot01 arh
        ON minutas.matriculaOutorgado = arh.matricula
      INNER JOIN (
        SELECT
          me.idMassificado,
          CAST(SUM(me.ativo) AS int) AS ativos,
          COUNT(*) AS total
        FROM
          app_procuracao.minutas_emitidas me
        WHERE
          me.idMassificado IS NOT NULL
        GROUP BY
          me.idMassificado
      ) counters
        ON minutas.idMassificado = counters.idMassificado
      WHERE
        counters.ativos > 0 AND minutas.ativo = 1
      ORDER BY
        minutas.createdAt DESC
    `);

    return result;
  }
}

module.exports = MinutaRepository;
