"use strict";

const getLatLong = require("../../Arh/getLatLong");
const getRotaRodoviaria = require("../../Arh/getRotaRodoviaria");
const limitrofes = require("../../Mst/limitrofes");

const Prefixo = use("App/Models/Mysql/Prefixo");
const Uors500g = use("App/Models/Mysql/Arh/Uors500g");

class MunicipiosRepository {
  async get(codigoMunicipio) {
    const municipio = await Prefixo.query()
      .select('municipio', 'nm_uf', 'cd_municipio_ibge', 'dv_municipio_ibge')
      .where('cd_municipio_bb', codigoMunicipio)
      .first();

    return municipio.toJSON();
  }

  async getDadosUor(uor) {
    const dadosUor = await Uors500g
      .findBy('CodigoUOR', parseInt(uor));

    return dadosUor.toJSON();
  }

  async getLimitrofes(origem, destino) {
    const consulta = await limitrofes(origem, destino);

    return consulta;
  }

  async obterLatLong(origem, destino) {
    const consulta = await getLatLong(origem, destino);

    return consulta;
  }

  async obterRotaRodoviaria(latLong) {
    const consulta = await getRotaRodoviaria(latLong);

    return consulta;
  }

}

module.exports = MunicipiosRepository;
