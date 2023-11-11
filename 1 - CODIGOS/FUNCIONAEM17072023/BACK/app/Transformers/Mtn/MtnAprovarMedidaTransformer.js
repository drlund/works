"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");

class MtnAprovarMedidaTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      analistaNome: model.analista_nome,
      analistaMatricula: model.analista_matricula,
      analiseEm: model.analise_em,
      aprovadorMatricula: model.aprovador_matricula,
      aprovadorNome: model.aprovador_nome,
      idEnvolvido: model.id_envolvido,
      parecerProposto: model.parecer_proposto,
      parecerAprovado: model.parecer_aprovado,
      alterado: model.alterado,
      aprovadoEm: model.created_at,
      medidaProposta: model.medidaProposta
        ? {
            id: model.medidaProposta.id,
            txtMedida: model.medidaProposta.txt_medida,
          }
        : null,
      medidaAprovada: model.medidaAprovada
        ? {
            id: model.medidaAprovada.id,
            txtMedida: model.medidaAprovada.txt_medida,
          }
        : null,
    };
  }
}

module.exports = MtnAprovarMedidaTransformer;
