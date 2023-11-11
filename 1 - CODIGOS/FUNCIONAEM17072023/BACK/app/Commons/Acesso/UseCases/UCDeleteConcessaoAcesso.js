'use strict'
const { AbstractUserCase } = use("App/Commons/AbstractUserCase");

class UCDeleteConcessaoAcesso extends AbstractUserCase {
  _checks({ id, chave, nome }) {
    if (!nome || !chave) {
      throw new Error("Não foi possível verificar as credenciais do funcionário logado.");
    }
    if (!id) {
      throw new Error("Necessário id da concessão.");
    }

    if (id.length != 24) {
      throw new Error("Id inválido.");
    }
  }

  async _action({ id, chave, nome }) {
    const {
      concessoesAcessos
    } = this.repository;

    const usuario = {
      chave,
      nome
    }

    const result = await concessoesAcessos
      .deletarConcessaoAcesso({
        id,
        usuario
      });

    if (!result) {
      throw new Error(`Falha ao excluir concessão ${id}.`);
    }

    return { id };

  }

}

module.exports = UCDeleteConcessaoAcesso;
