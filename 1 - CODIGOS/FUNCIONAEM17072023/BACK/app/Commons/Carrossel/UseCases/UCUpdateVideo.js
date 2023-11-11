"use strict";

const { AbstractUserCase } = use("App/Commons/AbstractUserCase/AbstractUserCase");
const moment = use("App/Commons/MomentZone");

class UCUpdateVideo extends AbstractUserCase {

  async _checks(id, novaDataInicioReproducao, user) {
    this.novaDataInicioReproducao = moment(novaDataInicioReproducao).format("YYYY-MM-DD");
    if(!moment(this.novaDataInicioReproducao).isValid()){
      throw new Error("Data inválida");
    }

    const isAdministradorVideos = await this.functions.hasPermission({
      nomeFerramenta: 'Carrossel de Notícias',
      dadosUsuario: user,
      permissoesRequeridas: ['GERENCIAR'],
    });
    if(!isAdministradorVideos) {
      throw new Error("Você não tem permissão para acessar esta funcionalidade.");
    }

  }

  async _action(id, novaDataInicioReproducao) {
    return this.repository.updateVideo(id, novaDataInicioReproducao)
  }

}
module.exports = UCUpdateVideo;