"use strict";

const getDadosBasicosCliente = use(
  "App/Commons/Clientes/getDadosBasicosCliente"
);
const getClassificacaoCliente = use(
  "App/Commons/Clientes/getClassificacaoCliente"
);
const exception = use("App/Exceptions/Handler");

class ClienteController {
  /**
   *
   *  Retorna os dados básicos de um cliente através do seu mci
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {View} ctx.view
   */
  async getDadosBasicos({ request, response, transform }) {
    const { mci, incluirClassificacao } = request.allParams();

    
    const dadosCliente = await getDadosBasicosCliente(mci, true);

    if (dadosCliente === null) {
      return response.notFound("Cliente não encontrado");
    }

    if (incluirClassificacao && JSON.parse(incluirClassificacao) === true) {
      const classificacao = await getClassificacaoCliente(mci);
      dadosCliente.classificacao = classificacao;
    }
    response.ok(dadosCliente);
  }

  /**
   * Através do MCI do cliente retorna a classificação do mesmo.
   *
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {View} ctx.view
   */
  async getClassificacao({ request, response, transform }) {
    const { mci } = request.allParams();
    const classificação = await getClassificacaoCliente(mci);
    response.ok(classificação);
  }
}

module.exports = ClienteController;
