"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const moment = require("moment");
const constants = use("App/Commons/Mtn/ComiteMtn/Constants");
const Env = use("Env");
const { TIPO_VOTO_OBRIGATORIO } = constants;
const BACKEND_URL = Env.get("BACKEND_URL", "http://localhost:3333");

const DOCUMENTO_BASE_URL = `${BACKEND_URL}/mtn/monitoramentos/download-documento`;


class LinhaTempoTransformer extends BumblebeeTransformer {
  transform(model) {
    return {
      visaoId: model.id,
      matriculaFunciAcao: model.matricula_funci_acao,
      descricao: model.descricao,
      criadoEm: model.created_at,
    };
  }
}

module.exports = LinhaTempoTransformer;
