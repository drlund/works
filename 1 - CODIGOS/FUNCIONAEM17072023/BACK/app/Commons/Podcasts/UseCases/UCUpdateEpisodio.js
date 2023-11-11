"use strict";
const { AbstractUserCase } = require('../../AbstractUserCase');

class UCUpdateEpisodio extends AbstractUserCase {
  async _checks(id, titulo, user) {
    const isAdministradorEpisodios = await this.functions.hasPermission({
      nomeFerramenta: "Podcasts",
      dadosUsuario: user,
      permissoesRequeridas: ["GERENCIAR"],
    });

    if (!isAdministradorEpisodios) {
      throw new Error(
        "Você não tem permissão para acessar esta funcionalidade. Solicite ao administrador acesso ao aplicativo: Podcasts > GERENCIAR"
      );
    }

    //Trata para que o id não venha nulo ou indefinido, além de ser um valor numérico.

    if (!id || typeof id !== "number") {
      throw new Error("Obrigatório informar o id de tipo numérico do episódio.");
    }
    this.id = id;

    //Trata para que o título não venha nulo ou indefinido, além de possuir um tamanho mínimo.
    if (!titulo || !titulo.length) {
      throw new Error("Obrigatório informar o título do episódio.");
    }
    this.titulo = titulo;
  }

  async _action() {
    return this.repository.updateEpisodio(this.id, this.titulo);
  }
}

module.exports = UCUpdateEpisodio;
