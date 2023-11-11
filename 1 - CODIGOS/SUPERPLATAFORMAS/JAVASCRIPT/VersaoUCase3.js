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

  async _action({ id, matricula, nome }) {
    const plataforma = await this.repository.patchPlataforma(id);

    if (!plataforma) {
      throw new Error('Plataforma não encontrada');
    }

    plataforma.matricula = matricula;
    plataforma.nomeResponsavel = nome;

    await plataforma.save();

    return { success: true };
  }
}

module.exports = UcEditaPlataforma;