"use strict";

const { AbstractUserCase } = use("App/Commons/AbstractUserCase/AbstractUserCase");

class UCDeleteVideo extends AbstractUserCase {

  async _checks(id, user) {
    const isAdministradorVideos = await this.functions.hasPermission({
      nomeFerramenta: 'Carrossel de Notícias',
      dadosUsuario: user,
      permissoesRequeridas: ['GERENCIAR'],
    });
    if(!isAdministradorVideos) {
      throw new Error("Você não tem permissão para acessar esta funcionalidade.");
    }
  }

  async _action(id) {

    return this.repository.deleteVideo(id)
  }

}
module.exports = UCDeleteVideo;