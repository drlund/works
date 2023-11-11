"use strict";

const ParamSuspensao = use("App/Models/Mysql/movimentacoes/ParamSuspensao");

class ParametroSuspensaoRepository {
  async getSuspensoes() {
    const paramVicePresi = await ParamSuspensao.query()
      .select("vicePresi as Tipo")
      .distinct("tipoSuspensao as Tipo Suspensão")
      .distinct("validade as Validade")
      .where("vicePresi as Valor", "!=", 0)
      .fetch();

    const paramDiretoria = await ParamSuspensao.query()
      .select("diretoria as Tipo")
      .distinct("tipoSuspensao as Tipo Suspensão")
      .distinct("validade as Validade")
      .where("diretoria as Valor", "!=", 0)
      .fetch();

    const paramSuper = await ParamSuspensao.query()
      .select("super as Tipo")
      .distinct("tipoSuspensao as Tipo Suspensão")
      .distinct("validade as Validade")
      .where("super as Valor", "!=", 0)
      .fetch();

    const paramGerev = await ParamSuspensao.query()
      .select("gerev as Tipo")
      .distinct("tipoSuspensao as Tipo Suspensão")
      .distinct("validade as Validade")
      .where("gerev as Valor", "!=", 0)
      .fetch();

    const paramPrefixo = await ParamSuspensao.query()
      .select("prefixo as Tipo")
      .distinct("tipoSuspensao as Tipo Suspensão")
      .distinct("validade as Validade")
      .where("prefixo as Valor", "!=", 0)
      .fetch();

    const paramMatricula = await ParamSuspensao.query()
      .select("matricula as Tipo")
      .distinct("tipoSuspensao as Tipo Suspensão")
      .distinct("validade as Validade")
      .where("matricula as Valor", "!=", "0")
      .fetch();

    const busca = {
      paramVicePresi: paramVicePresi ? paramVicePresi.toJSON() : [],
      paramDiretoria: paramDiretoria ? paramDiretoria.toJSON() : [],
      paramSuper: paramSuper ? paramSuper.toJSON() : [],
      paramGerev: paramGerev ? paramGerev.toJSON() : [],
      paramPrefixo: paramPrefixo ? paramPrefixo.toJSON() : [],
      paramMatricula: paramMatricula ? paramMatricula.toJSON() : [],
    };

    return busca;
  }

  /**
   * @param {{save: () => string;}} novaSuspensao
   */
  async gravarSuspensao(novaSuspensao) {
    await novaSuspensao.save();

    return novaSuspensao;
  }
}

module.exports = ParametroSuspensaoRepository;