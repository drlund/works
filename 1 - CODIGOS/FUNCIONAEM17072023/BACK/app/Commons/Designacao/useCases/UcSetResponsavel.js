"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

const Constants = use("App/Commons/Designacao/Constants");

const { TIPOS_ACESSO } = Constants;
class UcSetResponsavel extends AbstractUserCase {

  async _action({
    id,
    user
  }) {
    const { solicitacaoRepository, documentoRepository } = this.repository;
    await solicitacaoRepository.set(id, {responsavel: user.chave}, this.trx);
    const parecer = {
      id_solicitacao: id,
      id_historico: 29
    };
    const documento = await documentoRepository.post(parecer, null, user, this.trx);
    return documento;
  }

  _checks({
    id,
    user
  }) {
    if (!id) throw new Error("A id da solicitação deve ser informada", 400);
    if (!user) throw new Error("As informações do usuário logado deve ser informadas", 400);
  }

}

module.exports = UcSetResponsavel;
