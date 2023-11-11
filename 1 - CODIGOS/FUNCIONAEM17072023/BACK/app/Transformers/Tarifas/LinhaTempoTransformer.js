"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");

class LinhaTempoTransformer extends BumblebeeTransformer {
  transform(model) {

    return {
      acao: model.acao,
      ocorridoEm: model.createdAt,
      funcionario: {
        matricula: model.matriculaFunciAcao,
        nome: model.nomeFunciAcao,
      },
    };
  }
}

module.exports = LinhaTempoTransformer;
