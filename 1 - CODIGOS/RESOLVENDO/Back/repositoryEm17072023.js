"use strict";

const moment = require("moment");

const { getListaComitesAdm } = require("../../Arh/dadosComites");

const ParamAlcadas = use("App/Models/Mysql/movimentacoes/ParamAlcadas");
const CargosComissoesFot09 = use("App/Models/Mysql/Arh/CargosComissoesFot09");
const JurisdicoesSubordinadas = use(
  "App/Models/Mysql/movimentacoes/JurisdicoesSubordinadas"
);

class ParametrosAlcadasRepository {
  async getParametros() {
    const paramAlcadas = await ParamAlcadas.query()
      .where("ativo", "1")
      .orderBy("updatedAt", "desc")
      .fetch();

    const busca = paramAlcadas ? paramAlcadas.toJSON() : [];

    return busca;
  }

  /**
   * @param {{ save: () => string; }} novoParametro
   */
  async gravarParametro(novoParametro, parametro) {
    const parametroExistente = await ParamAlcadas.query()
      .where("prefixoDestino", novoParametro.prefixoDestino)
      .where("comissaoDestino", novoParametro.comissaoDestino)
      .first();

    if (parametroExistente) {
      if (parametroExistente.ativo === "1") {
        throw new Error("Parâmetros já existem e estão ativos.");
      } else {
        parametroExistente.ativo = '1';
        parametroExistente.observacao += `${novoParametro.observacao}`; 
        await parametroExistente.save();
        return parametroExistente;
      }
    } else {
      await novoParametro.save();
      return novoParametro;
    }
  }

  /**
   * @param {string} idParametro
   */
  async delParametro(idParametro) {
    const excluiParametro = await ParamAlcadas.query()
      .where("id", parseInt(idParametro))
      .update({ ativo: "0" });

    return excluiParametro;
  }

  /**
   * @param {string | number} idParametro
   * @param {{ comite: any; nomeComite: any; }} novoParametro
   */
  async patchParametros(idParametro, novoParametro) {
    const editaParametro = await ParamAlcadas.query().where("id", idParametro).update(novoParametro);

    if (!editaParametro) {
      throw new Error("Parâmetro não encontrado");
    }

    editaParametro.merge({
      comite: novoParametro.comite,
      nomeComite: novoParametro.nomeComite,
    });

    editaParametro.save();
  }

  /**
   * @param {string | number} idParametro
   * @param {string} novoTextoObservacao
   */
  async patchParametrosObservacao(idParametro, novoTextoObservacao) {
    const editaParametro = await ParamAlcadas.query().where("id", idParametro).update({ observacao });

    if (!editaParametro) {
      throw new Error("Parâmetro não encontrado");
    }

    editaParametro.observacao += "\n" + novoTextoObservacao;

    editaParametro.save();
  }

  /**
   * @param {string} cod_dependencia
   */
  async getCargosComissoesFot09(cod_dependencia) {
    if (!cod_dependencia) {
      const cargosComissoesFot09 = await CargosComissoesFot09.all();
      return cargosComissoesFot09.toJSON([]);
    }

    const cargosComissoesFot09 = await CargosComissoesFot09.query()
      .where("cod_dependencia", "=", cod_dependencia)
      .where("qtde_dotacao", ">", 0)
      .fetch();

    const busca = cargosComissoesFot09 ? cargosComissoesFot09.toJSON() : [];

    return busca;
  }

  /**
   * @param {string} prefixo
   */
  async getJurisdicoesSubordinadas(prefixo) {
    if (!prefixo) {
      const jurisdicoesSubordinadas = await JurisdicoesSubordinadas.all();
      return jurisdicoesSubordinadas.toJSON([]);
    }

    const jurisdicoesSubordinadas = await JurisdicoesSubordinadas.query()
      .distinct("prefixo_subordinada")
      .where("prefixo", "=", prefixo)
      .fetch();

    const busca = jurisdicoesSubordinadas
      ? jurisdicoesSubordinadas.toJSON()
      : [];

    return busca;
  }

  /**
   * @param {string} prefixo_subordinada
   */
  async getPrefixoBySubordinada(prefixo_subordinada) {
    if (!prefixo_subordinada) {
      const jusrisdicaoSubordinadas = await JurisdicoesSubordinadas.all();
      return jusrisdicaoSubordinadas.toJSON([]);
    }

    const jurisdicoesSubordinadas = await JurisdicoesSubordinadas.query()
      .distinct("prefixo")
      .where("prefixo_subordinada", "=", prefixo_subordinada)
      .fetch();

    const busca = jurisdicoesSubordinadas
      ? jurisdicoesSubordinadas.toJSON()
      : [];

    return busca;
  }

  /**
   * @param {string} prefixo
   */
  async listaComiteParamAlcadas(prefixo) {
    const comite = await getListaComitesAdm(prefixo);

    return comite;
  }
}

module.exports = ParametrosAlcadasRepository;