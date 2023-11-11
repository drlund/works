"use strict";
const exception = use("App/Exceptions/Handler");
const moment = require("moment");
const constants = use("App/Commons/Ambiencia/Constants");

class UCCampanhas {
  constructor(CampanhasRepository) {
    this.CampanhasRepository = CampanhasRepository;
    this.validated = false;
  }
  async validate() {
    this.validated = true;
  }
  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }

    const campanhas = await this.CampanhasRepository.getCampanhas();
    const campanhasVigentes = campanhas
      .filter(
        (campanha) =>
          campanha.ativo === "S" &&
          moment(
            campanha.dataEncerramentoAvaliacao,
            "DD-MM-YYYY HH:mm:ss"
          ).isAfter(moment())
      )
      .map((campanha) => {
        return {
          titulo: campanha.descricao,
          capaUrl: campanha.capaUrl,
          idCampanha: campanha.id,
        };
      });
    const campanhasEncerradas = campanhas.filter(
      (campanha) =>
        campanha.ativo === "N" &&
        moment(
          campanha.dataEncerramentoAvaliacao,
          "DD-MM-YYYY HH:mm:ss"
        ).isBefore(moment())
    ).map((campanha) => {
      return {
        titulo: campanha.descricao,
        capaUrl: campanha.capaUrl,
        idCampanha: campanha.id,
      };
    });

    return { campanhasVigentes, campanhasEncerradas };
  }
}

module.exports = UCCampanhas;
