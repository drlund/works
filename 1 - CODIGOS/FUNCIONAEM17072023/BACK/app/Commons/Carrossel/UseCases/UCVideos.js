"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");
class UCVideos extends AbstractUserCase {

  async _checks(user) {
    const isAdministradorVideos = await this.functions.hasPermission({
      nomeFerramenta: 'Carrossel de Notícias',
      dadosUsuario: user,
      permissoesRequeridas: ['CONSULTAR', 'GERENCIAR'],
    });
    if(!isAdministradorVideos) {
      throw new Error("Você não tem permissão para acessar esta funcionalidade.");
    }
  }

  async _action() {
    const videos = await this.repository.getVideos();
    return videos
  }

}
module.exports = UCVideos;
