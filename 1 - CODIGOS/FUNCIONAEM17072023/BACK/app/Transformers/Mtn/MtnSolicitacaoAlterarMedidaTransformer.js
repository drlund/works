"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const MtnAnexoTransformer = use("App/Transformers/Mtn/MtnAnexoTransformer");
/**
 * MtnParecerRevertidoTransformer class
 *
 * @class MtnParecerRevertidoTransformer
 * @constructor
 */
class MtnSolicitacaoAlterarMedidaTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return ["envolvido"];
  }

  static get defaultInclude() {
    return ["anexos"];
  }

  includeAnexos(model) {
    return this.collection(model.anexos, MtnAnexoTransformer);
  }

  includeEnvolvido(model) {
    return this.item(model.envolvido, "Mtn/MtnTransformerEnvolvido");
  }
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      // add your transformation object here
      id: model.id,
      idEnvolvido: model.id_envolvido,
      matriculaSolicitante: model.matricula_solicitante,
      nomeSolicitante: model.nome_solicitante,
      prefixoSolicitante: model.prefixo_solicitante,
      nomePrefixoSolicitante: model.nome_prefixo_solicitante,
      codigoCargoSolicitante: model.cd_cargo_solicitante,
      cargoSolicitante: model.cargo_solicitante,

      matriculaConfirmacao: model.matricula_confirmacao,
      nomeConfirmacao: model.nome_confirmacao,
      prefixoConfirmacao: model.prefixo_confirmacao,
      nomePrefixoConfirmacao: model.nome_prefixo_confirmacao,
      codigoCargoConfirmacao: model.cd_cargo_confirmacao,
      cargoConfirmacao: model.cargo_confirmacao,

      justificativa: model.justificativa,
      dataCriacao: model.dt_criacao_solicitacao,
      dataConfirmacao: model.dt_confirmacao_solicitacao,
      justificativa: model.justificativa,

      medidaNova: model.medidaNova
        ? {
            id: model.medidaNova.id,
            txtMedida: model.medidaNova.txt_medida,
          }
        : null,
      medidaAntiga: model.medidaAntiga
        ? {
            id: model.medidaAntiga.id,
            txtMedida: model.medidaAntiga.txt_medida,
          }
        : null,
    };
  }
}

module.exports = MtnSolicitacaoAlterarMedidaTransformer;
