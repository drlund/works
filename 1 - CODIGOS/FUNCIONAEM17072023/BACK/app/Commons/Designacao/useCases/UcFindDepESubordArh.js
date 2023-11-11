"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");
const { UOR_STRING_SUPERADM, PREFIXO_SUPERADM } = require("../Constants");

class UcFindDepESubordArh extends AbstractUserCase {

  async _action({
    usuario,
    prefixo
  }) {
    const {
      prefixoRepository
    } = this.repository;

    const {
      getAcessoSuperadm
    } = this.functions;

    if (usuario.user.uor === UOR_STRING_SUPERADM || usuario.user.prefixo === PREFIXO_SUPERADM) {
      usuario.user.uor = await getAcessoSuperadm(usuario.user);
    }

    const dependencias = await prefixoRepository.getJurisdicaoSubordinadas(usuario.user, prefixo);

    return dependencias;
  }

  _checks({
    usuario,
    prefixo
  }) {
    if (!usuario) throw { message: "Os dados do usuário logado deve ser informado", status: 400 };
    if (!prefixo) throw { message: "O número ou nome do prefixo deve ser informado", status: 400 };
  }
}

module.exports = UcFindDepESubordArh;
