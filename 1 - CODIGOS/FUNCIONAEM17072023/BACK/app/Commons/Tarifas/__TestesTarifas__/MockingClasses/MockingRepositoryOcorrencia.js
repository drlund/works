"use strict";

const { caminhoModels } = use("App/Commons/Tarifas/constants");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const ocorrenciaTarifasModel = use(`${caminhoModels}/Ocorrencias`);
const getMcisByNome = use(`App/Commons/Clientes/getMcisByNome`);

class MockingRepositoryOcorrencia {
  getOcorrenciasPendentes({ mci, cpf_cnpj, nomeCliente }) {
    return [];
  }

  async existeOcorrencia(id) {
    return new Promise((resolve, reject) => resolve(id === 1 ? true : false));
  }
}

module.exports = MockingRepositoryOcorrencia;
