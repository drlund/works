"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcGetDeAcordo extends AbstractUserCase {

  async _action({
    usuario,
    id
  }) {
    const {
      deAcordoRepository,
      solicitacaoRepository
    } = this.repository;

    const solicitacao = await solicitacaoRepository.getOneSolicitacao(id);
    const deAcordo = await deAcordoRepository.getDeAcordo(solicitacao, usuario.user);

    return deAcordo;
  }

  _checks({
    usuario,
    id
  }) {
    if (!usuario) throw { message: "Os dados do usuário logado deve ser informado", status: 400 };
    if (!id) throw { message: "O id da solicitação deve ser informado", status: 400 };
  }
}

module.exports = UcGetDeAcordo;
