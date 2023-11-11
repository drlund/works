"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");
const { NOME_FERRAMENTA } = require("../Constants");

class UcGetResponsavel extends AbstractUserCase{

  async _action({
    id,
    user
  }) {
    const { solicitacaoRepository } = this.repository;
    const { hasPermission } = this.functions;

    const solicitacao  = await solicitacaoRepository.getOne(id);

    const registro = await hasPermission({
      nomeFerramenta: NOME_FERRAMENTA,
      dadosUsuario: user,
      permissoesRequeridas: ["REGISTRO"]
    });

    return {
      responsavel: solicitacao.responsavel,
      pref_dest: solicitacao.pref_dest,
      matr_solicit: solicitacao.matr_solicit,
      registro
    };
  }

  _checks ({
    id,
    user
  }) {
    if (!id) throw { message: "A id da solicitação deve ser informada", status: 400 };
    if (!user) throw { message: "Os dados do funcionário logado devem ser informados", status: 400 };
  }

}


module.exports = UcGetResponsavel;