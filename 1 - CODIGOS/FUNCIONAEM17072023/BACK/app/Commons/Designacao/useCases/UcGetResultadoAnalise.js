"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcGetResultadoAnalise extends AbstractUserCase{

  async _action({
    id
  }) {
    const { analiseRepository } = this.repository;

    const analise  = await analiseRepository.getOne(id);

    return analise;
  }

  _checks ({
    id,
  }) {
    if (!id) throw { message: "A id da solicitação deve ser informada", status: 400 };
  }

}


module.exports = UcGetResultadoAnalise;