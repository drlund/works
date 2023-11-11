"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const { capitalize } = use("App/Commons/StringUtils");
const moment = require("moment");

/**
 * FunciComAusenciaTransformer class
 *
 * @class FunciComAusenciaTransformer
 * @constructor
 */
class FunciComAusenciaTransformer extends BumblebeeTransformer {
  transform(model) {
    const { nome, dependencia, ausencias, comissao, descCargo, matricula } =
      model;
    return {
      nome: capitalize(nome),
      matricula: matricula,
      dependencia: {
        prefixo: dependencia.prefixo,
        nome: dependencia.nome,
      },
      ausencias: ausencias.map((ausencia) => {
        return {
          dataInicio: moment(ausencia.dt_inicio).format("DD/MM/YYYY"),
          dataFim: moment(ausencia.dt_final).format("DD/MM/YYYY"),
          qtdDias: ausencia.qtd_dias,
        };
      }),
      comissao,
      descCargo,
    };
  }
}

module.exports = FunciComAusenciaTransformer;
