"use strict";

const Database = use("Database");

const { sqlRawQueries } = require('./rawQueries/getCadeiaProcuracao.sql');

class PesquisaRepository {
  #getIdsPorPesquisaPrefixoBase(/** @type {string} */ rawQuery) {
    return async function (/** @type {string} */ prefixo) {
      const whereAtivo = 1;

      const [result] = await Database
        .connection("procuracao")
        .raw(rawQuery, [prefixo, whereAtivo]);

      return /** @type {ProcuracaoPesquisaBase} */(result);;
    };
  }

  async getIdsPorPesquisaPrefixo(/** @type {string} */ prefixo) {
    return this.#getIdsPorPesquisaPrefixoBase(sqlRawQueries.getIdsPorPesquisaPrefixo)(prefixo);
  }

  async getIdsPorPesquisaPrefixoMaisRecente(/** @type {string} */ prefixo) {
    return this.#getIdsPorPesquisaPrefixoBase(sqlRawQueries.getIdsPorPesquisaPrefixoMaisRecente)(prefixo);
  }

  #getIdsPorPesquisaPessoaBase(/** @type {string} */ rawQuery) {
    return async function (/** @type {string} */ pesquisa) {
      const pesquisaLike = `%${pesquisa}%`;
      const whereAtivo = 1;

      const [matriculaLike, nomeLike, ativo] = [pesquisaLike, pesquisaLike, whereAtivo];

      const [result] = await Database.connection("procuracao").raw(rawQuery, [matriculaLike, nomeLike, ativo]);

      return /** @type {ProcuracaoPesquisaBase} */(result);
    };
  }

  async getIdsPorPesquisaPessoa(/** @type {string} */ pesquisa) {
    return this.#getIdsPorPesquisaPessoaBase(
      sqlRawQueries.getIdsPorPesquisaPessoa
    )(pesquisa);
  }

  async getIdsPorPesquisaPessoaMaisRecente(/** @type {string} */ pesquisa) {
    return this.#getIdsPorPesquisaPessoaBase(
      sqlRawQueries.getIdsPorPesquisaPessoaMaisRecente
    )(pesquisa);
  }

  /**
   * @param {{
   *  idProxy: string,
   *  idProcuracao: string|number,
   * }} props
   *
   * Passar apenas um de idProxy e idProcuracao.
   *
   * Primeira na cadeia é sempre a da pessoa que foi pesquisada,
   * a última é sempre uma de tipo não agregada.
   *
   * Retorna `null` se nada for achado.
   */
  async getCadeiaDeProcuracaoById({
    idProxy = '-1',
    idProcuracao = '-1',
  }) {
    const result = await Database
      .connection("procuracao")
      .raw(sqlRawQueries.getCadeiaProcuracao, [idProxy, idProcuracao]);

    // desestruturação do resultado
    const [[{ docsArr }]] = /** @type {{ docsArr: string}[][]} */(result);

    if (docsArr === null) {
      return null;
    }

    return /** @type {CadeiaDeProcuracao} */ (JSON.parse(docsArr));
  }

  /**
   * @param {{
   *  idProxy?: string,
   *  idProcuracao?: number,
   * }} props
   *
   * Passar apenas um de idProxy e idProcuracao.
   *
   * Retorna [] se nada for achado.
   */
  async getCadeiaAbaixoDeProcuracaoById({
    idProxy = '-1',
    idProcuracao = -1,
  }) {
    const result = await Database
      .connection("procuracao")
      .raw(sqlRawQueries.getCadeiaAbaixoProcuracao, [idProxy, idProcuracao]);

    const ids = /** @type {{ idProxy: string, idProcuracao: number}[]} */(JSON.parse(JSON.stringify(result[0])));

    if (ids === null || ids === undefined || ids.length === 0) {
      return [];
    }

    return ids;
  }
}

module.exports = PesquisaRepository;

/**
 * @typedef {[...ProcuracaoAgregada[], ProcuracaoExplodida]} CadeiaDeProcuracao
 *
 * @typedef {{
 *  procuracaoAgregada: {
 *   procuracaoId: number,
 *   procuracaoAtiva: 1 | 0,
 *   emissao: string,
 *   vencimento: string,
 *   manifesto: string,
 *   folha: string,
 *   livro: string,
 *   doc: string,
 *   cartorio: string,
 *   cartorioId: number,
 *  },
 *  outorgado: Outorgado,
 *  subsidiarias: SubsidiariasAgregado,
 * }} ProcuracaoAgregada
 *
 * @typedef {{
 *  procuracaoAgregada: null,
 *  outorgado: Outorgado,
 *  subsidiarias: SubsidiariasExplodido,
 * }} ProcuracaoExplodida
 *
 * @typedef {{
 *  matricula: string,
 *  nome: string
 *  cargo: string
 *  prefixo: string
 *  cpf: string
 *  rg: string
 *  estadoCivil: string
 *  municipio: string
 *  uf: string
 *  endereco: string
 * }} Outorgado
 *
 * @typedef {{
 *  idProcuracao: string | number,
 *  idProxy: string,
 *  matricula: string,
 *  nome: string,
 *  cargoNome: string,
 *  prefixo: string,
 *  ativo: 1|0,
 *  prefixo_lotacao: string,
 *  cpf: string,
 *  dataNasc: string,
 *  estadoCivil: string,
 *  rg: string,
 *  municipio: string,
 *  uf: string,
 *  endereco: string
 * }[]} ProcuracaoPesquisaBase
 *
 * @typedef {{
 *  id: number,
 *  nome: string,
 *  nome_completo: string,
 *  cnpj: string,
 *  subAtivo: 1 | 0,
 * }[]} SubsidiariasAgregado
 *
 * @typedef {{
 *  id: number,
 *  nome: string,
 *  nome_completo: string,
 *  cnpj: string,
 *  subAtivo: 1 | 0,
 *  procuracaoId: number,
 *  procuracaoAtiva: 1 | 0,
 *  emissao: string,
 *  vencimento: string,
 *  manifesto: string,
 *  folha: string,
 *  livro: string,
 *  doc: string,
 *  cartorio: string,
 *  cartorioId: number,
 * }[]} SubsidiariasExplodido
 */
