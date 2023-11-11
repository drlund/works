"use strict";

const { caminhoModels } = use("App/Commons/Tarifas/constants");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const ocorrenciaTarifasModel = use(`${caminhoModels}/Ocorrencias`);

class ocorrenciaTarifaRepository {
  async getOcorrenciasPendentes({ mci, cpf_cnpj, nomeCliente }) {
    const filtros = { mci, cpf_cnpj, nomeCliente };
    const query = ocorrenciaTarifasModel.query();

    this._aplicarFiltros(query, filtros);
    this._aplicarOcorrenciaPendente(query);

    const resultados = await query.with("dadosCliente").fetch();
    return resultados.toJSON();
  }

  async getOcorrenciasEmAndamento({ mci, cpf_cnpj, nomeCliente }) {
    const filtros = { mci, cpf_cnpj, nomeCliente };
    const query = ocorrenciaTarifasModel.query();

    this._aplicarFiltros(query, filtros);
    this._aplicarOcorrenciaEmAndamento(query);

    const resultados = await query
      .with("dadosCliente")
      .with("status", (builder) => builder.with("status"))
      .fetch();
    return resultados.toJSON();
  }

  isOcorrenciaReservada(ocorrencia) {
    const isOcorrenciaReservada =
      typeof ocorrencia.reservas !== "undefined" &&
      ocorrencia.reservas !== null &&
      Array.isArray(ocorrencia.reservas) &&
      ocorrencia.reservas.length > 0;
    return isOcorrenciaReservada;
  }

  isOcorrenciaPgtoRegistrado(ocorrencia) {
    const isOcorrenciaPgtoRegistrado =
      typeof ocorrencia.pagamentos !== "undefined" &&
      ocorrencia.pagamentos !== null &&
      Array.isArray(ocorrencia.pagamentos) &&
      ocorrencia.pagamentos.length > 0;

    return isOcorrenciaPgtoRegistrado;
  }

  async getOneOcorrencia(id) {
    const ocorrencia = await ocorrenciaTarifasModel.find(id);
    await ocorrencia.load("dadosCliente");
    await ocorrencia.load("linhaTempo");
    await ocorrencia.load("pagamentos", (builder) => {
      builder.where("ativa", 1);
      builder.with("anexos");
      builder.with("confirmacoes", (builder) => {
        builder.where("ativa", 1);
      });
      builder.orderBy("id", "desc");
    });
    await ocorrencia.load("reservas", (builder) => {
      builder.where("ativa", 1);
      builder.with("dadosPagamento");
      builder.with("contatos");
      builder.orderBy("createdAt", "desc");
      builder.limit(1);
    });

    if (!ocorrencia) {
      return null;
    }

    const isOcorrenciaReservada = this.isOcorrenciaReservada(
      ocorrencia.toJSON()
    );

    const isOcorrenciaPgtoRegistrado = this.isOcorrenciaPgtoRegistrado(
      ocorrencia.toJSON()
    );

    return {
      ...ocorrencia.toJSON(),
      isOcorrenciaReservada,
      isOcorrenciaPgtoRegistrado,
    };
  }

  async existeOcorrencia(id) {
    const ocorrencia = await ocorrenciaTarifasModel.find(id);
    return ocorrencia ? true : false;
  }

  async existeReservaAtiva(idOcorrencia) {
    const ocorrencia = await ocorrenciaTarifasModel
      .query()
      .where("id", idOcorrencia)
      .whereHas("reservas", (builder) => {
        builder.where("ativa", 1);
      })
      .first();
    return ocorrencia ? true : false;
  }

  /**
   *  Aplica os filtros disponíveis para a query recebida. Os filtros são:
   *
   * @param {*} query
   * @param {*} filtros
   * @returns
   */

  async _aplicarFiltros(query, filtros) {
    const { mci, cpf_cnpj, nomeCliente } = filtros;

    if (mci) {
      query.where("mci", mci);
    }

    if (cpf_cnpj) {
      query.where("cpf_cnpj", parseInt(cpf_cnpj));
    }

    if (nomeCliente) {
      query.whereHas("dadosCliente", (builder) => {
        builder.where("nome", `${nomeCliente.toUpperCase()}`);
      });
    }
  }

  async _aplicarOcorrenciaEmAndamento(query) {
    query.where((builder) => {
      builder.orWhereHas("reservas", (builder) => {
        builder.where("ativa", 1);
      });
      builder.orWhereHas("pagamentos", (builder) => {
        builder.where("ativa", 1);
      });
    });
  }

  /**
   *  Aplica na query recebida as condicionais para verificar se uma ocorrência está pendente de reserva.
   * @param {*} query
   */

  async _aplicarOcorrenciaPendente(query) {
    query.whereDoesntHave("reservas", (builder) => {
      builder.where("ativa", 1);
    });
    query.whereDoesntHave("pagamentos", (builder) => {
      builder.where("ativa", 1);
    });
  }
}

module.exports = ocorrenciaTarifaRepository;
