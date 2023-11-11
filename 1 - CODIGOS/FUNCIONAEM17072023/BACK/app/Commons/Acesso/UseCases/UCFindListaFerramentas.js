'use strict'
const { AbstractUserCase } = use("App/Commons/AbstractUserCase");

class UCFindPermissoesUsuario extends AbstractUserCase {
  _checks() {}

  async _action() {
    const { permissoesFerramentas } = this.repository;

    const permissoes = await permissoesFerramentas.find();

    return permissoes;
  }
}

module.exports = UCFindPermissoesUsuario;