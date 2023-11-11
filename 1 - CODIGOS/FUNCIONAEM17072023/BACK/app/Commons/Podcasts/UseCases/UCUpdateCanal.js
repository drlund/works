"use strict";
const { AbstractUserCase } = require('../../AbstractUserCase');

class UCUpdateCanal extends AbstractUserCase {

  async _checks({ id, novoNome, novaDescricao, user }) {
    const isAdministradorCanais = await this.functions.hasPermission({
      nomeFerramenta: 'Podcasts',
      dadosUsuario: user,
      permissoesRequeridas: ['GERENCIAR'],
    });

    if (!isAdministradorCanais) {
      throw new Error("Você não tem permissão para acessar esta funcionalidade.");
    }
  }

  async _action({ id, novoNome, novaDescricao }) {

    const alteracoes = { };

    if (novoNome) {
      alteracoes.nome = novoNome;
    }

    if (novaDescricao) {
      alteracoes.descricao = novaDescricao;
    }
    
    return this.repository.canais.updateCanal(
      id,
      alteracoes
    );
  }

}

module.exports = UCUpdateCanal