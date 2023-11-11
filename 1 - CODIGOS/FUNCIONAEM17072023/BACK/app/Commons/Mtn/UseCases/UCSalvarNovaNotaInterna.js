"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UCSalvarNovaNotaInterna extends AbstractUserCase {
  async _checks(notaInterna, usuario) {
    if (!notaInterna.idEnvolvido || typeof notaInterna.idEnvolvido !== 'number') {
      throw new Error("O id do envolvido deve ser informado e no formato numérico.");
    }

    const isEnvolvidoExiste = await this.repository.envolvido.isEnvolvidoExiste(notaInterna.idEnvolvido);
    if(!isEnvolvidoExiste) {
      throw new Error("O envolvido informado não consta no banco de dados.");
    }

    if (!notaInterna.desc_nota) {
      throw new Error("Não é possível inserir uma nota em branco.");
    }

    const isAdministradorMtn = await this.functions.hasPermission({
      nomeFerramenta: 'MTN',
      dadosUsuario: usuario,
      permissoesRequeridas: ['ANALISAR', 'MTN_ADM', 'MTN_PAINEL'],
    });

    if(!isAdministradorMtn) {
      throw new Error("Você não tem permissão para acessar esta funcionalidade.");
    }
  }

  async _action(notaInterna, usuario) {
    return await this.repository.novaNota.gravarNovaNota(
        notaInterna,
        usuario
      );
  }
}

module.exports = UCSalvarNovaNotaInterna;
