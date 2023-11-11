"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UCGetNotasInternas extends AbstractUserCase {
  async _checks(idEnvolvido, usuario) {
    if (!idEnvolvido || typeof idEnvolvido !== 'number') {
      throw new Error("O id do envolvido deve ser informado e no formato numérico para a consulta.");
    }

    const isEnvolvidoExiste = await this.repository.envolvido.isEnvolvidoExiste(idEnvolvido);
    if(!isEnvolvidoExiste) {
      throw new Error("O envolvido informado não consta no banco de dados.");
    }

    const isAdministradorMtn = await this.functions.hasPermission({
      nomeFerramenta: 'MTN',
      dadosUsuario: usuario,
      permissoesRequeridas: ['ANALISAR'],
      verificarTodas: true
    });

    if(!isAdministradorMtn) {
      throw new Error("Você não tem permissão para acessar esta funcionalidade.");
    }
  }

  async _action(idEnvolvido, usuario) {
    const notasInternasLidas =
      await this.repository.notaInterna.getNotasLidasByEnvolvidoEUsuario(
        idEnvolvido,
        usuario.chave
      );
    const notasInternas = await this.repository.notaInterna.getNotasByEnvolvido(
      idEnvolvido
    );
    return { notasInternas, notasInternasLidas };
  }
}

module.exports = UCGetNotasInternas;
