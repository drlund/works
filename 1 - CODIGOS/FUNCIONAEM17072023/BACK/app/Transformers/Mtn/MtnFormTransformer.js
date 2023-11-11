"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const funciModel = use("App/Models/Mysql/Funci");
const moment = use("App/Commons/MomentZone");

/**
 * MtnFormPendentesTransformer class
 *
 * @class MtnFormPendentesTransformer
 * @constructor
 */
class MtnFormTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  async transform(model) {
    const dadosFunci = await funciModel.findBy("matricula", model.matricula);
    return {
      key: model.matricula,
      matricula: model.matricula,
      nome: dadosFunci ? dadosFunci.nome.trim() : "Não identificado",
      visualizado: model.visualizado ? "Sim" : "Não",
      titulo: model.form ? model.form.titulo : 'Título não Encontrado',
      idResposta: model.id_resposta,
      tipo: "form",
      pendente: model.pendente,
      envioEmail: model.envioEmail
        ? moment(model.envioEmail).format("DD/MM/YYYY HH:mm")
        : "Não Disponível"
    };
  }
}

module.exports = MtnFormTransformer;
