"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UcConsultas extends AbstractUserCase{

  async _action({
    filtro,
    user
  }) {
    const { solicitacaoRepository } = this.repository;

    const solicitacao  = await solicitacaoRepository.getListaSolicitacoesPorFiltro(filtro, user);

    return solicitacao;
  }

  _checks({
    user,
    filtro
  }) {
    if (!user) {
      throw {
        message: "Dados do Usuário Logado não recebidos"
      }
    }
    if (!filtro) {
      throw {
        message: "Filtro da consulta não recebidos"
      }
    }
  }

}


module.exports = UcConsultas;