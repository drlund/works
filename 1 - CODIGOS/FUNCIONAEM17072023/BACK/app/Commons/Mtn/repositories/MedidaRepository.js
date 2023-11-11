"use strict";
const axios = require("axios").default;

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const medidaModel = use("App/Models/Postgres/MtnMedida");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const MtnConsultaDedipDipesApiLog = use(
  "App/Models/Postgres/MtnConsultaDedipDipesApiLog"
);
const { mtnConsts } = require("../../../Commons/Constants");
const consultaApiDedip = require("../consultaApiDedip");
const { medidas } = mtnConsts;

class MedidaRepository {
  /**
   *  Retorna os dados de uma medida, desde que mesma esteja ativa
   * @param {String} idMedida
   * @returns
   */
  async getDadosMedida(idMedida) {
    const dadosMedida = await medidaModel
      .query()
      .where("id", idMedida)
      .where("ativa", true)
      .first();

    return dadosMedida.toJSON();
  }

  async consultaAplicacaoMedidaDedip(dadosUsuario, envolvido, idMedida) {
    let idMedidaConvertidoParamDedip = 0;
    let paramTermoDeCienciaDedip = 1;
    let paramAlertaNegocialDedip = 2;

    if (idMedida === medidas.TERMO_DE_CIENCIA) {
      idMedidaConvertidoParamDedip = paramTermoDeCienciaDedip;
    } else if (idMedida === medidas.ALERTA_ETICO_NEGOCIAL) {
      idMedidaConvertidoParamDedip = paramAlertaNegocialDedip;
    }

    return await consultaApiDedip(
      dadosUsuario,
      envolvido,
      idMedida,
      idMedidaConvertidoParamDedip
    );
  }

  async salvarLogErro(dadosUsuario, envolvido, idMedida, logErro) {
    await MtnConsultaDedipDipesApiLog.create({
      matricula: envolvido.matricula,
      medida_pesquisada: idMedida,
      id_mtn: envolvido.id_mtn,
      mat_resp_analise: dadosUsuario.matricula,
      resposta_api: JSON.stringify(logErro),
    });
  }
}

module.exports = MedidaRepository;
