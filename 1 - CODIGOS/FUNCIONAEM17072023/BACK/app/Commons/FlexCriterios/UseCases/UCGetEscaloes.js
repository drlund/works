"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UCGetEscaloes extends AbstractUserCase {
  _checks(_, usuario, diretoria) {
    if (!usuario) {
      throw new Error("Necessário estar logado.");
    }
  }

  async _action(_, usuario, diretoria, idSolicitacao) {
    const { escaloesRepository } = this.repository;
    let dadosConsulta;
    /* const comites = [
      { id: 2, nome: "Administrador UE", nivel: 2, ativo: "1" },
      { id: 3, nome: "Membro do Comitê UE", nivel: 3, ativo: "1" },
      { id: 4, nome: "Matrícula", nivel: 4, ativo: "1" },
    ]; */

    const escalaoEscolhido = await escaloesRepository.getEscalaoEscolhido(
      diretoria,
      idSolicitacao
    );

    if (escalaoEscolhido?.id_escalao) {
      dadosConsulta = await escaloesRepository.getEscalaoById(
        escalaoEscolhido?.id_escalao
      );
      dadosConsulta[0].selecionado = true;
    } else {
      dadosConsulta = await escaloesRepository.getEscaloes();
      dadosConsulta.pop();
    }

    return dadosConsulta;
  }
}

module.exports = UCGetEscaloes;
