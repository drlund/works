'use strict';

const { AbstractUserCase } = use(
  'App/Commons/AbstractUserCase/AbstractUserCase.js',
);

class UcEditaPlataforma extends AbstractUserCase {
  _checks({usuario}) {
    if (!usuario) {
      throw new Error('Usuário não logado na Intranet.');
    }
  }

  async _action({id, matriculaResponsavel}) {
    return this.repository.patchPlataforma(id, matriculaResponsavel);
  }
}

module.exports = UcEditaPlataforma;