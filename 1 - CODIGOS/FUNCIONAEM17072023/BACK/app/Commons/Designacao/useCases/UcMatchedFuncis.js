"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

const Constants = use("App/Commons/Designacao/Constants");

const { TIPOS_ACESSO } = Constants;
class UcMatchedFuncis extends AbstractUserCase {

  async _action({
    funci,
    tipo,
    user
  }) {
    const { funcisRepository, prefsTesteRepository } = this.repository;
    const resultado = await funcisRepository.getMatchedFuncis({ funcionario: funci, tipo });

    const matchedFuncis = [];
    if (!user.acessos.includes(TIPOS_ACESSO.REGISTRO)) {
      const supersTeste = await prefsTesteRepository.getSupersTeste();
      const prefixosSuperTeste = supersTeste.map((item) => item.super)
      matchedFuncis.push(...resultado.filter((elem) => prefixosSuperTeste.includes(elem.prefixoSuper)));
    } else {
      matchedFuncis.push(...resultado);
    }

    return matchedFuncis;
  }

  _checks({
    funci,
    tipo
  }) {
    if (!funci) throw { message: "O funcionário deve ser informado", status: 400 };
    if (![0, 1, 2].includes(tipo)) throw { message: "O tipo de movimentação deve ser informado", status: 400 };
  }

}

module.exports = UcMatchedFuncis;
