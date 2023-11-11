"use strict";

const _ = require('lodash');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Designacao = use("App/Models/Mysql/Designacao");

const { TABELAS, CODS_AUSENCIA } = use('App/Commons/Designacao/Constants');

class CodigosAusenciaRepository {
  async getFilteredCodigos(filtros) {
    const { codigo, lista } = filtros;
    const exteriorNaLista = lista.includes(CODS_AUSENCIA.EXTERIOR);

    const query = Designacao.query()
      .table(TABELAS.COD_AUSENCIA);

    if (codigo || exteriorNaLista) {
      if (codigo === CODS_AUSENCIA.EXTERIOR || exteriorNaLista) {
        if (exteriorNaLista) {
          const index = lista.indexOf(CODS_AUSENCIA.EXTERIOR);
          if (index > -1) lista.splice(index, 1);
        }
        query.whereNot('codigo', CODS_AUSENCIA.EXTERIOR);
      } else {
        query.where('codigo', codigo);
      }
    }

    if (!_.isEmpty(lista)) {
      query.whereIn('codigo', lista);
    }

    const result = await query.fetch();
    const resultado = result.toJSON();

    return resultado;
  }
}

module.exports = CodigosAusenciaRepository;
