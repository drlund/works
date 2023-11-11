"use strict";

const jurisdicaoModel = use("App/Models/Mysql/Jurisdicao");

const tipologias = {
  AGENCIA_VAREJO: "AGENCIA VAREJO",
  SUPER_ATACADO: "SUPER ATACADO",
  AG_ESP_VAREJO: "AG.ESP. VAREJO",
  AG_VAREJO_MISTA: "AG.VAREJO MISTA",
  UNIDADE: "UNIDADE",
  CENOP: "CENOP",
  AREA_EM_UA: "AREA EM UA",
  GENAC: "GENAC",
  DIRETORIA: "DIRETORIA",
  CONSELHO_ADMINISTRACAO: "CONSELHO ADMINISTRACAO",
  PRESI: "PRESI",
  VICE_PRESIDENCIA: "VICE-PRESIDENCIA",
  CABB: "CABB",
  GERENCIA_EXECUTIVA: "GERENCIA EXECUTIVA",
  AJURE: "AJURE  ",
  PROGRAMA_ESTRATEGICO: "PROGRAMA ESTRATEGICO",
  SUPER_PRIVATE: "SUPER PRIVATE",
  GERAC: "GERAC",
  COM_ASSESSORAMENTO_CA: "COM ASSESSORAMENTO CA",
  SUPER_NEGOCIOS: "SUPER NEGOCIOS",
  SUPER_COMERCIAL: "SUPER COMERCIAL",
  GERENCIA_REGIONAL_EMPRESARIAL: "GERENCIA REGIONAL EMPRESARIAL",
  PSO: "PSO",
  AGENCIA_NO_EXTERIOR: "AGENCIA NO EXTERIOR",
  GECEX: "GECEX",
  AGENCIA_LARGE_CORPORATE: "AGENCIA LARGE CORPORATE",
  GERENCIA: "GERENCIA",
  GECOR: "GECOR",
  SETOR_EM_UA: "SETOR EM UA",
  UOR_TESTE_TI: "UOR TESTE TI",
  ESCRITORIO_PRIVATE: "ESCRITORIO PRIVATE",
  GEPES: "GEPES",
  GERAG: "GERAG",
  CECAR: "CECAR",
  GECOI: "GECOI",
  OUVIDORIA: "OUVIDORIA",
  CSA: "CSA",
  PLATAFORMA_CESUP_CENOP: "PLATAFORMA CESUP CENOP",
  REROP: "REROP",
  CCBB: "CCBB",
  NUJUR: "NUJUR",
  GIMOB: "GIMOB",
  AGENCIA_EMPRESARIAL: "AGENCIA EMPRESARIAL",
  AGENCIA_CORPORATE: "AGENCIA CORPORATE",
  CESIN: "CESIN",
  GPRED: "GPRED",
  GCASH: "GCASH",
  GEMOF: "GEMOF",
  ESCRITORIO_MERCAP: "ESCRITORIO MERCAP",
  ESCRITORIO_COMEX: "ESCRITORIO COMEX",
};

class MestreController {
  async getDiretorias({ request, response }) {
    const diretorias = await jurisdicaoModel
      .query()
      .where("tipologia_pai", tipologias.DIRETORIA)
      .groupBy("prefixo_pai")
      .fetch();
    return response.ok(diretorias);
  }

  async getSubordinadas({ request, response }) {
    const { prefixo } = request.allParams();

    if (!prefixo) {
      return response.badRequest("Deve-se informar o prefixo");
    }

    const subordinadas = await jurisdicaoModel
      .query()
      .where("prefixo_pai", prefixo)
      .fetch();

    return response.ok(subordinadas);
  }
}

module.exports = MestreController;
